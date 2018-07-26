<template>
  <table class="table width-full text-right border box-shadow">
    <thead>
      <tr>
        <!--<th>Sum</th>-->
        <th>Total</th>
        <th>Size (SBD)</th>
        <th>Bid (STEEM)</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(order, key, i) in bids.slice(0, 10)"
        :key="i"
        class="border-bottom"
      >
        <!--<td>{{order.created | date}}</td>-->
        <td>{{order.sbd / 1000}}</td>
        <td>{{order.steem / 1000}}</td>
        <!--<td>{{order.order_price.base}}</td>-->
        <!--<td>{{order.order_price.quote}}</td>-->
        <td class="text-green">{{parseFloat(order.real_price).toFixed(6)}}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: ['bids'],
};
</script>
