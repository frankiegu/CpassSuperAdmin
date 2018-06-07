<template>
  <div class="component-tab">
    <router-link
      :to="item.name"
      v-for="(item, idx) in tabList" :key="idx"
      :class="['tab-link', {'active-tab': $route.fullPath.match(item.name) != null}]">
      {{ item.text }}
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'LhTab',
  props: ['tabList']
}
</script>

<style lang="scss">
.component-tab {
  height: 45px;
  text-align: center;

  .tab-link {
    display: inline-block;
    line-height: 1;
    color: #5A72F6;
    width: 100px;
    height: 35px;
    line-height: 35px;
    margin-top: 4px;
    border-top: 1px solid #5A72F6;
    border-left: 1px solid #5A72F6;
    border-bottom: 1px solid #5A72F6;
    cursor: pointer;

    &:hover {
    }
  }
  .tab-link:last-child{
    border-right: 1px solid #5A72F6;
  }
  .active-tab {
    color: #fff;
    background: #5A72F6;
  }
}
</style>
