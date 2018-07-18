<template>
  <div>
    <h3>{{pair}}<sub>/ STEEM</sub></h3>
    <h2>Ticker</h2>
    <Ticker :ticker="ticker"/>

    <h2>Order book</h2>
    <div class="columns m-0 bg-gray-dark">
      <div class="column one-third bg-green-light">
        <h3>Bids (sell {{pair}} orders)</h3>
        <OrderBookBids :bids="orderBook.bids" />
      </div>
      <div class="column one-third text-center bg-gray-light">
        Actions
      </div>
      <div class="column one-third bg-red-light">
        <h3>Asks (buy {{pair}} orders)</h3>
        <OrderBookAsks :asks="orderBook.asks" />
      </div>
    </div>
    <div>
      <h2>Trade history</h2>
      <RecentTrades :recentTrades="recentTrades"/>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      pair: 'SBD',
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
  created() {
    this.getTicker();
    this.getOrderBook();
    this.getRecentTrades();
  },
};
</script>
