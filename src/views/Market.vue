<template>
  <div>
    <Ticker :asset="asset" :ticker="ticker"/>
    <div class="p-4">
      <div class="mb-4">
        <div class="graph"></div>
      </div>
      <h2>Order book</h2>
      <div class="columns">
        <div class="column one-third">
          <h3>Bids (sell {{asset}} orders)</h3>
          <OrderBookBids :bids="orderBook.bids" />
        </div>
        <div class="column one-third text-center">
          <Actions/>
        </div>
        <div class="column one-third">
          <h3>Asks (buy {{asset}} orders)</h3>
          <OrderBookAsks :asks="orderBook.asks" />
        </div>
      </div>
      <div class="mb-4">
        <h2>Trade history</h2>
        <RecentTrades :recentTrades="recentTrades" :asset="asset"/>
      </div>
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
      return this.$store.state.market.ticker[this.asset];
    },
    orderBook() {
      return this.$store.state.market.orderBook[this.asset];
    },
    recentTrades() {
      return this.$store.state.market.recentTrades[this.asset];
    },
  },
  methods: mapActions([
    'getTicker',
    'getOrderBook',
    'getRecentTrades',
  ]),
  beforeDestroy() {
    clearInterval(this.queryInterval);
  },
  mounted() {
    this.queryInterval = setInterval(() => {
      this.getTicker(this.asset);
      this.getOrderBook(this.asset);
      this.getRecentTrades(this.asset);
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
