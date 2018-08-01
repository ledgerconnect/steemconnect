<template>
  <table class="table width-full text-right mb-4">
    <thead>
      <tr class="border-bottom">
        <!--<th>Sum</th>-->
        <th class="text-left">Date</th>
        <th class="text-left">Type</th>
        <th>Price</th>
        <th>Total units {{asset}}</th>
        <th>Total cost (STEEM)</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(trade, key, i) in recentTrades.slice(0, 5)"
        :key="i"
        class="border-bottom"
      >
        <td class="text-left">{{trade.date | date}}</td>
        <td class="text-left">
          <span class="text-red" v-if="trade.current_pays.slice(-6) === ' STEEM'">Sell</span>
          <span class="text-green" v-else>Buy</span>
        </td>
        <td>
          <template v-if="trade.current_pays.slice(-6) === ' STEEM'">
            {{(parseFloat(trade.open_pays) / parseFloat(trade.current_pays)).toFixed(6)}}
          </template>
          <template v-else>
            {{(parseFloat(trade.current_pays) / parseFloat(trade.open_pays)).toFixed(6)}}
          </template>
        </td>
        <td>
          <template v-if="trade.current_pays.slice(-6) === ' STEEM'">
            {{trade.open_pays}}
          </template>
          <template v-else>
            {{trade.current_pays}}
          </template>
        </td>
        <td>
          <template v-if="trade.current_pays.slice(-6) === ' STEEM'">
            {{trade.current_pays}}
          </template>
          <template v-else>
            {{trade.open_pays}}
          </template>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: ['recentTrades', 'asset'],
};
</script>
