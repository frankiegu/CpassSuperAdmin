<template>
  <div class="page-activity-com">
    <lh-title :title="titleName" :noBorder="true">
      <div class="com-title-box pb0">
        <h2 class="width100">
          <span v-if="dataFinishPercent !== 100" class="width100">
            <span class="fl">正在创建场地...</span>
            <span class="field-name a-line ml12">{{ onePartForm.fieldName }}</span>
            <span v-if="dataFinishPercent" class="lh-process ml12">
              <span
                v-for="(item, idx) in 3"
                :key="idx"
                class="blue-step"
                :class="processStep(idx)"
                :style="`width: ${100 / 3}%`"></span>
            </span>
          </span>
          <span v-else>
            {{ onePartForm.fieldName }}
          </span>
        </h2>
      </div>
    </lh-title>

    <!-- tab 切换 -->
    <lh-page-tab
      :activityTab="activityTab"
      :tabList="tabList"
      :addEditType="addEditType"
      :tabSwitch="tabSwitch"
      @tabToggle="toggleTab" />

    <div class="lh-card-main lh-card-body">
      <h3 class="step-one-title" v-if="activityTab === 1">基本信息</h3>
      <h3 class="step-one-title" v-if="activityTab === 2">活动配置</h3>
      <h3 class="step-one-title" v-if="activityTab === 3">展示设置</h3>
      <!-- first step -->
      <el-form
        v-show="activityTab === 1"
        :model="onePartForm"
        :rules="onePartFormRule"
        ref="onePartForm">
        <!--<h3 class="text-title mt0">需要发布怎样的场地？</h3>-->
        <el-form-item prop="activityName" label="活动名称 " label-width="120px">
          <el-input v-model.trim="onePartForm.activityName" class="activity-name" placeholder="活动名称" :maxlength="30"></el-input>
        </el-form-item>

        <!-- 标题文字不要换行，因为会多一个空格，就不对齐了 -->
        <el-form-item prop="activityRules" label="活动规则 " label-width="120px" class="mt40">
          <el-input
            type="textarea"
            class="activity-name fl"
            v-model.trim="onePartForm.activityRules"
            :maxlength="200"
            :rows="4"
            placeholder="请填写报名方式"
          >
          </el-input>

          <span class="theme-gray fl">&nbsp;&nbsp;（{{onePartForm.activityRules.length}}/50）限制字数50</span></el-form-item>

        <el-form-item prop="activityType" label="活动类型" label-width="120px" class="mt40">
          <template>
            <el-radio class="mt10" v-model="onePartForm.activityType" label="common">普通活动</el-radio>
            <el-radio class="mt10" v-model="onePartForm.activityType" label="interactive">互动游戏</el-radio>
          </template>
        </el-form-item>

        <el-form-item prop="activityType" label="活动模板" label-width="120px" class="mt40">
          <template>
            <el-radio class="mt10" v-model="onePartForm.activityTemplate" label="goldenEggs">砸金蛋</el-radio>
            <el-radio class="mt10" v-model="onePartForm.activityTemplate" label="otherGames">其他</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="活动有效期" label-width="120px" prop="rangeDate" class="mt40">
          <div>
            <el-date-picker
              v-model="onePartForm.rangeDate"
              @change="dateChange"
              :picker-options="orderSortDate"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              placeholder="选择日期"
              type="daterange"
              align="left"></el-date-picker>
          </div>
          <div class="date-text-wrapper">
            <i class="el-icon-warning fl theme-light-gray date-warnning"></i>
            <span class="warnning-text">此处仅为可参与活动的日期，不控制是否显示在用户端</span>
          </div>

        </el-form-item>

        <el-form-item label="活动banner" label-width="120px" prop="bannerPic" class="mt40">
          <lh-upload
            :imgUrl="onePartForm.bannerPic"
            class="fl"
            @uploadImg="val => onePartForm.bannerPic = val"></lh-upload>
          <i class="el-icon-question fl theme-light-gray date-warnning upload-text-icon ml10 mt6 mr5" @click="uploadText = true"></i>
          <div v-if="uploadText">
            <p>建议尺寸： 600PX * 460PX</p>
            <p class="banner-format">支持格式： JPG / PNG</p>
          </div>
        </el-form-item>

        <el-button
          @click="submitForm('onePartForm', '1')"
          :loading="loadingOnePart"
          class="to-bottom-right width80px mt30"
          type="primary">下一步</el-button>
      </el-form>

      <!-- second step -->
      <!--
        仅第二步使用v-if，因为办公室有校验失效的问题
        第一步、第三步使用v-show，因为相关事件失效了
      -->
      <el-form
        v-if="activityTab === 2"
        :model="twoPartForm"
        :rules="twoPartFormRule"
        :inline="true"
        ref="twoPartForm">
        <!-- 办公室 -->
        <div>
          <el-row>
            <el-col :span="4">
              <el-form-item prop="attendNum">
                <h3 class="text-title second-form-title">参与人数</h3>
                <el-input v-model.trim="twoPartForm.attendNum" placeholder="请输入最大允许参与人数" :maxlength="6"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="winningTimes">
                <h3 class="text-title second-form-title">每人最大允许中奖数</h3>
                <el-input v-model.trim="twoPartForm.winningTimes" placeholder="请输入每人最大允许中奖数" :maxlength="6"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="4">
              <el-form-item prop="originalTimes">
                <h3 class="text-title second-form-title">初始抽奖次数</h3>
                <el-input v-model.trim="twoPartForm.originalTimes" placeholder="请输入初始可抽奖次数" :maxlength="6"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="shareAddTimes">
                <h3 class="text-title second-form-title">分享成功后额外抽奖次数</h3>
                <el-input v-model.trim="twoPartForm.shareAddTimes" placeholder="请输入分享成功后额外抽奖次数" :maxlength="6"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <!--奖品列表-->
          <div class="prize-list">
            <h3 class="prize-title">奖品列表</h3>
            <el-table
              :data="prizeList"
              v-loading="orderLoading"
              style="width: 500px; margin-bottom: 22px;">
              <el-table-column label="奖品" prop="prizeName"></el-table-column>
              <el-table-column label="类型" prop="type">
                <template slot-scope="scope">
                  <span v-if="scope.row.type === 1">优惠券</span>
                  <span v-if="scope.row.type === 2">微信红包</span>
                </template>
              </el-table-column>
              <el-table-column label="数量" prop="quantity">
                <template slot-scope="scope">
                  <!--<span v-if="!isEditFee">{{ scope.row.actualPrice }}</span>-->
                  <el-input
                    :maxlength="8"
                    v-model="scope.row.quantity"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="中奖概率 （%）" prop="probability">
                <template slot-scope="scope">
                  <!--<span v-if="!isEditFee">{{ scope.row.actualPrice }}</span>-->
                  <el-input
                    :maxlength="8"
                    v-model="scope.row.probability"
                  ></el-input>
                </template>
              </el-table-column>
            </el-table>
          </div>


          <h3 class="text-title">租金是多少？</h3>
          <el-form-item prop="price">
            <el-input
              v-model.trim="twoPartForm.price"
              placeholder="请输入租金"
              class="width160px"
              :maxlength="6"
              clearable></el-input>
            <span class="theme-light-gray ml10">元/月</span>
          </el-form-item>
        </div>


        <el-button
          @click="submitForm('twoPartForm', '2')"
          class="to-bottom-right width80px mt30"
          :loading="loadingTwoPart"
          type="primary">继 续</el-button>
        <el-button plain class="ml12" @click="toPrev(1)">上一步</el-button>
      </el-form>

      <!-- third step -->
      <el-form
        v-show="activityTab === 3"
        :model="threePartForm"
        :rules="threePartFormRule"
        ref="threePartForm">

        <h3 class="text-title mt0">为场地上传一些好看的照片</h3>
        <el-form-item label="展示图" label-width="54px">
          <lh-upload
            :imgsArr="threePartForm.imgs"
            :imgsLenght="imgsLenght"
            :size="128" />
        </el-form-item>

        <h3 class="text-title no-required mt30">场地的简短描述和使用须知</h3>
        <el-row class="limit-words-box">
          <div class="limit-words-in">
            <div class="limit-words theme-gray">{{ editor1TextLength }}/{{ quillLenght }}</div>
          </div>

          <el-form-item label="场地描述" label-width="68px">
            <div class="editor-container quill-editor-box">
              <quill-editor
                v-model.trim="threePartForm.facilitiesAndServices"
                ref="myQuillEditor1"
                :options="editorOption1"
                @change="onTextChange1($event)" />
            </div>
          </el-form-item>
        </el-row>

        <!-- <h3 class="text-title no-required mt48">使用须知</h3> -->
        <el-row class="limit-words-box mt4">
          <div class="limit-words-in">
            <div class="limit-words theme-gray">{{ editor2TextLength }}/{{ quillLenght }}</div>
          </div>

          <el-form-item label="使用须知" label-width="68px">
            <div class="editor-container quill-editor-box">
              <quill-editor
                v-model.trim="threePartForm.instructionsForUse"
                ref="myQuillEditor2"
                :options="editorOption1"
                @change="onTextChange2($event)" />
            </div>
          </el-form-item>
        </el-row>

        <h3 class="text-title no-required mt43">最后一步，留下场地负责人的联系方式</h3>
        <el-row>
          <el-col :span="8">
            <el-form-item label="联系人" prop="contactName" label-width="91px">
              <el-input
                v-model.trim="threePartForm.contactName"
                placeholder="请输入姓名"
                class="width160px"
                :maxlength="20"
                clearable></el-input>
            </el-form-item>
          </el-col>

          <!-- @#issue有空拿到公共可复用的界面去 -->
          <el-col :span="16">
            <el-form-item class="is-required lh-input-group" label="联系电话">
              <el-select
                v-model="threePartForm.telLineSelected"
                @change="threePartForm.contactTel = ''"
                class="left-select fl"
                placeholder="请选择联系方式">
                <el-option label="手机" value="0"></el-option>
                <el-option label="固定" value="1"></el-option>
              </el-select>

              <el-form-item prop="contactTel" class="fl dib">
                <el-input
                  v-if="threePartForm.telLineSelected === '0'"
                  v-model.trim="threePartForm.contactTel"
                  :maxlength="11"
                  class="right-input"
                  placeholder="请输入联系方式"
                  clearable></el-input>

                <el-input
                  v-else
                  v-model.trim="threePartForm.contactTel"
                  :maxlength="12"
                  class="right-input"
                  placeholder="请输入联系方式"
                  clearable></el-input>
              </el-form-item>
              <span v-if="threePartForm.telLineSelected === '1'" class="theme-light-gray fl dib ml12">包括区号、电话、分机号，以 “-” 隔开</span>
            </el-form-item>
          </el-col>
        </el-row>

        <h3 class="text-title no-required mt27">完成场地创建后，可以在场地列表查看并调整场地的日程</h3>
        <!-- 发布成功之后，到成功页看到对应的开放状态，勾选则开放 -->
        <el-form-item>
          <el-checkbox v-model="threePartForm.isEffect" label="马上生效" border></el-checkbox>
        </el-form-item>

        <div class="mt64">
          <el-button
            @click="submitForm('threePartForm', '3')"
            :loading="loadingThreePart"
            class="to-bottom-right width80px"
            type="primary">保 存</el-button>
          <el-button plain class="ml12" @click="toPrev(2)">上一步</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import addMixins from './com.mixins'
import { pickerOptions1 } from '@/mixins/head/data-picker'
import upload from '@/components/upload'
import pageTab from './components/page-tab'
import commonMixins from './common.mixins'
import { quillEditor } from 'vue-quill-editor'
import { getEndStartTime, deepCopyObj } from '@/config/utils'
import { fieldDetail } from '@/service'

export default {
  mixins: [addMixins, commonMixins],
  components: {
    quillEditor,
    [pageTab.name]: pageTab,
    [upload.name]: upload
  },
  data () {
    return {
      fieldId: this.$route.query.fieldId || sessionStorage.getItem('addFieldFirstStep'),
      type: this.$route.query.type,
      addStep: this.$route.query.addStep + '',
      titleName: '',
      pickerOptions1,
      orderSortDate: {
        disabledDate(time) {
          // return (time.getTime() < Date.now() - 3600 * 1000 * 24)
          return time.getTime() < Date.now()
        }
      }, // 日期选择范围
      uploadText: false // 上传图片提示文字
    }
  },
  watch: {
    'twoPartForm.timeType': function(val, oldVal) {
      // console.log('timeType', val, oldVal, this.hoursList);
      if (val === 'hour') {
        this.hoursList = this.todayList
      } else {
        this.hoursList = this.monthList
      }
    }
  },
  mounted() {
    // 渲染页面权重更高
    this.renderPage()
    // 设置标题之后，里面去填充页面内容
    this.setPageTitle()
  },
  methods: {
    /**
     * 提交表单
     */
    addPartOne(ajaxParams) {
      this.loadingOnePart = true

      const onePartForm = this.onePartForm
      ajaxParams.fieldName = onePartForm.fieldName
      ajaxParams.area = onePartForm.area
      ajaxParams.equipments = this.equipmentsList.map((i) => {
        if (i.checked) return i.id
      })

      if (this.onePartForm.type === '3' || this.onePartForm.type === '5') {
        ajaxParams.stationNum = onePartForm.stationNum
      } else {
        ajaxParams.maxAdmissibleNum = onePartForm.maxAdmissibleNum
      }

      this.dataFinishInterface(ajaxParams).then(res => {
        if (res.status === 'true') {
          if (this.addEditType) {
            this.setMsg('success', '更新成功')
          } else {
            this.setMsg('success', '完成场地新增第一步')
          }
          this.tabSwitch = 2         // add field 打开第三道门
          this.activityTab = 2       // 切换到第二道门
          this.loadingOnePart = false

          let resInfo = res.info
          this.fieldId = resInfo.id // 保存新增id
          this.dataFinishPercent = resInfo.dataFinishPercent

          // if (!this.addEditType && !this.$route.query.addStep) {
          //   this.$router.replace({
          //     path: '/field/com',
          //     query: {
          //       fieldId: this.fieldId,
          //       addStep: 2
          //     }
          //   })
          // }
        } else {
          this.setMsg('error', res.msg)
          this.loadingOnePart = false
        }
      })
    },
    addPartTwo(ajaxParams) {
      if (this.onePartForm.type === '5') {
        let twoPartForm = this.twoPartForm
        ajaxParams.startUseTime = twoPartForm.startUseTime
        ajaxParams.minRentMonth = twoPartForm.minRentMonth
        ajaxParams.price = twoPartForm.price
      } else {
        let twoPartForm = this.twoPartForm
        this.loadingTwoPart = true

        // 整周和工作日是同一个字段
        ajaxParams.appointmentTimeType = twoPartForm.appointmentTimeType
        ajaxParams.canUsePoint = twoPartForm.canUsePoint ? twoPartForm.canUsePoint : 0
        ajaxParams.canUseCoupon = twoPartForm.canUseCoupon ? twoPartForm.canUseCoupon : 0
        ajaxParams.cancel = (twoPartForm.type === '2') ? 0 : 1
        ajaxParams.payType = twoPartForm.payType

        /**
         * appointmentTimeType为1时 workState必须传 1
         * 整周，默认营业，且不可修改
         */
        // console.log('this.openData', this.openData);
        ajaxParams.workState = this.openData[0].status
        // 如果没有workState，不需要传workPriceDetailParam
        if (ajaxParams.workState) {
          // @#注意：工位和会议室的参数不一样
          if (this.onePartForm.type !== '3') {
            let obj = {
              price: this.openData[0].price
            }
            obj.startTime = this.openData[0].startTime
            obj.endTime = this.openData[0].endTime
            ajaxParams.workPriceDetailParam = []
            ajaxParams.workPriceDetailParam.push(obj)
            // console.log('ajaxParams.workPriceDetailParam', ajaxParams.workPriceDetailParam);
          } else {
            ajaxParams.workPrice = this.openData[0].price
          }
        }

        if (this.twoPartForm.appointmentTimeType !== 1) {
          ajaxParams.restState = this.openData[1].status

          // 如果没有 restState ，不需要传 restPriceDetailParam
          if (ajaxParams.restState) {
            // @#注意：工位和会议室的参数不一样
            if (this.onePartForm.type !== '3') {
              let obj = {
                price: this.openData[1].price
              }
              obj.startTime = this.openData[1].startTime
              obj.endTime = this.openData[1].endTime
              ajaxParams.restPriceDetailParam = []
              ajaxParams.restPriceDetailParam.push(obj)
              // console.log('ajaxParams.restPriceDetailParam', ajaxParams.restPriceDetailParam);
            } else {
              ajaxParams.restPrice = this.openData[1].price
            }
          }
        }

        // 如果不允许取消，就不传取消规则的参数
        if (twoPartForm.type !== '2') {
          ajaxParams.cancelBeforeTime = twoPartForm.cancelBeforeTime
          ajaxParams.cancelBeforeUnit = (twoPartForm.timeType === 'today') ? 'D' : 'H'
        }
        // 如果收费标准有一个为0，则禁止微信支付
        if (this.disabledweixinPay) {
          ajaxParams.payType = [twoPartForm.payType[0]]
        }
      }

      // console.log('ajaxParams', ajaxParams);
      this.dataFinishInterface(ajaxParams).then(res => {
        if (res.status === 'true') {
          if (this.addEditType === 1) {
            this.setMsg('success', '更新成功')
          } else {
            this.setMsg('success', '完成场地新增第二步')
          }

          // @#注意：需要刷新备份的数据
          this.deepCopy()

          this.tabSwitch = 3      // add field 打开第三道门
          this.activityTab = 3 // 切换到第二道门
          this.loadingTwoPart = false

          // if (!this.addEditType && !this.$route.query.addStep) {
          //   this.$router.replace({
          //     path: '/field/com',
          //     query: {
          //       fieldId: this.fieldId,
          //       addStep: 3
          //     }
          //   })
          // }
        } else {
          this.setMsg('error', res.msg)
          this.loadingTwoPart = false
        }
      })
    },
    // 监听第二步是否有修改
    monitorTwoPart() {
      // console.log('monitor', this.openDataMonitor); // this.twoPartMonitor, this.openDataMonitor
      // console.log('原生', this.openData); // this.twoPartForm, this.openData

      this.twoPartStatus = false
      for (let key of Object.keys(this.twoPartMonitor)) {
        if (typeof this.twoPartMonitor[key] !== 'object') {
          // console.log(`string-${key}`, this.twoPartForm[key], this.twoPartMonitor[key]);

          if (this.twoPartForm[key] !== this.twoPartMonitor[key]) {
            // console.log('key1', key);
            this.twoPartStatus = true
            return
          }
        } else {
          // console.log(`object-${key}`, this.twoPartForm[key], this.twoPartMonitor[key]);

          if (this.twoPartForm[key].length !== this.twoPartMonitor[key].length) {
            // console.log('key2', key);
            this.twoPartStatus = true
            return
          }
        }
      }

      // 找到对应的idx
      this.openData.forEach((item, idx) => {
        for (let list of Object.keys(item)) {
          // console.log('----', this.openDataMonitor[idx][list], item[list])

          if (item[list] !== this.openDataMonitor[idx][list]) {
            // console.log('list', list);
            this.twoPartStatus = true
            return
          }
        }
      })
    },
    addPartThree(ajaxParams) {
      if (!this.validateImgs()) return

      this.loadingThreePart = true

      let threePartForm = this.threePartForm
      ajaxParams.contactName = threePartForm.contactName
      ajaxParams.contactTel = threePartForm.contactTel
      ajaxParams.facilitiesAndServices = threePartForm.facilitiesAndServices
      ajaxParams.instructionsForUse = threePartForm.instructionsForUse
      ajaxParams.mainImg = threePartForm.mainImg
      ajaxParams.isEffect = threePartForm.isEffect ? 1 : 0
      ajaxParams.imgs = threePartForm.imgs.map((item) => {
        if (item.img) return item.img
      })

      this.dataFinishInterface(ajaxParams).then(res => {
        if (res.status === 'true') {
          if (this.fieldId) {
            this.setMsg('success', '保存成功')
          }
          this.loadingThreePart = false

          /**
           * 没有100%添加成功的场地，比如，添加了第一步，退出
           * 再进来编辑到100%，还是要跳转到发布成功页
           */
          if (this.dataFinishPercent !== 100) {
            this.$router.replace({
              path: '/field/success',
              query: {
                id: this.fieldId,
                title: this.onePartForm.fieldName,
                open: this.threePartForm.isEffect ? 1 : 0
              }
            })
          } else {
            this.$router.replace({ path: '/field/list' })
          }
        } else {
          this.setMsg('error', res.msg)
          this.loadingThreePart = false
        }
      })
    },
    submitForm(formName, step) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let ajaxParams = {
            // 如果已经添加的场地，如添加了第一步，进来编辑第一步的信息也需要传Id
            id: this.dataFinishPercent ? this.fieldId : null,
            type: this.onePartForm.type,
            storeId: this.onePartForm.storeId
          }
          switch (step) {
            case '1':
              ajaxParams.step = 1
              this.addPartOne(ajaxParams)
              if (!this.paymentList.length) {
                // paymentType().then(res => {
                //   if (res.status === 'true' && res.info) {
                //     this.paymentList = res.info
                //   }
                // })
              }
              break;
            case '3':
              ajaxParams.step = 3
              this.addPartThree(ajaxParams)
              break;
            case '2':
              // 校验预约设置
              if (this.onePartForm.type === '5') {
                ajaxParams.step = 2
                this.addPartTwo(ajaxParams)
                return
              }

              if (this.onePartForm.type !== '5' && !this.verifyReservationSetting()) return

              // 判断表单是否有改动，true为有改动，false则未改动
              // 没改动不调接口，调接口需求要关闭对外开放，所以未改动就不调用编辑接口
              if (this.dataFinishPercent === 100) {
                this.monitorTwoPart()
              }

              if (!this.twoPartStatus) {
                this.tabSwitch = 3  // add field 打开第三道门
                this.activityTab = 3 // 切换到第二道门
                this.loadingTwoPart = false
                return
              }

              // 编辑的时候，弹出确认框
              if (this.dataFinishPercent === 100) {
                const h = this.$createElement;
                this.$msgbox({
                  title: '调整确认',
                  message: h('p', null, [
                    h('p', { style: 'color: #1C1C2F' }, '当前场地对外开放中，请调整对外开放信息'),
                    h('p', { style: 'color: #868696' }, '为了保障您的利益，已停止对外开放')
                  ]),
                  type: 'warning',
                  showCancelButton: true,
                  confirmButtonText: '确认',
                  cancelButtonText: '去设置',
                  beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                      done()
                      ajaxParams.step = 2
                      this.addPartTwo(ajaxParams)
                    } else {
                      done()
                      window.open(`#/field/open/settings?id=${this.fieldId}&type=${this.onePartForm.type}`, '_blank')
                    }
                  }
                })
              } else {
                ajaxParams.step = 2
                this.addPartTwo(ajaxParams)
              }
              break;
          }
        } else {
          // return
        }
      });
    },

    /**
     * 公共部分
     */
    processStep(idx) {
      if (idx === 1) {
        return this.dataFinishPercent === 30 ? 'light-blue-step' : 'blue-step'
      }
      if (idx === 2) {
        return this.dataFinishPercent === 30 ? 'bgcfff' : 'light-blue-step'
      }
    },
    getStoreList(visible) {
      // 新增场地visible等于undefined，或者在触发选择框的时候，刷新门店列表
      // 因为旁边有个新增门店的功能
      if (visible === undefined || visible) {
        // findAllStore().then(res => {
        //   if (res.status === 'true') {
        //     this.storeList = res.info
        //     /* 新增场地，默认为读取门店列表的第一个场地 */
        //     if (!this.onePartForm.storeId) {
        //       this.onePartForm.storeId = this.storeList[0].id
        //       this.showStoreAddr()
        //     }
        //   }
        // })
      }
    },
    // 选择门店之后，旁边显示对应的地址
    showStoreAddr() {
      for (var item of this.storeList) {
        if (this.onePartForm.storeId) {
          if (this.onePartForm.storeId === item.id) {
            this.onePartForm.storeAddr = item.provinceName + item.cityName + item.districtName + item.address
          }
        } else {
          if (this.onePartForm.storeId === item.id) {
            this.onePartForm.storeAddr = item.provinceName + item.cityName + item.districtName + item.address
          }
        }
      }
      // console.log('showStoreAddr', id, this.onePartForm.storeAddr);
    },
    renderPage() {
      /**
       * 渲染前，需要请求的接口数据
       * 像这种请求列表的接口，不用考虑失败情况
       */
      // equipmentList({ fieldId: this.fieldId }).then(res => {
      //   if (res.status === 'true') {
      //     this.equipmentsList = res.info
      //   }
      // })

      /* 公用场地类型的数据，方便维护，避免错误 */
      this.typeList = (this.typeList.length === 5) ? this.typeList.splice(1) : this.typeList
      // 默认选中，需提前取消
      this.changeRule()
    },
    setPageTitle() {
      let titleName

      // 拿到门店列表
      this.getStoreList()
      if (!this.fieldId) {
        titleName = '添加活动'
        this.addEditType = 0

        // 添加场地，默认选中会议室类型
        this.onePartForm.type = '1'

        // 添加场地，使用添加接口
        // this.dataFinishInterface = fieldAddField

        // 初始化预约设置数据
        this.toggleWeek()
      } else {
        if (this.type === 'edit') {
          titleName = '编辑活动'
        } else {
          titleName = '复制活动'
        }
        this.addEditType = 1
        this.getPageData()
      }

      this.titleName = titleName
      document.title = titleName
    },
    // 返回上一页，tab值切换
    toPrev(val) {
      this.activityTab = val
    },
    toggleTab(val) {
      this.activityTab = val

      /* 分步的数据，隐藏的部分应该在步骤内时再请求 */
      if (val === 2 && !this.paymentList.length) {
        // paymentType().then(res => {
        //   if (res.status === 'true' && res.info) {
        //     this.paymentList = res.info
        //   }
        // })
      }
    },
    // 把预约设置接口数据结构 转成自己需要的结构
    // 因为区分工作日可以手动切换，所以用openWeek 和 openPeriod保存起来，但提交表单的时候不用区分
    turnOpenData(ajaxData) {
      // console.log('ajaxData', ajaxData);

      // 如果添加场地第一步刷新，第二步的数据都是空的
      // 所以读取的时候，直接拿新增的数据
      if (ajaxData.appointmentTimeType) {
        // 工作日，包含整周
        if (ajaxData.appointmentTimeType === 1) {
          // console.log('1-------');
          // @#注意：整周默认营业
          let obj = [{
            status: ajaxData.workState || 0,
            price: ajaxData.workPriceDetailList[0].price
          }]

          // console.log('1');
          obj[0].startTime = ajaxData.workPriceDetailList[0].startTime
          obj[0].endStartTime = ajaxData.workPriceDetailList[0].startTime
          obj[0].endTime = ajaxData.workPriceDetailList[0].endTime

          this.openWeek = obj
        } else {
          // console.log('4');
          // console.log('2-------', ajaxData.workPriceDetailList[0].price);
          // 工作日，包含整周
          this.openPeriod[0].status = ajaxData.workState || 0

          if (ajaxData.workState) {
            this.openPeriod[0].price = ajaxData.workPriceDetailList[0].price
            this.openPeriod[0].startTime = ajaxData.workPriceDetailList[0].startTime
            this.openPeriod[0].endStartTime = ajaxData.workPriceDetailList[0].startTime
            this.openPeriod[0].endTime = ajaxData.workPriceDetailList[0].endTime
          }

          // 非工作日
          // 把null设置成0
          this.openPeriod[1].status = ajaxData.restState || 0
          if (ajaxData.restState) {
            this.openPeriod[1].price = ajaxData.restPriceDetailList[0].price
            this.openPeriod[1].startTime = ajaxData.restPriceDetailList[0].startTime
            this.openPeriod[1].endStartTime = ajaxData.restPriceDetailList[0].startTime
            this.openPeriod[1].endTime = ajaxData.restPriceDetailList[0].endTime
          }
        }
      }
    },
    // 备份，判断表单是否有改动
    deepCopy() {
      this.twoPartMonitor = deepCopyObj(this.twoPartForm)
      this.openDataMonitor = deepCopyObj(this.openData)
    },
    // 切换，区分工作日和非工作日
    toggleWeek() {
      if (this.twoPartForm.appointmentTimeType === 1) {
        this.openData = [...this.openWeek]
      } else {
        this.openData = [...this.openPeriod]
      }
      // 每次切换的时候，清空禁止微信支付
      this.disabledweixinPay = false

      // console.log('openData', this.twoPartForm.appointmentTimeType, this.openData, this.openWeek, this.openPeriod);
    },
    getPageData() {
      fieldDetail({ fieldId: this.fieldId }).then(res => {
        if (res.status === 'true') {
          let resInfo = res.info
          let fieldData = resInfo.field

          // 信息完整度100%之后调用编辑接口，否则 调用添加接口
          this.dataFinishPercent = fieldData.dataFinishPercent
          // this.dataFinishInterface = (fieldData.dataFinishPercent === 100) ? fieldEditField : fieldAddField

          // 如果不是编辑状态，都要设置成添加状态
          this.addEditType = (fieldData.dataFinishPercent === 100) ? 1 : 0

          this.onePartForm = {
            type: fieldData.type + '',
            storeId: fieldData.storeId,
            fieldName: fieldData.fieldName,
            maxAdmissibleNum: resInfo.fieldMeeting ? resInfo.fieldMeeting.maxAdmissibleNum || '' : (resInfo.fieldRoadshowHall ? resInfo.fieldRoadshowHall.maxAdmissibleNum || '' : (resInfo.fieldOther ? resInfo.fieldOther.maxAdmissibleNum : '')),
            area: fieldData.area
          }
          // 显示门店地址信息
          this.showStoreAddr()

          let twoPartForm = {
            appointmentTimeType: fieldData.appointmentTimeType || 2,
            cancelBeforeTime: fieldData.cancelBeforeTime || 3,
            timeType: (fieldData.cancelBeforeUnit === 'H') ? 'hour' : 'today',
            type: (fieldData.cancel !== 0) ? '1' : '2',
            canUseCoupon: fieldData.canUseCoupon,
            canUsePoint: fieldData.canUsePoint,
            payType: resInfo.paymentTypeList
          }

          if (this.onePartForm.type === '5') {
            let fieldOffice = resInfo.fieldOffice
            twoPartForm.startUseTime = fieldOffice.startUseTime || ''
            twoPartForm.minRentMonth = fieldOffice.stationNum || ''
            twoPartForm.price = fieldOffice.price || ''
          }
          this.twoPartForm = twoPartForm

          switch (this.onePartForm.type) {
            case '1':
              this.turnOpenData(resInfo.fieldMeeting)
              break;
            case '2':
              this.turnOpenData(resInfo.fieldRoadshowHall)
              break;
            case '4':
              this.turnOpenData(resInfo.fieldOther)
              break;
            case '5':
              this.onePartForm.stationNum = resInfo.fieldOffice.stationNum
              break;
            case '3':
              this.onePartForm.stationNum = resInfo.fieldStation.stationNum

              if (this.twoPartForm.appointmentTimeType === 1) {
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
              break;
          }
          // 拼接预约设置的数据
          this.toggleWeek()

          // 备份，判断表单是否有改动
          // @#注意：深拷贝
          this.deepCopy()
          // console.log('monitor', this.twoPartMonitor, this.openDataMonitor);

          this.threePartForm = {
            contactName: fieldData.contactName || '',
            contactTel: fieldData.contactTel || '',
            telLineSelected: (fieldData.contactTel && fieldData.contactTel.length > 11) ? '1' : '0',
            facilitiesAndServices: fieldData.facilitiesAndServices,
            instructionsForUse: fieldData.instructionsForUse,
            isEffect: fieldData.status === 10,
            imgs: !resInfo.fieldImgs.length ? [{}] : resInfo.fieldImgs.map(img => ({ img: img.img, mainImg: img.mainImg }))
          }

          if (this.dataFinishPercent === 30) {
            this.tabSwitch = 2 // add field 打开第二道门
          } else if (this.dataFinishPercent === 70) {
            this.tabSwitch = 3 // add field 打开第三道门
          }
        }
      })
    },
    /**
     * part 1
     * */
    dateChange (val) {
      console.log('val', val)
    },
    /**
     * part 2
     * 当不允许取消切换到允许取消，时间设置默认值
     */
    // 同时选择休息时，禁止选择，弹出提示：不能歇业
    handleOpen(idx) {
      if (!this.openData[0].status && !this.openData[1].status) {
        this.openData[idx].status = 1
        this.setMsg('至少需要选中一个营业的日期')
      }
    },
    changeRule() {
      if (this.twoPartForm.type === '1') {
        this.twoPartForm.timeType = 'hour'
        this.changeTimeUnit()
      }
    },
    /**
     * 在有支付方式的情况下，办公室特殊，是没有的
     * 是否可以微信支付：场地费用有0出现的时候就禁用微信支付
     * 切换和修改场地费用的时候，都要重置一次：场地类型、区分工作日、3个费用输入框值的改动
     * 考虑新增和读取的交互
     */
    setWeixinPay() {
      if (this.twoPartForm.appointmentTimeType === 1) {
        this.disabledweixinPay = (this.openWeek[0].price === '0')
      } else {
        this.disabledweixinPay = ((this.openPeriod[0].price === '0') || (this.openPeriod[1].price === '0'))
      }

      let hasWeixinPay = 10
      for (let item of this.paymentList) {
        if (item.name === 20) {
          hasWeixinPay = 20
          break;
        }
      }
      // 如果不包含微信支付，就不展示微信支付相关提示
      if (hasWeixinPay === 10) {
        this.disabledweixinPay = false
      }
      // console.log('test', this.disabledweixinPay);
    },
    changeTimeUnit() {
      // 切换日期单位的时候，默认选中第一个
      this.twoPartForm.cancelBeforeTime = (this.twoPartForm.timeType === 'hour') ? '3' : '1'
    },
    // 需要区分工作日和非工作日
    changeStartTime(idx) {
      this.openData[idx].endTime = null
      this.openData[idx].endStartTime = getEndStartTime(this.openData[idx].startTime)

      // 调整开始时间就清空结束时间
    },

    /**
     * part 3
     */
    onTextChange1(editor) {
      // 针对只是列表的可以满足需求，但是复杂就不好做字数限制了
      let formartObject
      formartObject = this.$refs.myQuillEditor1.quill.getFormat(0, this.$refs.myQuillEditor1.quill.getLength())
      this.editor1TextLength = this.$refs.myQuillEditor1.quill.getLength() - 1

      // console.log('text-change111', this.$refs.myQuillEditor1.quill.getLength())
      if (this.$refs.myQuillEditor1.quill.getLength() > this.quillLenght + 1) {
        this.$refs.myQuillEditor1.quill.setText(this.$refs.myQuillEditor1.quill.getText().substring(0, this.quillLenght))
        this.$refs.myQuillEditor1.quill.formatText(0, this.$refs.myQuillEditor1.quill.getLength(), formartObject)
      }
      // console.log('text-change111', this.$refs.myQuillEditor1.quill.getLength())
    },
    onTextChange2(editor1) {
      let formartObject
      formartObject = this.$refs.myQuillEditor2.quill.getFormat(0, this.$refs.myQuillEditor2.quill.getLength())
      this.editor2TextLength = this.$refs.myQuillEditor2.quill.getLength() - 1

      if (this.$refs.myQuillEditor2.quill.getLength() > this.quillLenght + 1) {
        this.$refs.myQuillEditor2.quill.setText(this.$refs.myQuillEditor2.quill.getText().substring(0, this.quillLenght))
        this.$refs.myQuillEditor2.quill.formatText(0, this.$refs.myQuillEditor2.quill.getLength(), formartObject)
      }
    }
  }
}
</script>

<style lang="scss">
.page-activity-com {

  .field-name {
    float: left;
    max-width: 66%;
    height: 29px;
  }
  .qr-box-more {
    .el-dialog__body {
      padding: 15px 20px 20px !important;
    }
    .el-dialog--tiny {
      width: 298px;
      border-radius: 4px !important;
    }
    .qr-box {
      width: 258px;
      margin: 0 auto;

      img {
        width: 100%;
      }
      p {
        height: 36px;
        line-height: 36px;
        text-align: center;
        color: #fff;
        background-color: #5E80E5;
      }
    }
    .call-back {
      text-align: center;
    }
  }
  .el-input-group__append,
  .el-input-group__prepend {
    width: 60px;
  }
  .el-form-item__label {
    text-align: left;
  }
}
</style>
<style lang="scss" scoped>
/*@import "src/styles/variables";*/
.page-activity-com {
  .line-wrap {
    display: inline-block;
    width: 75px !important;
  }
  .icon-url {
    display: inline-block;
    width: 20px;
    height: 20px;
    margin: -3px 0 0 5px;
    vertical-align: middle;
  }

  .width30 {
    width: 30px;
    height: 1px;
  }
  .set-main-img {
    clear: both;
    overflow: hidden;

    li {
      float: left;
      width: 148px;
      margin: 0 8px 8px 0;
      text-align: center;
    }
  }
  .activity-name {
    width: 425px;
  }
  .date-text-wrapper {
  }
  .date-warnning {
    margin-top: 7px;
  }
  .upload-text-icon {
    cursor: pointer;
  }
  .warnning-text {
    font-size: 12px;
    color: rgb(140, 140, 140);
    margin-top: 8px;
    margin-left: 6px;
  }
  .banner-format {
    margin-left: 132px;
    margin-top: -10px;
  }
  .step-one-title {
    font-weight: 500;
    font-size: 18px;
    margin-bottom: 15px;
  }
  .second-form-title {
    margin-top: 0;
    margin-bottom: 4px;
    font-size: 14px;
    /*width: 30%;*/
  }
}
</style>
