<template>
  <div>
    <div class="columns mb-4 bg-gray-light text-uppercase rounded-2 overflow-hidden">
      <div class="column px-0 one-half">
        <a
          :class="tab === 'buy' ? 'bg-green-light d-block p-2' : 'd-block p-2'"
          @click="tab = 'buy'"
        >
          Buy
        </a>
      </div>
      <div class="column px-0 one-half">
        <a
          :class="tab === 'sell' ? 'bg-red-light d-block p-2' : 'd-block p-2'"
          @click="tab = 'sell'"
        >
          Sell
        </a>
      </div>
    </div>
    <div class="columns">
      <form class="text-left">
        <p>Quantity (SBD)</p>
        <input
          v-model="quantity"
          name="quantity"
          class="form-control input-lg input-block mb-2"
          @change="updateTotal"
        />
        <p>Bid price (STEEM)</p>
        <input
          v-model="price"
          name="price"
          class="form-control input-lg input-block mb-2"
          @change="updateTotal"
        />
        <p>Total (STEEM)</p>
        <input
          v-model="total"
          name="total"
          class="form-control input-lg input-block mb-4"
          @change="updateQuantity"
        />
        <div class="text-uppercase">
          <a
            @click="open = true"
            class="text-center border-0 bg-green-light p-2 rounded-2 d-block"
            v-if="tab === 'buy'"
          >
            Buy SBD
          </a>
          <a
            @click="open = true"
            class="text-center border-0 bg-red-light p-2 rounded-2 d-block"
            v-if="tab === 'sell'"
          >
            Sell SBD
          </a>
        </div>
      </form>
      <VueModal
        v-if="open"
        @close="open = false"
        :title="tab === 'buy' ? 'Buy SBD' : 'Sell SBD'"
        :locked="isLoading"
        class="small text-left"
      >
        <div class="default-body">
          Are you sure you want to buy <b>{{total}} STEEM</b> for <b>{{quantity}} SBD</b>?
        </div>
        <div slot="footer" class="actions">
          <button
            :disabled="isLoading"
            class="btn btn-large btn-primary"
            @click="isLoading = true; handleCancelOrder(orderId)"
          >
            Confirm
          </button>
          <button
            :disabled="isLoading"
            class="btn btn-large btn-plain"
            @click="open = false"
          >
            Cancel
          </button>
        </div>
      </VueModal>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tab: 'buy',
      quantity: '0.000',
      price: '0.000000',
      total: '0.000',
      open: false,
      isLoading: false,
    };
  },
  methods: {
    updateTotal() {
      this.total = this.quantity > 0 && this.price > 0 ?
        (this.quantity / this.price).toFixed(3) : '0.000';
    },
    updateQuantity() {
      this.quantity = this.total > 0 && this.price > 0 ?
        (this.total / this.price).toFixed(3) : this.quantity;
    },
  },
  mounted() {
    this.$root.$on('fillOrder', ({ price, quantity }) => {
      this.price = price || this.price;
      this.quantity = quantity || this.quantity;
      this.updateTotal();
    });
  },
};
</script>
