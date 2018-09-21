<template>
  <table class="table table-lg width-full text-right">
    <thead>
      <tr class="border-bottom">
        <th>Total</th>
        <th>Size (SBD)</th>
        <th>Bid (STEEM)</th>
      </tr>
    </thead>
    <transition-group v-if="visibleBids.length !== 0" name="entry" tag="tbody">
      <tr
        v-for="order in visibleBids"
        :key="getOrderKey(order)"
        class="border-bottom"
      >
        <td>{{order.steem / 1000}}</td>
        <td>
          <a @click="$root.$emit('fillQuantity', order.token / 1000)">
            {{order.token / 1000}}
          </a>
        </td>
        <td>
          <a
            @click="$root.$emit('fillPrice', order.price)"
            class="text-green"
          >
            {{order.price}}
          </a>
        </td>
      </tr>
    </transition-group>
  </table>
</template>

<script>
const VISIBLE_BIDS = 5;

export default {
  props: ['bids'],
  computed: {
    visibleBids() {
      return this.bids.slice(0, VISIBLE_BIDS);
    },
  },
  methods: {
    getOrderKey(order) {
      return `${order.count}-${order.price}`;
    },
  },
};
</script>
