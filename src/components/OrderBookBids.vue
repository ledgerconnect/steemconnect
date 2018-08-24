<template>
  <table class="table table-lg width-full text-right">
    <thead>
      <tr class="border-bottom">
        <th>Total</th>
        <th>Size (SBD)</th>
        <th>Bid (STEEM)</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(order, key, i) in bids.slice(0, 5)"
        :key="i"
        class="border-bottom"
      >
        <td>{{order.steem / 1000}}</td>
        <td>
          <a @click="$root.$emit('fillQuantity', order.sbd / 1000)">
            {{order.sbd / 1000}}
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
    </tbody>
  </table>
</template>

<script>
export default {
  props: ['bids'],
};
</script>
