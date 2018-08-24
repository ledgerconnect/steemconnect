<template>
  <div>
    <div class="columns mb-4 bg-gray-light text-uppercase rounded-2 overflow-hidden">
      <div class="column px-0 one-half">
        <a
          class="d-block p-2"
          :class="{ 'bg-green-light': tab === 'buy' }"
          @click="tab = 'buy'"
        >
          Buy
        </a>
      </div>
      <div class="column px-0 one-half">
        <a
          class="d-block p-2"
          :class="{ 'bg-red-light' : tab === 'sell' }"
          @click="tab = 'sell'"
        >
          Sell
        </a>
      </div>
    </div>
    <div class="columns">
      <form class="text-left">
        <label for="quantity">Quantity (SBD)</label>
        <div
          v-if="dirty && !!errors.quantity"
          class="error mb-2"
        >
          {{ errors.quantity }}
        </div>
        <AmountInput
          v-model="quantity"
          id="quantity"
          name="quantity"
          class="form-control input-lg input-block mb-2"
          @change="updateTotal"
        />
        <label for="price">Price (STEEM)</label>
        <div
          v-if="dirty && !!errors.price"
          class="error mb-2"
        >
          {{ errors.price }}
        </div>
        <AmountInput
          v-model="price"
          id="price"
          name="price"
          :digits="6"
          class="form-control input-lg input-block mb-2"
          @change="updateTotal"
        />
        <label for="total">Total (STEEM)</label>
        <div
          v-if="dirty && !!errors.total"
          class="error mb-2"
        >
          {{ errors.total }}
        </div>
        <AmountInput
          v-model="total"
          id="total"
          name="total"
          class="form-control input-lg input-block mb-4"
          @change="updateQuantity"
        />
        <div class="text-uppercase">
          <button
            v-if="tab === 'buy'"
            :disabled="orderDisabled"
            @click.prevent="handleOrder"
            class="input-block border-0 bg-green-light p-2 rounded-2 d-block"
          >
            Buy SBD
          </button>
          <button
            v-if="tab === 'sell'"
            :disabled="orderDisabled"
            @click.prevent="handleOrder"
            class="input-block border-0 bg-red-light p-2 rounded-2 d-block"
          >
            Sell SBD
          </button>
        </div>
      </form>
      <VueModal
        v-if="open"
        @close="open = false"
        :title="modalTitle"
        :locked="sending"
        class="small text-left"
      >
        <div class="default-body">
          <div v-if="failed" class="flash flash-error mb-4">
            Oops, something went wrong. Please try again later.
          </div>
          <Confirmation v-if="!!transactionId" :id="transactionId" />
          <span v-else v-html="modalText" />
        </div>
        <div slot="footer" class="actions">
          <button
            v-if="!!transactionId"
            @click="open = false"
            class="btn btn-large btn-plain input-block"
          >
            Close
          </button>
          <template v-else>
            <button
              :disabled="sending"
              class="btn btn-large btn-primary"
              @click="handleConfirm"
            >
              {{ confirmText }}
            </button>
            <button
              :disabled="sending"
              class="btn btn-large btn-plain"
              @click="open = false"
            >
              Cancel
            </button>
          </template>
        </div>
      </VueModal>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { Asset } from 'dsteem';

const DEFAULT_QUANTITY = '0.000';
const DEFAULT_PRICE = '0.000000';
const DEFAULT_TOTAL = '0.000';

export default {
  data() {
    return {
      tab: 'buy',
      quantity: DEFAULT_QUANTITY,
      price: DEFAULT_PRICE,
      total: DEFAULT_TOTAL,
      open: false,
      dirty: false,
      sending: false,
      transactionId: '',
      failed: false,
    };
  },
  computed: {
    amountToSell() {
      if (this.tab === 'buy') {
        return new Asset(parseFloat(this.total), 'STEEM');
      }

      return new Asset(parseFloat(this.quantity), 'SBD');
    },
    minToReceive() {
      if (this.tab === 'buy') {
        return new Asset(parseFloat(this.quantity), 'SBD');
      }

      return new Asset(parseFloat(this.total), 'STEEM');
    },
    balanceSufficient() {
      const { account } = this.$store.state.auth;

      const balance = this.tab === 'buy' ? account.balance : account.sbd_balance;

      return Asset.fromString(balance).subtract(this.amountToSell).amount >= 0;
    },
    errors() {
      const current = {};

      if (!this.quantity || this.quantity <= 0) {
        current.quantity = 'Quantity has to be higher than 0.';
      } else if (this.tab === 'sell' && !this.balanceSufficient) {
        current.quantity = "You don't have enough SBD.";
      }

      if (!this.price || this.price <= 0) {
        current.price = 'Price has to be higher than 0.';
      }

      if (!this.total || this.total <= 0) {
        current.total = 'Total has to be higher than 0.';
      } else if (this.tab === 'buy' && !this.balanceSufficient) {
        current.total = "You don't have enough STEEM.";
      }

      return current;
    },
    hasErrors() {
      return Object.keys(this.errors).length !== 0;
    },
    orderDisabled() {
      return this.dirty && this.hasErrors;
    },
    modalTitle() {
      return this.tab === 'buy' ? 'Buy SBD' : 'Sell SBD';
    },
    modalText() {
      if (this.tab === 'buy') {
        return this.calculateBody(this.amountToSell, this.minToReceive, 'buy');
      }

      return this.calculateBody(this.minToReceive, this.amountToSell, 'sell');
    },
    confirmText() {
      if (this.sending) return 'Sending';

      return this.failed ? 'Retry' : 'Confirm';
    },
  },
  watch: {
    open(value) {
      this.dirty = false;

      if (value === false && (this.transactionId || this.failed)) {
        this.resetForm();
      }
    },
  },
  methods: {
    ...mapActions(['createLimitOrder']),
    resetForm() {
      this.quantity = DEFAULT_QUANTITY;
      this.price = DEFAULT_PRICE;
      this.total = DEFAULT_TOTAL;

      this.transactionId = '';
      this.failed = false;
    },
    calculateBody(from, to, text) {
      const rate = (from.amount / to.amount).toFixed(6);
      return `Are you sure you want to ${text} <b>${to.toString()}</b> for <b>${from.toString()}</b> (at ${rate} STEEM/SBD)?`;
    },
    updateTotal() {
      this.total = (this.quantity * this.price).toFixed(3);
    },
    updateQuantity() {
      this.quantity = this.price < 0.000001 ?
        DEFAULT_QUANTITY :
        (this.total / this.price).toFixed(3);
    },
    handleOrder() {
      this.dirty = true;

      if (!this.hasErrors) {
        this.open = true;
      }
    },
    async handleConfirm() {
      this.sending = true;

      const { amountToSell, minToReceive } = this;

      try {
        const confirmation = await this.createLimitOrder({ amountToSell, minToReceive });

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
  mounted() {
    this.$root.$on('fillQuantity', (quantity) => {
      this.quantity = quantity.toString();
      this.updateTotal();
    });
    this.$root.$on('fillPrice', (price) => {
      this.price = price;
      this.updateTotal();
    });
  },
};
</script>
