<template>
  <table class="table table-lg width-full text-right">
    <thead>
      <tr class="border-bottom">
        <th class="text-left">Order ID</th>
        <th class="text-left">Type</th>
        <th class="text-left">Time</th>
        <th>Price</th>
        <th>Amount</th>
        <th>Total</th>
        <th class="text-left">Action</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="order in openOrders" class="border-bottom">
        <td class="text-left">{{order.orderid}}</td>
        <td class="text-left">
          <span class="text-red" v-if="order.sell_price.base.slice(-6) === ' STEEM'">Sell</span>
          <span class="text-green" v-else>Buy</span>
        </td>
        <td class="text-left">{{order.created | date}}</td>
        <td>{{order.sell_price.base}}</td>
        <td>{{order.sell_price.quote}}</td>
        <td>123.456</td>
        <td class="text-left">
          <a href="#">Cancel</a>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  computed: {
    openOrders() {
      return this.$store.state.auth.open_orders;
    },
  },
};
</script>
