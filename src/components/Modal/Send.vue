<template>
  <VueModal
    v-if="open"
    @close="$emit('cancel')"
    :locked="sending"
    title="Transfer"
    class="small"
  >
    <div class="default-body">
      <div v-if="failed" class="flash flash-error mb-4">
        Oops, something went wrong. Please try again later.
      </div>
      <Confirmation v-if="!!transactionId" :id="transactionId" />
      <template v-else>
        <label for="asset">Asset</label>
        <select v-model="asset" class="form-select input-block mb-2" id="asset" name="asset">
          <option value="STEEM">Steem (STEEM)</option>
          <option value="SBD">Steem Dollars (SBD)</option>
        </select>
        <label for="to">Recipient</label>
        <div
          v-if="dirty.to && !!errors.to"
          class="error mb-2"
        >
          {{ errors.to }}
        </div>
        <input
          v-model.trim="to"
          id="to"
          name="to"
          value=""
          type="text"
          class="form-control input-lg input-block mb-2"
          autocorrect="off"
          autocapitalize="none"
          @blur="handleBlur('to')"
        />
        <div class="split">
          <label for="amount">Amount</label>
          <label for="usd">Amount USD</label>
        </div>
        <div
          v-if="dirty.amount && !!errors.amount"
          class="error mb-2"
        >
          {{ errors.amount }}
        </div>
        <div class="split">
          <AmountInput
            v-model="amount"
            id="amount"
            name="amount"
            @keyup="setUsd"
            @blur="handleBlur('amount')"
          />
          <AmountInput
            v-model="usd"
            id="usd"
            name="usd"
            @keyup="setAmount"
            @blur="handleBlur('amount')"
          />
        </div>
        <div class="mb-2">
          <a @click="setMax">Max: {{ balanceAsset.toString() }}</a>
        </div>
        <label for="memo">Description</label>
        <textarea
          v-model.trim="memo"
          id="memo"
          name="memo"
          rows="3"
          class="form-control input-lg input-block mb-4"
          placeholder="Write an optional message"
        />
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
import debounce from 'lodash/debounce';
import client from '@/helpers/client';

const DEFAULT_AMOUNT = '0.000';
const DEFAULT_USD = '0.00';
const USERNAME_LOOKUP_WAIT = 200;

export default {
  props: ['open', 'initialAsset', 'initialUsername'],
  data() {
    return {
      asset: 'STEEM',
      to: '',
      amount: DEFAULT_AMOUNT,
      usd: DEFAULT_USD,
      memo: '',
      verificationUpToDate: false,
      verifiedRecipient: '',
      dirty: {
        to: false,
        amount: false,
      },
      sending: false,
      transactionId: '',
      failed: false,
    };
  },
  computed: {
    ratio() {
      const { ticker, rate } = this.$store.state.market;

      if (this.asset === 'STEEM') return rate.price_usd;

      return ticker.SBD.latest * rate.price_usd;
    },
    amountAsset() {
      return new Asset(parseFloat(this.amount || '0'), this.asset);
    },
    balanceAsset() {
      const { account } = this.$store.state.auth;

      const balance = this.asset === 'STEEM' ? account.balance : account.sbd_balance;

      return Asset.fromString(balance);
    },
    balanceSufficient() {
      return this.balanceAsset.subtract(this.amountAsset).amount >= 0;
    },
    usernameValid() {
      return this.to && this.verifiedRecipient === this.to;
    },
    errors() {
      const current = {};

      if (!this.to) {
        current.to = 'Recipient is required.';
      } else if (!this.usernameValid && this.verificationUpToDate) {
        current.to = "This recipient doesn't exist.";
      }

      if (this.amountAsset.amount === 0) {
        current.amount = 'Amount is required.';
      }

      if (!this.balanceSufficient) {
        current.amount = "You don't have enough funds.";
      }

      return current;
    },
    confirmText() {
      if (this.sending) return 'Sending';

      return this.failed ? 'Retry' : 'Confirm';
    },
    confirmDisabled() {
      return !this.usernameValid
        || this.amount <= 0
        || !this.balanceSufficient
        || this.sending;
    },
  },
  watch: {
    open: 'resetForm',
    initialAsset(value) {
      if (value) this.asset = value;
    },
    initialUsername(value) {
      if (value) this.to = value;
    },
    to(value) {
      this.verificationUpToDate = false;
      this.lookupUsername(value);
    },
    asset() {
      this.setUsd();
    },
  },
  methods: {
    ...mapActions(['transfer']),
    resetForm() {
      this.to = this.initialUsername || '';
      this.amount = DEFAULT_AMOUNT;
      this.usd = DEFAULT_USD;
      this.memo = '';

      this.dirty = {
        to: false,
        amount: false,
      };

      this.transactionId = '';
      this.failed = false;
      this.verificationUpToDate = false;
      this.verifiedRecipient = '';
    },
    handleBlur(name) {
      this.dirty[name] = true;
    },
    lookupUsername: debounce(async function lookupUsername(value) {
      const users = await client.database.getAccounts([value]);

      if (users.length === 1) {
        this.verifiedRecipient = value;
      }

      this.verificationUpToDate = true;
    }, USERNAME_LOOKUP_WAIT),
    setUsd() {
      this.usd = (this.amount * this.ratio).toFixed(2);
    },
    setAmount() {
      this.amount = (this.usd / this.ratio).toFixed(3);
    },
    setMax() {
      this.amount = this.balanceAsset.amount.toFixed(3);
      this.setUsd();
    },
    async handleConfirm() {
      this.sending = true;

      try {
        const confirmation = await this.transfer({
          amount: this.amountAsset.toString(),
          to: this.to,
          memo: this.memo,
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
    width: 48%;
  }
}
</style>
