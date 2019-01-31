<template>
  <div class="hero height-full">
    <Center>
      <span class="logo iconfont icon-steemconnect"/>
      <h4 class="m-0">steemconnect</h4>
      <div class="mt-4 mb-7">
        <h1 class="mb-6">You're in control of your keys.</h1>
        <div class="columns mb-6 hide-sm">
          <div class="column one-half v-align-middle">
            <a
              :href="pkg.repository.url.replace('.git', '/releases')"
               target="_blank"
               class="d-block rounded-2 px-3 py-2 bg-primary text-white text-left"
            >
              <span class="iconfont icon-chrome float-right"/>
              Download extension
            </a>
          </div>
          <div class="column one-half v-align-middle">
            <a
              :href="pkg.repository.url.replace('.git', '/releases')"
              target="_blank"
              class="d-block rounded-2 px-3 py-2 bg-primary text-white text-left"
            >
              <span class="iconfont icon-desktop-windows float-right"/>
              Download Desktop app
            </a>
          </div>
        </div>
        <p>With SteemConnect, you're always in control of your private keys: we neither store nor have access to them.</p>
      </div>
      <Footer/>
    </Center>
  </div>
</template>

<script>
import pkg from '@/../package.json';

export default {
  data() {
    return {
      pkg,
    };
  },
};
</script>

<style scoped lang="less">
.hero {
  background-image: url('../assets/img/bg.svg');
}

.icon-chrome,
.icon-desktop-windows {
  font-size: 32px;
}
</style>
