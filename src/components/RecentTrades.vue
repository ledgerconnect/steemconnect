<template>
  <table class="width-full text-right">
    <thead>
      <tr>
        <!--<th>Sum</th>-->
        <th class="text-left">Date</th>
        <th>Price</th>
        <th>Steem</th>
        <th>{{pair}}</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(trade, key, i) in recentTrades.slice(0, 10)"
        :key="i"
      >
        <!--<td>{{order.created | date}}</td>-->
        <td class="text-left">{{trade.date | date}}</td>
        <td>{{(parseFloat(trade.current_pays) / parseFloat(trade.open_pays)).toFixed(6)}}</td>
        <!--<td>{{order.order_price.base}}</td>-->
        <!--<td>{{order.order_price.quote}}</td>-->
        <td>{{trade.open_pays}}</td>
        <td>{{trade.current_pays}}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: ['recentTrades'],
};
</script>
