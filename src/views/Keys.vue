<template>
  <div>
    <Header title="Keys" />
    <table class="table table-lg width-full after-header">
      <thead>
        <tr class="border-bottom">
          <th>Type</th>
          <th>Key</th>
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
            v-if="publicKeys[authority] === auth[0]"
          >
            <td>{{ authority }}</td>
            <td>{{ auth[0] }}</td>
            <td>{{ auth[1] }}</td>
            <td class="text-right">
              <span class="iconfont icon-kebab-vertical"/>
            </td>
          </tr>
        </template>
        <tr class="border-bottom" v-if="publicKeys['memo'] == account.memo_key">
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
import { privateKeyFrom } from '@/helpers/auth';

export default {
  computed: {
    account() {
      return this.$store.state.auth.account;
    },
    publicKeys() {
      const { keys } = this.$store.state.auth;

      return Object.keys(keys).reduce((acc, b) => {
        if (!keys[b]) return acc;

        acc[b] = privateKeyFrom(keys[b])
          .createPublic()
          .toString();

        return acc;
      }, {});
    },
  },
};
</script>
