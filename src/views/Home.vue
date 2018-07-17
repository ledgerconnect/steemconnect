<template>
  <div>
    <div>
      <h2>Ticker</h2>
      <div>
        <div>Last price {{ticker.latest}}</div>
        <div>Ask {{ticker.lowest_ask}}</div>
        <div>Bid {{ticker.highest_bid}}</div>
        <div>Spread {{ticker.percent_change}}</div>
        <div>24h volume STEEM {{ticker.steem_volume}}</div>
        <div>24h volume SBD {{ticker.sbd_volume}}</div>
      </div>
      <h2>Trade history</h2>
      <div>
        <div
          v-for="(trade, key, i) in recentTrades"
          :key="i"
        >
          {{trade.date | date}}
          {{(parseFloat(trade.current_pays) / parseFloat(trade.open_pays)).toFixed(6)}}
          {{trade.open_pays}}
          {{trade.current_pays}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  computed: {
    recentTrades() {
      return this.$store.state.market.recentTrades;
    },
    ticker() {
      return this.$store.state.market.ticker;
    },
  },
  methods: mapActions([
    'getRecentTrades',
    'getTicker',
  ]),
  created() {
    this.getRecentTrades();
    this.getTicker();
  },
};
</script>
