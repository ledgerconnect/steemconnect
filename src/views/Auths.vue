<template>
  <div>
    <Header title="Auths" />
    <table class="table width-full after-header">
      <thead>
        <tr class="border-bottom">
          <th>Type</th>
          <th>Key</th>
          <th>Weight</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(auth, i) in auths" class="border-bottom" :key="i">
          <td>{{ auth.authority }}</td>
          <td>
            <OperationValueAccount v-if="auth.type === 'account'" :value="auth.auth[0]" />
            <template v-else>{{ auth.auth[0] }}</template>
            <router-link
              v-if="auth.type === 'account'"
              :to="
                auth.authority !== 'posting'
                  ? `/revoke/${auth.auth[0]}?authority=${auth.authority}`
                  : `/revoke/${auth.auth[0]}`
              "
              class="btn btn-sm float-right"
            >
              Revoke
            </router-link>
          </td>
          <td>{{ auth.auth[1] }}</td>
        </tr>
        <tr class="border-bottom" v-if="publicKeys['memo'] == account.memo_key">
          <td>memo</td>
          <td>{{ account.memo_key }}</td>
          <td></td>
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
    auths() {
      const auths = [];
      ['owner', 'active', 'posting'].forEach(authority => {
        this.account[authority].key_auths.forEach(auth => {
          auths.push({ type: 'key', authority, auth });
        });
        this.account[authority].account_auths.forEach(auth => {
          auths.push({ type: 'account', authority, auth });
        });
      });
      return auths;
    },
  },
};
</script>
