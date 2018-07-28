<template>
  <div>
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
          <td class="text-left">
            <a href="#" @click="open = true">Send</a>
          </td>
        </tr>
        <tr class="border-bottom">
          <td class="text-left">Steem Dollar (SBD)</td>
          <td>{{$n(parseFloat(account.sbd_balance))}}</td>
          <td>$194.32</td>
          <td>$1.21</td>
          <td class="text-red">-2.39%</td>
          <td class="text-left">
            <a href="#" @click="open = true">Send</a>
          </td>
        </tr>
      </tbody>
    </table>
    <VueModal
      v-if="open"
      @close="open = false"
      title="Transfer"
      class="small"
    >
      <div class="default-body">
        Send 1.000 STEEM
      </div>
      <div slot="footer" class="actions">
        <button class="btn btn-large btn-primary" @click="open = false">
          Confirm
        </button>
        <button class="btn btn-large btn-plain" @click="open = false">
          Cancel
        </button>
      </div>
    </VueModal>
  </div>

</template>

<script>
export default {
  data () {
    return {
      open: false,
    }
  },
  computed: {
    account() {
      return this.$store.state.auth.account;
    },
  },
};
</script>
