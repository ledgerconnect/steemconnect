<template>
  <div>
    <Search v-model="search" />
    <table class="table table-lg width-full text-right">
      <thead>
        <tr class="border-bottom">
          <th class="text-left">Asset name</th>
          <th>Balance</th>
          <th>Value, USD</th>
          <th>Price, USD</th>
          <th>24h change</th>
          <th/>
        </tr>
      </thead>
      <tbody>
        <tr v-if="balanceVisible('Steem (STEEM)')" class="border-bottom">
          <td class="text-left">Steem (STEEM)</td>
          <td>{{$n(steemBalance)}}</td>
          <td>{{$n(rate.price_usd * steemBalance, 'currency')}}</td>
          <td>{{$n(rate.price_usd, 'currency')}}</td>
          <td :class="rate.percent_change_24h > 0 ? 'text-green' : 'text-red'">
            <span v-if="rate.percent_change_24h > 0">+</span>{{$n(rate.percent_change_24h)}}%
          </td>
          <td>
            <VueDropdown>
              <VueButton
                slot="trigger"
                class="icon-button flat"
              >
                <span class="iconfont icon-kebab-vertical"/>
              </VueButton>
              <VueDropdownButton @click.prevent="open = true; asset = 'STEEM'">
                Send
              </VueDropdownButton>
              <VueDropdownButton disabled>Power up</VueDropdownButton>
            </VueDropdown>
          </td>
        </tr>
        <tr v-if="balanceVisible('Steem Dollars (SBD)')" class="border-bottom">
          <td class="text-left">Steem Dollars (SBD)</td>
          <td>{{$n(sbdBalance)}}</td>
          <td>{{$n(rate.price_usd * tickers.SBD.latest * sbdBalance, 'currency')}}</td>
          <td>{{$n(rate.price_usd * tickers.SBD.latest, 'currency')}}</td>
          <td>?</td>
          <td>
            <VueDropdown>
              <VueButton
                slot="trigger"
                class="icon-button flat"
              >
                <span class="iconfont icon-kebab-vertical"/>
              </VueButton>
              <VueDropdownButton @click.prevent="open = true; asset = 'SBD'">
                Send
              </VueDropdownButton>
              <VueDropdownButton disabled>Convert</VueDropdownButton>
            </VueDropdown>
          </td>
        </tr>
        <tr v-if="balanceVisible('Steem Power (SP)')" class="border-bottom">
          <td class="text-left">Steem Power (SP)</td>
          <td>{{$n(steemPowerBalance)}}</td>
          <td>{{$n(rate.price_usd * steemPowerBalance, 'currency')}}</td>
          <td>{{$n(rate.price_usd, 'currency')}}</td>
          <td :class="rate.percent_change_24h > 0 ? 'text-green' : 'text-red'">
            <span v-if="rate.percent_change_24h > 0">+</span>{{$n(rate.percent_change_24h)}}%
          </td>
          <td>
            <VueDropdown>
              <VueButton
                slot="trigger"
                class="icon-button flat"
              >
                <span class="iconfont icon-kebab-vertical"/>
              </VueButton>
              <VueDropdownButton disabled>Power down</VueDropdownButton>
            </VueDropdown>
          </td>
        </tr>
        <tr
          v-if="balanceVisible('Savings Steem') && savingsSteemBalance > 0"
          class="border-bottom"
        >
          <td class="text-left">Savings Steem</td>
          <td>{{$n(savingsSteemBalance)}}</td>
          <td>{{$n(rate.price_usd * savingsSteemBalance, 'currency')}}</td>
          <td>{{$n(rate.price_usd, 'currency')}}</td>
          <td :class="rate.percent_change_24h > 0 ? 'text-green' : 'text-red'">
            <span v-if="rate.percent_change_24h > 0">+</span>{{$n(rate.percent_change_24h)}}%
          </td>
          <td>
            <VueDropdown>
              <VueButton
                slot="trigger"
                class="icon-button flat"
              >
                <span class="iconfont icon-kebab-vertical"/>
              </VueButton>
              <VueDropdownButton disabled>Withdraw</VueDropdownButton>
            </VueDropdown>
          </td>
        </tr>
        <tr
          v-if="balanceVisible('Savings Steem Dollars') && savingsSbdBalance > 0"
          class="border-bottom"
        >
          <td class="text-left">Savings Steem Dollars</td>
          <td>{{$n(savingsSbdBalance)}}</td>
          <td>{{$n(rate.price_usd * tickers.SBD.latest * savingsSbdBalance, 'currency')}}</td>
          <td>{{$n(rate.price_usd * tickers.SBD.latest, 'currency')}}</td>
          <td>?</td>
          <td>
            <VueDropdown>
              <VueButton
                slot="trigger"
                class="icon-button flat"
              >
                <span class="iconfont icon-kebab-vertical"/>
              </VueButton>
              <VueDropdownButton disabled>Withdraw</VueDropdownButton>
            </VueDropdown>
          </td>
        </tr>
      </tbody>
    </table>
    <ModalSend :open="open" :initialAsset="asset" @cancel="handleCancel" />
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      open: false,
      asset: 'STEEM',
      search: '',
    };
  },
  computed: {
    account() {
      return this.$store.state.auth.account;
    },
    steemBalance() {
      return parseFloat(this.account.balance) || 0;
    },
    sbdBalance() {
      return parseFloat(this.account.sbd_balance) || 0;
    },
    savingsSteemBalance() {
      return parseFloat(this.account.savings_balance) || 0;
    },
    savingsSbdBalance() {
      return parseFloat(this.account.savings_sbd_balance) || 0;
    },
    steemPowerBalance() {
      const { properties } = this.$store.state.market;

      return this.vestToSteem(
        this.account.vesting_shares,
        properties.total_vesting_shares,
        properties.total_vesting_fund_steem,
      );
    },
    rate() {
      return this.$store.state.market.rate;
    },
    tickers() {
      return {
        SBD: this.$store.state.market.ticker.SBD,
      };
    },
  },
  methods: {
    ...mapActions([
      'getRate',
      'getTicker',
    ]),
    vestToSteem(vestingShares, totalVestingShares, totalVestingFundSteem) {
      return (
        parseFloat(totalVestingFundSteem) *
        (parseFloat(vestingShares) / parseFloat(totalVestingShares))
      );
    },
    balanceVisible(name) {
      if (!this.search) return true;

      return name
        .toLowerCase()
        .includes(this.search.toLowerCase());
    },
    handleCancel() {
      this.open = false;
    },
  },
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
