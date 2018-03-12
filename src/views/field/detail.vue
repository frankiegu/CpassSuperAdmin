<template>
  <div class="order-space-detail">
    <lh-title :title="fieldName">
      <el-tag size="mini" class="ml20 fl">{{typeText}}</el-tag>
      <template slot-scope="scope">
        <el-tooltip
          :content="isOpen === 1 ? '点击关闭该会员的前端使用权限' : '点击开启该会员的前端使用权限'"
          placement="top"
          effect="light"
          class="margin-lr6">

          <el-switch
            v-model="isOpen"
            :active-value="1"
            :inactive-value="0"
            class="fr"
            :active-color="switchActiveColor"
            active-text=""
            inactive-text=""
            @change="handleUpdateStatus(fieldId, isOpen)"></el-switch>
        </el-tooltip>
      </template>

    </lh-title>

    <div class="page-title-info">
      <el-row>
        <el-col :span="16">
          <el-row :gutter="20">
            <el-col :span="8">
              <lh-item label="场地联系人：" label-width="auto">{{field.contactName}}</lh-item>
            </el-col>

            <el-col :span="8">
              <lh-item label="联系电话：" label-width="auto">{{field.contactTel}}</lh-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="8">
              <lh-item label="所属空间：" label-width="auto">{{spaceInfo.spaceName}}</lh-item>
            </el-col>

            <el-col :span="8">
              <lh-item label="所属门店：" label-width="auto">{{storeInfo.storeName}}</lh-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col>
              <lh-item label="门店地址：" label-width="auto">{{storeInfo.provinceName}}{{storeInfo.cityName}}{{storeInfo.districtName}}{{storeInfo.address}}</lh-item>
            </el-col>
          </el-row>
        </el-col>

        <div class="page-title-right" v-if="field.type === 3">
          <div class="p-item">
            <div class="theme-gray">工位数量</div>
            <div class="p-con">{{field.stationNum}}</div>
          </div>

          <div class="p-item">
            <p class="theme-gray">收费标准</p>
            <p class="p-con">{{field.hourPrice}}元/天</p>
          </div>
        </div>
      </el-row >
    </div>

    <div class="content-body">
      <div class="senior-title">基本信息</div>

      <div class="card-body">
        <el-row :gutter="20">
          <el-col :span="8">
            <lh-item label="可预约时段：" label-width="auto">{{appointment.startTime}}～{{appointment.endTime}}</lh-item>
          </el-col>

          <el-col :span="8">
            <lh-item label="取消设置：" label-width="auto">提前{{field.cancelSetting}}</lh-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <lh-item label="最大容纳人数：" label-width="auto">{{field.maxAdmissibleNum}}人</lh-item>
          </el-col>

          <el-col :span="8">
            <lh-item label="场地面积：" label-width="auto">{{field.area}}平方米</lh-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col>
            <lh-item label="设备：" label-width="auto">
              <span v-for="(item, index) in equipments" :key="index">{{index === (equipments.length - 1) ? item.name : item.name + '、'}}</span>
            </lh-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col>
            <lh-item label="图片：" label-width="auto">
              <img class="img-list" v-for="item in fieldImgs" :src="item.img">
              <!-- <img :src="scope.row.img + zoomImgSize()"> -->
            </lh-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col>
            <lh-item label="设施与服务：" label-width="84px">
              <div v-html="field.facilitiesAndServices"></div>
            </lh-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col>
            <lh-item label="使用须知：" label-width="70px">
              <div v-html="field.instructionsForUse"></div>
            </lh-item>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
  import { fieldDetail, setFieldStatus } from '@/service/field'
  import detaillMixins from './detail.mixins'

  export default {
    mixins: [detaillMixins],
    components: {},
    data () {
      return {
        fieldId: this.$route.query.id,
        isOpen: '',

        dialogStatus: false,
        type: '',
        fieldName: '',
        typeText: '',
        fieldInfo: {},
        field: {}, // 场地信息
        equipments: [], // 设施
        appointment: {}, // 预约时段
        fieldImgs: [], // 场地图片
        spaceInfo: {},
        storeInfo: {}
      }
    },
    props: {},
    watch: {},
    computed: {},
    mounted() {
      this.getPageData()
    },
    methods: {
      // 更新会员状态
      handleUpdateStatus(id, status) {
        setFieldStatus({ fieldId: id, isOpen: status }).then(res => {
          if (res.status === 'true') {
            console.log('res', res)
          } else {
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            })
          }
        })
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
        fieldDetail({ fieldId: this.fieldId }).then(res => {
          if (res.status === 'true') {
            this.fieldInfo = res.info
            this.fieldName = res.info.fieldDetail.field.fieldName
            this.fieldImgs = res.info.fieldDetail.fieldImgs
            this.field = res.info.fieldDetail.field
            this.appointment = res.info.fieldDetail.appointment
            this.isOpen = res.info.isOpen
            this.equipments = res.info.fieldDetail.equipments
            this.spaceInfo = res.info.space
            this.storeInfo = res.info.store
            console.log('.equipments', this.equipments)
            if (res.info.fieldDetail.field.type === 1) {
              this.typeText = '会议室'
            } else if (res.info.fieldDetail.field.type === 2) {
              this.typeText = '路演厅'
            } else if (res.info.fieldDetail.field.type === 3) {
              this.typeText = '工位'
            }
            if (res.info.fieldDetail.field.cancelBeforeUnit === 'H') {
              this.field.cancelSetting = res.info.fieldDetail.field.cancelBeforeTime + '小时'
            } else {
              this.field.cancelSetting = res.info.fieldDetail.field.cancelBeforeTime + '天'
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
