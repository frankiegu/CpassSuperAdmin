<template>
  <el-row :gutter="24" class="usage-rate">
    <el-col
      v-for="(item, index) in storeRateData"
      :key="index"
      :span="handleHasPermissions(['/manage/field/addOrUpdateFieldPartThree', '/manage/field/draftBox']) ? 6 : 8">

      <div class="grid-content statistics-item">
        <div class="font-size-16px">场地使用率</div>
        <span v-if="item.up < 0" class="item-num theme-red">
          {{ item.usedRate }}%
          <img src="/static/images/space/decline.png" style="margin-top: 18px;">
        </span>

        <span v-else class="item-num pointer-theme-blue">
          {{ item.usedRate }}%
          <img v-show="0 !== item.usedRate" src="/static/images/space/rise.png">
        </span>
        <div class="datatime theme-gray">{{ item.date }}</div>
      </div>
    </el-col>

    <el-col
      v-if="handleHasPermissions(['/manage/field/addOrUpdateFieldPartThree', '/manage/field/draftBox'])"
      :span="6">

      <div class="grid-content statistics-item operate-grid">
        <router-link
          v-permissions="'/manage/field/addOrUpdateFieldPartThree'"
          :to="'/space/add?type=saveDraftTip'"
          class="ml5 mr5 mb10 db">
          <el-button
            type="primary"
            class="width140px"
            icon="el-icon-circle-plus">发布场地</el-button></router-link>

        <router-link
          v-permissions="'/manage/field/draftBox'"
          to="/space/drafts"
          class="ml5 mr5 db">
          <el-button type="primary" class="width140px">场地草稿箱</el-button></router-link>
      </div>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    props: ['storeRateData'],
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
      height: 166px;
      padding: 30px 32px;
      text-align: center;
      border-radius: 4px;
      background-color: #ffffff;
      box-sizing: border-box;

      &.operate-grid {
        padding-top: 42px;
      }

      .item-num {
        display: block;
        font-size: 50px;
        line-height: 36px;
        vertical-align: middle;
        margin: 15px 0;

        span {
          display: inline-block;
        }
        img {
          margin-left: -15px;
        }
      }
    }
  }
</style>
