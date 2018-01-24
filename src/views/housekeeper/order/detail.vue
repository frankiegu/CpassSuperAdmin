<template>
  <div class="housekeeper-order-detail">
    <div class="page-title"> <h1>工单详情</h1> </div>

    <div class="card-padding-vertical card-padding">

      <h3 class="grid-title">工单详情</h3>
      <!-- 1 -->
      <el-row>
        <el-col :span="8">
          <div class="detail-info">
            <div class="label">工单号</div>
            <div class="label-con"> {{ pageData.orderNumber }} </div>
          </div>
        </el-col>

        <el-col :span="8">
          <div class="detail-info">
            <div class="label">提交时间</div>
            <div class="label-con"> {{ pageData.createTime }} </div>
          </div>
        </el-col>
      </el-row>

      <!-- 2 -->
      <el-row>
        <el-col :span="8">
          <div class="detail-info">
            <div class="label">需求标题</div>
            <div class="label-con">
              <p class="line-height22 pt7"> {{ pageData.orderName }} </p>
            </div>
          </div>
        </el-col>
      </el-row>

      <!-- 3 -->
      <el-row>
        <el-col :span="16">
          <div class="detail-info">
            <div class="label">需求描述</div>
            <div class="label-con">
              <p class="line-height22 pt7"> {{ pageData.orderDescription }} </p></div>
          </div>
        </el-col>
      </el-row>

      <div class="detail-info">
        <div class="label">需求服务时间</div>
        <div class="label-con"> {{ pageData.requireTime }} </div>
      </div>

      <h3 class="grid-title">联系信息</h3>
      <!-- 1 -->
      <el-row>
        <el-col :span="8">
          <div class="detail-info">
            <div class="label">联系人</div>
            <div class="label-con"> {{ pageData.contact }} </div>
          </div>
        </el-col>

        <el-col :span="8">
          <div class="detail-info">
            <div class="label">所属公司</div>
            <div class="label-con"> {{ pageData.companyName }} </div>
          </div>
        </el-col>
      </el-row>
      <!-- 2 -->
      <el-row>
        <el-col :span="8">
          <div class="detail-info">
            <div class="label">联系方式</div>
            <div class="label-con"> {{ pageData.phone }} </div>
          </div>
        </el-col>
      </el-row>

      <h3 class="grid-title">接单状态</h3>
      <el-row>
        <el-col :span="8">
          <div class="detail-info">
            <div class="label">工单状态</div>
            <div class="label-con">
              <el-tag
                v-if="pageData.orderStatusName"
                :type="pageData.orderStatusName | statusFilter(filtersStatusList)">
                {{pageData.orderStatusName}}</el-tag>
            </div>
          </div>
        </el-col>

        <el-col v-if="pageData.keeperName" :span="8">
          <div class="detail-info">
            <div class="label">接单管家</div>
            <div class="label-con"> {{ pageData.keeperName }} </div>
          </div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24" class="text-center mt40">
          <div v-permissions="'/manage/spaceKeeperOrder/accept'" class="detail-info">
            <el-button
              v-if="pageData.canAcceptOrder"
              @click="showDialog(id)"
              class="width120px"
              type="primary" >接单</el-button>
          </div>
        </el-col>
      </el-row>
    </div>

    <keeper-dialog
      :orderId="orderId"
      :dialogVisible="dialogVisible"
      @getPageData="getPageData"
      @updateDialogStatus="val => dialogVisible = val"></keeper-dialog>
  </div>
</template>

<script>
  import { pageData as comData } from './list.data'
  import keeperDialog from './components/dialog'
  import { formatTimeString } from '@/config/utils'
  import { keeperOrderDetail } from '@/service/housekeeper'
  export default {
    components: { keeperDialog },
    data () {
      return {
        id: this.$route.query.id,
        pageData: {},
        filtersStatusList: comData.statusList,

        // dialog
        dialogVisible: false,
        orderId: ''
      }
    },
    mounted: function () {
      this.getPageData()
    },
    methods: {
      showDialog(id) {
        this.dialogVisible = true
        this.orderId = id
      },
      getPageData () {
        keeperOrderDetail({ orderId: this.id }).then(res => {
          if (res.status === 'true') {
            this.pageData = res.info

            this.pageData.requireTime = formatTimeString(this.pageData.requireTime, 'yyyy-MM-dd HH:mm')
            this.pageData.createTime = formatTimeString(this.pageData.createTime, 'yyyy-MM-dd HH:mm')
          } else {
            this.setMsg('error', res.msg)
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .housekeeper-order-detail {
  }
</style>
