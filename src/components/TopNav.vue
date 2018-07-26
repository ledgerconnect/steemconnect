<template>
  <div id="topnav" class="border-bottom py-2 px-4 text-right box-shadow">
    <Avatar username="hellosteem"/>
  </div>
</template>

<style scoped lang="less">
@import '../vars';

#topnav {
  font-size: 18px;
  position: fixed;
  top: 0;
  left: @sidebar-width;
  right: 0;
  height: @topnav-height;
  background-color: @bg-color;
  ul {
    list-style: none;
    li {
      display: inline-block;
    }
  }
}
</style>
