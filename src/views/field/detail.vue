<template>
  <div class="page-field-detail">
    <lh-title :title="titleName">
      <span class="ml12">
        <el-tag v-if="isOpen === 1" type="success" size="mini">开放中</el-tag>
        <el-tag v-else="isOpen === 0" type="danger" size="mini">未开放</el-tag>
      </span>

      <el-tooltip
        :content="isOpen === 1 ? '点击停用场地' : '点击开放场地'"
        placement="top"
        class="margin-lr6">
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
    </lh-title>

    <!-- title 扩展 -->
    <div class="page-title-info">
      <el-row>
        <el-col :span="16">
          <el-row :gutter="20">
            <el-col :span="8">
              <lh-item label="场地联系人：" label-width="87px">{{ field.contactName }}</lh-item>
            </el-col>
            <el-col :span="8">
              <lh-item label="联系电话：" label-width="auto">{{ field.contactTel }}</lh-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="8">
              <lh-item label="所属空间：" label-width="87px">{{ space.spaceName }}</lh-item>
            </el-col>
            <el-col :span="8">
              <lh-item label="所属门店：" label-width="auto">{{ store.storeName }}</lh-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col>
              <lh-item label="门店地址：" label-width="87px">{{store.provinceName}}{{store.cityName}}{{store.districtName}}{{store.address}}</lh-item>
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
    <lh-card
      :cardTitle="fieldType === '3' || fieldType === '5' ? '开放时段' : '预约设置'">
      <h3 class="text-title fz16 mb6 mt0 no-required">基本价格</h3>

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
            <span v-if="appointmentTimeType === 2">
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
            {{ scope.row.price || scope.row.price === 0 ? scope.row.price + (fieldType === '3' || fieldType === '5' ? '元/天' : '元/小时') : '-' }}
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
      <h3 v-if="fieldType !== '5'" class="text-title fz16 mb6 mt24 no-required">对外价格</h3>
      <el-table border
        v-if="fieldType !== '5'"
        :data="openPrice"
        class="width100">
        <el-table-column label="日期">
          <template slot-scope="scope">
            <span v-if="appointmentTimeType === 2">
              <span v-if="scope.row.type === 1">工作日</span>
              <span v-else-if="scope.row.type === 2">非工作日</span>
            </span>
            <span v-else>整周</span>
          </template>
        </el-table-column>

        <!-- 休息的时段不返回，对外价格都是营业的，休息没有对外 -->
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span v-if="appointmentTimeType === 2">
              <span v-if="scope.row.status === 1">营业</span>
              <span v-else>休息</span>
            </span>
            <span v-else>营业</span>
          </template>
        </el-table-column>

        <el-table-column v-if="fieldType !== '3'">
          <template slot-scope="scope">
            <span v-if="scope.row.itmeType === 1">普通时段</span>
            <span v-else-if="scope.row.itmeType === 2">特殊时段</span>
            <span v-else>免费时段</span>
          </template>
        </el-table-column>

        <el-table-column label="时段" v-if="fieldType !== '3'">
          <template slot-scope="scope">
            {{ scope.row.startTime ? scope.row.startTime + '-' + scope.row.endTime : '-' }}
          </template>
        </el-table-column>

        <el-table-column label="时长" v-if="fieldType !== '3'">
          <template slot-scope="scope">
            {{ scope.row.longTime ? scope.row.longTime + '小时' : '-' }}
          </template>
        </el-table-column>

        <el-table-column label="价格">
          <template slot-scope="scope">
            {{ scope.row.price || scope.row.price === 0 ? '¥' + scope.row.price : '-' }}
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
    </lh-card>

    <!-- 硬件设施 -->
    <lh-card cardTitle="硬件设施" :isEmpty="!equipments.length">
      <div v-for="(item, idx) in equipments" :key="idx" class="equipmentList-box">
        <span class="theme-gray">{{ item.name }}</span>
        <img :src="item.icon + zoomImgSize(24)">
      </div>
    </lh-card>

    <!-- 展示图 -->
    <lh-card cardTitle="展示图" :isEmpty="!fieldImgs.length" class="diagram">
      <img v-for="(item, idx) in fieldImgs" :key="idx" :src="item.url">
    </lh-card>

    <!-- 场地描述 -->
    <lh-card cardTitle="场地描述" :isEmpty="!field.facilitiesAndServices">
      <div v-html="field.facilitiesAndServices"></div>
    </lh-card>
  </div>
</template>

<script>
import { typeList } from '@/mixins/data'
import { fieldDetail, setFieldStatus } from '@/service/field'
import detaillMixins from './detail.mixins'

export default {
  mixins: [detaillMixins],
  mounted() {
    this.getPageData()
  },
  methods: {
    turnOpenData(ajaxData) {
      // console.log('ajaxData', ajaxData, this.openWeek);
      // 基本价格
      if (ajaxData.appointmentTimeType) {
        if (this.appointmentTimeType === 1) {
          if (this.fieldType !== '3') {
            if (ajaxData.workState) {
              this.openWeek[0].status = ajaxData.workState
              this.openWeek[0].price = ajaxData.workPriceDetailList[0].price
              this.openWeek[0].startTime = ajaxData.workPriceDetailList[0].startTime
              this.openWeek[0].endTime = ajaxData.workPriceDetailList[0].endTime
            }

            this.openPeriod[0].type = 1
          }
          // console.log('openWeek', this.openWeek);
        } else {
          // @#注意：区分工作日的情况，工作日和非工作日都有可能是休息的状态
          if (this.fieldType !== '3') {
            // 工作日
            if (ajaxData.workState) {
              this.openPeriod[0].status = ajaxData.workState
              this.openPeriod[0].price = ajaxData.workPriceDetailList[0].price
              this.openPeriod[0].startTime = ajaxData.workPriceDetailList[0].startTime
              this.openPeriod[0].endTime = ajaxData.workPriceDetailList[0].endTime
            }

            // 非工作日
            if (ajaxData.restState) {
              this.openPeriod[1].type = 2
              this.openPeriod[1].status = ajaxData.restState
              this.openPeriod[1].price = ajaxData.restPriceDetailList[0].price

              this.openPeriod[1].startTime = ajaxData.restPriceDetailList[0].startTime
              this.openPeriod[1].endTime = ajaxData.restPriceDetailList[0].endTime
            }
            // console.log('openPeriod--------------', this.openPeriod);
          }
        }
      }
    },
    // 设置对外价格
    setOpenPrice(fieldPriceList) {
      this.openPrice = this.turnPrice(fieldPriceList)
    },
    // 排序
    turnPrice(fieldPriceList) {
      let list = { ...this.openPriceUnit }
      let lists = []
      for (let item of fieldPriceList) {
        if (item.clientType === 'WXAPP') {
          // 用来判断，该场地对外开放设置，是否开放
          list.clientType = item.clientType

          // 排在第一位，整周的用
          list.price = item.price
          if (item.periodOrder === 1) {
            list.itmeType = 1
          } else {
            if (item.price) {
              list.itmeType = 2
            } else {
              list.itmeType = 0
            }
          }

          if (item.dayType === 1) {
            list.type = 1
          } else {
            list.type = 2
          }

          // 休息时段的不返回
          // if (item.fieldType === 3) {
          list.status = 1
          // }
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
    /**
     * 是否开放，如果没有开放，需要手动加入。
     *
     * 开放的时候，是否休息，休息的时候接口没有返回，需要手动加入
     * 还要注意插入的位置，在特殊时段的情况下
     * 还得计算时长
     */
    setBasePrice(priceData) {
      // 该场地的对外开放设置为关闭时，插入基本价格
      // 只要有第一条，就可以走下面的流程了
      // console.log('test', this.openPeriod, this.openSettingStatus)

      /**
       * 开放，返回营业数据，休息不返回
       * 关闭，不返回数据
       * @#踩坑：到最后，还是需求不明确，或者是需求理解错误耽误了
       */
      if (!this.openSettingStatus) {
        /**
         * #@注意：没有对外开放的场地，不展示对外开放价格
         */
        // if (this.appointmentTimeType === 1) {
        //   this.openPrice.splice(1, 0, this.openData[0])
        //   this.openData[0].longTime = calcLongTime(this.openData[0].startTime, this.openData[0].endTime)
        // } else {
        //   this.openPrice.splice(1, 0, this.openData[0])
        //   this.openData[0].longTime = calcLongTime(this.openData[0].startTime, this.openData[0].endTime)

        //   this.openData[1].longTime = calcLongTime(this.openData[1].startTime, this.openData[1].endTime)
        //   this.openPrice.splice(this.openPrice.length, 0, this.openData[1])
        // }

        // if (!priceData.workState) {
        // 判断是否有对应的工作日、非工作日，返回相应地数据
        // 而且需要区分有没有休息的情况，有才添加

        /**
         * 确定openPeriod的返回值
         */
        // if (this.openPrice.length) {
        //   // 计算时长
        //   this.openPrice.splice(1, 0, this.openPeriod[0])
        //   this.openPeriod[0].longTime = calcLongTime(this.openPeriod[0].startTime, this.openPeriod[0].endTime)
        // } else {
        //   this.openPrice.splice(1, 0, this.openData[0])
        //   this.openData[0].longTime = calcLongTime(this.openData[0].startTime, this.openData[0].endTime)
        // }
        // } else {
        // if (this.openPrice.length) {
        //   // 计算时长
        //   this.openPrice.splice(1, 0, this.openPeriod[0])
        //   this.openPeriod[0].longTime = calcLongTime(this.openPeriod[0].startTime, this.openPeriod[0].endTime)
        // } else {
        //   console.log('this.openData[0]', this.openData[0]);
        //   this.openPrice.splice(1, 0, this.openData[0])
        //   this.openData[0].longTime = calcLongTime(this.openData[0].startTime, this.openData[0].endTime)
        // }
        // }

        // console.log('openPrice', this.openPrice);
        // if (!priceData.restState) {
        //   // 工作日的特殊时段结束了，再插入非工作的基本价格
        //   for (let i = 0, len = this.openPrice.length; i < len; i++) {
        //     if (this.openPrice[i].type === 2) {
        //       this.openPrice.splice((i + 1), 0, this.openPeriod[1])
        //       break;
        //     } else {
        //       // 计算时长
        //       this.openPeriod[len - 1].longTime = calcLongTime(this.openPeriod[len - 1].startTime, this.openPeriod[len - 1].endTime)
        //       this.openPrice.splice((len), 0, this.openPeriod[1])
        //       break;
        //     }
        //   }
        // } else {
        //   // 只返回了有的数据
        //   // if (this.openPrice.length) {
        //   //   // 计算时长
        //   //   this.openPrice.splice(1, 0, this.openPeriod[0])
        //   //   this.openPeriod[0].longTime = calcLongTime(this.openPeriod[0].startTime, this.openPeriod[0].endTime)
        //   // } else {
        //   //   console.log('this.openData[0]', this.openData[0]);
        //   //   this.openPrice.splice(1, 0, this.openData[0])
        //   //   this.openData[0].longTime = calcLongTime(this.openData[0].startTime, this.openData[0].endTime)
        //   // }
        // }
      } else {
        // if (!priceData.workState) {
        //   this.openPrice.splice(0, 0, this.openData[0])
        //   this.openData[0].longTime = calcLongTime(this.openData[0].startTime, this.openData[0].endTime)
        // }
        // if (!priceData.restState) {
        //   this.openData[1].longTime = calcLongTime(this.openData[1].startTime, this.openData[1].endTime)
        //   this.openPrice.splice(this.openPrice.length, 0, this.openData[1])
        // }

        // if (!priceData.workState) {
        //   if (this.openPrice.length) {
        //     // 计算时长
        //     this.openPrice.splice(1, 0, this.openPeriod[0])
        //     this.openPeriod[0].longTime = calcLongTime(this.openPeriod[0].startTime, this.openPeriod[0].endTime)
        //   } else {
        //     this.openPrice.splice(1, 0, this.openData[0])
        //     this.openData[0].longTime = calcLongTime(this.openData[0].startTime, this.openData[0].endTime)
        //   }
        // }

        // 开放和关闭的区别
        // else {
        //   if (this.openPrice.length) {
        //     // 计算时长
        //     this.openPrice.splice(1, 0, this.openPeriod[0])
        //     this.openPeriod[0].longTime = calcLongTime(this.openPeriod[0].startTime, this.openPeriod[0].endTime)
        //   } else {
        //     console.log('this.openData[0]', this.openData[0]);
        //     this.openPrice.splice(1, 0, this.openData[0])
        //     this.openData[0].longTime = calcLongTime(this.openData[0].startTime, this.openData[0].endTime)
        //   }
        // }

        // console.log('openPrice', this.openPrice);
        // if (!priceData.restState) {
        //   // 工作日的特殊时段结束了，再插入非工作的基本价格
        //   for (let i = 0, len = this.openPrice.length; i < len; i++) {
        //     if (this.openPrice[i].type === 2) {
        //       this.openPrice.splice((i + 1), 0, this.openPeriod[1])
        //       break;
        //     } else {
        //       // 计算时长
        //       this.openPeriod[len - 1].longTime = calcLongTime(this.openPeriod[len - 1].startTime, this.openPeriod[len - 1].endTime)
        //       this.openPrice.splice((len), 0, this.openPeriod[1])
        //       break;
        //     }
        //   }
        // }
      }

      // console.log('this.openPrice', this.openPrice);
    },
    getOpenStatus() {
      for (let item of this.openPrice) {
        // console.log('item.clientType', item.clientType);
        if (item.clientType === 'WXAPP') {
          this.openSettingStatus = true
          break;
        }
      }
    },
    getPageData() {
      fieldDetail({ fieldId: this.fieldId }).then(res => {
        if (res.status === 'true') {
          let resInfo = res.info
          this.field = resInfo.field
          this.space = resInfo.space
          this.isOpen = resInfo.isOpen

          if (!this.fieldType) {
            this.fieldType = resInfo.field.type + ''
            this.setPageTitle('getTitle')
          }
          this.appointmentTimeType = resInfo.field.appointmentTimeType
          this.store = resInfo.store
          this.equipments = resInfo.equipments

          // 展示图
          this.fieldImgs = resInfo.fieldImgs.map(item => ({
            url: item.img
          }))
          this.fieldImgs = []
          for (let item of resInfo.fieldImgs) {
            // @#注意：主图不重复展示在列表中
            // if (item.mainImg === 1) {
            //   this.mainImg = item.img
            // } else {
            this.fieldImgs.push({ url: item.img })
            // }
          }

          switch (this.fieldType) {
            case '6':
              this.stationNum = resInfo.fieldHourStation.maxAdmissibleNum
              this.turnOpenData(resInfo.fieldHourStation)
              this.setOpenPrice(resInfo.fieldPriceList)

              this.getOpenStatus()
              this.toggleWeek()
              break;
            case '1':
              this.stationNum = resInfo.fieldMeeting.maxAdmissibleNum
              this.turnOpenData(resInfo.fieldMeeting)
              this.setOpenPrice(resInfo.fieldPriceList)

              /**
               * 拿到场地是否对外开放，先拿到openPrice
               * 在调用turnOpenData方法之后调用
               * 办公室不需要
               */
              this.getOpenStatus()

              this.toggleWeek()

              // 对外价格，在基本价格之后整合
              // this.setBasePrice(resInfo.fieldMeeting)
              break;
            case '2':
              this.stationNum = resInfo.fieldRoadshowHall.maxAdmissibleNum
              this.turnOpenData(resInfo.fieldRoadshowHall)
              this.setOpenPrice(resInfo.fieldPriceList)

              this.getOpenStatus()
              this.toggleWeek()
              break;
            case '4':
              this.stationNum = resInfo.fieldOther.maxAdmissibleNum
              this.turnOpenData(resInfo.fieldOther)
              this.setOpenPrice(resInfo.fieldPriceList)

              this.getOpenStatus()
              this.toggleWeek()
              // 插入基本几个
              // this.setBasePrice(resInfo.fieldOther)
              break;
            case '3':
              this.stationNum = resInfo.fieldStation.stationNum

              if (this.appointmentTimeType === 1) {
                let fieldPriceList = [...this.openWeek]
                fieldPriceList[0].price = resInfo.fieldStation.workPrice
                fieldPriceList[0].status = resInfo.fieldStation.workState
                this.openWeek = [...fieldPriceList]
              } else {
                let fieldPriceList = [...this.openPeriod]
                fieldPriceList[0].price = resInfo.fieldStation.workPrice
                fieldPriceList[0].status = resInfo.fieldStation.workState
                fieldPriceList[1].price = resInfo.fieldStation.restPrice
                fieldPriceList[1].status = resInfo.fieldStation.restState
                this.openPeriod = [...fieldPriceList]
              }
              // 拿基本价格
              this.toggleWeek()

              // 拿对外价格
              this.setOpenPrice(resInfo.fieldPriceList)
              break;
            case '5':
              this.stationNum = resInfo.fieldOffice.stationNum
              this.openOffice = [{ ...resInfo.fieldOffice }]

              this.toggleWeek()
              break;
          }
        }
      })
    },
    setPageTitle(type) {
      for (let item of this.typeList) {
        if (this.fieldType === (item.key + '')) {
          this.titleName = this.field.fieldName + '（' + item.label + '）'
          document.title = this.titleName
        }
      }

      if (type !== 'getTitle') {
        this.getPageData()
      }
    },
    // 更新会员状态
    handleUpdateStatus() {
      setFieldStatus({
        fieldId: this.fieldId,
        isOpen: this.isOpen
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
