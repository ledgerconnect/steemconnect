<template>
  <div>
    <table class="table table-lg width-full text-right">
      <thead>
        <tr class="border-bottom">
          <th class="text-left">Operation</th>
          <th class="text-left">Time</th>
          <th>Amount</th>
          <th/>
        </tr>
      </thead>
      <tbody>
        <template v-for="(history, d) in byDate">
          <tr
            :key="`header-${d}`"
            class="border-bottom text-left table-header"
          >
            <td colspan="4">{{ d | dateHeader }}</td>
          </tr>
          <tr
          v-for="transfer in history"
          class="border-bottom"
            :key="transfer[0]"
          >
            <td class="text-left">{{ transfer[1].op[0] }}</td>
            <td class="text-left">{{ transfer[1].timestamp | timeOnly }}</td>
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
        </template>
      </tbody>
    </table>
  </div>
</template>

<script>
import moment from 'moment';
import { mapActions } from 'vuex';

export default {
  computed: {
    transferHistory() {
      return this.$store.state.auth.transfer_history;
    },
    byDate() {
      return this.transferHistory.reduce((acc, b) => {
        const date = moment.utc(b[1].timestamp).local().format('YYYY-MM-DD');

        (acc[date] = acc[date] || []).push(b);
        return acc;
      }, {});
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
