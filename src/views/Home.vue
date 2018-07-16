<template>
  <div>
    <div>
      <h2>Trade history</h2>
      <div>
        <div
          v-for="(trade, key, i) in tradeHistory"
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
    tradeHistory() {
      return this.$store.state.market.tradeHistory;
    },
  },
  methods: mapActions([
    'getTradeHistory',
  ]),
  created() {
    this.getTradeHistory();
  },
};
</script>
