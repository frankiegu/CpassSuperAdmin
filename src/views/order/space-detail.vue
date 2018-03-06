<template>
  <div class="order-space-detail">
    <lh-title :title="'单号：011802271609286'"></lh-title>

    <div class="page-title-info">
      <el-row>
        <el-col :span="16">
          <el-row :gutter="20">
            <el-col :span="8">
              <lh-item label="生成时间：" label-width="auto">2018-02-01 09:04:09</lh-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="8">
              <lh-item label="预定人：" label-width="auto">邓先生</lh-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="8">
              <lh-item label="联系方式：" label-width="auto">13760886805</lh-item>
            </el-col>

            <el-col :span="8">
              <lh-item label="预约号：" label-width="auto">699311</lh-item>
            </el-col>
          </el-row>
        </el-col>

        <div class="page-title-right">
          <div class="p-item">
            <div class="theme-gray">状态</div>
            <div class="p-con">已完成</div>
          </div>

          <div class="p-item">
            <p class="theme-gray">订单金额</p>
            <p class="p-con">￥500.00</p>
          </div>
        </div>
      </el-row >
    </div>

    <div class="content-body">
      <div class="card-body">
        <div class="basics-title">场地信息</div>
        <el-row :gutter="20">
          <el-col :span="8">
            <lh-item label="空间名称：" label-width="auto">壹空间</lh-item>
          </el-col>
          <el-col :span="8">
            <lh-item label="场地名称：" label-width="auto">壹空间会议室003室</lh-item>
          </el-col>
          <el-col :span="8">
            <lh-item label="场地联系人：" label-width="auto">金先生</lh-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <lh-item label="门店名称：" label-width="auto">珠控店</lh-item>
          </el-col>
          <el-col :span="8">
            <lh-item label="场地类型：" label-width="auto">会议室</lh-item>
          </el-col>
          <el-col :span="8">
            <lh-item label="联系方式：" label-width="auto">13450583920</lh-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <lh-item label="场地地址：" label-width="70px">广州市天河区天河北路233号中信广场36楼</lh-item>
          </el-col>
        </el-row>

        <div class="basics-title mt8">支付信息</div>
        <el-table :data="tableData" class="width100">
          <el-table-column label="支付金额" prop="date1"></el-table-column>
          <el-table-column label="支付时间" prop="date2"></el-table-column>
          <el-table-column label="交易号" prop="date3"></el-table-column>
          <el-table-column label="支付方式" prop="date4"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.date5 === 1">待支付</span>
              <span v-else-if="scope.row.date5 === 20">已支付</span>
              <span v-else-if="scope.row.date5 === 10">已退款</span>
              <span v-else>待退款</span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="senior-title mt24">订单日志</div>
      <div class="card-body">
        <el-table :data="tableData2" class="width100">
          <el-table-column label="操作人" prop="date1"></el-table-column>
          <el-table-column label="操作时间" prop="date2"></el-table-column>
          <el-table-column label="内容备注" prop="date3"></el-table-column>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
  import { accountInfo } from '@/service/client'
  import spaceDetailMixins from './space-detail.mixins'

  export default {
    mixins: [spaceDetailMixins],
    components: {},
    data () {
      return {
        clientId: this.$route.query.id,
        dialogStatus: false,
        type: '',
        pagaData: {
          username: '',
          spaceId: '',
          name: '',
          manageUrl: '',
          wxUrl: ''
        }
      }
    },
    props: {},
    watch: {},
    computed: {},
    mounted() {
      // this.getPageData()
    },
    methods: {
      getPageData() {
        accountInfo({ clientId: this.clientId }).then(res => {
          if (res.status === 'true') {
            let data = res.info
            this.pagaData = {
              username: data.username,
              spaceId: data.spaceId,
              name: data.name,
              manageUrl: data.manageUrl,
              wxUrl: data.wxUrl
            }
          } else {
            this.setMsg('error', res.msg)
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "src/styles/config";
  .order-space-detail {
  }
</style>
