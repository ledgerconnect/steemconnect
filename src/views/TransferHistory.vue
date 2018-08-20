<template>
  <div>
    <table class="table table-lg width-full text-right">
      <thead>
        <tr class="border-bottom">
          <th class="text-left">Time</th>
          <th class="text-left">Operation</th>
          <th>Amount</th>
          <th/>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="transfer in transferHistory"
          class="border-bottom"
          :key="transfer[0]"
        >
          <td class="text-left">{{ transfer[1].timestamp | date }}</td>
          <td class="text-left">{{ transfer[1].op[0] }}</td>
          <td>{{ transfer[1].op[1].amount }}</td>
          <td class="text-right">
            <a
              :href="'https://steemd.com/tx/' + transfer[1].trx_id"
              target="_blank"
            >
              <span class="iconfont icon-kebab-vertical"/>
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  computed: {
    transferHistory() {
      return this.$store.state.auth.transfer_history;
    },
  },
  methods: mapActions([
    'getTransferHistory',
  ]),
  mounted() {
    this.getTransferHistory();
  },
};
</script>
