<template>
  <div class="content-body">
    <h3 class="senior-title">{{ cardTitle }}</h3>
    <div class="card-body">
      <slot v-if="!isEmpty" />

      <div v-if="isEmpty" class="components-card-empty-text tc">
        <lh-svg icon-class="icon-frowno" class="fill-grayish mr10" />暂无数据
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LhCard',
  props: ['cardTitle', 'isEmpty']
}
</script>

<style lang="scss" scoped>
@import "src/styles/common/var";
.components-card-empty-text {
  width: 100%;
  height: 64px;
  font-size: 16px;
  color: $theme-grayish;
  display: flex;
  justify-content: center;
  align-items: center;

  .fill-grayish {
    width: 24px;
    height: 24px;
  }
}
</style>
