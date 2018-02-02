<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!-- app 要去掉 scoped，否则引入的共同样式带不到子组件去 -->
<style lang="scss">
 @import "./styles/config";
 @import "./styles/reset";
 @import "./styles/reset-ele";
 @import "./styles/common";
 @import "./styles/public";
</style>
