<template>
  <div>
    <div class="search border-bottom px-4">
      <span class="iconfont icon-search"/>
      <input v-model="search" type="text" class="px-4 py-3 border-0 input-lg"/>
    </div>
    <table class="table table-lg width-full text-right">
      <thead>
        <tr class="border-bottom">
          <th class="text-left">Operation</th>
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
          <TableOperation
            v-for="transfer in history"
            :transfer="transfer"
            :key="transfer[0]"
          />
        </template>
      </tbody>
    </table>
  </div>
</template>

<script>
import moment from 'moment';
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      search: '',
    };
  },
  computed: {
    transferHistory() {
      return this.$store.state.auth.transfer_history.filter(transfer => JSON.stringify(transfer)
        .toLowerCase()
        .includes(this.search.toLowerCase()));
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
