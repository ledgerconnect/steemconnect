<template>
  <div>
    <div>
      <h3>{{pair}}<sub>/ STEEM</sub></h3>
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
        <h3>Bids (sell {{pair}} orders)</h3>
        <table class="text-right">
          <thead>
            <tr>
              <!--<th>Sum</th>-->
              <th>Total</th>
              <th>Size ({{pair}})</th>
              <th>Bid (STEEM)</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(order, key, i) in orderBook.bids.slice(0, 10)"
              :key="i"
            >
              <!--<td>{{order.created | date}}</td>-->
              <td>{{order.sbd / 1000}}</td>
              <td>{{order.steem / 1000}}</td>
              <!--<td>{{order.order_price.base}}</td>-->
              <!--<td>{{order.order_price.quote}}</td>-->
              <td class="text-green">{{parseFloat(order.real_price).toFixed(6)}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <h3>Asks (buy {{pair}} orders)</h3>
        <table class="text-right">
          <thead>
            <tr>
              <!--<th>Sum</th>-->
              <th>Total</th>
              <th>Size ({{pair}})</th>
              <th>Ask (STEEM)</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(order, key, i) in orderBook.asks.slice(0, 10)"
              :key="i"
            >
              <!--<td>{{order.created | date}}</td>-->
              <td>{{order.sbd / 1000}}</td>
              <td>{{order.steem / 1000}}</td>
              <!--<td>{{order.order_price.base}}</td>-->
              <!--<td>{{order.order_price.quote}}</td>-->
              <td class="text-red">{{parseFloat(order.real_price).toFixed(6)}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <h2>Trade history</h2>
      <div>
        <table class="text-right">
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
      </div>
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
