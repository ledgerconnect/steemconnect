<template>
  <table class="table table-lg width-full text-left">
    <thead>
      <tr class="border-bottom">
        <th>Ask (STEEM)</th>
        <th>Size (SBD)</th>
        <th>Total</th>
      </tr>
    </thead>
    <transition-group v-if="visibleAsks.length !== 0" name="entry" tag="tbody">
      <tr
        v-for="order in visibleAsks"
        :key="getOrderKey(order)"
        class="border-bottom"
      >
        <td>
          <a
            @click="$root.$emit('fillPrice', order.price)"
            class="text-red"
          >
            {{order.price}}
          </a>
        </td>
        <td>
          <a @click="$root.$emit('fillQuantity', order.sbd / 1000)">
            {{order.sbd / 1000}}
          </a>
        </td>
        <td>{{order.steem / 1000}}</td>
      </tr>
    </transition-group>
  </table>
</template>

<script>
const VISIBLE_ASKS = 5;

export default {
  props: ['asks'],
  computed: {
    visibleAsks() {
      return this.asks.slice(0, VISIBLE_ASKS);
    },
  },
  methods: {
    getOrderKey(order) {
      return `${order.count}-${order.price}`;
    },
  },
};
</script>
