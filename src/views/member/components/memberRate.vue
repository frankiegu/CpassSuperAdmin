<template>
  <el-row :gutter="50" class="usage-rate">
    <el-col
      v-for="(item, index) in memberRateData"
      :key="index"
      :span="6">

      <div class="statistics-item font-size-16px nowrap">
        <div v-if="index === 0">会员总数</div>
        <div v-else-if="index === 1">本日变化</div>
        <div v-else-if="index === 2">本周变化</div>
        <div v-else-if="index === 3">本月变化</div>
        <span class="item-num theme-blue">
          {{ item }}
        </span>
      </div>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    props: {
      memberRateData: {
        type: Array
      }
    },
    data () {
      return {
      }
    }
  }
</script>

<style lang="scss" scoped>
  .usage-rate {
    margin-bottom: 20px;

    .statistics-item {
      width: 100%;
      height: 110px;
      box-shadow: 0 1px 4px 0 rgba(0, 21, 41, 0.12);
      padding: 20px 32px;
      text-align: center;
      border-radius: 4px;
      background-color: #ffffff;
      box-sizing: border-box;
      cursor: pointer;
      /*&>div {*/
        /*width: 100%;*/
        /*height: 50px;*/
        /*line-height: 50px;*/
        /*background: #9eb1ff;*/
        /*color: #fff;*/
      /*}*/

      .item-num {
        display: block;
        font-size: 20px;
        line-height: 36px;
        vertical-align: middle;
        margin: 15px 0;

        span {
          display: inline-block;
        }
      }
    }
  }
</style>
