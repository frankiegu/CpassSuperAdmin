<template>
  <div class="page-field-detail">
    <lh-title title="活动详情">
    </lh-title>

    <!--标题拓展-->
    <div class="com-title-box">
      <div class="img-box">
        <div class="img-box-in">
          <img :src="mainImg" v-if="field.dataFinishPercent === 100">
          <span v-else class="lh-edit-img no-border">
              编辑中
            </span>
        </div>
      </div>

      <div class="info-box">
        <el-row>
          <el-col :span="24">
            <el-row :gutter="20" class="mb6">
              <h1 class="info-title ml10">这里是活动名称</h1>
              <el-tag type="success" class="info-title-tag ml12 mt2">互动游戏</el-tag>
              <div class="info-title-id ml12">ID:102348984</div>

              <el-tooltip
                :content="isOpen === 1 ? '点击开启活动' : '点击关闭活动'"
                placement="top"
                class="margin-lr6 mt6">
                <el-switch
                  v-model="isOpen"
                  @change="handleUpdateStatus"
                  :active-value="1"
                  :inactive-value="0"
                  class="fr"
                  active-text=""
                  inactive-text=""
                  :active-color="switchActiveColor"></el-switch>
              </el-tooltip>
              <el-button type="primary" class="fr mr10">编辑</el-button>
              <el-button type="primary" class="fr mr10">删除</el-button>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <lh-item label="活动有效期：" label-width="87px">2018-5-18 12:00至2018-5-19 24:00</lh-item>
              </el-col>
              <el-col :span="8">
                <lh-item label="活动类型：" label-width="auto">线上活动</lh-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <lh-item label="展示时间：" label-width="87px">2018-5-18 12:00至2018-5-19 24:00</lh-item>
              </el-col>
              <el-col :span="8">
                <lh-item label="创建日期：" label-width="auto">2018-5-7 17:09</lh-item>
              </el-col>
            </el-row>

            <el-row :gutter="20" class="big-detail">
              <div class="label-box">
                <span class="label-title">查看人数：</span>
                <span class="label-info">11,100</span>
              </div>
              <div class="label-box">
                <span class="label-title">参与次数：</span>
                <span class="label-info">100</span>
              </div>
              <div class="label-box">
                <span class="label-title">分享人数：</span>
                <span class="label-info">10</span>
              </div>
              <div class="label-box">
                <span class="label-title">分享次数：</span>
                <span class="label-info">20</span>
              </div>
            </el-row>
          </el-col>
        </el-row>
      </div>

    </div>

    <div class="page-info">
      <!-- tab标签 -->
      <el-tabs v-model="activeTab">
        <!-- 领取方式标签页 -->
        <el-tab-pane label="卡券信息" name="couponInformation" class="coupon-detail-info">
        </el-tab-pane>
        <!--领券详情标签页-->
        <el-tab-pane label="领券详情" name="receiveRecord" class="receive-list">
          <el-form :model="formData" :inline="true" class="text-right mr-10">
            <!-- 选择的是到期时间，所以是往后选 -->
            <el-form-item>
              <el-date-picker
                v-model="formData.reg_date"
                @change="getPageData(1)"
                type="daterange"
                align="right"
                clearable
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                placeholder="选择提交日期"
                :picker-options="pickerOptions"></el-date-picker>
            </el-form-item>

            <el-form-item class="fr">
              <el-button @click="exportExcel" class="lh-btn-export">
                <lh-svg icon-class="icon-download" />导出
              </el-button>
            </el-form-item>

          </el-form>

          <el-table :data="tableData" :empty-text="tableEmpty" :slot="tableEmpty" v-loading="tableLoading" border
                    style="width: 100%">

            <el-table-column label="活动ID" prop="name" align="left"></el-table-column>
            <el-table-column label="活动名称" prop="name" align="left">
              <template slot-scope="scope">
                <router-link
                  :to="{path: '/activity/detail', query: {id: 3210}}"
                  class="table-link">
                  {{ scope.row.name }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column label="活动类型" prop="price"></el-table-column>
            <el-table-column label="活动开始时间" prop="providerName" align="left" sortable sort-by="created"></el-table-column>
            <el-table-column label="活动结束时间" prop="providerName" align="left" sortable sort-by="created"></el-table-column>
            <el-table-column label="活动状态">
              <template slot-scope="scope">
                <span v-if="scope.row.type === 1">未发布</span>
                <span v-if="scope.row.type === 2">未开始</span>
                <span v-if="scope.row.type === 3">进行中</span>
                <span v-if="scope.row.type === 4">已结束</span>
                <span v-if="scope.row.type === 5">暂停</span>
              </template>
            </el-table-column>

            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" v-if="scope.row.statusCode === 1"
                           class="operate-btn">编辑</el-button>

                <el-button type="text" v-if="scope.row.statusCode === 1"
                           class="operate-btn">复制</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            :total="pageTotal"
            :layout="layoutArr"
            :page-size="pageSize"
            :page-sizes="pageSizeArr"
            :current-page="currentPage"
            class="pagination-container"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            background></el-pagination>
        </el-tab-pane>
      </el-tabs>
    </div>

  </div>
</template>

<script>
import detaillMixins from './detail.mixins'

export default {
  components: {},
  mixins: [detaillMixins],
  mounted() {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/config";
.page-field-detail {
  .com-title-box {
    width: 100%;
    padding: 0px 24px 16px;
    box-sizing: border-box;
    overflow: hidden;
    background: #fff;

    .img-box {
      position: relative;
      width: 230px;
      height: 126px;
      float: left;
      border-radius: 2px;
      background-color: #F7F9FA;
      overflow: hidden;

      .img-box-in {
        position: absolute;
        left: 50%;
        width: 300%;
        height: 100%;
        margin-left: -150%;
        text-align: center;
      }
      img {
        display: inline-block;
        vertical-align: top;
        height: 126px;
        border-radius: 2px;
      }
    }

    .info-box{
      display: inline-block;
      width: calc(100% - 260px);
      height: 140px;
      margin-left: 20px;

      .info-title{
        max-width: 200px;
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .info-title-tag{
        vertical-align: top;
      }
      .info-title-id{
        display: inline-block;
        vertical-align: top;
        line-height: 29px;
      }
    }
  }

  .page-info{
    height: 41px;
    padding: 0px 30px;
    background: #fff;
  }
  .big-detail{
    .label-box{
      width: 25%;
      height: 38px;
      display: block;
      float: left;

      .label-title{
        width: 77px;
        display: inline-block;
        color: #333;
        line-height: 22px;
        padding-left: 10px;
        vertical-align: top;
      }
      .label-info{
        display: inline-block;
        width: calc(100% - 95px);
        vertical-align: top;
        line-height: 22px;
        font-size: 22px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #000;
      }
    }
  }
}
</style>
