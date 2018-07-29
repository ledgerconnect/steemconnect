<template>
  <div>
    <Ticker :asset="asset" :ticker="ticker"/>
    <div class="graph border-bottom bg-gray-light"/>
    <div class="p-4">
      <div class="columns m-0">
        <div class="column one-third">
          <h4>Bids (sell {{asset}} orders)</h4>
          <OrderBookBids :bids="orderBook.bids" />
        </div>
        <div class="column one-third text-center p-5">
          <Actions/>
        </div>
        <div class="column one-third">
          <h4>Asks (buy {{asset}} orders)</h4>
          <OrderBookAsks :asks="orderBook.asks" />
        </div>
      </div>
    </div>
    <div>
      <h3 class="mx-4">Trade history</h3>
      <RecentTrades :recentTrades="recentTrades" :asset="asset"/>
      <h3 class="mx-4">Open orders</h3>
      <OpenOrders/>
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
    this.getTicker(this.asset);
    this.getOrderBook(this.asset);
    this.getRecentTrades(this.asset);
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
  height: 400px;
}
</style>
