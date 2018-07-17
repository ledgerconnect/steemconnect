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
      <h2>Order book</h2>
      <div>
        <h3>Bids (buy orders)</h3>
        <div
          v-for="(order, key, i) in orderBook.bids.slice(0, 20)"
          :key="i"
        >
          {{order.created | date}}
          {{order.sbd / 1000}}
          {{order.steem / 1000}}
          {{order.order_price.base}}
          {{order.order_price.quote}}
          {{order.real_price}}
        </div>
      </div>
      <div>
        <h3>Asks (sell orders)</h3>
        <div
          v-for="(order, key, i) in orderBook.asks.slice(0, 20)"
          :key="i"
        >
          {{order.created | date}}
          {{order.sbd / 1000}}
          {{order.steem / 1000}}
          {{order.order_price.base}}
          {{order.order_price.quote}}
          {{order.real_price}}
        </div>
      </div>
      <h2>Trade history</h2>
      <div>
        <div
          v-for="(trade, key, i) in recentTrades.slice(0, 20)"
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
