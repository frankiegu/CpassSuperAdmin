<template>
  <div class="page-error">
    <!-- @#TODO明天替换图片 -->
    <img v-if="errorTitle === '403'" src="/static/images/403.png">
    <img v-else src="/static/images/404.png">

    <div class="width240px">
      <h1>
        <span>{{ errorTitle }}</span>
      </h1>
      <p class="theme-light-gray">{{ errorDec }}</p>
      <router-link to="/" class="to-bottom-right">返回首页</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LhError',
  props: ['errorTitle', 'errorDec']
}
</script>

<style lang="scss" scoped>
@import "src/styles/common/var";
.page-error {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15%;

  .width240px {
    width: 240px;
  }
  img {
    float: right;
    width: 443px;
    padding-right: 12.8%;
  }
  h1 {
    height: 73px;

    span {
      display: inline-block;
      font-size: 100px;
      font-weight: 600;
      height: 73px;
      line-height: 73px;
      color: #494C5C;
      margin-top: -2px;
    }
  }
  p {
    font-size: 20px;
    height: 28px;
    line-height: 28px;
    padding: 22px 0;
    overflow: hidden;
  }
}
</style>
