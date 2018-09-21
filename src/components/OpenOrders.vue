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
      <ModalCancelOrder
        :open="open"
        :orderId="orderId"
        @cancel="handleModalCancel"
      />
    </template>
  </div>
</template>

<script>
import { copyToClipboard } from '@/helpers/utils';

export default {
  data() {
    return {
      open: false,
      orderId: null,
      search: '',
    };
  },
  computed: {
    openOrders() {
      return this.$store.state.auth.open_orders.filter(order => JSON.stringify(order)
        .toLowerCase()
        .includes(this.search.toLowerCase()));
    },
  },
  methods: {
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
    handleModalCancel() {
      this.open = false;
    },
  },
};
</script>
