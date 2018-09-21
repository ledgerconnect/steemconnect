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
      <ModalCreateOrder
        :open="open"
        :tab="tab"
        :amountToSell="amountToSell"
        :minToReceive="minToReceive"
        @cancel="handleModalCancel"
      />
    </div>
  </div>
</template>

<script>
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
  },
  methods: {
    resetForm() {
      this.quantity = DEFAULT_QUANTITY;
      this.price = DEFAULT_PRICE;
      this.total = DEFAULT_TOTAL;
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
    handleModalCancel() {
      this.open = false;
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
