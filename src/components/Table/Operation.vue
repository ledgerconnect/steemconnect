<template>
  <tr class="border-bottom">
    <td class="text-left">
      <div>
        <div v-show="op[0] === 'transfer_to_vesting'">
          Powered up
        </div>
        <div v-show="op[0] === 'withdraw_vesting'">
          Started power down
        </div>
        <div v-show="op[0] === 'interest'">
          Received interest
        </div>
        <div v-show="op[0] === 'transfer'">
          <span v-if="op[1].to === username">
            Received from
            <a :href="'https://steemit.com/@' + op[1].from" target="_blank">
              {{ op[1].from }} <span class="iconfont icon-link-external"/>
            </a>
          </span>
          <span v-else>
            Sent to
            <a :href="'https://steemit.com/@' + op[1].to" target="_blank">
              {{ op[1].to }} <span class="iconfont icon-link-external"/>
            </a>
          </span>
        </div>
        <div v-show="op[0] === 'liquidity_reward'">
          Received liquidity rewards
        </div>
        <div v-show="op[0] === 'author_reward'">
          Received author rewards
        </div>
        <div v-show="op[0] === 'curation_reward'">
          Received curation rewards
        </div>
        <div v-show="op[0] === 'comment_benefactor_reward'">
          Received comment benefactor rewards
        </div>
        <div v-show="op[0] === 'transfer_to_savings'">
          Sent to saving
        </div>
        <div v-show="op[0] === 'transfer_from_savings'">
          Started transfer from savings
        </div>
        <div v-show="op[0] === 'cancel_transfer_from_savings'">
          Canceled transfer from savings
        </div>
        <div v-show="op[0] === 'escrow_transfer'">
          Started escrow transfer
        </div>
        <div v-show="op[0] === 'escrow_approve'">
          Approved escrow transfer
        </div>
        <div v-show="op[0] === 'escrow_dispute'">
          Disputed escrow transfer
        </div>
        <div v-show="op[0] === 'escrow_release'">
          Released escrow transfer
        </div>
        <div v-show="op[0] === 'fill_convert_request'">
          Filled convert request
        </div>
        <div v-show="op[0] === 'fill_order'">
          <span v-if="op[1].open_owner === username">
            Paid {{ op[1].open_pays }} for {{ op[1].current_pays }}
          </span>
          <span v-else>
            Paid {{ op[1].current_pays }} for {{ op[1].open_pays }}
          </span>
        </div>
        <div v-show="op[0] === 'claim_reward_balance'">
          Claimed reward balance
        </div>
      </div>
      <h6 class="m-0">
        {{ transfer[1].timestamp | timeOnly }}
      </h6>
    </td>
    <td>
      <div v-if="op[0] === 'transfer'">
        {{ op[1].to === username ? '+' : '-' }}{{ op[1].amount }}
        <h6 class="m-0">
          {{$n(convertToUsd(op), 'currency')}}
        </h6>
      </div>
      <div v-else-if="!!op[1].amount">
        {{ op[1].amount }}
        <h6 class="m-0">
          {{$n(convertToUsd(op), 'currency')}}
        </h6>
      </div>
    </td>
    <td>
      <VueDropdown>
        <VueButton
          slot="trigger"
          class="icon-button flat"
        >
          <span class="iconfont icon-kebab-vertical"/>
        </VueButton>
        <VueDropdownButton>
          <a
            :href="'https://steemd.com/tx/' + transfer[1].trx_id"
            target="_blank"
            class="button-link"
          >
            TX info <span class="iconfont icon-link-external"/>
          </a>
        </VueDropdownButton>
        <VueDropdownButton
          @click="handleIdCopy(transfer[1].trx_id)"
        >
          Copy TX ID
        </VueDropdownButton>
      </VueDropdown>
    </td>
  </tr>
</template>

<script>
import { mapActions } from 'vuex';
import { copyToClipboard } from '@/helpers/utils';

export default {
  props: ['transfer'],
  data() {
    return {
      op: this.transfer[1].op,
    };
  },
  computed: {
    username() {
      return this.$store.state.auth.username;
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
    convertToUsd(op) {
      const { amount } = op[1];
      const modifier = amount.indexOf('SBD') !== -1 ? this.tickers.SBD.latest : 1;

      return this.rate.price_usd * parseFloat(amount) * modifier;
    },
    handleIdCopy(id) {
      try {
        copyToClipboard(id);
      } catch (err) {
        console.error(err);
      }
    },
  },
  mounted() {
    this.getRate();
    this.getTicker('SBD');
    this.queryInterval = setInterval(() => {
      this.getRate();
      this.getTicker('SBD');
    }, 20000);
  },
  beforeDestroy() {
    clearInterval(this.queryInterval);
  },
};
</script>
