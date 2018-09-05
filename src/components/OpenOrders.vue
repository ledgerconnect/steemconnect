<template>
  <div>
    <Search v-model="search" />
    <template>
      <table class="table width-full text-right">
        <thead>
        <tr class="border-bottom">
          <th class="text-left">Order ID</th>
          <th class="text-left">Time</th>
          <th class="text-left">Type</th>
          <th>Quantity</th>
          <th>Filled</th>
          <th>Price (STEEM)</th>
          <th>Total (STEEM)</th>
          <th/>
        </tr>
        </thead>
        <tbody>
        <tr v-for="order in openOrders" class="border-bottom" :key="order.orderId">
          <td class="text-left">{{order.orderid}}</td>
          <td class="text-left">{{order.created | date}}</td>
          <td class="text-left">
            <span class="text-red" v-if="getOrderDirection(order) === 'sell'">Sell</span>
            <span class="text-green" v-else>Buy</span>
          </td>
          <td>{{getOrderQuantity(order).toFixed(3)}}</td>
          <td>{{getOrderFilled(order).toFixed(3)}}</td>
          <td>{{getOrderPrice(order).toFixed(6)}}</td>
          <td>{{getOrderTotal(order).toFixed(3)}}</td>
          <td>
            <VueDropdown>
              <VueButton
                slot="trigger"
                class="icon-button flat"
              >
                <span class="iconfont icon-kebab-vertical"/>
              </VueButton>
              <VueDropdownButton @click="open = true; orderId = order.orderid">
                Cancel this order
              </VueDropdownButton>
              <VueDropdownButton
                @click="handleIdCopy(order.orderid)"
              >
                Copy order ID
              </VueDropdownButton>
            </VueDropdown>
          </td>
        </tr>
        </tbody>
      </table>
      <VueModal
        v-if="open"
        @close="open = false"
        title="Cancel order"
        :locked="sending"
        class="small"
      >
        <div class="default-body">
          <div v-if="failed" class="flash flash-error mb-4">
            We couldn't cancel this order. Please try again later.
          </div>
          <Confirmation v-if="!!transactionId" :id="transactionId" />
          <span v-else>
            Are you sure you want to cancel the order <b>{{orderId}}</b>?
          </span>
        </div>
        <div slot="footer" class="actions">
          <button
            v-if="!!transactionId"
            @click="open = false"
            class="btn btn-large btn-plain input-block"
          >
            Close
          </button>
          <template v-else>
            <button
              :disabled="sending"
              class="btn btn-large btn-primary"
              @click="handleCancelOrder(orderId)"
            >
              {{ confirmText }}
            </button>
            <button :disabled="sending" class="btn btn-large btn-plain" @click="open = false">
              Cancel
            </button>
          </template>
        </div>
      </VueModal>
    </template>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { copyToClipboard } from '@/helpers/utils';

export default {
  data() {
    return {
      open: false,
      sending: false,
      orderId: null,
      search: '',
      transactionId: '',
      failed: false,
    };
  },
  computed: {
    openOrders() {
      return this.$store.state.auth.open_orders.filter(order => JSON.stringify(order)
        .toLowerCase()
        .includes(this.search.toLowerCase()));
    },
    confirmText() {
      if (this.sending) return 'Sending';

      return this.failed ? 'Retry' : 'Confirm';
    },
  },
  watch: {
    open() {
      this.transactionId = '';
      this.failed = false;
    },
  },
  methods: {
    ...mapActions(['cancelLimitOrder']),
    handleIdCopy(id) {
      try {
        copyToClipboard(id);
      } catch (err) {
        console.error(err);
      }
    },
    getOrderDirection(order) {
      if (order.sell_price.base.indexOf('SBD') !== -1) return 'sell';
      return 'buy';
    },
    getOrderQuantity(order) {
      if (this.getOrderDirection(order) === 'sell') {
        return parseFloat(order.sell_price.base);
      }
      return parseFloat(order.sell_price.quote);
    },
    getOrderFilled(order) {
      const toSell = parseFloat(order.sell_price.base);
      const filled = toSell - (order.for_sale / 1000);

      const fillRate = filled / toSell;

      return this.getOrderQuantity(order) * fillRate;
    },
    getOrderPrice(order) {
      if (this.getOrderDirection(order) === 'sell') {
        return parseFloat(order.sell_price.quote) / parseFloat(order.sell_price.base);
      }
      return parseFloat(order.sell_price.base) / parseFloat(order.sell_price.quote);
    },
    getOrderTotal(order) {
      if (this.getOrderDirection(order) === 'buy') {
        return parseFloat(order.sell_price.base);
      }
      return parseFloat(order.sell_price.quote);
    },
    async handleCancelOrder(orderId) {
      this.sending = true;

      try {
        const confirmation = await this.cancelLimitOrder(orderId);

        this.transactionId = confirmation.id;
        this.failed = false;
      } catch (err) {
        console.error(err);

        this.transactionId = '';
        this.failed = true;
      }

      this.sending = false;
    },
  },
};
</script>
