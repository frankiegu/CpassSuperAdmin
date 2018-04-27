<template>
  <div class="page-field-detail">
    <lh-title :title="titleName">
      <span class="mr12">
        <el-tag v-if="field.status === 10" type="success" size="mini">开放中</el-tag>
        <el-tag v-else="field.status === 20" type="danger" size="mini">未开放</el-tag>
      </span>

      <el-tooltip
        :content="field.status === 10 ? '点击停用会员' : '点击开放会员'"
        placement="top"
        effect="light"
        class="margin-lr6">
        <el-switch
          v-model="field.status"
          @change="handleUpdateStatus"
          :active-value="10"
          :inactive-value="20"
          class="fr"
          active-text=""
          inactive-text=""
          :active-color="switchActiveColor"></el-switch>
      </el-tooltip>
    </lh-title>

    <!-- title 扩展 -->
    <div class="page-title-info">
      <el-row>
        <el-col :span="16">
          <el-row :gutter="20">
            <el-col :span="8">
              <lh-item label="场地联系人：" label-width="86px">{{ field.contactName }}</lh-item>
            </el-col>
            <el-col :span="8">
              <lh-item label="联系电话：" label-width="auto">{{ field.contactTel }}</lh-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="8">
              <lh-item label="所属空间：" label-width="86px">{{ space.spaceName }}</lh-item>
            </el-col>
            <el-col :span="8">
              <lh-item label="所属门店：" label-width="auto">{{ store.storeName }}</lh-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col>
              <lh-item label="门店地址：" label-width="86px">{{store.provinceName}}{{store.cityName}}{{store.districtName}}{{store.address}}</lh-item>
            </el-col>
          </el-row>
        </el-col>

        <div class="page-title-right">
          <div class="p-item">
            <div class="theme-gray">{{ fieldType === '3' || fieldType === '5' ? '工位数' : '最大容纳' }}</div>
            <div class="p-con">{{ stationNum || 0 }}人</div>
          </div>
          <div class="p-item right-item">
            <p class="theme-gray">场地面积</p>
            <p class="p-con">{{ field.area }}㎡</p>
          </div>
        </div>
      </el-row>
    </div>

    <!-- 预约设置 -->
    <lh-card-empty
      :cardTitle="fieldType === '1' || fieldType === '4' ? '预约设置' : '开放时段'">
      <h3 v-if="fieldType === '1' || fieldType === '4'" class="text-title fz16 mb6 mt0 no-required">基本价格</h3>

      <!-- 非办公室 -->
      <el-table border v-if="fieldType !== '5'" :data="openData" class="width100">
        <el-table-column label="时段">
          <template slot-scope="scope">
            <span v-if="appointmentTimeType === 2">
              <span v-if="scope.row.type === 1">工作日</span>
              <span v-else-if="scope.row.type === 2">非工作日</span>
            </span>
            <span v-else>整周</span>
          </template>
        </el-table-column>

        <el-table-column label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status">
              <span v-if="scope.row.status === 1">营业</span>
              <span v-else>休息</span>
            </span>
            <span v-else>营业</span>
          </template>
        </el-table-column>

        <!-- 工位没有可预约时段 -->
        <el-table-column v-if="fieldType !== '3'" label="可预约时段">
          <template slot-scope="scope">
            {{ scope.row.startTime ? scope.row.startTime + '-' + scope.row.endTime : '-' }}
          </template>
        </el-table-column>

        <el-table-column label="收费标准">
          <template slot-scope="scope">
            {{ scope.row.price ? scope.row.price + (fieldType === 1 ? '元/小时' : '元/天') : '-' }}
          </template>
        </el-table-column>
      </el-table>

      <!-- 办公室 -->
      <el-table border v-else :data="openOffice" class="width100">
        <el-table-column label="可起租日期" prop="startUseTime"></el-table-column>
        <el-table-column label="租金">
          <template slot-scope="scope">
            {{ scope.row.price ? scope.row.price + '元/月' : '-' }}
          </template>
        </el-table-column>

        <el-table-column label="最少租用时长">
          <template slot-scope="scope">
            {{ scope.row.minRentMonth ? scope.row.minRentMonth + '个月' : '-' }}
          </template>
        </el-table-column>
      </el-table>

      <!-- @#注意：工位和办公室没有对外价格 -->
      <h3 v-if="fieldType === '1' || fieldType === '4'" class="text-title fz16 mb6 mt24 no-required">对外价格</h3>
      <el-table border
        v-if="fieldType === '1' || fieldType === '4'"
        :data="openPrice"
        class="width100">
        <el-table-column label="日期">
          <template slot-scope="scope">
            <span v-if="scope.row.type === 1">工作日</span>
            <span v-else-if="scope.row.type === 2">非工作日</span>
            <span v-else>整周</span>
          </template>
        </el-table-column>

        <!-- 休息的时段不返回，对外价格都是营业的，休息没有对外 -->
        <el-table-column label="状态">
          <template slot-scope="scope">营业</template>
        </el-table-column>

        <el-table-column>
          <template slot-scope="scope">
            <span v-if="scope.row.itmeType === '1'">普通时段</span>
            <span v-else-if="scope.row.itmeType === '2'">特殊时段</span>
            <span v-else>免费时段</span>
          </template>
        </el-table-column>

        <el-table-column label="时段">
          <template slot-scope="scope">
            {{ scope.row.startTime ? scope.row.startTime + '-' + scope.row.endTime : '-' }}
          </template>
        </el-table-column>

        <el-table-column label="时长">
          <template slot-scope="scope">
            {{ scope.row.longTime }}小时
          </template>
        </el-table-column>

        <el-table-column label="价格">
          <template slot-scope="scope">
            ¥{{ scope.row.price }}
          </template>
        </el-table-column>
      </el-table>

      <lh-item v-if="fieldType !== '5'" :pb0="0" label="取消规则" label-width="68px"  class="mt24">
        {{
          field.cancel === 1 ?
          '需提前' + field.cancelBeforeTime + ( field.cancelBeforeUnit === 'D' ? '天' : '小时') + '取消' :
          '不允许取消'
        }}
      </lh-item>
    </lh-card-empty>

    <!-- 硬件设施 -->
    <lh-card-empty cardTitle="硬件设施" :isEmpty="!equipments.length">
      <div v-for="(item, idx) in equipments" :key="idx" class="equipmentList-box">
        <span class="theme-gray">{{ item.name }}</span>
        <img :src="item.icon + zoomImgSize(24)">
      </div>
    </lh-card-empty>

    <!-- 展示图 -->
    <lh-card-empty cardTitle="展示图" :isEmpty="!fieldImgs.length" class="diagram">
      <img v-for="(item, idx) in fieldImgs" :key="idx" :src="item.url">
    </lh-card-empty>

    <!-- 场地描述 -->
    <lh-card-empty cardTitle="场地描述" :isEmpty="!field.facilitiesAndServices">
      <div v-html="field.facilitiesAndServices"></div>
    </lh-card-empty>
  </div>
</template>

<script>
import { fieldDetail, setFieldStatus } from '@/service/field'
import detaillMixins from './detail.mixins'

export default {
  mixins: [detaillMixins],
  mounted() {
    this.getPageData()
  },
  methods: {
    //
    turnOpenData(ajaxData, fieldPriceList) {
      // console.log('ajaxData', ajaxData, fieldPriceList);

      // 基本价格
      // ------------------
      if (this.appointmentTimeType === 1) {
        this.openWeek[0].status = ajaxData.workState
        this.openWeek[0].price = ajaxData.workPriceDetailList[0].price

        if (this.fieldType !== '3') {
          this.openWeek[0].startTime = ajaxData.workPriceDetailList[0].startTime
          this.openWeek[0].endTime = ajaxData.workPriceDetailList[0].endTime
        }
        // console.log('openWeek', this.openWeek);
      } else {
        if (this.fieldType !== '3') {
          // 工作日
          this.openPeriod[0].status = ajaxData.workState
          this.openPeriod[0].price = ajaxData.workPriceDetailList[0].price
          if (this.fieldType !== '3') {
            this.openPeriod[0].startTime = ajaxData.workPriceDetailList[0].startTime
            this.openPeriod[0].endTime = ajaxData.workPriceDetailList[0].endTime
          }

          if (ajaxData.appointmentTimeType === 1) {
            this.openPeriod[0].type = 1
          } else {
            // 非工作日
            this.openPeriod[1].type = 2
            this.openPeriod[1].status = ajaxData.restState
            this.openPeriod[1].price = ajaxData.restPriceDetailList[0].price
            if (this.fieldType !== '3') {
              this.openPeriod[1].startTime = ajaxData.restPriceDetailList[0].startTime
              this.openPeriod[1].endTime = ajaxData.restPriceDetailList[0].endTime
            }
          }

          // console.log('openPeriod--------------', this.openPeriod);
        } else {
          this.openPeriod = this.turnPrice(fieldPriceList)
          // console.log('fieldPriceList----------', this.openWeek);
        }
      }

      // 只有会议室和其他类型，才有时段
      if (this.fieldType === '1' || this.fieldType === '4') {
        // 对外价格
        // ------------------
        this.openPrice = []

        this.openPrice = this.turnPrice(fieldPriceList)
        // console.log('openPrice----------', this.openPrice);
      }
    },
    // 排序
    turnPrice(fieldPriceList) {
      let list = { ...this.openPriceUnit }
      let lists = []
      for (let item of fieldPriceList) {
        if (item.clientType === 'WXAPP') {
          // 排在第一位，整周的用
          list.price = item.price
          if (item.periodOrder === 1) {
            list.itmeType = '1'
          } else {
            if (item.price) {
              list.itmeType = '2'
            } else {
              list.itmeType = '0'
            }
          }

          if (item.dayType === 1) {
            list.type = 1
          } else {
            list.type = 2
          }
          // console.log('item.dayType-----', list.type)

          list.startTime = item.startTime
          list.endTime = item.endTime
          // list.endMinute = item.endMinute
          list.longTime = item.dateDuration
          list.appointmentTimeType = item.appointmentTimeType

          // console.log('list-----', list);
          lists.push({ ...list })
        }
      }
      // console.log('lists-----', lists);

      // @#注意，再进行冒泡排序，从小到大
      // 从1开始，第一个是普通时段
      // for (var i = 1, len = lists.length; i < len; i++) {
      //   for (var j = i; j < len; j++) {
      //     if (lists[i].endMinute > lists[j].endMinute) {
      //       let b = lists[i]
      //       lists[i] = lists[j]
      //       lists[j] = b
      //     }
      //   }
      // }

      return [...lists]
    },
    // 切换，区分工作日和非工作日
    toggleWeek() {
      if (this.appointmentTimeType === 1) {
        this.openData = this.openWeek
      } else {
        this.openData = this.openPeriod
      }
      // console.log('openData', this.openData);
    },
    getPageData() {
      fieldDetail({ fieldId: this.fieldId }).then(res => {
        if (res.status === 'true') {
          let resInfo = res.info
          this.field = resInfo.field
          this.space = resInfo.space
          if (!this.fieldType) {
            this.fieldType = resInfo.field.type + ''
            this.setPageTitle()
          }
          this.appointmentTimeType = resInfo.field.appointmentTimeType
          this.store = resInfo.store
          this.equipments = resInfo.equipments

          // 展示图
          this.fieldImgs = resInfo.fieldImgs.map(item => ({
            url: item.img
          }))

          switch (this.fieldType) {
            case '1':
              this.stationNum = resInfo.fieldMeeting.maxAdmissibleNum
              this.turnOpenData(resInfo.fieldMeeting, resInfo.fieldPriceList)
              break;
            case '3':
              this.stationNum = resInfo.fieldStation.stationNum
              this.turnOpenData(resInfo.fieldStation, resInfo.fieldPriceList)
              break;
            case '4':
              this.stationNum = resInfo.fieldOther.maxAdmissibleNum
              this.turnOpenData(resInfo.fieldOther, resInfo.fieldPriceList)
              break;
            case '5':
              this.stationNum = resInfo.fieldOffice.stationNum
              this.openOffice = [{ ...resInfo.fieldOffice }]
              break;
          }

          this.toggleWeek()
        }
      })
    },
    setPageTitle() {
      for (let item of this.typeList) {
        if (this.fieldType === item.key) {
          this.titleName = this.field.fieldName + '（' + item.label + '）'
          document.title = this.titleName
        }
      }
    },
    // 更新会员状态
    handleUpdateStatus() {
      setFieldStatus({
        fieldId: this.fieldId,
        isOpen: (this.field.status === 20) ? 1 : 0
      }).then(res => {
        if (res.status === 'true') {
          // @注意：感叹号只在需要表达强烈情感的情况下使用，弹出信息推荐不使用
          this.setMsg('success', '修改成功')
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
.page-field-detail {
  .diagram {
    img {
      height: 126px;
      margin-right: 12px;
      border-radius: 2px;
    }
  }
  .equipmentList-box {
    float: left;
    margin-right: 60px;

    img {
      width: 24px;
      height: 24px;
      vertical-align: middle;
    }
    span {
      vertical-align: middle;
      margin-right: 4px;
    }
  }

  .page-title-right {
    .right-item {
      float: right;
    }
  }
}
</style>
