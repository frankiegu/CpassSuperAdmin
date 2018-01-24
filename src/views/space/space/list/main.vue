<template>
  <div v-if="spaceAccess" class="space-list">
    <div class="page-title"> <h1>场地管理</h1> </div>

    <usage-rate :storeRateData="storeRateData"></usage-rate>

    <div class="card-padding card-padding-vertical">
      <el-form :model="formFilter" :inline="true" class="mr-10 text-right form-class mt10">
        <el-form-item>
          <el-date-picker
            v-model="formFilter.date"
            @change="refreshPageData"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            placeholder="选择日期"
            type="date"
            clearable></el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-select
            v-model="formFilter.storeId"
            @change="changePage"
            placeholder="请选择门店"
            clearable>

            <el-option
              v-for="item in storeList"
              :label="item.storeName"
              :value="item.id"
              :key="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-select
            v-model="formFilter.businessStatus"
            @change="changePage"
            placeholder="请选择场地状态"
            clearable>
            <lh-option :statusList="formFilter.statusList"></lh-option>
          </el-select>
        </el-form-item>
      </el-form>

      <el-tabs v-model="fieldType">
        <el-tab-pane
          v-for="item in formFilter.typeList"
          :label="item.label"
          :key='item.key'
          :name="item.key">

          <!-- 如果数据没有更新，则查看缓存的数据 -->
          <keep-alive>
            <tab-pane
              ref="tabPane"
              v-if='fieldType == item.key'
              :fieldType="fieldType"
              :formFilter="formFilter"
              @create="showCreatedTimes"
              @setFlatpickr="setFlatpickr"
              @deleteSpace="deleteSpace"></tab-pane>
          </keep-alive>
        </el-tab-pane>
      </el-tabs>
    </div>

    <transition name="slide-fade">
      <div class="flatpickr" v-show="flatpickrStatus">
        <div class="panel">
          <h1>会议室开放情况</h1>

          <div class="content">
            <div class="set-date">
              <div class="date-title">
                <span class="fl">排期调整<span class="theme-gray"></span></span>
                <!-- <span @click="clear" data-clear class="pointer-theme-blue fr">撤销</span> -->
              </div>

              <div class="other-option">
                <el-date-picker
                  v-model="date"
                  :picker-options="pickerOptions0"
                  :disabled="otherOptionStatus"
                  @change="handleChangeDate"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  class="fl data-width"
                  placeholder="选择日期"
                  type="date"></el-date-picker>

                <div classs="fr">
                  <el-radio-group v-model="switchRadio" @change="changeRdio">
                    <el-radio :disabled="otherOptionStatus" class="radio" label="1">长期开放</el-radio>
                    <el-radio :disabled="otherOptionStatus" class="radio" label="0">长期关闭</el-radio>
                  </el-radio-group>
                </div>
              </div>

              <!-- <div class="">{{ flatpickrDate }}</div> -->
            </div>

            <div class="mt20">
              <span class="fl theme-gray font-size-12px">根据选定的日期，一键调整后续场地状态</span>
              <!-- <span @click="clear" data-clear class="pointer-theme-blue fr">撤销</span> -->
            </div>
            <div class="date">
              <div id="flatpickr-box" class="flatpickr-box">
                <div>
                  <flat-pickr
                    v-model="flatpickrDate"
                    :config="config"
                    :required="true"
                    :data-inline="true"
                    placeholder="请设置日期范围"
                    class="flatpickr-ipt"
                    name="date"></flat-pickr>
                </div>
              </div>

              <div class="switch-box">
                <div class="switch mr15">
                  <span class="open-color"></span>
                  <span class="open-text">开放</span>
                </div>
                <div class="switch">
                  <span class="close-color"></span>
                  <span class="close-text">关闭</span>
                </div>
              </div>
            </div>
          </div>

          <div class="footer">
            <el-button @click="flatpickrSave" class="btn-save" type="primary">保存</el-button>
            <el-button @click="cancelSet" class="btn-clear">取消</el-button>
          </div>
        </div>

        <div @touchmove.prevent @click="cancelSet" class="v-modal"></div>
      </div>
    </transition>
  </div>
</template>

<script>
  import '@/styles/airbnb.scss'
  import 'flatpickr/dist/l10n/zh.js'
  import { pageData } from './list.data'
  import option from '@/components/option'
  import tabPane from './components/tab-pane'
  import usageRate from './components/usageRate'
  import flatPickr from 'vue-flatpickr-component'
  import allStore from '@/config/mixins/head/getAllStore'
  import { formatTimeString, getDateStr } from '@/config/utils'
  import { statisticsStoreRate, fieldDelete, getFieldBusinessStatus, updateFieldBusinessStatusForever, updateFiledBusinessStatus } from '@/service'

  export default {
    mixins: [allStore],
    components: {
      flatPickr,
      usageRate,
      tabPane,
      [option.name]: option
    },
    data() {
      return {
        date: null,               // 选择日期
        storeRateData: [0, 0, 0], // 场地使用率
        createdTimes: 0,
        fieldType: '3',
        formFilter: pageData.formFilter,

        config: pageData.config,
        pickerOptions0: pageData.pickerOptions0,
        listenModel: 0,
        flatpickrStatus: false,
        switchRadio: null,
        setFlatpickrId: null,
        flatpickrMonthArray: [],  // 存储月份数组的数据
        otherOptionStatus: false, // 排期调整的状态
        flatpickrDate: []         // 选择范围日期
      }
    },
    computed: {
      spaceAccess() {
        return Boolean(this.$store.getters.getSpaceAccess)
      }
    },
    mounted() {
      if (this.spaceAccess) {
        this.getUsageRate()
      }
    },
    methods: {
      showCreatedTimes() {
        this.createdTimes = this.createdTimes + 1
      },
      changePage() {
        this.$refs.tabPane[0].getPageData()
        this.getUsageRate()
      },
      refreshPageData(val) {
        this.formFilter.date = this.formFilter.date ? formatTimeString(val) : ''
        this.changePage()
      },
      getUsageRate() {
        if (!this.formFilter.date) {
          this.setMsg('请选择日期')
          return
        }
        statisticsStoreRate({
          date: this.formFilter.date ? formatTimeString(this.formFilter.date) : '',
          storeId: this.formFilter.storeId
        }).then(res => {
          if (res.status === 'true') {
            this.storeRateData = res.info
          } else {
            this.setMsg('error', res.msg)
          }
        })
      },
      deleteSpace(id) {
        this.$confirm('确定删除？（删除场地不会影响已生成的订单）', '提示', { type: 'warning' }).then(() => {
          fieldDelete({ fieldId: id }).then(res => {
            if (res.status === 'true') {
              this.$refs.tabPane[0].getPageData()
              this.setMsg('success', '删除成功!')
            } else {
              this.setMsg('error', res.msg)
            }
          })
        }).catch(() => {
          this.setMsg('已取消删除')
        });
      },
      // 点击操作会议开放情况
      setFlatpickr(id) {
        let dateList = []
        let todayTime = getDateStr(1)

        // 保存点击的场地id，供保存使用
        this.setFlatpickrId = id

        // 恢复默认状态
        if (!this.flatpickrStatus) {
          // 设置 长期开放关闭 初始日期，明天之前都是关闭状态
          this.date = getDateStr(1)
          // 点击之后，马上重置单选框状态
          // 而后立马更改标识
          this.switchRadio = null
        }
        this.flatpickrDate = []
        this.flatpickrMonthArray = []
        this.otherOptionStatus = false
        this.flatpickrStatus = true

        let dataJson = {
          fieldId: this.setFlatpickrId,
          startDate: todayTime,
          endDate: getDateStr(90)
        }
        getFieldBusinessStatus(dataJson).then(res => {
          if (res.status === 'true') {
            /**
             * 拿到两份今天之后的日期和状态
             * 一份备份
             * 一份给插件调用 调整修改
             */
            for (var i = 0; i < res.info.length; i++) {
              this.flatpickrMonthArray.push({
                businessStatus: res.info[i].businessStatus,
                date: res.info[i].date
              })

              if (res.info[i].businessStatus === 1) {
                dateList.push(res.info[i].date)
              }
            }
            this.flatpickrDate = dateList
            // console.log('dateList: ', dateList);
            // console.log('this.flatpickrMonthArray: ', this.flatpickrMonthArray);

            // 300毫秒之后，打开可设置长期开放关闭的开关
            // 起因是，点击设置会议开放情况，需要充值单选框的值
            if (this.listenModel === 0) {
              setTimeout(() => {
                this.listenModel = 1
              }, 300)
              // console.log('this.listenModel：', this.listenModel);
            }
          } else {
            this.setMsg('error', res.msg)
          }
        })
      },
      cancelSet() {
        this.flatpickrStatus = false
        this.listenModel = 0
      },
      // 更新场地长期开启或关闭的状态
      handleUpdateBusinessStatus() {
        const dataJson = {
          fieldId: this.setFlatpickrId,
          date: formatTimeString(this.date),
          businessStatus: this.switchRadio
        }
        updateFieldBusinessStatusForever(dataJson).then(res => {
          if (res.status === 'true') {
            // 刷新展示日期的数据
            this.setFlatpickr(this.setFlatpickrId)
            this.setMsg('success', '修改成功!')
          } else {
            this.setMsg('error', res.msg)
          }
        })
      },
      // 日历时间选择器change事件
      handleChangeDate() {
        if (this.switchRadio) {
          this.handleUpdateBusinessStatus()
        }
        // this.switchRadio = null
      },
      // 长期开启或关闭单选框change事件
      changeRdio(val) {
        // console.log('=== 0: ', this.listenModel)

        if (this.listenModel === 0) {
          this.listenModel += 1
          return
        }
        this.listenModel += 1

        if (val === '1') {
          this.handleUpdateBusinessStatus()
        } else if (val === '0') {
          this.$confirm('该场地将于选定的日期起长期关闭并停止预约，但不影响已有订单', '确认关闭？', { type: 'warning' }).then(() => {
            this.handleUpdateBusinessStatus()
          }).catch(() => {
            this.setMsg('已取消')
          });
        }
      },
      // 保存会议开放情况
      flatpickrSave() {
        let backups = []

        /**
         * 当长期 开放关闭 有值的时候，就调用相关接口
         * 反之，调用开放情况接口
         * 先在可调整的范围内设置为关闭的状态
         */
        for (let i in this.flatpickrMonthArray) {
          this.flatpickrMonthArray[i].businessStatus = 0
        }
        // console.log('this.flatpickrMonthArray1: ', this.flatpickrMonthArray);

        // 测试对象的类型
        // 如果拿到的数据是 string，则转换为 数组
        if (typeof this.flatpickrDate === 'string') {
          // 从插件拿到开放的日期
          this.flatpickrDate = this.flatpickrDate.split(', ')
          // console.log('split string');
        }
        // console.log('this.flatpickrDate： ', this.flatpickrDate)

        // 设置开放的日期，状态为 1
        for (let j in this.flatpickrDate) {
          backups[j] = {
            businessStatus: 1,
            date: this.flatpickrDate[j]
          }
        }
        // console.log('backups', backups);

        // 拼接两个接口
        // 遍历备份的数据，如果开放的日期对应到备份的日期，就把状态赋值过去
        // console.log('test', this.flatpickrMonthArray.length, backups.length);
        let diffLen = this.flatpickrMonthArray.length - backups.length
        let backupsLen = backups.length

        for (let l = 0; l < diffLen; l++) {
          backups[backupsLen + l] = {
            date: '',
            businessStatus: 0
          }
        }
        // console.log('backupsChange: ', backups);

        // 把backups的长度设置跟flatpickrMonthArray一样
        for (let k of this.flatpickrMonthArray) {
          for (let m of backups) {
            if (k.date === m.date) {
              k.businessStatus = m.businessStatus
            }
          }
        }
        // console.log('this.flatpickrMonthArray:', this.flatpickrMonthArray);

        const dataJson = {
          fieldId: this.setFlatpickrId,
          fieldDateBusinessStatus: this.flatpickrMonthArray
        }
        // console.log('dataJson: ', dataJson);

        // 更新数据
        updateFiledBusinessStatus(dataJson).then(res => {
          if (res.status === 'true') {
            this.flatpickrStatus = false
            this.listenModel = 0
            this.setMsg('success', '保存成功!')
            this.$refs.tabPane[0].getPageData()
          } else {
            this.setMsg('error', res.msg)
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  @import 'src/styles/config.scss';
  .space-list {
    .el-tabs__nav-wrap::after {
      height: 1px;
    }
    .el-tabs__nav-scroll {
      padding-bottom: 8px;
    }
    .el-tabs__active-bar {
      bottom: -8px;
    }
    .flatpickr {
      position: fixed;
      z-index: 2000;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;

      .content {
        .switch {
          display: inline-block;
        }
        .date-title {
          height: 20px;
          margin-bottom: 22px;
        }
        .other-option {
          height: 36px;
        }
        .data-width.el-date-editor.el-input {
          width: 140px;
        }
        .open-text, .close-text {
          color: $theme-gray;
          vertical-align: middle;
        }
        .open-color, .close-color {
          display: inline-block;
          width: 40px;
          height: 15px;
          vertical-align: middle;
        }
        .open-color {
          background-color: $theme-blue;
        }
        .close-color {
          background-color: #c5c5c5;
        }
        .date {
          position: fixed;
          top: 180px;
          width: 320px;
          text-align: right;
        }
        .switch-box {
          margin-top: 548px;

          @media screen and (max-width: 1366px) {
            margin-top: 476px;
          }
        }
        .set-date {
          position: relative;
          z-index: 2;
          width: 320px;
          margin-top: 150px;

          .el-radio.radio {
            margin-top: 11px;
            margin-left: 10px;
          }
        }
      }
      .footer {
        position: fixed;
        bottom: 50px;
        @media screen and (max-width: 1366px) {
          bottom: 20px;
        }
        width: 320px;
        text-align: center;

        .btn-clear {
          width: 100px;
        }
        .btn-save {
          width: 200px;
        }
      }
      h1 {
        font-size: 18px;
        text-align: center;
        padding-top: 30px;
      }
      @media screen and (max-width: 1366px) {
        h1 {
          padding-top: 15px;
        }
        .content {
          .date {
            top: 120px;
          }
          .set-date {
            margin-top: 30px;
          }
        }
      }
      .panel {
        position: fixed;
        top: 60px;
        right: 0;
        z-index: 11111;
        background-color: #fff;
        width: 390px;
        padding: 0 35px;
        height: 100%;
        border-radius: 2px;
        box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
        box-sizing: border-box;
        border-top: 1px solid #f0f2f7;
      }
      .v-modal {
        top: 60px;
        left: -20px;
        width: 150%;
      }
    }
    .flatpickr-calendar {
      position: fixed !important;
      top: 427px !important;
      right: 40px;
    }
    .flatpickr .flatpickr-box {
      position: relative;
      margin-top: 30px;
      width: 320px;

      .flatpickr-model {
        position: absolute;
        top: 0;
        left: 0;
        background: transparent;
        z-index: 2;
        height: 36px;
        line-height: 1;
        border: 1px solid rgb(209, 212, 229);
        color: #bbb;
        cursor: not-allowed;
        display: inline-block;
        font-size: inherit;
        outline: none;
        padding: 3px 10px;
        transition: border-color .2s cubic-bezier(.645,.045,.355,1);
        width: 100%;
        box-sizing: border-box;
        background-image: none;
        border-radius: 4px;
      }
      .flatpickr-ipt {
        background-color: #fff;
        background-image: none;
        border-radius: 4px;
        border: 1px solid rgb(191, 194, 217);
        box-sizing: border-box;
        color: rgb(31, 35, 61);
        display: inline-block;
        font-size: inherit;
        height: 36px;
        line-height: 1;
        outline: none;
        padding: 3px 10px;
        transition: border-color .2s cubic-bezier(.645,.045,.355,1);
        width: 100%;
        display: none;
      }
      .el-icon-close {
        position: absolute;
        z-index: 2;
        width: 35px;
        height: 34px;
        line-height: 34px;
        right: 0;
        top: 0;
        text-align: center;
        color: rgb(191, 194, 217);
        transition: all .3s;
        border: 1px solid rgb(191, 194, 217);
        background-color: #FFF;
        border-left: 0;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
        display: none;
      }
      ::-moz-placeholder {
        color: #bfcbd9;
      }
      ::-webkit-input-placeholder {
        color: #bfcbd9;
      }
      :-ms-input-placeholder {
        color: #bfcbd9;
      }
    }
    .flatpickr-box:hover {
      .el-icon-close {
        // display: block;
      }
    }
    @media screen and (max-width: 1366px) {
      .flatpickr-calendar {
        top: 282px !important;
      }
    }
  }
</style>
<style lang="scss" scoped>
  @import 'src/styles/config.scss';
  .space-list {
    .form-class {
      position: relative;
      z-index: 1;
      margin-bottom: -60px;
    }
  }
</style>
