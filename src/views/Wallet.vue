<template>
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
        <td>$432.32</td>
        <td>$1.44</td>
        <td class="text-green">+4.54%</td>
        <td class="text-left">Send</td>
      </tr>
      <tr class="border-bottom">
        <td class="text-left">Steem Dollar (SBD)</td>
        <td>{{$n(parseFloat(account.sbd_balance))}}</td>
        <td>$194.32</td>
        <td>$1.21</td>
        <td class="text-red">-2.39%</td>
        <td class="text-left">Send</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  computed: {
    account() {
      return this.$store.state.auth.account;
    },
  },
};
</script>
