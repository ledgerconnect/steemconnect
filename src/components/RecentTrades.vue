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
      <transition-group v-if="recentTrades.length !== 0" name="entry" tag="tbody">
        <tr
          v-for="(trade) in visibleTrades"
          :key="getTradeKey(trade)"
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
      </transition-group>
  </table>
</template>

<script>
const VISIBLE_TRADES = 5;

export default {
  props: ['recentTrades', 'asset'],
  computed: {
    visibleTrades() {
      return this.recentTrades.slice(0, VISIBLE_TRADES);
    },
  },
  methods: {
    getTradeKey(trade) {
      return trade.date + trade.current_pays + trade.open_pays;
    },
  },
};
</script>
