<template>
  <div v-else class="table-empty-text tc">
    <img src="/static/images/empty.png">
    <p>{{ tableEmpty }}</p>
  </div>
</template>

<script>
export default {
  name: 'LhTableEmpty',
  props: ['tableEmpty']
}
</script>

<style lang="scss" scoped>
@import "src/styles/variables";
/* 自定义table空态 */
.table-empty-text {
  width: 100%;
  height: 434px;
  color: #909399;
  text-align: center;
  box-sizing: border-box;
  overflow: hidden;

  img {
    margin: 102px 0 16px;
  }
  p {
    height: 20px;
    line-height: 20px;
  }
}
</style>
