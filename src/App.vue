<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!-- app 要去掉 scoped，否则引入的共同样式带不到子组件去 -->
<style lang="scss">
@import "./styles/base";
@import "./styles/reset";
@import "./styles/public";
@import "./styles/common"; // common的权重最好高于 public
@import "./styles/lib/nprogress";

#app {
  height: 100%;
  overflow: auto;
}
.icon {
   width: 22px;
   height: 22px;
   vertical-align: middle;
   fill: currentColor;
   overflow: hidden;
}
</style>
