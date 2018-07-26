<template>
  <div id="app" class="d-flex flex-row">
    <Sidebar/>
    <TopNav/>
    <div id="content" class="width-full p-4">
      <router-view/>
    </div>
  </div>
</template>

<style scoped lang="less">
@import './vars';

#content {
  margin-left: @sidebar-width;
  margin-top: @topnav-height;
}
</style>
