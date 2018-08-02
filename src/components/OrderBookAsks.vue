<template>
  <table class="table table-lg width-full text-right">
    <thead>
      <tr class="border-bottom">
        <!--<th>Sum</th>-->
        <th>Total</th>
        <th>Size (SBD)</th>
        <th>Ask (STEEM)</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(order, key, i) in asks.slice(0, 5)"
        :key="i"
        class="border-bottom"
      >
        <!--<td>{{order.created | date}}</td>-->
        <td>{{order.sbd / 1000}}</td>
        <td>{{order.steem / 1000}}</td>
        <!--<td>{{order.order_price.base}}</td>-->
        <!--<td>{{order.order_price.quote}}</td>-->
        <td>
          <a
            @click="$root.$emit('fillOrder', parseFloat(order.real_price).toFixed(6))"
            class="text-red"
          >
            {{parseFloat(order.real_price).toFixed(6)}}
          </a>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: ['asks', 'fillOrder'],
};
</script>
