<template>
  <div class="page-field-detail">
    <lh-title title="活动详情">
    </lh-title>

    <!--标题拓展-->
    <div class="com-title-box">
      <div class="img-box">
        <div class="img-box-in">
          <img :src="bannerPath" v-if="bannerPath">
          <span v-else class="lh-edit-img no-border">
              编辑中
            </span>
        </div>
      </div>

      <div class="info-box">
        <el-row>
          <el-col :span="24">
            <el-row :gutter="20" class="mb6">
              <h1 class="info-title ml10">{{ name }}</h1>
              <el-tag class="info-title-tag ml12 mt2" v-if="status === 0">未发布</el-tag>
              <el-tag class="info-title-tag ml12 mt2" v-if="status === 1">未开始</el-tag>
              <el-tag type="success" class="info-title-tag ml12 mt2" v-if="status === 2">进行中</el-tag>
              <el-tag type="danger" class="info-title-tag ml12 mt2" v-if="status === 3">已结束</el-tag>
              <el-tag type="warning" class="info-title-tag ml12 mt2" v-if="status === 4">暂停</el-tag>
              <div class="info-title-id ml12">ID:{{ code }}</div>

              <el-tooltip
                v-if="status === 0 || status === 1 || status === 2 || status === 4"
                :content="isOpen === 0 ? '点击开启活动' : '点击暂停活动'"
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
              <router-link :to="{path: '/activity/add', query: {id: activityId, type: 'edit'}}" v-if="canEdit">
                <el-button type="primary" class="fr mr10">编辑</el-button>
              </router-link>
              <el-button type="primary" plain class="fr mr10" @click="delectActivity" v-if="canEdit">删除</el-button>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <lh-item label="活动有效期：" label-width="87px">{{ startDate }} 至 {{ endDate }}</lh-item>
              </el-col>
              <el-col :span="8">
                <lh-item label="活动类型：" label-width="auto">
                  <span v-if="type === 1">普通活动</span>
                  <span v-if="type === 2">互动游戏</span>
                </lh-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <lh-item label="展示时间：" label-width="87px">
                  <span v-if="showDate && hiddenDate">{{ showDate }} 至 {{ hiddenDate }}</span>
                  <span v-else>未设置</span>
                </lh-item>
              </el-col>
              <el-col :span="8">
                <lh-item label="创建日期：" label-width="auto">{{ created }}</lh-item>
              </el-col>
            </el-row>

            <el-row :gutter="20" class="big-detail">
              <div class="label-box">
                <span class="label-title">查看人数：</span>
                <span class="label-info">{{ lookPlayer }}</span>
              </div>
              <div class="label-box">
                <span class="label-title">参与次数：</span>
                <span class="label-info">{{ lotteryCount }}</span>
              </div>
              <div class="label-box">
                <span class="label-title">分享人数：</span>
                <span class="label-info">{{sharePlayerCount}}</span>
              </div>
              <div class="label-box">
                <span class="label-title">分享次数：</span>
                <span class="label-info">{{shareTotalCount}}</span>
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
        <el-tab-pane label="活动详情" name="couponInformation" class="coupon-detail-info">
          <div class="mt10 bgcfff">
            <div class="card-body-title">活动规则</div>
            <div class="card-body-info">
              <lh-item label=""  label-width="0px" v-html="regulation"></lh-item>
            </div>

            <div class="card-body-title">活动内容</div>
            <div class="card-body-info">
              <div class="site-info">最大参与人数：<span class="site-info-desc">{{ lotteryPlayer }}人</span></div>
              <div class="site-info">每人最大允许中奖数：<span class="site-info-desc">{{ winningMaxTime }}次</span></div>
              <div class="site-info">初始抽奖次数：<span class="site-info-desc">{{ lotteryInitTime }}次</span></div>
              <div class="site-info">分享成功后额外抽奖次数：<span class="site-info-desc">{{ lotteryExtraTime }}次</span></div>
            </div>
            <div class="card-body-table">
              <el-table :data="platformActivityGiftList" empty-text="暂无数据" border
                        style="width: 100%">

                <el-table-column label="奖品" align="left">
                  <template slot-scope="scope">
                    <span>{{ scope.row.couponName || (scope.row.redpacketName + '（' + scope.row.amount + '元）') }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="奖品类型" prop="typeName" align="left"></el-table-column>
                <el-table-column label="数量" prop="giftQuantity" align="left"></el-table-column>
                <el-table-column label="中奖概率（%）" prop="lotteryRate" align="left">
                  <template slot-scope="scope">
                    <span>{{ (scope.row.lotteryRate * 100) + '%' }}</span>
                  </template>
                </el-table-column>

              </el-table>
            </div>

            <div class="card-body-title">展示设置</div>
            <div class="card-body-info">
              <lh-item label="展示端："  label-width="87px">
                <span v-for="(item, index) in platformActivityShowConfigList" :key="index">
                  <span v-if="index >= 1 && index < platformActivityShowConfigList.length">、</span>
                  <span v-if="item.type === 1">小程序</span>
                  <span v-if="item.type === 2">ios端</span>
                  <span v-if="item.type === 3">安卓端</span>
                </span>
              </lh-item>
              <lh-item label="未开始提示："  label-width="87px">{{ notBeginPrompt || '未设置' }}</lh-item>
              <lh-item label="结束提示："  label-width="87px">{{ endPrompt || '未设置' }}</lh-item>
            </div>

          </div>
        </el-tab-pane>
        <!--领券详情标签页-->
        <el-tab-pane label="活动统计" name="receiveRecord" class="receive-list">
          <div class="mt10 bgcfff">
            <div class="card-body-title">整体统计</div>

            <div>
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
                    placeholder="选择添加时间"
                    :picker-options="pickerOptions"></el-date-picker>
                </el-form-item>

                <el-form-item class="fr">
                  <el-button @click="exportExcel" class="lh-btn-export">
                    <lh-svg icon-class="icon-download" />导出
                  </el-button>
                </el-form-item>

              </el-form>

              <el-table :data="tableData" :empty-text="tableEmpty" :slot="tableEmpty" v-loading="tableLoading" border @sort-change="change"
                        style="width: 100%">

                <el-table-column label="日期" prop="date" align="left" sortable="custom"></el-table-column>
                <el-table-column label="查看人数" prop="lookPlayer" align="left"></el-table-column>
                <el-table-column label="参与次数" prop="lotteryCount" align="left"></el-table-column>
                <el-table-column label="分享人数" prop="sharePlayer" align="left"></el-table-column>
                <el-table-column label="分享次数" prop="shareCount" align="left"></el-table-column>

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
            </div>
          </div>
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
      /*height: 140px;*/
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
    background: #fff;
    padding: 24px;
    margin: 24px;
    border-radius: 6px;
    box-shadow: 0 1px 6px 0 rgba(0, 21, 41, 0.12);
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
  .detail-title{
    margin: 0px 32px;
    padding: 16px 0px;
  }
  .card-body-title{
    font-size: 16px;
  }
  .card-body-info{
    padding: 24px 24px;

    .site-info{
      display: inline-block;
      color: #333;
      margin-right: 50px;

      .site-info-desc{
        font-size: 20px;
        color: #000;
      }
    }
    .site-info:last-child{
      margin-right: 0px;
    }
  }
  .card-body-table{
    padding: 0px 24px 36px 24px;
  }
}
</style>
<style lang="scss">
  .detail-item{
    ol{
      li{
        list-style: decimal !important;
      }
    }
  }
</style>
