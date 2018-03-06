<template>
  <div class="order-space-detail">
    <lh-title :title="'雷猴软件3708工位'">
      <el-tag size="mini" class="ml20 fl">工位</el-tag>

      <el-tooltip
        :content="test === 1 ? '点击关闭该会员的前端使用权限' : '点击开启该会员的前端使用权限'"
        placement="top"
        effect="light"
        class="margin-lr6">

        <el-switch
          v-model="test"
          :active-value="1"
          :inactive-value="0"
          class="fr"
          :active-color="switchActiveColor"
          active-text=""
          inactive-text=""
          @change="handleUpdateStatus(scope.row.id, scope.row.status)"></el-switch>
      </el-tooltip>
    </lh-title>

    <div class="page-title-info">
      <el-row>
        <el-col :span="16">
          <el-row :gutter="20">
            <el-col :span="8">
              <lh-item label="场地联系人：" label-width="auto">杨中信</lh-item>
            </el-col>

            <el-col :span="8">
              <lh-item label="联系电话：" label-width="auto">1598026006</lh-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="8">
              <lh-item label="所属空间：" label-width="auto">广州雷猴</lh-item>
            </el-col>

            <el-col :span="8">
              <lh-item label="所属门店：" label-width="auto">中信广场</lh-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col>
              <lh-item label="门店地址：" label-width="auto">广东省广州市天河区中信广场3708</lh-item>
            </el-col>
          </el-row>
        </el-col>

        <div class="page-title-right">
          <div class="p-item">
            <div class="theme-gray">工位数量</div>
            <div class="p-con">12</div>
          </div>

          <div class="p-item">
            <p class="theme-gray">收费标准</p>
            <p class="p-con">100元/天</p>
          </div>
        </div>
      </el-row >
    </div>

    <div class="content-body">
      <div class="senior-title">基本信息</div>

      <div class="card-body">
        <el-row :gutter="20">
          <el-col :span="8">
            <lh-item label="可预约时段：" label-width="auto">00:00-23:30</lh-item>
          </el-col>

          <el-col :span="8">
            <lh-item label="取消设置：" label-width="auto">提前3小时</lh-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <lh-item label="最大容纳人数：" label-width="auto">2人</lh-item>
          </el-col>

          <el-col :span="8">
            <lh-item label="场地面积：" label-width="auto">20平方米</lh-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col>
            <lh-item label="设备：" label-width="auto">无限网络、音响</lh-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col>
            <lh-item label="图片：" label-width="auto">
              <img class="img-list" src="/static/images/login-logo.png">
              <img class="img-list" src="/static/images/login-logo.png">
              <img class="img-list" src="/static/images/login-logo.png">
              <img class="img-list" src="/static/images/login-logo.png">
              <!-- <img :src="scope.row.img + zoomImgSize()"> -->
            </lh-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col>
            <lh-item label="设施与服务：" label-width="84px">撒发生地方的所发生的深V撒发生地方的所发生的深V撒发生地方的所发生的深V撒发生地方的所发生的深V撒发生地方的所发生的深V撒发生地方的所发生的深V撒发生地方的所发生的深V撒发生地方的所发生的深V撒发生地方的所发生的深V撒发生地方的所发生的深V撒发生地方的所发生的深V撒发生地方的所发生的深V撒发生地方的所发生的深V撒发生地方的所发生的深V撒发生地方的所发生的深V撒发生地方的所发生的深V撒发生地方的所发生的深V撒发生地方的所发生的深V撒发生地方的所发生的深V撒发生地方的所发生的深V撒发生地方的所发生的深V撒发生地方的所发生的深V撒发生地方的所发生的深V撒发生地方的所发生的深V撒发生地方的所发生的深V撒发生地方的所发生的深V撒发生地方的所发生的深V撒发生地方的所发生的深V</lh-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col>
            <lh-item label="使用感知：" label-width="70px">撒发生地方的所发生的深V撒发生地方的所发生的深V撒发生地方的所发生的深V撒发生地方的所发生的深V撒发生地方的所发生的深V撒发生地方的所发生的深V撒发生地方的所发生的深V</lh-item>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
  import { accountInfo } from '@/service/client'
  import detaillMixins from './detail.mixins'

  export default {
    mixins: [detaillMixins],
    components: {},
    data () {
      return {
        clientId: this.$route.query.id,
        test: '1',

        dialogStatus: false,
        type: '',
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
      // 更新会员状态
      handleUpdateStatus(id, status) {
        // const statusParams = {
        //   userId: id,
        //   status: status
        // }
        // userUpdateStatus(statusParams).then(res => {
        //   if (res.status === 'true') {
        //     this.$message.success('修改成功！')
        //   } else {
        //     this.$message.error(res.msg)
        //   }
        // })
      },
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
