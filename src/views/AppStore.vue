<template>
  <div>
    <Header>
      <div class="header-container">
        <Search v-model="search" />
        <button class="border-left">Create</button>
      </div>
    </Header>
    <table class="table table-lg width-full text-right">
      <tbody>
        <tr v-for="(app, i) in apps" :key="i" class="border-bottom v-align-top">
          <td class="text-left" width="1">
            <Avatar :username="app.username" :size="64"/>
          </td>
          <td class="text-left" style="width: 600px;">
            <h4>
              {{ app.name }}
              <button class="btn btn-sm btn-plain ml-2">
                Follow
              </button>
            </h4>
            <div class="mb-2">
              <span class="iconfont icon-steem mr-2"/>
              <a href="#" class="mr-3">{{ app.username }}</a>
              <template v-if="app.twitter">
                <span class="iconfont icon-twitter mr-2"/>
                <a href="#" class="mr-3">{{ app.twitter }}</a>
              </template>
              <span class="iconfont icon-link mr-2"/>
              <a
                :href="app.website"
                target="_blank"
                class="mr-3"
              >{{ app.website | parseUrl }}</a>
            </div>
            <p class="mb-4">{{ app.about }}</p>
            <div class="columns">
              <p class="column col-3">
                <b>Followers</b>
                <br/>{{ $n(app.followers) }}
              </p>
              <p class="column col-3">
                <b>Reputation</b>
                <br/>{{ app.reputation }}
              </p>
            </div>
          </td>
          <td>
            <button class="btn btn-blue mr-2">
              Log in
            </button>
            <button class="btn btn-plain">
              Visit
            </button>
          </td>
          <td>
            <span class="iconfont icon-kebab-vertical"/>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
const apps = [
  {
    username: 'dtube',
    name: 'DTube',
    website: 'http://d.tube',
    about: 'D.Tube is the first crypto-decentralized video platform, built on top of the STEEM Blockchain and the IPFS peer-to-peer network.',
    reputation: 74,
    followers: 2240,
  },
  {
    username: 'utopian-io',
    name: 'Utopian',
    website: 'https://utopian.io',
    about: 'Utopian is the only platform rewarding contributions to Open Source projects by utilizing a decentralised, vote-based reward system built on top of the STEEM Blockchain.',
    reputation: 72,
    followers: 9301,
  },
  {
    username: 'steemhunt',
    name: 'Steemhunt',
    website: 'https://www.steemhunt.com',
    about: 'Steem Fueled ProductHunt - Make money by discovering cool products every day',
    reputation: 66,
    followers: 835,
  },
];

export default {
  data() {
    return {
      search: '',
    };
  },
  computed: {
    apps() {
      return apps.filter(app => JSON.stringify(app)
        .toLowerCase()
        .includes(this.search.toLowerCase()));
    },
  },
};
</script>
