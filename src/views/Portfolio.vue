<template>
  <div>
    <table class="table table-lg width-full text-right">
      <thead>
        <tr class="border-bottom">
          <th class="text-left">Asset name</th>
          <th>Balance</th>
          <th>Value, USD</th>
          <th>Price, USD</th>
          <th>24h change</th>
          <th class="text-left">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr class="border-bottom">
          <td class="text-left">Steem (STEEM)</td>
          <td>{{$n(parseFloat(account.balance))}}</td>
          <td>{{$n(rate.price_usd * parseFloat(account.balance), 'currency')}}</td>
          <td>{{$n(rate.price_usd, 'currency')}}</td>
          <td :class="rate.percent_change_24h > 0 ? 'text-green' : 'text-red'">
            <span v-if="rate.percent_change_24h > 0">+</span>{{$n(rate.percent_change_24h)}}%
          </td>
          <td class="text-left">
            <a href="#" @click="open = true; asset = 'STEEM'">Send</a>
          </td>
        </tr>
        <tr class="border-bottom">
          <td class="text-left">Steem Dollars (SBD)</td>
          <td>{{$n(parseFloat(account.sbd_balance))}}</td>
          <td>{{$n(rate.price_usd / tickers.SBD.latest * parseFloat(account.sbd_balance), 'currency')}}</td>
          <td>{{$n(rate.price_usd / tickers.SBD.latest, 'currency')}}</td>
          <td>?</td>
          <td class="text-left">
            <a href="#" @click="open = true; asset = 'SBD'">Send</a>
          </td>
        </tr>
      </tbody>
    </table>
    <VueModal
      v-if="open"
      @close="open = false"
      title="Transfer"
      class="small"
    >
      <div class="default-body">
        Send 1.000 {{asset}}
      </div>
      <div slot="footer" class="actions">
        <button class="btn btn-large btn-primary" @click="open = false">
          Confirm
        </button>
        <button class="btn btn-large btn-plain" @click="open = false">
          Cancel
        </button>
      </div>
    </VueModal>
  </div>

</template>

<script>
import { mapActions } from 'vuex';

export default {
  data () {
    return {
      open: false,
      asset: null,
    }
  },
  computed: {
    account() {
      return this.$store.state.auth.account;
    },
    rate() {
      return this.$store.state.market.rate;
    },
    tickers() {
      return {
        SBD: this.$store.state.market.ticker.SBD
      };
    },
  },
  methods: mapActions([
    'getRate',
    'getTicker',
  ]),
  beforeDestroy() {
    clearInterval(this.queryInterval);
  },
  mounted() {
    this.getRate();
    this.getTicker('SBD');
    this.queryInterval = setInterval(() => {
      this.getRate();
      this.getTicker('SBD');
    }, 20000);
  },
};
</script>
