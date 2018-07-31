<template>
  <div id="app">
    <div
      class="d-flex flex-row flex-items-center height-full"
      v-if="$route.meta.layout === 'light'"
    >
      <router-view/>
    </div>
    <div class="d-flex flex-row" v-else>
      <Sidebar/>
      <div id="content" class="width-full ml-sm-0">
        <router-view/>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
@import './vars';

#content {
  margin-left: 0;

  @media (min-width: 768px){
    margin-left: @sidebar-width !important;
  }
}
</style>
