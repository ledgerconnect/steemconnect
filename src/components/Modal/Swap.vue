<template>
  <VueModal
    v-if="open"
    @close="$emit('cancel')"
    :locked="sending"
    title="Swap"
    class="small"
  >
    <div class="default-body">
      <div v-if="failed" class="flash flash-error mb-4">
        Oops, something went wrong. Please try again later.
      </div>
      <Confirmation v-if="!!transactionId" :id="transactionId" />
      <template v-else>
        <label for="sendAmount">Send</label>
        <div
          v-show="(dirty.sendAmount || dirty.receiveAmount) && !!errors.sendAmount"
          class="error mb-2"
        >
          {{ errors.sendAmount }}
        </div>
        <div class="split">
          <AmountInput
            v-model="sendAmount"
            id="sendAmount"
            name="sendAmount"
            @keyup="setReceiveAmount"
            @blur="handleBlur('sendAmount')"
          />
          <select v-model="sendAsset" class="form-select input-block mb-2">
            <option value="STEEM">Steem (STEEM)</option>
            <option value="SBD">Steem Dollars (SBD)</option>
          </select>
        </div>
        <div class="mb-2">
          <a @click="setMax">Max: {{ balanceAsset.toString() }}</a>
        </div>
        <div class="mb-2">
          <button class="switch-btn btn btn-block" @click="handleSwitch">
            <span class="iconfont icon-arrow-both mr-1"/> Switch
          </button>
        </div>
        <label for="receiveAmount">Receive</label>
        <div class="split">
          <AmountInput
            v-model="receiveAmount"
            id="receiveAmount"
            name="receiveAmount"
            @keyup="setSendAmount"
            @blur="handleBlur('receiveAmount')"
          />
          <select v-model="receiveAsset" class="form-select input-block mb-2">
            <option value="STEEM">Steem (STEEM)</option>
            <option value="SBD">Steem Dollars (SBD)</option>
          </select>
        </div>
        <p v-if="sendAmountAsset.amount !== 0 && !unfillable">
          Your rate: {{ rate }}.
        </p>
      </template>
    </div>
    <div slot="footer" class="actions">
      <button
        v-if="!!transactionId"
        @click="$emit('cancel')"
        class="btn btn-large btn-plain input-block"
      >
        Close
      </button>
      <template v-else>
        <button
          :disabled="confirmDisabled"
          class="btn btn-large btn-primary"
          @click="handleConfirm"
        >
          {{ confirmText }}
        </button>
        <button class="btn btn-large btn-plain" @click="$emit('cancel')">
          Cancel
        </button>
      </template>
    </div>
  </VueModal>
</template>

<script>
import { mapActions } from 'vuex';
import { Asset } from 'dsteem';
import { getMarketValue } from '@/helpers/market';

const DEFAULT_AMOUNT = '0.000';

export default {
  props: ['open'],
  data() {
    return {
      sendAsset: 'STEEM',
      sendAmount: DEFAULT_AMOUNT,
      receiveAmount: DEFAULT_AMOUNT,
      dirty: {
        sendAmount: false,
        receiveAmount: false,
      },
      unfillable: false,
      sending: false,
      transactionId: '',
      failed: false,
    };
  },
  computed: {
    orders() {
      return this.$store.state.market.orderBook.SBD;
    },
    receiveAsset: {
      get() {
        return this.sendAsset === 'STEEM' ? 'SBD' : 'STEEM';
      },
      set(newValue) {
        this.sendAsset = newValue === 'STEEM' ? 'SBD' : 'STEEM';
      },
    },
    sendAmountAsset() {
      return new Asset(parseFloat(this.sendAmount || '0'), this.sendAsset);
    },
    receiveAmountAsset() {
      return new Asset(parseFloat(this.receiveAmount || '0'), this.receiveAsset);
    },
    rate() {
      const rate = this.sendAmountAsset.amount / this.receiveAmountAsset.amount;

      return `1 ${this.sendAsset} = ${rate.toFixed(3)} ${this.receiveAsset}`;
    },
    balanceAsset() {
      const { account } = this.$store.state.auth;

      const balance = this.sendAsset === 'STEEM' ? account.balance : account.sbd_balance;

      return Asset.fromString(balance);
    },
    balanceSufficient() {
      return this.balanceAsset.subtract(this.sendAmountAsset).amount >= 0;
    },
    errors() {
      const current = {};

      if (this.sendAmountAsset.amount === 0) {
        current.sendAmount = 'Amount is required.';
      } else if (!this.balanceSufficient) {
        current.sendAmount = "You don't have enough funds.";
      } else if (this.unfillable) {
        current.sendAmount = "Market can't fullfill this order right now.";
      }

      return current;
    },
    confirmText() {
      if (this.sending) return 'Sending';

      return this.failed ? 'Retry' : 'Confirm';
    },
    confirmDisabled() {
      return this.sendAmountAsset.amount <= 0
        || !this.balanceSufficient
        || this.unfillable
        || this.sending;
    },
  },
  watch: {
    open: 'resetForm',
    receiveAsset: 'setSendAmount',
  },
  methods: {
    ...mapActions(['createLimitOrder']),
    resetForm() {
      this.sendAmount = DEFAULT_AMOUNT;

      this.dirty = {
        sendAmount: false,
        receiveAmount: false,
      };

      this.transactionId = '';
      this.failed = false;
    },
    handleBlur(name) {
      this.dirty[name] = true;
    },
    setMax() {
      this.sendAmount = this.balanceAsset.amount.toFixed(3);
      this.setReceiveAmount();
      this.dirty.sendAmount = true;
    },
    setReceiveAmount() {
      const { orders, sendAmountAsset, sendAsset } = this;

      const amount = getMarketValue(orders, sendAmountAsset.amount * 1000, sendAsset !== 'STEEM');

      if (amount !== false) {
        this.unfillable = false;
        this.receiveAmount = (amount / 1000).toFixed(3);
      } else {
        this.unfillable = true;
      }
    },
    setSendAmount() {
      const { orders, receiveAmountAsset, receiveAsset } = this;

      const amount = getMarketValue(orders, receiveAmountAsset.amount * 1000, receiveAsset !== 'STEEM');

      this.unfillable = amount === false;

      if (amount !== false) {
        this.unfillable = false;
        this.sendAmount = (amount / 1000).toFixed(3);
      } else {
        this.unfillable = true;
      }
    },
    handleSwitch() {
      this.receiveAmount = this.sendAmount;
      this.receiveAsset = this.sendAsset;
    },
    async handleConfirm() {
      this.sending = true;

      try {
        const confirmation = await this.createLimitOrder({
          amountToSell: this.sendAmountAsset,
          minToReceive: this.receiveAmountAsset,
          fillOrKill: true,
        });

        this.transactionId = confirmation.id;
        this.failed = false;
      } catch (err) {
        console.error(err);

        this.transactionId = '';
        this.failed = true;
      }

      this.sending = false;
    },
  },
};
</script>

<style lang="less" scoped>
.split {
  display: flex;
  justify-content: space-between;

  & > * {
    width: 49.5%;
  }
}

.switch-btn > .iconfont{
  font-size: 12px;
}
</style>
