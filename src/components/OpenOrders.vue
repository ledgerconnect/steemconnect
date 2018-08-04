<template>
  <div>
    <table class="table width-full text-right">
      <thead>
      <tr class="border-bottom">
        <th class="text-left">Order ID</th>
        <th class="text-left">Time</th>
        <th class="text-left">Type</th>
        <th>Price</th>
        <th>Amount</th>
        <th>Total</th>
        <th class="text-left">Action</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="order in openOrders" class="border-bottom" :key="order.orderId">
        <td class="text-left">{{order.orderid}}</td>
        <td class="text-left">{{order.created | date}}</td>
        <td class="text-left">
          <span class="text-red" v-if="order.sell_price.base.slice(-6) === ' STEEM'">Sell</span>
          <span class="text-green" v-else>Buy</span>
        </td>
        <td>{{order.sell_price.base}}</td>
        <td>{{order.sell_price.quote}}</td>
        <td>123.456</td>
        <td class="text-left">
          <a @click="open = true; orderId = order.orderid">Cancel</a>
        </td>
      </tr>
      </tbody>
    </table>
    <VueModal
      v-if="open"
      @close="open = false"
      title="Cancel order"
      :locked="isLoading"
      class="small"
    >
      <div class="default-body">
        Are you sure you want to cancel the order <b>{{orderId}}</b>?
      </div>
      <div slot="footer" class="actions">
        <button
          :disabled="isLoading"
          class="btn btn-large btn-primary"
          @click="isLoading = true; handleCancelOrder(orderId)"
        >
          Confirm
        </button>
        <button :disabled="isLoading" class="btn btn-large btn-plain" @click="open = false">
          Cancel
        </button>
      </div>
    </VueModal>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      open: false,
      isLoading: false,
      orderId: null,
    };
  },
  computed: {
    openOrders() {
      return this.$store.state.auth.open_orders;
    },
  },
  methods: {
    ...mapActions([
      'cancelOrder',
    ]),
    handleCancelOrder(orderId) {
      this.cancelOrder(orderId).then(() => {
        this.open = false;
        this.isLoading = false;
        this.orderId = null;
      }).catch((e) => {
        console.log('Cancel order failed', e);
      });
    },
  },
};
</script>
