<template>
  <div id="app" class="d-flex flex-row">
    <Sidebar/>
    <div id="content" class="width-full p-4">
      <router-view/>
    </div>
  </div>
</template>

<style scoped lang="less">
@import './vars';

#content {
  margin-left: @sidebar-width;
}
</style>
