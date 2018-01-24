<!-- 使用场景：状态 -->
<template>
  <div class="lh-option">
    <el-option
      v-for="item in statusList"
      :key="item.value"
      :value="item.value"
      :label="item.label">

      <el-tag :type="item.type" class="select-tag">{{ item.label }}</el-tag>
    </el-option>
  </div>
</template>

<script>
  export default {
    name: 'LhOption',
    data () {
      return {}
    },
    props: ['statusList'],
    mounted () {
      // console.log('statusList', this.statusList);
    },
    methods: {}
  }
</script>

<style lang="scss" scoped>
  .lh-option {
  }
  .select-tag {
    height: 20px;
    line-height: 18px!important;
  }
</style>
