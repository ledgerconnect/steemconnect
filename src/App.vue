<template>
  <div
    id="app"
    class="d-flex flex-row"
  >
    <Sidebar/>
    <TopNav/>
    <div
      id="content"
      class="width-full ml-sm-0"
    >
      <router-view/>
    </div>
  </div>
</template>

<style scoped lang="less">
@import './vars';

#content {
  margin-top: @topnav-height;
  margin-left: 0;

  @media (min-width: 768px){
    margin-left: @sidebar-width !important;
  }
}
</style>
