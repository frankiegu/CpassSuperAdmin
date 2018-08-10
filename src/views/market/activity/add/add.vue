<template>
  <div class="page-activity-com">
    <lh-title :title="titleName" :noBorder="true"></lh-title>

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
          <!--<el-input-->
            <!--type="textarea"-->
            <!--resize="none"-->
            <!--class="activity-name fl"-->
            <!--v-model.trim="onePartForm.activityRules"-->
            <!--:maxlength="200"-->
            <!--:rows="7"-->
            <!--placeholder="请填写活动规则"-->
          <!--&gt;</el-input>-->
          <!--<div class="limit-words-in">-->
            <!--<div class="limit-words theme-gray">{{ editor1TextLength }}/{{ 200 }}</div>-->
          <!--</div>-->
            <div class="editor-container quill-editor-box">
              <quill-editor
                v-model.trim="onePartForm.activityRules"
                ref="myQuillEditor1"
                :options="editorOption1"
                @change="onTextChange1($event)"></quill-editor>
            </div>

          <span class="theme-gray fl rules-length">（{{editor1TextLength}}/200）限制字数200</span></el-form-item>

        <el-form-item prop="activityType" label="活动类型" label-width="120px" class="mt40">
          <template>
            <el-radio class="mt10" v-model="onePartForm.activityType" label="1" :disabled="true">普通活动</el-radio>
            <el-radio class="mt10" v-model="onePartForm.activityType" label="2">互动游戏</el-radio>
          </template>
        </el-form-item>

        <el-form-item prop="activityType" label="活动模板" label-width="120px" class="mt40" v-if="onePartForm.activityType === '2'">
          <template>
            <!--活动模板 1砸金蛋 2领红包-->
            <el-radio class="mt10" v-model="onePartForm.activityTemplate" label="1" :disabled="type === 'edit' || type === 'copy'">砸金蛋</el-radio>
            <el-radio class="mt10" v-model="onePartForm.activityTemplate" label="2" :disabled="type === 'edit' || type === 'copy'">领红包</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="活动有效期" label-width="120px" prop="rangeDate" class="mt40">
          <div>
            <el-date-picker
              class="width340px"
              v-model="onePartForm.rangeDate"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
              @change="dateChange"
              :clearable="false"
              :picker-options="orderSortDate"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              placeholder="选择日期"
              type="datetimerange"
              :default-time="['00:00:00', '23:59:59']"
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
        v-show="activityTab === 2"
        :model="twoPartForm"
        :rules="twoPartFormRule"
        :inline="true"
        ref="twoPartForm">
        <div>
          <el-row>
            <el-col :span="4" style="min-width: 240px;">
              <el-form-item prop="attendNum">
                <h3 class="text-title second-form-title">参与人数</h3>
                <el-input class="width220px" v-model.trim="twoPartForm.attendNum" placeholder="请输入最大允许参与人数" :maxlength="6"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="winningTimes">
                <h3 class="text-title second-form-title">每人最大允许中奖数</h3>
                <el-input class="width220px" :maxlength="3" v-model.trim="twoPartForm.winningTimes" placeholder="请输入每人最大允许中奖数"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="4" style="min-width: 240px;">
              <el-form-item prop="originalTimes">
                <h3 class="text-title second-form-title">初始抽奖次数</h3>
                <el-input class="width220px" v-model.trim="twoPartForm.originalTimes" placeholder="请输入初始可抽奖次数" :maxlength="3"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="shareAddTimes">
                <h3 class="text-title second-form-title">分享成功后额外抽奖次数</h3>
                <el-input class="width220px" v-model.trim="twoPartForm.shareAddTimes" placeholder="请输入分享成功后额外抽奖次数" :maxlength="3"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <!--奖品列表-->
          <div class="prize-list">
            <h3 class="step-one-title mt36">奖品列表</h3>
            <el-table
              :data="prizeList"
              v-loading="orderLoading"
              :rules="prizeTableRules"
              style="width: 1000px; margin-bottom: 22px;">
              <el-table-column label="奖品" prop="prizeName" width="200px"></el-table-column>
              <el-table-column label="类型" prop="type">
                <template slot-scope="scope">
                  <span v-if="scope.row.type === 1">优惠券</span>
                  <span v-if="scope.row.type === 2">微信红包</span>
                </template>
              </el-table-column>
              <el-table-column label="数量" prop="quantity" width="260px">
                <template slot-scope="scope">
                  <!--<span v-if="!isEditFee">{{ scope.row.actualPrice }}</span>-->
                  <el-input
                    :maxlength="4"
                    :autofocus="true"
                    :disabled="scope.row.disabled"
                    v-model.trim="scope.row.quantity"
                    @input.native="handleInputQuantity(scope.row.quantity, scope.row.id, scope.row.type, scope.row.maxQuantity)"
                  ></el-input>
                  <div v-if="scope.row.validate">
                    <i class="el-icon-warning fl theme-red upload-text-icon mt4"></i>
                    <span class="prize-warnning fl ml4">{{scope.row.prizeQuantityWarning}}</span>
                  </div>
                  <div v-if="scope.row.probabilityValidate">
                    <i class="el-icon-warning fl theme-red upload-text-icon mt4" style="opacity: 0;"></i>
                    <span class="prize-warnning fl ml4" style="opacity: 0;">{{scope.row.prizeProbabilityWarning}}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="中奖概率 （%）" prop="probability" width="260px">
                <template slot-scope="scope">
                  <!--<span v-if="!isEditFee">{{ scope.row.actualPrice }}</span>-->
                  <!--:maxlength="scope.row.probability.indexOf('.') < 0 && scope.row.probability.length > 3 ? 3 : 4"-->
                  <el-input
                    :autofocus="true"
                    :maxlength="scope.row.maxLength"
                    v-model.trim="scope.row.probability"
                    @input.native="handleInputProbability(scope.row.probability, scope.row.id)"
                  ></el-input>
                  <div v-if="scope.row.probabilityValidate">
                    <i class="el-icon-warning fl theme-red upload-text-icon mt4"></i>
                    <span class="prize-warnning fl ml4">{{scope.row.prizeProbabilityWarning}}</span>
                  </div>
                  <div v-if="scope.row.validate">
                    <i class="el-icon-warning fl theme-red upload-text-icon mt4" style="opacity: 0;"></i>
                    <span class="prize-warnning fl ml4" style="opacity: 0;">{{scope.row.prizeQuantityWarning}}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <span style="cursor: pointer;" @click="deletePrize(scope.row.index)">删除</span>
                </template>
              </el-table-column>
            </el-table>
            <el-button class="fl" type="primary" icon="el-icon-circle-plus" plain @click="addPrize">添加奖品</el-button>
          </div>
          <el-form-item></el-form-item>
        </div>

        <el-button plain class="ml12" @click="toPrev(1)">上一步</el-button>
        <el-button
          @click="submitForm('twoPartForm', '2')"
          class="to-bottom-right width80px mt30"
          :loading="loadingTwoPart"
          type="primary">下一步</el-button>
        <!--添加奖品弹窗-->
        <el-dialog
          title="添加奖品"
          width="30%"
          :visible.sync="dialogVisible"
          v-if="dialogVisible"
          class="set-dialog">

          <!--一下均可以由用户更改-->
          <el-form
            :model="addPrizeForm"
            label-width="100px"
            ref="addPrizeForm"
            :inline="false"
            :rules="addPrizeFormRule">
            <el-form-item label="奖品类型" prop="addPrizeType" style="width: 100%">
              <template>
                <el-radio class="mt10 add-prize-info" v-model="addPrizeForm.addPrizeType" label="1" :disabled="onePartForm.activityTemplate === '2'">优惠券</el-radio>
                <el-radio class="mt10" v-model="addPrizeForm.addPrizeType" label="2">微信红包</el-radio>
              </template>
            </el-form-item>
            <!--微信红包-->
            <div v-if="addPrizeForm.showRedEnvelope || onePartForm.activityTemplate === '2'">
              <el-form-item style="width: 100%" label="红包类型" prop="redEnvelopeType">
                <template>
                  <el-radio class="mt10 add-prize-info" v-model="addPrizeForm.redEnvelopeType" label="1">普通红包</el-radio>
                </template>
              </el-form-item>
              <!--红包金额-->
              <el-form-item style="width: 100%" label="红包金额" class="red-envelope" prop="redEnvelopeAmount">
                <el-input v-model="addPrizeForm.redEnvelopeAmount" :maxlength="addPrizeForm.redEnvelopeAmount.indexOf('.') > -1 ? (addPrizeForm.redEnvelopeAmount.indexOf('.') + 3) : 3" placeholder="请输入单个红包的金额" class="width300px add-prize-info"></el-input>
              </el-form-item>
            </div>

            <!--优惠券-->
            <div v-if="!addPrizeForm.showRedEnvelope || (onePartForm.activityTemplate === '1' && !addPrizeForm.showRedEnvelope)">
              <!--选择优惠券类型-->
              <el-form-item style="width: 100%" class="choose-coupon-type" label="选择优惠券" prop="couponType">
                <el-select v-model="addPrizeForm.couponType" class="width220px add-prize-info" @change="couponTypeChange">
                  <el-option
                    v-for="(value, key) in prizeType"
                    :label="value.name"
                    :value="value.type"
                    :key="key"></el-option>
                </el-select>
              </el-form-item>

            </div>
            <!--选择优惠券-->
            <el-form-item style="width: 100%" prop="selCouponId" class="choose-coupon" v-if="!addPrizeForm.showRedEnvelope">
              <el-select v-model="addPrizeForm.selCouponId" class="width220px add-prize-info coupon-sel">
                <el-option
                  v-for="(value, key) in couponList"
                  :label="value.name"
                  :value="value.id"
                  :key="key"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item style="width: 100%" label="使用说明" class="red-envelope" prop="useInstruction">
              <el-input v-model="addPrizeForm.useInstruction" :maxlength="15" placeholder="请填写奖品的使用说明" class="width300px add-prize-info"></el-input>
            </el-form-item>

            <!--红包使用说明-->
            <!--<el-form-item v-if="addPrizeForm.showRedEnvelope" style="width: 100%" label="使用说明" class="red-envelope" prop="useInstruction">-->
              <!--<el-input v-model="addPrizeForm.redEnvelopeInstruction" :maxlength="15" placeholder="请填写奖品的使用说明" class="width300px add-prize-info"></el-input>-->
            <!--</el-form-item>-->


            <!--礼品券奖品说明-->
            <!--<el-form-item v-if="!addPrizeForm.showRedEnvelope && addPrizeForm.couponType === 3" style="width: 100%" label="奖品说明" class="red-envelope" prop="giftUseInstruction">-->
              <!--<el-input v-model="addPrizeForm.giftUseInstruction" :maxlength="5" placeholder="请填写礼品券使用说明" class="width300px add-prize-info"></el-input>-->
            <!--</el-form-item>-->

            <el-form-item style="width: 100%" label="" prop="allowRepeat">
              <el-checkbox class="add-prize-checkbox" v-model="addPrizeForm.allowRepeat">允许同一用户重复获得此奖品</el-checkbox>
            </el-form-item>
          </el-form>

          <div slot="footer" class="dialog-footer">
            <el-button type="primary" class="width80px" plain @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" class="width80px" @click="sureAddPrize">确 定</el-button>
          </div>
        </el-dialog>
      </el-form>

      <!-- third step -->
      <el-form
        v-show="activityTab === 3"
        :model="threePartForm"
        :rules="threePartFormRule"
        ref="threePartForm">
        <el-form-item label="展示端" label-width="100px" prop="displayTerminal">
          <template>
            <el-checkbox-group v-model="threePartForm.displayTerminal">
              <el-checkbox :disabled="item.disabled" :label="item.name" value="item.id" v-for="item in threePartForm.terminalList" :key="item.id"></el-checkbox>
            </el-checkbox-group>
          </template>
        </el-form-item>

        <el-form-item label="活动有效期" label-width="100px">
          <template>
            <span>{{threePartForm.activityStart?threePartForm.activityStart.substr(0, 16):''}}</span> 至 <span>{{threePartForm.activityEnd?threePartForm.activityEnd.substr(0, 16):''}}</span>
          </template>
        </el-form-item>

        <el-form-item label="显示时间" label-width="100px" prop="activityDisplayStart">
          <el-date-picker
            :clearable="false"
            v-model="threePartForm.activityDisplayStart"
            :picker-options="orderSortDate"
            default-time="00:00:00"
            placeholder="选择开始日期"
            type="datetime"
            @change="displayStart"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
            align="left"></el-date-picker>
          <i class="el-icon-warning theme-light-gray date-warnning ml10"></i>
          <span class="warnning-text display-activity">活动将在该时间自动在客户端显示</span>
        </el-form-item>

        <el-form-item label="隐藏时间" label-width="100px" prop="activityDisplayEnd">
          <el-date-picker
            :clearable="false"
            v-model="threePartForm.activityDisplayEnd"
            :picker-options="orderSortDate"
            placeholder="选择结束日期"
            @change="displayEnd"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
            default-time="23:59:59"
            type="datetime"
            align="left"></el-date-picker>
          <i class="el-icon-warning theme-light-gray date-warnning ml10"></i>
          <span class="warnning-text display-activity">活动将在该时间自动在客户端隐藏</span>
        </el-form-item>

        <div class="prompt-setting">
          <h3 class="step-one-title mt36">提示设定</h3>
          <el-form-item label="未开始提示" label-width="100px" prop="tipsBeforeStart">
            <el-input
              type="textarea"
              resize="none"
              class="activity-name fl"
              v-model="threePartForm.tipsBeforeStart"
              :maxlength="20"
              :rows="2"
              placeholder="活动尚未开始">
            </el-input>
          </el-form-item>

          <el-form-item label="结束提示" label-width="100px" prop="tipsEnd" class="mt27">
            <el-input
              type="textarea"
              resize="none"
              class="activity-name fl"
              v-model="threePartForm.tipsEnd"
              :maxlength="20"
              :rows="2"
              placeholder="活动已结束">
            </el-input>
          </el-form-item>
        </div>
        <div class="mt64">
          <el-button plain class="ml12" @click="toPrev(2)">上一步</el-button>
          <el-button
            @click="submitForm('threePartForm', '3')"
            :loading="loadingThreePart"
            class="to-bottom-right width80px"
            type="primary">
            <span v-if="!activityId">完成创建</span>
            <span v-if="activityId">保 存</span>
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import addMixins from './com.mixins'
import upload from '@/components/upload'
import pageTab from './components/page-tab'
import commonMixins from './common.mixins'
import { quillEditor } from 'vue-quill-editor'
import { deepCopyObj } from '@/config/utils'
import { platformActivityAdd, platformActivityDetail, findUsableCouponByType, platformActivityEdit } from '@/service/market'

export default {
  mixins: [addMixins, commonMixins],
  components: {
    [pageTab.name]: pageTab,
    [upload.name]: upload,
    quillEditor
  },
  data () {
    return {
      activityId: this.$route.query.id,
      type: this.$route.query.type,
      titleName: '',
      orderSortDate: {
        disabledDate(time) {
          // return (time.getTime() < Date.now() - 3600 * 1000 * 24)
          return time.getTime() < Date.now() - 3600 * 1000 * 24
        }
      }, // 日期选择范围
      uploadText: false, // 上传图片提示文字
      submitObject: {} // 创建活动提交参数对象
    }
  },
  watch: {
    dialogVisible (val) {
      if (!val) {
        this.addPrizeForm = {
          addPrizeType: '1',
          redEnvelopeType: '1',
          redEnvelopeAmount: '',
          selCouponId: '',
          couponType: 1, // 优惠券类型
          allowRepeat: false, // 是否允许重复中奖
          useInstruction: '', // 使用说明
          showRedEnvelope: this.onePartForm.activityTemplate === '2'
        }
        if (this.onePartForm.activityTemplate === '2') this.addPrizeForm.addPrizeType = '2'
      }
    },
    'onePartForm.activityTemplate': function (val) {
      if (val === '2') {
        this.addPrizeForm.addPrizeType = '2'
      } else {
        this.addPrizeForm.addPrizeType = '1'
      }
    }
  },
  mounted() {
    // 设置标题之后，里面去填充页面内容
    this.setPageTitle()
  },
  methods: {
    /**
     * 提交表单
     */
    submitForm(formName, step) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let ajaxParams = {
            name: this.onePartForm.activityName, // 活动名称
            regulation: this.onePartForm.activityRules, // 活动规则
            type: this.onePartForm.activityType, // 活动类型
            template: this.onePartForm.activityTemplate, // 活动模板
            startDate: this.threePartForm.activityStart, // 活动开始日期
            endDate: this.threePartForm.activityEnd, // 活动结束日期
            bannerPath: this.onePartForm.bannerPic // 活动banner
          }
          switch (step) {
            case '1':
              // ajaxParams.step = 1
              this.submitObject = ajaxParams
              this.tabSwitch = 2
              this.activityTab = 2
              this.loadingOnePart = false
              this.validatePartOne = true
              document.documentElement.scrollTop = 0
              document.body.scrollTop = 0
              if (this.onePartForm.activityTemplate === '2') this.addPrizeForm.addPrizeType = '2'
              break;
            case '2':
              // ajaxParams.step = 2
              console.log('1111111', this.checkHasCoupon(this.prizeList))
              this.checkPrize()
              this.validatePartTwo = true
              if (this.prizeList.length > 0 && this.prizeList.every(this.checkPrizeQuantity) && this.prizeList.every(this.checkPrizeProbability)) {
                if (this.onePartForm.activityTemplate === '2') {
                  // 如果活动模板是领红包, 奖品不允许添加券
                  if (this.checkHasCoupon(this.prizeList) <= 0) {
                    this.tabSwitch = 3      // add field 打开第三道门
                    this.activityTab = 3 // 切换到第二道门
                    this.loadingTwoPart = false
                  } else {
                    this.$message.info('领红包活动的奖品只能添加微信红包, 请确认奖品添加是否正确')
                  }
                } else {
                  this.tabSwitch = 3      // add field 打开第三道门
                  this.activityTab = 3 // 切换到第二道门
                  this.loadingTwoPart = false
                }
              } else if (this.prizeList.length <= 0) {
                this.$message.info('请至少添加一个奖品')
              } else if (!this.prizeList.every(this.checkPrizeQuantity) || !this.prizeList.every(this.checkPrizeProbability)) {
                this.$message.info('请确定奖品信息填写无误')
              }
              document.documentElement.scrollTop = 0
              document.body.scrollTop = 0
              break;
            case '3':
              // ajaxParams.step = 3
              // threePartForm
              this.checkPrize()
              this.validatePartThree = true
              let terminals = []
              for (let i = 0; i < this.threePartForm.terminalList.length; i++) {
                for (let j = 0; j < this.threePartForm.displayTerminal.length; j++) {
                  if (this.threePartForm.terminalList[i].name === this.threePartForm.displayTerminal[j]) {
                    terminals.push(this.threePartForm.terminalList[i].id)
                  }
                }
              }
              this.submitObject.showType = terminals // 展示端
              // 展示时间
              let s = new Date(this.threePartForm.activityDisplayStart)
              let sy = s.getFullYear()
              let dsm = s.getMonth() + 1
              dsm = dsm >= 10 ? dsm : '0' + dsm
              let dsd = s.getDate() >= 10 ? s.getDate() : '0' + s.getDate()
              let dsH = s.getHours() >= 10 ? s.getHours() : '0' + s.getHours()
              let dsM = s.getMinutes() >= 10 ? s.getMinutes() : '0' + s.getMinutes()
              this.threePartForm.displayStartSubmit = sy + '-' + dsm + '-' + dsd + ' ' + dsH + ':' + dsM + ':00'
              // 隐藏日期
              let e = new Date(this.threePartForm.activityDisplayEnd)
              // 提交的展示时间
              let ey = e.getFullYear()
              let dem = e.getMonth() + 1
              dem = dem >= 10 ? dem : '0' + dem
              let ded = e.getDate() >= 10 ? e.getDate() : '0' + e.getDate()
              let deH = e.getHours() >= 10 ? e.getHours() : '0' + e.getHours()
              let deM = e.getMinutes() >= 10 ? e.getMinutes() : '0' + e.getMinutes()
              this.threePartForm.displayEndSubmit = ey + '-' + dem + '-' + ded + ' ' + deH + ':' + deM + ':59'
              this.submitObject.showDate = this.threePartForm.displayStartSubmit // 展示日期
              this.submitObject.hiddenDate = this.threePartForm.displayEndSubmit // 隐藏日期
              this.submitObject.notBeginPrompt = this.threePartForm.tipsBeforeStart // 未开始提示
              this.submitObject.endPrompt = this.threePartForm.tipsEnd // 结束提示

              // onePartForm
              this.submitObject.name = this.onePartForm.activityName // 活动名称
              this.submitObject.regulation = this.onePartForm.activityRules // 活动规则
              this.submitObject.type = this.onePartForm.activityType // 活动类型
              this.submitObject.template = this.onePartForm.activityTemplate // 活动模板
              this.submitObject.startDate = this.threePartForm.activityStart // 活动开始日期
              this.submitObject.endDate = this.threePartForm.activityEnd // 活动结束日期
              this.submitObject.bannerPath = this.onePartForm.bannerPic // 活动banner

              // twoPartForm
              this.submitObject.lotteryPlayer = this.twoPartForm.attendNum // 参与人数
              this.submitObject.winningMaxTime = this.twoPartForm.winningTimes // 每人最大允许中奖数
              this.submitObject.lotteryInitTime = this.twoPartForm.originalTimes // 初始抽奖次数
              this.submitObject.lotteryExtraTime = this.twoPartForm.shareAddTimes // 分享成功后额外抽奖次数
              let giftCouponTwo = [] // 优惠券数组
              let giftRedpacketTwo = [] // 红包数组
              this.submitObject.giftCouponArray = []
              this.submitObject.giftRedpacketArray = []
              // 奖品数组
              this.prizeList.forEach(v => {
                let tempCoupon, tempReEvenlope
                if (v.type === 1) {
                  // 优惠券
                  tempCoupon = {
                    platformCouponId: v.id,
                    isRepeat: v.isRepeat, // 是否允许统一用户重复中奖
                    giftQuantity: v.quantity, // 奖品数量
                    lotteryRate: v.probability, // 中奖概率
                    redemptRemark: v.useExplain // 奖品使用说明
                  }
                  giftCouponTwo.push(tempCoupon)
                } else {
                  tempReEvenlope = {
                    type: v.redEnvelopeType, // 红包类型
                    amount: v.redEnvelopeAmount, // 红包金额
                    isRepeat: v.isRepeat, // 是否允许统一用户重复中奖
                    giftQuantity: v.quantity, // 奖品数量
                    lotteryRate: v.probability, // 中奖概率
                    redemptRemark: v.useExplain // 奖品使用说明
                  }
                  giftRedpacketTwo.push(tempReEvenlope)
                }
              })
              if (giftCouponTwo.length > 0) this.submitObject.giftCouponArray = giftCouponTwo // 优惠券数组
              if (giftRedpacketTwo.length > 0) this.submitObject.giftRedpacketArray = giftRedpacketTwo // 红包数组

              // 请求接口
              if (this.prizeList.length > 0 && this.prizeList.every(this.checkPrizeQuantity) && this.prizeList.every(this.checkPrizeProbability)) {
                if (!this.activityId) {
                  platformActivityAdd(this.submitObject).then(res => {
                    if (res.status === 'true') {
                      this.$router.push('/activity/detail?id=' + res.info.id)
                    } else {
                      this.setMsg('error', res.msg)
                    }
                  })
                } else if (this.activityId) {
                  this.submitObject.id = this.activityId
                  if (this.submitObject.giftCouponArray.length > 0) {
                    this.submitObject.giftCouponArray.forEach(v => {
                      if (v.isRepeat) {
                        v.isRepeat = 1
                      } else {
                        v.isRepeat = 0
                      }
                    })
                  }
                  if (this.submitObject.giftRedpacketArray.length > 0) {
                    this.submitObject.giftRedpacketArray.forEach(v => {
                      if (v.isRepeat) {
                        v.isRepeat = 1
                      } else {
                        v.isRepeat = 0
                      }
                    })
                  }
                  if (this.type === 'edit') {
                    platformActivityEdit(this.submitObject).then(res => {
                      if (res.status === 'true') {
                        this.setMsg('success', '更新成功')
                        this.$router.push('/activity/detail?id=' + this.activityId)
                      } else {
                        this.setMsg('error', res.msg)
                      }
                    })
                  } else if (this.type === 'copy') {
                    this.submitObject.id = ''
                    if (!this.onePartForm.activityName) {
                      this.setMsg('error', '请输入活动名称')
                    } else {
                      platformActivityAdd(this.submitObject).then(res => {
                        if (res.status === 'true') {
                          this.setMsg('success', res.msg)
                          this.$router.push('/activity/detail?id=' + res.info.id)
                        } else {
                          this.setMsg('error', res.msg)
                        }
                      })
                    }
                  }
                }
              } else if (!this.onePartForm.activityName) {
                this.setMsg('error', '请输入活动名称')
              } else {
                this.setMsg('error', '请确认奖品信息填写无误')
              }
              break;
          }
        }
      });
    },
    /**
     * 公共部分
     */
    setPageTitle() {
      let titleName
      if (!this.activityId) {
        titleName = '添加活动'
        this.addEditType = 0
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
    },
    getPageData() {
      platformActivityDetail({ activityId: this.activityId }).then(res => {
        if (res.status === 'true') {
          let partOne = res.info.platformActivity
          let startDate = new Date(partOne.startDate)
          let sy = startDate.getFullYear()
          let sm = startDate.getMonth()
          let sd = startDate.getDate()
          let sH = startDate.getHours()
          let sM = startDate.getMinutes()
          let start = new Date(sy, sm, sd, sH, sM)

          let endDate = new Date(partOne.endDate)
          let ey = endDate.getFullYear()
          let em = endDate.getMonth()
          let ed = endDate.getDate()
          let eH = endDate.getHours()
          let eM = endDate.getMinutes()
          let end = new Date(ey, em, ed, eH, eM)
          this.onePartForm = {
            activityName: partOne.name, // 活动名称
            activityRules: partOne.regulation, // 活动规则
            activityTemplate: partOne.template + '', // 活动模板
            activityType: partOne.type + '', // 活动类型
            activityStartDate: partOne.startDate, // 活动开始日期
            activityEndDate: partOne.endDate, // 活动结束日期
            rangeDate: [start, end], // 活动日期
            bannerPic: partOne.bannerPath // 活动banner
          }
          this.submitObject.name = this.onePartForm.activityName
          this.submitObject.regulation = this.onePartForm.activityRules
          this.submitObject.type = this.onePartForm.activityType
          this.submitObject.template = this.onePartForm.activityTemplate
          this.submitObject.startDate = this.onePartForm.activityStartDate
          this.submitObject.endDate = this.onePartForm.activityEndDate
          this.submitObject.bannerPath = this.onePartForm.bannerPic
          if (this.type === 'copy') {
            this.onePartForm.activityName = ''
          }
          this.monitorOnePartForm = deepCopyObj(this.onePartForm)

          this.twoPartForm = {
            attendNum: partOne.lotteryPlayer, // 参与人数
            winningTimes: partOne.winningMaxTime, // 允许的最大中奖次数
            originalTimes: partOne.lotteryInitTime, // 初始抽奖次数
            shareAddTimes: partOne.lotteryExtraTime // 分享后获得的抽奖次数
          }
          if (res.info.platformActivityGiftList.length > 0) {
            res.info.platformActivityGiftList.forEach(v => {
              let prize = {
                type: v.platformCouponId ? 1 : 2,
                prizeName: v.platformCouponId ? v.couponName : '普通红包(' + v.amount + '元)',
                quantity: v.giftQuantity,
                probability: parseFloat((v.lotteryRate * 100).toPrecision(12)).toFixed(2),
                id: v.platformCouponId,
                validate: false,
                probabilityValidate: false,
                prizeQuantityWarning: '',
                prizeProbabilityWarning: '',
                isRepeat: v.isRepeat === 1,
                useExplain: v.redemptRemark,
                redEnvelopeType: v.type + '',
                redEnvelopeAmount: v.amount
              }
              if (this.type === 'edit' && prize.type === 1) {
                prize.disabled = true
              } else {
                prize.disabled = false
              }
              this.prizeList.push(prize)
            })
            findUsableCouponByType().then(res => {
              if (res.status === 'true') {
                let list = res.info
                for (let i = 0; i < list.length; i++) {
                  for (let j = 0; j < this.prizeList.length; j++) {
                    if (list[i].id === this.prizeList[j].id) {
                      this.prizeList[j].maxQuantity = list[i].notUseQuantity > 0 ? list[i].notUseQuantity : list[i].giftQuantity
                    }
                  }
                }
                let giftCouponArray = [] // 红包数组
                let giftRedpacketArray = [] // 红包数组
                // 奖品数组
                this.prizeList.forEach((v, i) => {
                  v.index = i
                  let tempCoupon, tempReEvenlope
                  if (v.type === 1) {
                    // 优惠券
                    tempCoupon = {
                      platformCouponId: v.id,
                      isRepeat: v.isRepeat, // 是否允许统一用户重复中奖
                      giftQuantity: v.quantity, // 奖品数量
                      lotteryRate: v.probability, // 中奖概率
                      redemptRemark: v.useExplain // 奖品使用说明
                    }
                    giftCouponArray.push(tempCoupon)
                  } else {
                    tempReEvenlope = {
                      type: v.redEnvelopeType, // 红包类型
                      amount: v.redEnvelopeAmount, // 红包金额
                      isRepeat: v.isRepeat, // 是否允许统一用户重复中奖
                      giftQuantity: v.quantity, // 奖品数量
                      lotteryRate: v.probability, // 中奖概率
                      redemptRemark: v.useExplain // 奖品使用说明
                    }
                    giftRedpacketArray.push(tempReEvenlope)
                  }
                })
                if (giftCouponArray.length > 0) this.submitObject.giftCouponArray = giftCouponArray // 优惠券数组
                if (giftRedpacketArray.length > 0) this.submitObject.giftRedpacketArray = giftRedpacketArray // 红包数组
              }
            })
          }

          if (res.info.platformActivityShowConfigList.length > 0) {
            res.info.platformActivityShowConfigList.forEach(v => {
              if (v.type === 1) {
                this.threePartForm.displayTerminal.push('小程序')
              } else if (v.type === 2) {
                this.threePartForm.displayTerminal.push('APP IOS端')
              } else if (v.type === 3) {
                this.threePartForm.displayTerminal.push('APP 安卓端')
              }
            })
          }
          this.threePartForm.activityStart = partOne.startDate
          this.threePartForm.activityEnd = partOne.endDate
          this.threePartForm.displayStartSubmit = res.info.platformActivityShowConfigList[0].showDate
          this.threePartForm.displayEndSubmit = res.info.platformActivityShowConfigList[0].hiddenDate
          // 活动展示时间
          let startS = new Date(res.info.platformActivityShowConfigList[0].showDate)
          let syS = startS.getFullYear()
          let smS = startS.getMonth()
          let sdS = startS.getDate()
          let sHS = startS.getHours()
          let sMS = startS.getMinutes()
          this.threePartForm.activityDisplayStart = new Date(syS, smS, sdS, sHS, sMS)
          // 活动隐藏时间
          let endS = new Date(res.info.platformActivityShowConfigList[0].hiddenDate)
          let eyS = endS.getFullYear()
          let emS = endS.getMonth()
          let edS = endS.getDate()
          let eHS = endS.getHours()
          let eMS = endS.getMinutes()
          this.threePartForm.activityDisplayEnd = new Date(eyS, emS, edS, eHS, eMS)
          // 活动未开始提示
          this.threePartForm.tipsBeforeStart = res.info.platformActivityShowConfigList[0].notBeginPrompt
          this.threePartForm.tipsEnd = res.info.platformActivityShowConfigList[0].endPrompt
          if (this.type) {
            this.checkPrize()
          }
        }
      })
    },
    /**
     * part 1
     * */
    dateChange (val) {
      if (val) {
        let start = new Date(val[0])
        let sy = start.getFullYear()
        let sm = start.getMonth()
        let sd = start.getDate()
        let sH = start.getHours()
        let sM = start.getMinutes()
        let end = new Date(val[1])
        let ey = end.getFullYear()
        let em = end.getMonth()
        let ed = end.getDate()
        let eH = end.getHours()
        let eM = end.getMinutes()

        // 活动展示时间
        this.threePartForm.activityDisplayStart = new Date(sy, sm, sd, sH, sM)
        // 活动隐藏时间
        this.threePartForm.activityDisplayEnd = new Date(ey, em, ed, eH, eM)
        // 活动开始/结束日期
        sm = sm + 1
        sm = sm >= 10 ? sm : '0' + sm
        sd = sd >= 10 ? sd : '0' + sd
        sH = sH >= 10 ? sH : '0' + sH
        sM = sM >= 10 ? sM : '0' + sM

        em = em + 1
        em = em >= 10 ? em : '0' + em
        ed = ed >= 10 ? ed : '0' + ed
        eH = eH >= 10 ? eH : '0' + eH
        eM = eM >= 10 ? eM : '0' + eM
        this.threePartForm.activityStart = sy + '-' + sm + '-' + sd + ' ' + sH + ':' + sM + ':00'
        this.threePartForm.displayStartSubmit = this.threePartForm.activityStart
        this.threePartForm.activityEnd = ey + '-' + em + '-' + ed + ' ' + eH + ':' + eM + ':59'
        this.threePartForm.displayEndSubmit = this.threePartForm.activityEnd
      }
    },
    /**
     * part 2: 活动模板是领红包时判断奖品列表里面是否包含优惠券
     * 目前需求是: 领红包模板不能添加优惠券的奖品
     */
    checkHasCoupon (list) {
      let coupon = []
      list.forEach(v => {
        if (v.type === 1) {
          coupon.push(v)
        }
      })
      return coupon.length
    },
    /**
     * part 3
     */
    displayStart (val) {
      let start = new Date(val)
      let sy = start.getFullYear()
      let sm = start.getMonth()
      let sd = start.getDate()
      let sH = start.getHours()
      let sM = start.getMinutes()

      // 活动展示时间
      this.threePartForm.activityDisplayStart = new Date(sy, sm, sd, sH, sM)
      // 提交的展示时间
      // threePartForm.activityDisplayStart
      let dsm = sm + 1
      dsm = dsm >= 10 ? dsm : '0' + dsm
      let dsd = sd >= 10 ? sd : '0' + sd
      let dsH = sH >= 10 ? sH : '0' + sH
      let dsM = sM >= 10 ? sM : '0' + sM
      this.threePartForm.displayStartSubmit = sy + '-' + dsm + '-' + dsd + ' ' + dsH + ':' + dsM + ':00'
    },
    displayEnd (val) {
      let end = new Date(val)
      let ey = end.getFullYear()
      let em = end.getMonth()
      let ed = end.getDate()
      let eH = end.getHours()
      let eM = end.getMinutes()

      // 活动隐藏时间
      this.threePartForm.activityDisplayEnd = new Date(ey, em, ed, eH, eM)
      // 提交的展示时间
      // threePartForm.activityDisplayEnd
      let dem = em + 1
      dem = dem >= 10 ? dem : '0' + dem
      let ded = ed >= 10 ? ed : '0' + ed
      let deH = eH >= 10 ? eH : '0' + eH
      let deM = eM >= 10 ? eM : '0' + eM
      this.threePartForm.displayEndSubmit = ey + '-' + dem + '-' + ded + ' ' + deH + ':' + deM + ':59'
    },
    // 确定添加奖品
    sureAddPrize () {
      this.$refs['addPrizeForm'].validate((valid) => {
        if (valid) {
          let couponName = ''
          let couponRest = 0
          if (this.addPrizeForm.selCouponId) {
            this.couponList.forEach(v => {
              if (v.id === this.addPrizeForm.selCouponId) {
                couponName = v.name
                couponRest = v.notUseQuantity
              }
            })
          }
          if (this.addPrizeForm.addPrizeType - 1 + 1 === 2) {
            couponRest = 9999
          }
          let prize = {
            type: this.addPrizeForm.addPrizeType - 1 + 1,
            prizeName: this.addPrizeForm.showRedEnvelope ? '普通红包(' + this.addPrizeForm.redEnvelopeAmount + '元)' : couponName,
            maxQuantity: couponRest,
            quantity: '',
            probability: '',
            id: this.addPrizeForm.selCouponId,
            validate: true,
            probabilityValidate: true,
            prizeQuantityWarning: '请输入奖品数量',
            prizeProbabilityWarning: '请输入中奖概率',
            isRepeat: this.addPrizeForm.allowRepeat ? 1 : 0,
            // useExplain: this.addPrizeForm.showRedEnvelope ? this.addPrizeForm.redEnvelopeInstruction : this.addPrizeForm.useInstruction, // 奖品使用说明
            useExplain: this.addPrizeForm.useInstruction, // 奖品使用说明
            redEnvelopeType: this.addPrizeForm.redEnvelopeType, // 红包类型
            redEnvelopeAmount: this.addPrizeForm.redEnvelopeAmount, // 红包金额
            disabled: false
          }
          this.prizeList.push(prize)
          this.prizeList.forEach((v, i) => {
            this.totalProbability = this.totalProbability + (v.probability - 1 + 1)
            v.index = i
          })
          this.dialogVisible = false
          this.addPrizeForm = {
            addPrizeType: '1',
            redEnvelopeType: '1',
            redEnvelopeAmount: '',
            selCouponId: '',
            couponType: 1, // 优惠券类型
            allowRepeat: false, // 是否允许重复中奖
            useInstruction: '', // 使用说明
            showRedEnvelope: false
          }
        } else {
          this.$message.error('请填写完整信息')
          return false;
        }
      });
    },
    // 添加奖品弹窗
    addPrize () {
      if (this.prizeList.length < 20) {
        if (this.couponList.length > 0 && this.prizeList.length > 0) {
          for (let i = 0; i < this.couponList.length; i++) {
            for (let j = 0; j < this.prizeList.length; j++) {
              if (this.prizeList[j] && this.couponList[i] && this.prizeList[j].id === this.couponList[i].id) {
                this.couponList.splice(i, 1)
              }
            }
          }
        }
        if (this.prizeList.length > 0) {
          if (this.prizeList.every(this.checkPrizeQuantity) && this.prizeList.every(this.checkPrizeProbability)) {
            this.dialogVisible = true
            this.couponTypeChange()
          } else {
            this.$message.info('请确认奖品信息填写无误')
          }
        } else {
          this.dialogVisible = true
          this.couponTypeChange()
        }
      } else {
        this.setMsg('最多只能添加20个奖品')
      }
    },
    // 删除奖品
    deletePrize (index) {
      this.prizeList.forEach((v, i) => {
        if (index === i) {
          this.prizeList.splice(i, 1)
        }
      })
      // 重新排序
      this.prizeList.forEach((v, i) => {
        v.index = i
      })
    },
    // 判断prizeList所有元素的数量输入验证是否都通过
    checkPrizeQuantity (item) {
      return item.validate === false
    },
    // 判断prizeList所有元素的中奖概率输入验证是否都通过
    checkPrizeProbability (item) {
      return item.probabilityValidate === false
    },
    // 复制和编辑时查询奖品剩余数量
    checkPrize () {
      let couponRest
      findUsableCouponByType().then(res => {
        if (res.status === 'true') {
          couponRest = res.info
          if (couponRest.length > 0) {
            let allCouponIds = []
            // 奖品数组
            for (let i = 0; i < couponRest.length; i++) {
              allCouponIds.push(couponRest[i].id)
              for (let j = 0; j < this.prizeList.length; j++) {
                if (this.prizeList[j].id === couponRest[i].id) {
                  if (this.prizeList[j].quantity > couponRest[i].notUseQuantity) {
                    if (this.type === 'copy') {
                      let temp = this.prizeList[j]
                      temp.validate = true
                      temp.prizeQuantityWarning = '奖品数量不能超过券剩余量'
                      this.prizeList.splice(j, temp)
                    }
                  } else {
                    this.prizeList[j].validate = false
                  }
                } else if (this.prizeList[j].id && allCouponIds.indexOf(this.prizeList[j].id) < 0) {
                  if (this.type === 'copy') {
                    this.prizeList[j].validate = true
                    this.prizeList[j].prizeQuantityWarning = '券剩余量为0,请删除并选择其他奖品'
                  } else if (this.type === 'edit') {
                    this.prizeList[j].maxQuantity = this.prizeList[j].quantity
                  }
                }
              }
            }
          } else {
            if (this.type === 'copy') {
              this.prizeList.forEach(v => {
                if (v.type === 1) {
                  v.validate = true
                  v.prizeQuantityWarning = '券剩余量为0,请删除并选择其他奖品'
                }
              })
            }
          }
        }
      })
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
  .el-range-editor.el-input__inner {
    width: 310px;
  }
  .red-envelope {
    .el-form-item__error {
      margin-left: -50px;
    }
  }
  .choose-coupon {
    .el-form-item__error {
      margin-left: 50px;
    }
  }
  .choose-coupon-type {
    .el-form-item__error {
      margin-left: -50px;
    }
  }
  .el-dialog {
    min-width: 510px;
  }
  .editor-container {
    height: 100%;
    width: 45%;
    min-width: 500px;
  }
  .quill-editor-box {
    margin-bottom: 0;
    padding-bottom: 45px;
  }
  .ql-container.ql-snow {
    min-height: 180px;
    padding-bottom: 20px;
  }
}
</style>
<style lang="scss" scoped>
@import "../../../../styles/variables";
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
    margin-left: 106px;
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
  .prize-warnning {
  }
  .add-prize-info {
    margin-left: -50px;
  }
  .coupon-sel {
    margin-left: 50px;
  }
  .add-prize-checkbox {
    margin-left: 40px;
  }
  .display-activity {
    margin-left: 0;
  }
  .rules-length {
    margin-top: -25px;
  }
}
</style>
