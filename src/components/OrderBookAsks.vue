<template>
  <table class="table table-lg width-full text-left">
    <thead>
      <tr class="border-bottom">
        <th>Ask (STEEM)</th>
        <th>Size (SBD)</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(order, key, i) in asks.slice(0, 5)"
        :key="i"
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
    </tbody>
  </table>
</template>

<script>
export default {
  props: ['asks'],
};
</script>
