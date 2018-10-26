<template>
  <div>
    <Header title="Permissions" />
    <table class="table table-lg width-full after-header">
      <thead>
        <tr class="border-bottom">
          <th>Type</th>
          <th>Account / key</th>
          <th>Weight</th>
          <th/>
        </tr>
      </thead>
      <tbody>
        <template v-for="(authority, i) in ['owner', 'active', 'posting']">
          <tr
            v-for="
              (auth, j) in account[authority].key_auths.concat(account[authority].account_auths)
             "
            class="border-bottom"
            :key="`${i}-${j}`"
          >
            <td>{{ authority }}</td>
            <td>{{ auth[0] }}</td>
            <td>{{ auth[1] }}</td>
            <td class="text-right">
              <span class="iconfont icon-kebab-vertical"/>
            </td>
          </tr>
        </template>
        <tr class="border-bottom">
          <td>memo</td>
          <td>{{ account.memo_key }}</td>
          <td></td>
          <td class="text-right">
            <span class="iconfont icon-kebab-vertical"/>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
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
