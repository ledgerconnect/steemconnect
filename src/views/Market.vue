<template>
  <div>
    <h2>{{asset}} ticker</h2>
    <Ticker :ticker="ticker"/>
    <div class="graph"></div>
    <h2>Order book</h2>
    <div class="columns">
      <div class="column one-third">
        <h3>Bids (sell {{asset}} orders)</h3>
        <OrderBookBids :bids="orderBook.bids" />
      </div>
      <div class="column one-third text-center">
        <h3>Actions</h3>
      </div>
      <div class="column one-third">
        <h3>Asks (buy {{asset}} orders)</h3>
        <OrderBookAsks :asks="orderBook.asks" />
      </div>
    </div>
    <div>
      <h2>Trade history</h2>
      <RecentTrades :recentTrades="recentTrades" :asset="asset"/>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      asset: this.$route.params.asset,
    };
  },
  computed: {
    ticker() {
      return this.$store.state.market.ticker;
    },
    orderBook() {
      return this.$store.state.market.orderBook;
    },
    recentTrades() {
      return this.$store.state.market.recentTrades;
    },
  },
  methods: mapActions([
    'getTicker',
    'getOrderBook',
    'getRecentTrades',
  ]),
  beforeDestroy () {
    clearInterval(this.queryInterval)
  },
  mounted() {
    this.queryInterval = setInterval(() => {
      this.getTicker();
      this.getOrderBook();
      this.getRecentTrades();
    }, 3000);
  },
};
</script>

<style scoped lang="less">
.graph {
  background-color: lightgray;
  height: 400px;
}
</style>
