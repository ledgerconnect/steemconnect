<template>
  <div>
    <Ticker :asset="asset" :ticker="ticker"/>
    <div class="graph border-bottom bg-gray-light mb-4 tradingview-widget-container">
      <div id="tradingview_24491"></div>
    </div>
    <div>
      <div class="columns m-0">
        <div class="column px-0 col-lg-4 col-12 mb-4">
          <h4 class="mx-4">Bids</h4>
          <OrderBookBids :bids="bids"/>
        </div>
        <div class="column col-lg-4 col-12 text-center px-6 mb-4">
          <Actions/>
        </div>
        <div class="column px-0 col-lg-4 col-12 mb-4">
          <h4 class="mx-4">Asks</h4>
          <OrderBookAsks :asks="asks"/>
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
    bids() {
      return Object.values(this.$store.state.market.orderBook[this.asset].bids);
    },
    asks() {
      return Object.values(this.$store.state.market.orderBook[this.asset].asks);
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

    // eslint-disable-next-line no-new, new-cap
    new TradingView.widget({
      autosize: true,
      symbol: 'BITTREX:STEEMBTC',
      interval: 'D',
      timezone: 'Etc/UTC',
      theme: 'Light',
      style: '1',
      locale: 'en',
      toolbar_bg: '#f1f3f6',
      enable_publishing: false,
      hide_legend: true,
      save_image: false,
      container_id: 'tradingview_24491',
    });
  },
};
</script>

<style scoped lang="less">
.graph {
  height: 400px;

  & > div:first-child {
    height: 100%;
  }
}
</style>
