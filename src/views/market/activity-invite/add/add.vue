<template>
  <div class="page-activity-com">
    <lh-title :title="titleName" :noBorder="true"></lh-title>

    <!-- tab 切换 -->
    <lh-page-tab
      :activityTab="activityTab"
      :addEditType="addEditType"
      :tabList="tabList"
      :tabSwitch="tabSwitch"
      @tabToggle="toggleTab" />

    <div class="lh-card-main lh-card-body">
      <h3 class="step-one-title" v-if="activityTab === 1">邀请有礼页配置</h3>
      <h3 class="step-one-title" v-if="activityTab === 2">新人活动页配置</h3>
      <!-- first step -->
      <el-form :model="onePartForm" :rules="onePartFormRule" v-if="activityTab === 1" ref="onePartForm">
        <el-form-item prop="name" label="标题" label-width="120px" class="mt40">
          <el-input :disabled="status === 'ing' || status === 'ed'" v-model="onePartForm.name" class="activity-name" placeholder="标题" :maxlength="20"></el-input>
        </el-form-item>

        <el-form-item prop="topBanner" label="顶部banner" label-width="120px">
          <lh-upload :accept="'.jpg,png'"
            :imgUrl="onePartForm.topBanner" class="fl" :disabled="status === 'ing' || status === 'ed'"
            @uploadImg="showTopBanner"></lh-upload>
          <i class="el-icon-question fl theme-light-gray date-warnning upload-text-icon ml10 mt6 mr5" @click="isShowTopBanner = true"></i>
          <div v-if="isShowTopBanner">
            <p>建议尺寸： 750 * 1206PX</p>
            <p class="banner-format">支持格式： JPG / PNG</p>
          </div>
        </el-form-item>

        <el-form-item prop="regulation" label="活动规则 " label-width="120px">
          <div class="editor-container quill-editor-box" :class="[(status === 'ing' || status === 'ed') ? 'disabledStyle' : '']" :style="{background: (status === 'ing' || status === 'ed') ? '#f5f7fa' : ''}">
            <quill-editor
              :disabled="status === 'ing' || status === 'ed'"
              v-model.trim="onePartForm.regulation"
              ref="myQuillEditor1"
              :options="editorOption1"></quill-editor>
          </div>
        </el-form-item>

        <el-form-item prop="rangeActivityDate" label="阶段活动时间" label-width="120px">
          <div>
            <el-date-picker
              class="width340px"
              :disabled="status === 'ing'"
              format="yyyy-MM-dd HH:mm:ss"
              v-model="onePartForm.rangeActivityDate"
              value-format="yyyy-MM-dd HH:mm:ss"
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

        <el-form-item prop="winningMaxTime" label="最高奖励金额" label-width="120px">
          <el-input :disabled="status === 'ing' || status === 'ed'" v-model="onePartForm.winningMaxTime" class="activity-name" style="width: 400px;" placeholder="最高奖励金额"></el-input>
          <p style="display: inline-block">&nbsp;&nbsp;元</p>
        </el-form-item>

        <el-form-item prop="winningTime" label="单次奖励" label-width="120px">
          <el-input :disabled="status === 'ing' || status === 'ed'" v-model="onePartForm.winningTime" class="activity-name" style="width: 400px;" placeholder="单次奖励"></el-input>
          <p style="display: inline-block">&nbsp;&nbsp;元</p>
        </el-form-item>

        <el-form-item label="成功邀请人数" label-width="120px">
          <p v-if="!onePartForm.winningTime || !onePartForm.winningMaxTime">0</p>
          <p v-if="onePartForm.winningTime && onePartForm.winningMaxTime">{{onePartForm.winningMaxTime / onePartForm.winningTime}}</p>
        </el-form-item>

        <el-form-item prop="inviteCard" label="选择卡券" label-width="120px">
          <el-button :disabled="status === 'ing' || status === 'ed'" v-model="onePartForm.inviteCard" type="primary" @click="choiceCard('inviteCard')">选择卡券</el-button>
          <p style="display: inline-block" v-if="onePartForm.inviteCard && onePartForm.inviteCard.length > 0">已选择{{onePartForm.inviteCard.length}}张优惠券</p>
        </el-form-item>

        <el-form-item label="推荐场地" label-width="120px">
          <el-button :disabled="status === 'ing'" v-model="onePartForm.recommendField1" type="primary" @click="addRecommendField('recommendField1')">添加场地1</el-button>
          <el-button :disabled="status === 'ing'" v-model="onePartForm.recommendField2" type="primary" @click="addRecommendField('recommendField2')">添加场地2</el-button>
          <el-button :disabled="status === 'ing'" v-model="onePartForm.recommendField3" type="primary" @click="addRecommendField('recommendField3')">添加场地3</el-button>
        </el-form-item>

        <el-form-item label="显示消息栏" label-width="120px">
          <el-switch :disabled="status === 'ing' || status === 'ed'" active-value="true" inactive-value="false" v-model="onePartForm.showMsg"></el-switch>
        </el-form-item>

        <el-form-item prop="grant" label="加码好礼" label-width="120px">
          <el-row style="margin-bottom: 10px;">
            <el-select :disabled="status === 'ing' || status === 'ed'" placeholder="选择发放方式" v-model="onePartForm.grantType1" style="width:125px;">
              <el-option label="online" value="online"></el-option>
              <el-option label="offline" value="offline"></el-option>
            </el-select>
            <el-input :disabled="status === 'ing' || status === 'ed'" v-model="onePartForm.grantName1" class="activity-name" style="width: 105px;" :maxlength="10" placeholder="奖品名称"></el-input>
            <el-input :disabled="status === 'ing' || status === 'ed'" v-model="onePartForm.grantNum1" class="activity-name" style="width: 105px;" placeholder="数量展示"></el-input>
            <el-upload name="file"
                       :action="action"
                       :disabled="status === 'ing' || status === 'ed'"
                       accept="image/png, image/jpeg"
                       :headers="headers"
                       v-model="onePartForm.grantImg1"
                       style="display: inline-block;"
                       :on-success="uploadGrantImg1"
                       :show-file-list="false">
              <el-button :disabled="status === 'ing' || status === 'ed'" slot="trigger" size="medium" type="primary">图片1</el-button>
            </el-upload>
          </el-row>
          <el-row style="margin-bottom: 10px;">
            <el-select :disabled="status === 'ing' || status === 'ed'" placeholder="选择发放方式" v-model="onePartForm.grantType2" style="width:125px;">
              <el-option label="online" value="online"></el-option>
              <el-option label="offline" value="offline"></el-option>
            </el-select>
            <el-input :disabled="status === 'ing' || status === 'ed'" v-model="onePartForm.grantName2" class="activity-name" style="width: 105px;" :maxlength="10" placeholder="奖品名称"></el-input>
            <el-input :disabled="status === 'ing' || status === 'ed'" v-model="onePartForm.grantNum2" class="activity-name" style="width: 105px;" placeholder="数量展示"></el-input>
            <el-upload name="file"
                       :action="action"
                       :disabled="status === 'ing' || status === 'ed'"
                       accept="image/png, image/jpeg"
                       :headers="headers"
                       v-model="onePartForm.grantImg2"
                       style="display: inline-block;"
                       :on-success="uploadGrantImg2"
                       :show-file-list="false">
              <el-button :disabled="status === 'ing' || status === 'ed'" slot="trigger" size="medium" type="primary">图片2</el-button>
            </el-upload>
          </el-row>
          <el-row>
            <el-select :disabled="status === 'ing' || status === 'ed'" placeholder="选择发放方式" v-model="onePartForm.grantType3" style="width:125px;">
              <el-option label="online" value="online"></el-option>
              <el-option label="offline" value="offline"></el-option>
            </el-select>
            <el-input :disabled="status === 'ing' || status === 'ed'" v-model="onePartForm.grantName3" class="activity-name" style="width: 105px;" :maxlength="10" placeholder="奖品名称"></el-input>
            <el-input :disabled="status === 'ing' || status === 'ed'" v-model="onePartForm.grantNum3" class="activity-name" style="width: 105px;" placeholder="数量展示"></el-input>
            <el-upload name="file"
                       :action="action"
                       :disabled="status === 'ing' || status === 'ed'"
                       accept="image/png, image/jpeg"
                       :headers="headers"
                       v-model="onePartForm.grantImg3"
                       style="display: inline-block;"
                       :on-success="uploadGrantImg3"
                       :show-file-list="false">
              <el-button :disabled="status === 'ing' || status === 'ed'" slot="trigger" size="medium" type="primary">图片3</el-button>
            </el-upload>
          </el-row>
        </el-form-item>

        <el-form-item prop="morePrizesLimit" label="加码好礼获奖人数限制" label-width="120px">
          <el-input :disabled="status === 'ing' || status === 'ed'" v-model="onePartForm.morePrizesLimit" class="activity-name" placeholder="加码好礼获奖人数限制"></el-input>
        </el-form-item>

        <el-form-item prop="bestPrize" label="终极大奖" label-width="120px">
          <el-input :disabled="status === 'ing' || status === 'ed'" v-model="onePartForm.bestPrizeName" class="activity-name" style="width: 125px;" :maxlength="10" placeholder="奖品名称"></el-input>
          <el-input :disabled="status === 'ing' || status === 'ed'" v-model="onePartForm.bestPrizeMum" class="activity-name" style="width: 125px;" placeholder="数量展示"></el-input>
          <el-upload style="display: inline-block;"
                     v-model="onePartForm.bestPrizeImg"
                     :action="action"
                     :disabled="status === 'ing' || status === 'ed'"
                     accept="image/png, image/jpeg"
                     :headers="headers"
                     :on-success="uploadBestImg"
                     :show-file-list="false">
            <el-button :disabled="status === 'ing' || status === 'ed'" slot="trigger" size="medium" type="primary">配图</el-button>
          </el-upload>
          <el-upload style="display: inline-block;"
                     v-model="onePartForm.winImg"
                     :action="action"
                     :disabled="status === 'ing' || status === 'ed'"
                     accept="image/png, image/jpeg"
                     :headers="headers"
                     :on-success="uploadWinImg"
                     :show-file-list="false">
            <el-button :disabled="status === 'ing' || status === 'ed'" slot="trigger" size="medium" type="primary">获奖图片</el-button>
          </el-upload>
        </el-form-item>

        <el-form-item label="显示排行榜" label-width="120px">
          <el-switch :disabled="status === 'ing' || status === 'ed'" active-value="true" inactive-value="false" v-model="onePartForm.showRankList"></el-switch>
        </el-form-item>

        <el-form-item prop="limitNum" label="截止名次" label-width="120px">
          <el-input :disabled="onePartForm.showRankList !== 'true' || (status === 'ing' || status === 'ed')" v-model="onePartForm.limitNum" class="activity-name" placeholder="截止名次"></el-input>
        </el-form-item>

        <el-form-item prop="payLimit" label="实付金额限制" label-width="120px">
          <el-input :disabled="onePartForm.showRankList !== 'true' || (status === 'ing' || status === 'ed')" v-model="onePartForm.payLimit" class="activity-name" placeholder="实付金额限制"></el-input>
        </el-form-item>

        <el-button
          @click="nextForm('onePartForm')"
          class="to-bottom-right width80px mt30"
          type="primary">下一步</el-button>
      </el-form>

      <!-- second step -->
      <el-form :model="twoPartForm" :rules="towPartFormRule" v-if="activityTab === 2" ref="twoPartForm">
        <el-form-item prop="title" label="标题" label-width="120px" class="mt40">
          <el-input :disabled="status === 'ing' || status === 'ed'" v-model="twoPartForm.title" class="activity-name" placeholder="标题" :maxlength="20"></el-input>
        </el-form-item>

        <el-form-item prop="actBanner" label="活动banner" label-width="120px">
          <lh-upload
            :imgUrl="twoPartForm.actBanner" class="fl"
            :disabled="status === 'ing' || status === 'ed'"
            @uploadImg="showActBanner"></lh-upload>
          <i class="el-icon-question fl theme-light-gray date-warnning upload-text-icon ml10 mt6 mr5" @click="isShowActBanner = true"></i>
          <div v-if="isShowActBanner">
            <p>建议尺寸： 750 * 1206PX</p>
            <p class="banner-format">支持格式： JPG / PNG</p>
          </div>
        </el-form-item>

        <el-form-item label="添加卡券" prop="inviteCard" label-width="120px">
          <el-button :disabled="status === 'ing' || status === 'ed'" v-model="twoPartForm.inviteCard" type="primary" @click="choiceCard('inviteCard2')">添加卡券</el-button>
          <p style="display: inline-block" v-if="twoPartForm.inviteCard && twoPartForm.inviteCard.length > 0">已选择{{twoPartForm.inviteCard.length}}张优惠券</p>
        </el-form-item>

        <el-form-item label="推荐场地" label-width="120px">
          <el-button :disabled="status === 'ing'" v-model="twoPartForm.recommendField1" type="primary" @click="addRecommendField('recommendField1')">添加场地1</el-button>
          <el-button :disabled="status === 'ing'" v-model="twoPartForm.recommendField2" type="primary" @click="addRecommendField('recommendField2')">添加场地2</el-button>
          <el-button :disabled="status === 'ing'" v-model="twoPartForm.recommendField3" type="primary" @click="addRecommendField('recommendField3')">添加场地3</el-button>
        </el-form-item>

        <el-form-item prop="advBanner" label="广告banner" label-width="120px">
          <lh-upload :accept="'.jpg,png'"
            :imgUrl="twoPartForm.advBanner" class="fl" :disabled="status === 'ing' || status === 'ed'"
            @uploadImg="showAdvBanner"></lh-upload>
          <i class="el-icon-question fl theme-light-gray date-warnning upload-text-icon ml10 mt6 mr5" @click="isShowAdvBanner = true"></i>
          <div v-if="isShowAdvBanner">
            <p>建议尺寸： 750 * 1206PX</p>
            <p class="banner-format">支持格式： JPG / PNG</p>
          </div>
        </el-form-item>

        <el-button
          @click="sure('twoPartForm')"
          class="to-bottom-right width80px mt30"
          type="primary">确认</el-button>
      </el-form>
    </div>
    <el-dialog title="添加场地" :visible.sync="isFieldAdd" width="30%" :show-close='true'>
      <el-form :model="fieldAdd" ref="fieldAdd">
        <el-form-item label="所属品牌" label-width="80px" style="margin-left: 35px;" class="mt40">
          <el-select placeholder="请选择所属品牌" @change="getSpace" style="width:300px;" v-model="fieldAdd.stroe">
            <el-option v-for="(item, index) in stroeeData" :key="index" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属空间" label-width="80px" style="margin-left: 35px;" class="mt40">
          <el-select placeholder="请选择所属空间" @change="getField" style="width:300px;" v-model="fieldAdd.space">
            <el-option v-for="(item, index) in spaceData" :key="index" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="场地" label-width="80px" style="margin-left: 35px;" class="mt40">
          <el-select filterable placeholder="请选择场地" style="width:300px;" v-model="fieldAdd.field">
            <el-option v-for="(item, index) in fieldData" :key="index" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div style="text-align: center;" class="mt40">
        <span slot="footer" class="dialog-footer">
          <el-button @click="isFieldAdd = false">取 消</el-button>
          <el-button type="primary" @click="addFieldSure">确 定</el-button>
        </span>
      </div>
    </el-dialog>
    <el-dialog title="选择卡券" :visible.sync="choiceCoupon" width="65%" :show-close='true' v-if="choiceCoupon">
      <el-form>
        <el-form-item class="range-cont clearfix">
          <div class="list-cont fl">
            <el-input v-model.trim="filterText" placeholder="输入关键字进行过滤" class="fix-input"></el-input>
            <div class="tree-cont">
              <el-tree node-key="id" :data="treeData" empty-text="暂无数据"
                       :filter-node-method="filterNode" default-expand-all :props="treeProp" :default-checked-keys="submitData"
                       show-checkbox ref="rangeTree" class="range-tree" @check-change="handleCheckChange">
              </el-tree>
              <p class="theme-light-gray mt60" style="text-align: center" v-if="isFilterNoData">暂无数据</p>
            </div>
          </div>

          <div class="list-cont fl">
            <p class="theme-gray clearfix fix-input">
              已选优惠券
              <span class="theme-blue ml12">{{selectedCoupons.length}}</span>
              <span class="pointer-theme-blue fr" @click="removeSelected()">清空</span>
            </p>

            <!-- 选中的部分空间 -->
            <el-table :data="selectedCoupons" height="360px" key="storeTable">
              <el-table-column label="优惠券类型" prop="type"></el-table-column>
              <el-table-column label="名称" prop="name"></el-table-column>
              <el-table-column label="剩余数量" prop="surplus"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <span class="pointer-theme-gray" @click="removeSelected(scope.row.id)">删除</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
      </el-form>

      <div style="text-align: center;" class="mt40">
        <span slot="footer" class="dialog-footer">
          <el-button @click="choiceCoupon = false">返回</el-button>
          <el-button type="primary" @click="selectCardSure">确 定</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import upload from '@/components/upload'
  import pageTab from '../components/page-tab.vue'
  import { quillEditor } from 'vue-quill-editor'
  import { API_PATH } from '@/config/env'
  import { platformActivityInviteAdd, platformActivityInviteList, platformActivityInviteEdit, findUsableCoupon,
    platformActivityInviteCardAdd, platformActivityInviteCardDelete, platformActivityInviteCardList,
    platformActivityInviteCardNewAdd, platformActivityInviteCardNewDelete, platformActivityInviteCardNewList,
    stroeList } from '@/service/market'
  import { clientList } from '@/service/client'
  import { listSpace } from '@/service/space'
  import { fieldList } from '@/service/field'

  export default {
    mixins: [],
    components: {
      [pageTab.name]: pageTab,
      [upload.name]: upload,
      quillEditor
    },
    data () {
      const reg = /^[0-9]+$/
      const reg1 = /^[1-9]\d{0,2}$/
      const reg2 = /^([1-9]|[1-9]\d|100)$/
      const onePartFormRuleName = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入标题'));
        } else {
          callback();
        }
      };
      const onePartFormRuleTopBanner = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请上传顶部图片'));
        } else {
          callback();
        }
      };
      const onePartFormRuleRegulation = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入活动规则'));
        } else {
          callback();
        }
      };
      const onePartFormRuleRangeActivityDate = (rule, value, callback) => {
        if (value.length === 0) {
          callback(new Error('请选择阶段活动时间'));
        } else {
          callback();
        }
      };
      const onePartFormRuleWinningMaxTime = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入最高奖励金额'));
        } else if (!reg.test(value)) {
          callback(new Error('请输入数字'));
        } else if (!reg1.test(value)) {
          callback(new Error('请输入大于0小于等于999的整数'));
        } else {
          callback();
        }
      };
      const onePartFormRuleWinningTime = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入单次奖励'));
        } else if (!reg.test(value)) {
          callback(new Error('请输入数字'));
        } else if (!reg1.test(value)) {
          callback(new Error('请输入大于0小于等于999的整数'));
        } else {
          callback();
        }
      };
      const onePartFormRuleGrant = (rule, value, callback) => {
        let isShow = false
        if (this.onePartForm.grantType1) {
          if (!this.onePartForm.grantName1) {
            callback(new Error('请输入奖品1的名称'));
            isShow = false
          } else if (!this.onePartForm.grantNum1) {
            callback(new Error('请输入奖品1的数量'));
            isShow = false
          } else if (!this.onePartForm.grantImg1) {
            callback(new Error('请上传奖品1的图片'));
            isShow = false
          } else {
            isShow = true
          }
        }
        if (this.onePartForm.grantType2) {
          if (!this.onePartForm.grantName2) {
            callback(new Error('请输入奖品2的名称'));
            isShow = false
          } else if (!this.onePartForm.grantNum2) {
            callback(new Error('请输入奖品2的数量'));
            isShow = false
          } else if (!this.onePartForm.grantImg2) {
            callback(new Error('请上传奖品2的图片'));
            isShow = false
          } else {
            isShow = true
          }
        }
        if (this.onePartForm.grantType3) {
          if (!this.onePartForm.grantName3) {
            callback(new Error('请输入奖品3的名称'));
            isShow = false
          } else if (!this.onePartForm.grantNum3) {
            callback(new Error('请输入奖品3的数量'));
            isShow = false
          } else if (!this.onePartForm.grantImg3) {
            callback(new Error('请上传奖品3的图片'));
            isShow = false
          } else {
            isShow = true
          }
        }
        if (isShow) {
          callback()
        }
      };
      const onePartFormRuLemorePrizesLimit = (rule, value, callback) => {
        if (value) {
          if (!reg.test(value)) {
            callback(new Error('请输入数字'));
          } else if (!reg1.test(value)) {
            callback(new Error('请输入大于0小于等于999的整数'));
          } else {
            callback();
          }
        } else {
          callback();
        }
      };
      const onePartFormRuleBestPrize = (rule, value, callback) => {
        if (this.onePartForm.bestPrizeMum && !reg.test(this.onePartForm.bestPrizeMum)) {
          callback(new Error('展示数量仅支持输入数字'));
        } else if (this.onePartForm.bestPrizeMum && !reg2.test(this.onePartForm.bestPrizeMum)) {
          callback(new Error('请输入大于0小于等于100的整数'));
        } else {
          callback();
        }
      };
      const onePartFormRuleLimitNum = (rule, value, callback) => {
        if (this.onePartForm.showRankList === 'true') {
          if (!value) {
            callback(new Error('请输入截止名次'));
          } else if (!reg.test(value)) {
            callback(new Error('请输入数字'));
          } else {
            callback();
          }
        } else {
          callback()
        }
      };
      const onePartFormRulePayLimit = (rule, value, callback) => {
        if (this.onePartForm.showRankList === 'true') {
          if (!value) {
            callback(new Error('请输入实付金额限制'));
          } else if (!reg.test(value)) {
            callback(new Error('请输入数字'));
          } else {
            callback();
          }
        } else {
          callback()
        }
      };
      const twoPartFormRuleInviteCard = (rule, value, callback) => {
        console.log('inviteCard', this.twoPartForm.inviteCard)
        if (value.length === 0) {
          callback(new Error('请添加卡券'));
        } else {
          callback();
        }
      };
      const twoPartFormRuleActBanner = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请上传活动banner'));
        } else {
          callback();
        }
      };
      const twoPartFormRuleAdvBanner = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请上传广告banner'));
        } else {
          callback();
        }
      };
      return {
        onePartFormRule: {
          name: [{ required: true, trigger: ['blur', 'change'], validator: onePartFormRuleName }],
          topBanner: [{ required: true, trigger: ['blur', 'change'], validator: onePartFormRuleTopBanner }],
          regulation: [{ required: true, trigger: ['blur', 'change'], validator: onePartFormRuleRegulation }],
          rangeActivityDate: [{ required: true, trigger: ['blur', 'change'], validator: onePartFormRuleRangeActivityDate }],
          winningMaxTime: [{ required: true, trigger: ['blur', 'change'], validator: onePartFormRuleWinningMaxTime }],
          winningTime: [{ required: true, trigger: ['blur', 'change'], validator: onePartFormRuleWinningTime }],
          grant: [{ required: false, trigger: ['blur', 'change'], validator: onePartFormRuleGrant }],
          morePrizesLimit: [{ required: false, trigger: ['blur', 'change'], validator: onePartFormRuLemorePrizesLimit }],
          bestPrize: [{ required: false, trigger: ['blur', 'change'], validator: onePartFormRuleBestPrize }],
          limitNum: [{ required: false, trigger: ['blur', 'change'], validator: onePartFormRuleLimitNum }],
          payLimit: [{ required: false, trigger: ['blur', 'change'], validator: onePartFormRulePayLimit }],
          inviteCard: [{ required: true, trigger: ['blur', 'change'], validator: twoPartFormRuleInviteCard }]
        },
        towPartFormRule: {
          title: [{ required: true, trigger: ['blur', 'change'], validator: onePartFormRuleName }],
          inviteCard: [{ required: true, trigger: ['blur', 'change'], validator: twoPartFormRuleInviteCard }],
          actBanner: [{ required: true, trigger: ['blur', 'change'], validator: twoPartFormRuleActBanner }],
          advBanner: [{ required: true, trigger: ['blur', 'change'], validator: twoPartFormRuleAdvBanner }]
        },
        headers: {
          token: sessionStorage.getItem('token')
        }, // 上传图片时设置请求头
        action: API_PATH + '/supervisor/file/upload', // 图片上传路径
        activityId: this.$route.query.id, // 编辑的数据id
        type: this.$route.query.type, // 页面类型  add || edit
        status: this.$route.query.status, // 该活动所处的状态   will:未开始   ing:正在进行   ed:已结束
        titleName: '', // 页面展示的title
        tabList: ['① 邀请有礼页配置', '② 新人活动页配置'], // tab页显示文字
        activityTab: 1, // 当前展示tab页
        addEditType: 0, // 0为新增  1为编辑
        orderSortDate: { // 日期选择范围
        },
        editorOption1: { // 富文本编辑器
          modules: {
            toolbar: [
              [{ 'list': 'ordered' }]
            ]
          },
          placeholder: '请填写活动规则',
          theme: 'snow'  // or 'bubble'
        },
        onePartForm: {
          rangeActivityDate: [], // 阶段活动时间
          inviteCard: [], // 邀请新人的选择卡券
          recommendField1: {}, // 推荐场地1
          recommendField2: {}, // 推荐场地2
          recommendField3: {}, // 推荐场地3
          showRankList: 'true',
          showMsg: 'true' //
        }, // 第一步的表单绑定的变量
        tabSwitch: false, // 是否可以展示第二步
        twoPartForm: {
          inviteCard: [], // 邀请新人的选择卡券
          recommendField1: {}, // 推荐场地1
          recommendField2: {}, // 推荐场地2
          recommendField3: {} // 推荐场地3
        }, // 第二步的表单绑定的变量
        isFieldAdd: false, // 是否展示添加场地弹窗
        stroeeData: [], // 所属品牌的下拉数据
        spaceData: [], // 所属空间的下拉数据
        fieldData: [], // 场地的下拉数据
        fieldAdd: {
          stroe: '',
          space: '',
          field: ''
        }, // 推荐场地弹窗中绑定的对象
        choiceCoupon: false, // 是否展示选择卡券弹窗
        treeData: [{
          name: '全部',
          id: 1,
          children: [{
            name: '小时券',
            id: 2,
            children: []
          }, {
            name: '代金券',
            id: 3,
            children: []
          }, {
            name: '礼品券',
            id: 4,
            children: []
          }]
        }], // 选择卡券弹窗左侧的树形结构数据
        treeProp: {
          label: 'name',
          disabled: (data) => {
            return !data.type && (!data.children || !data.children.length)
          }
        }, // 选择卡券左侧树形结构数据的规则
        filterText: '', // 选择卡券树形结构筛选
        selectedCoupons: [], // 选中的优惠券信息
        submitData: [], // 存放选择卡券的数组id数组
        isFilterNoData: false, // 是否显示树形结构物数据的提示
        isShowTopBanner: false, // 是否展示顶部banner的提示文字
        isShowActBanner: false, // 是否展示活动banner的提示文字
        isShowAdvBanner: false, // 是否展示广告banner的提示文字
        submitObject: {}, // "确定"按钮的参数对象
        currentCode: '', // 当前字段
        list: [] // 用于限制阶段时间可选范围
      }
    },
    watch: {
      filterText(val) {
        this.$refs.rangeTree.filter(val)
      }
    },
    mounted() {
      // 设置标题之后，里面去填充页面内容
      this.setPageTitle()
    },
    created() {
      this.getStroe()
      this.init()
    },
    methods: {
      init () {
        const self = this
        platformActivityInviteList({
          filters: {
            'platform_activity': {
              'type': {
                equalTo: 3
              }
            }
          },
          page_size: 1000
        }).then(res => {
          console.log(res.data.info.result)
          res.data.info.result.forEach((item, index) => {
            console.log(item.startDate, item.endDate)
            this.list.push([item.startDate, item.endDate])
            self.orderSortDate = {
              disabledDate(time) {
                return self.returnDate(time)
              }
            }
          })
        })
      },
      /**
       * 置灰已存在的阶段时间
       */
      returnDate(time) {
        if (this.list.length === 0) {
          return time.getTime() < Date.now() - 3600 * 1000 * 24
        } else {
          let data = time.getTime() < Date.now() - 3600 * 1000 * 24
          this.list.forEach(item => {
            data = data || (time.getTime() < new Date(item[1]) && time.getTime() > new Date(item[0]) - 3600 * 1000 * 24)
          })
          console.log('data_____🙃', data)
          return data
        }
      },
      /**
       * 查询品牌列表
       */
      getStroe() {
        clientList({
          pageSize: 1000
        }).then(res => {
          res.info.result.forEach((item, index) => {
            this.stroeeData.push({ 'id': item.id, 'name': item.brandName })
          })
        })
      },
      /**
       * 查询空间列表
       */
      getSpace() {
        const self = this
        self.fieldAdd.space = ''
        self.fieldAdd.field = ''
        console.log(self.fieldAdd.stroe)
        stroeList({
          pageSize: 1000
        }).then(res => {
          console.log('res.info', res.info)
          self.spaceData = []
          res.info.result.forEach((item, index) => {
            self.spaceData.push({ 'id': item.storeId, 'name': item.storeName })
          })
        })
      },
      /**
       * 查询场地列表
       */
      getField() {
        const self = this
        self.fieldAdd.field = ''
        fieldList({
          pageSize: 1000
        }).then(res => {
          res.info.result.forEach((item, index) => {
            this.fieldData.push({ 'id': item.fieldId, 'name': item.fieldName })
          })
        })
      },
      /**
       * 上传图片之后展示上传图片
       */
      showTopBanner(val) { // 顶部图片
        this.$set(this.onePartForm, 'topBanner', val)
      },
      showActBanner(val) { // 活动图片
        console.log(this.onePartForm)
        this.$set(this.twoPartForm, 'actBanner', val)
      },
      showAdvBanner(val) { // 广告图片
        console.log(this.onePartForm)
        this.$set(this.twoPartForm, 'advBanner', val)
      },
      /**
       * 上传图片之后的赋值
       */
      uploadGrantImg1(response) {
        this.onePartForm.grantImg1 = response.info.path
      },
      uploadGrantImg2(response) {
        this.onePartForm.grantImg2 = response.info.path
      },
      uploadGrantImg3(response) {
        this.onePartForm.grantImg3 = response.info.path
      },
      uploadBestImg(response) {
        this.onePartForm.bestPrizeImg = response.info.path
      },
      uploadWinImg(response) {
        this.onePartForm.winImg = response.info.path
      },
      /**
       * 根据type确定title展示文字
       */
      setPageTitle() {
        let titleName
        if (this.type === 'add') {
          titleName = '添加活动'
          this.addEditType = 0
        } else if (this.type === 'edit') {
          titleName = '编辑活动'
          this.addEditType = 1
          this.getPageData()
        }
        this.titleName = titleName
        document.title = titleName
      },
      /**
       * 添加推荐场地
       */
      addRecommendField(code) {
        this.isFieldAdd = true
        this.fieldAdd.space = ''
        this.fieldAdd.field = ''
        this.currentCode = code
      },
      /**
       * 推荐场地的"确认"按钮
       */
      addFieldSure() {
        console.log(this.currentCode)
        if (this.activityTab === 1) {
          if (this.fieldAdd.field) {
            this.onePartForm[this.currentCode] = this.fieldAdd
          } else {
            this.onePartForm[this.currentCode] = {}
          }
        } else if (this.activityTab === 2) {
          if (this.fieldAdd.field) {
            this.twoPartForm[this.currentCode] = this.fieldAdd
          } else {
            this.twoPartForm[this.currentCode] = {}
          }
        }
        this.isFieldAdd = false
      },
      /**
       * 选择卡券
       */
      choiceCard(data) {
        const self = this
        this.currentCode = data
        findUsableCoupon().then(res => {
          if (res.status === 'true' && res.info) {
            if (!res.info.couponList.length) {
              self.treeData = []
              this.choiceCoupon = true
            } else {
              res.info.couponList.forEach((item, index) => {
                item.id = item.id
                if (item.type === 1) { // 小时券
                  self.treeData[0].children[0]['children'] = []
                  self.treeData[0].children[0]['children'].push(item)
                } else if (item.type === 2) { // 代金券
                  self.treeData[0].children[1]['children'] = []
                  self.treeData[0].children[1]['children'].push(item)
                } else if (item.type === 3) { // 礼品券
                  self.treeData[0].children[2]['children'] = []
                  self.treeData[0].children[2]['children'].push(item)
                }
                self.choiceCoupon = true
              })
              console.log(self.treeData[0])
              if (self.addEditType) {
                self.submitData = []
                console.log('编辑的选择卡券')
                self.submitData = []
                if (self.activityTab === 1) {
                  if (self.onePartForm.inviteCard.length === 0) {
                    self.removeSelected()
                  } else {
                    self.submitData = self.onePartForm.inviteCard
                  }
                } else if (self.activityTab === 2) {
                  if (self.twoPartForm.inviteCard.length === 0) {
                    self.removeSelected()
                  } else {
                    self.submitData = self.twoPartForm.inviteCard
                  }
                }
              } else {
                console.log('新增的选择卡券')
                self.removeSelected()
              }
              setTimeout(function () {
                self.selectedCoupons = self.$refs.rangeTree.getCheckedNodes(true)
                self.selectedCoupons.forEach((item, index) => {
                  item.surplus = item.quantity - item.statistics.received
                })
              }, 10)
            }
          }
        })
      },
      /**
       * 选择卡券树形数据过滤
       */
      filterNode(value, data, node) {
        this.$nextTick(() => {
          this.isFilterNoData = this.$refs['rangeTree'].$el.offsetHeight === 0
        })
        if (!value) return true
        if (data.name && data.name.indexOf(value) !== -1) {
          return true
        } else if (node.parent.data.name && node.parent.data.name.indexOf(value) !== -1) {
          return true
        } else if (node.parent.parent && node.parent.parent.level > 0 &&
          node.parent.parent.data.name.indexOf(value) !== -1) {
          return true
        }
      },
      /**
       * 选择卡券的树节点，返回优惠券的节点信息
       */
      getCheckedNodes() {
        const checkedNodes = this.$refs.rangeTree.getCheckedNodes(true)
        const storeNodes = []
        for (let i = 0; i < checkedNodes.length; i++) {
          if (checkedNodes[i].id && !checkedNodes[i].disabled) {
            storeNodes.push(checkedNodes[i])
          }
        }
        return storeNodes
      },
      /**
       * 复选框change时更新节点
       */
      handleCheckChange(data, checked, indeterminate) {
        this.selectedCoupons = this.getCheckedNodes()
        this.selectedCoupons.forEach((item, index) => {
          item.surplus = item.quantity - item.statistics.received
        })
        this.submitData = []
        for (let i = 0; i < this.selectedCoupons.length; i++) {
          this.submitData.push(this.selectedCoupons[i].id)
        }
      },
      /**
       * 移除选中的节点
       */
      removeSelected(nodeKey) {
        // 如果没有传nodeKey，则移除所有选中的节点；否则移除当前nodeKey的节点
        let treeName = 'rangeTree'
        if (!nodeKey) {
          this.$refs[treeName].setCheckedKeys([])
        } else {
          this.$refs[treeName].setChecked(nodeKey, false, true)
        }
      },
      /**
       * 选择卡券的"确定"按钮
       */
      selectCardSure() {
        if (this.activityTab === 1) {
          this.onePartForm.inviteCard = this.submitData
        } else if (this.activityTab === 2) {
          this.twoPartForm.inviteCard = this.submitData
        }
        this.choiceCoupon = false
      },
      /**
       * 第一步："下一步"按钮
       */
      nextForm() {
        const self = this
        console.log(self.onePartForm)
        this.$refs.onePartForm.validate((valid) => {
          if (valid) {
            console.log(self.onePartForm)
            self.activityTab = 2
            self.tabSwitch = true
          } else {
            self.tabSwitch = false
            self.$message({
              message: '验证未通过',
              type: 'error'
            })
            return false
          }
        });
      },
      /**
       * 第二步："确定"按钮
       */
      sure(formName) {
        const self = this
        console.log(self.onePartForm)
        console.log(self.twoPartForm)
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(self.twoPartForm)
            const properties = {
              banner: self.onePartForm.topBanner, // 顶部banner
              rule: self.onePartForm.regulation, // 活动规则
              max_prize: self.onePartForm.winningMaxTime, // 最高奖励金额
              once_prize: self.onePartForm.winningTime, // 单次奖励
              show_msg: self.onePartForm.showMsg, // 显示消息烂
              more_prizes: [  // 加码好礼
                {
                  delivery_mothod: self.onePartForm.grantType1, // 发放方式,
                  name: self.onePartForm.grantName1,
                  num: self.onePartForm.grantNum1, // 数量,
                  img: self.onePartForm.grantImg1 // 图片
                },
                {
                  delivery_mothod: self.onePartForm.grantType2, // 发放方式,
                  name: self.onePartForm.grantName2,
                  num: self.onePartForm.grantNum2, // 数量,
                  img: self.onePartForm.grantImg2 // 图片
                },
                {
                  delivery_mothod: self.onePartForm.grantType3, // 发放方式,
                  name: self.onePartForm.grantName3,
                  num: self.onePartForm.grantNum3, // 数量,
                  img: self.onePartForm.grantImg3 // 图片
                }
              ],
              more_prizes_limit: self.onePartForm.morePrizesLimit,  // 加码好礼人数限制,
              best_prize: {
                name: self.onePartForm.bestPrizeName,
                num: self.onePartForm.bestPrizeMum, // 数量
                img: self.onePartForm.bestPrizeImg, // 图片
                win_img: self.onePartForm.winImg // 大奖获奖图片
              },
              show_rank_list: self.onePartForm.showRankList, // 显示排行榜,
              limit_num: self.onePartForm.limitNum, // 截止名次,
              pay_limit: self.onePartForm.payLimit, // 实付金额限制,
              title: self.twoPartForm.title, // 新人活动的标题
              newuser_banner: self.twoPartForm.actBanner, // 新人活动banner,
              newuser_adv_banner: self.twoPartForm.advBanner // 新人广告banner,
            }
            console.log(properties)
            self.submitObject = {
              name: self.onePartForm.name,
              type: 3,
              template: 1,
              code: 31,
              start_date: self.onePartForm.rangeActivityDate[0],
              end_date: self.onePartForm.rangeActivityDate[1],
              properties: JSON.stringify(properties)
            }
            if (self.addEditType) {
              console.log('编辑的确定按钮')
              platformActivityInviteEdit(this.submitObject, self.activityId).then(res => {
                // this.$router.push('/activityInvite')
                this.$message({
                  type: 'success',
                  message: '修改成功!'
                });
                console.log('res', res)
                platformActivityInviteCardList({
                  filters: {
                    act_inv_coupon: {
                      platformActivityId: {
                        equalTo: res.info.id
                      }
                    }
                  },
                  page_size: 1000
                }).then(resList => {
                  console.log('resList', resList)
                  const deleArr = []
                  resList.info.result.forEach((item, index) => {
                    deleArr.push(item.id) // 出了批量删除接口后，用这个变量传参
                  })
                  deleArr.forEach((item, index) => { // 模拟批量删除接口，之后用进行替换
                    platformActivityInviteCardDelete(item).then(resp => {
                      if (index === deleArr.length - 1) {
                        self.onePartForm.inviteCard.forEach((item, index) => { // 模拟批量创建接口，之后进行替换
                          platformActivityInviteCardAdd({
                            plat_coupon_id: item,
                            platform_activity_id: res.info.id,
                            is_delete: 1
                          })
                        })
                      }
                    })
                  })
                })
                platformActivityInviteCardNewList({
                  filters: {
                    act_inv_newuser_coupon: {
                      platformActivityId: {
                        equalTo: res.info.id
                      }
                    }
                  },
                  page_size: 1000
                }).then(resList => {
                  console.log('resList', resList)
                  const deleArr = []
                  resList.info.result.forEach((item, index) => {
                    deleArr.push(item.id) // 出了批量删除接口后，用这个变量传参
                  })
                  deleArr.forEach((item, index) => { // 模拟批量删除接口，之后用进行替换
                    platformActivityInviteCardNewDelete(item).then(resp => {
                      if (index === deleArr.length - 1) {
                        self.twoPartForm.inviteCard.forEach((item, index) => { // 模拟批量创建接口，之后进行替换
                          platformActivityInviteCardNewAdd({
                            plat_coupon_id: item,
                            platform_activity_id: res.info.id,
                            is_delete: 1
                          })
                        })
                      }
                    })
                  })
                })
              })
            } else {
              console.log('新增的确定按钮')
              platformActivityInviteAdd(this.submitObject).then(res => {
                this.$message({
                  type: 'success',
                  message: '保存成功!'
                });
                // console.log(res)
                self.onePartForm.inviteCard.forEach((item, index) => { // 模拟批量创建接口，之后进行替换
                  platformActivityInviteCardAdd({
                    plat_coupon_id: item,
                    platform_activity_id: res.info.id,
                    is_delete: 1
                  })
                })
                self.twoPartForm.inviteCard.forEach((item, index) => { // 模拟批量创建接口，之后进行替换
                  platformActivityInviteCardNewAdd({
                    plat_coupon_id: item,
                    platform_activity_id: res.info.id,
                    is_delete: 1
                  })
                })
                // platformActivityInviteFieldAdd()
                // platformActivityInviteFieldNewAdd()
                // this.$router.push('/activityInvite')
              })
            }
          } else {
            self.$message({
              message: '验证未通过',
              type: 'error'
            })
            return false
          }
        });
      },
      /**
       * 点击tab页，切换步骤
       */
      toggleTab(val) {
        this.activityTab = val
      },
      /**
       * 编辑活动时数据的渲染
       */
      getPageData() {
        const self = this
        platformActivityInviteList({
          filters: {
            'platform_activity': {
              'id': {
                equalTo: self.activityId
              }
            }
          }
        }).then(res => {
          console.log(res.data.info.result[0])
          self.$set(self.onePartForm, 'name', res.data.info.result[0].name)
          self.$set(self.onePartForm, 'topBanner', JSON.parse(res.data.info.result[0].properties).banner)
          self.$set(self.onePartForm, 'regulation', JSON.parse(res.data.info.result[0].properties).rule)
          self.$set(self.onePartForm, 'rangeActivityDate', [res.data.info.result[0].startDate, res.data.info.result[0].endDate])
          self.$set(self.onePartForm, 'winningMaxTime', JSON.parse(res.data.info.result[0].properties).max_prize)
          self.$set(self.onePartForm, 'winningTime', JSON.parse(res.data.info.result[0].properties).once_prize)
          self.$set(self.onePartForm, 'showMsg', JSON.parse(res.data.info.result[0].properties).show_msg)
          self.$set(self.onePartForm, 'grantType1', JSON.parse(res.data.info.result[0].properties).more_prizes[0].delivery_mothod)
          self.$set(self.onePartForm, 'grantName1', JSON.parse(res.data.info.result[0].properties).more_prizes[0].name)
          self.$set(self.onePartForm, 'grantNum1', JSON.parse(res.data.info.result[0].properties).more_prizes[0].num)
          self.$set(self.onePartForm, 'grantImg1', JSON.parse(res.data.info.result[0].properties).more_prizes[0].img)
          self.$set(self.onePartForm, 'grantType2', JSON.parse(res.data.info.result[0].properties).more_prizes[1].delivery_mothod)
          self.$set(self.onePartForm, 'grantName2', JSON.parse(res.data.info.result[0].properties).more_prizes[1].name)
          self.$set(self.onePartForm, 'grantNum2', JSON.parse(res.data.info.result[0].properties).more_prizes[1].num)
          self.$set(self.onePartForm, 'grantImg2', JSON.parse(res.data.info.result[0].properties).more_prizes[1].img)
          self.$set(self.onePartForm, 'grantType3', JSON.parse(res.data.info.result[0].properties).more_prizes[2].delivery_mothod)
          self.$set(self.onePartForm, 'grantName3', JSON.parse(res.data.info.result[0].properties).more_prizes[2].name)
          self.$set(self.onePartForm, 'grantNum3', JSON.parse(res.data.info.result[0].properties).more_prizes[2].num)
          self.$set(self.onePartForm, 'grantImg3', JSON.parse(res.data.info.result[0].properties).more_prizes[2].img)
          self.$set(self.onePartForm, 'morePrizesLimit', JSON.parse(res.data.info.result[0].properties).more_prizes_limit)
          self.$set(self.onePartForm, 'bestPrizeName', JSON.parse(res.data.info.result[0].properties).best_prize.name)
          self.$set(self.onePartForm, 'bestPrizeMum', JSON.parse(res.data.info.result[0].properties).best_prize.num)
          self.$set(self.onePartForm, 'bestPrizeImg', JSON.parse(res.data.info.result[0].properties).best_prize.img)
          self.$set(self.onePartForm, 'winImg', JSON.parse(res.data.info.result[0].properties).best_prize.win_img)
          self.$set(self.onePartForm, 'showRankList', JSON.parse(res.data.info.result[0].properties).show_rank_list)
          self.$set(self.onePartForm, 'limitNum', JSON.parse(res.data.info.result[0].properties).limit_num)
          self.$set(self.onePartForm, 'payLimit', JSON.parse(res.data.info.result[0].properties).pay_limit)
          self.$set(self.twoPartForm, 'title', JSON.parse(res.data.info.result[0].properties).title)
          self.$set(self.twoPartForm, 'actBanner', JSON.parse(res.data.info.result[0].properties).newuser_banner)
          self.$set(self.twoPartForm, 'advBanner', JSON.parse(res.data.info.result[0].properties).newuser_adv_banner)
          platformActivityInviteCardList({
            filters: {
              act_inv_coupon: {
                platformActivityId: {
                  equalTo: res.data.info.result[0].id
                }
              }
            },
            page_size: 1000
          }).then(resList => {
            const oneCard = []
            console.log(resList.info.result[0].platCouponId)
            if (resList.info.result.length > 0) {
              resList.info.result.forEach((item, index) => {
                oneCard.push(item.platCouponId)
              })
            }
            self.$set(self.onePartForm, 'inviteCard', oneCard)
          })
          platformActivityInviteCardNewList({
            filters: {
              act_inv_newuser_coupon: {
                platformActivityId: {
                  equalTo: res.data.info.result[0].id
                }
              }
            },
            page_size: 1000
          }).then(resList => {
            const twoCard = []
            if (resList.info.result.length > 0) {
              resList.info.result.forEach((item, index) => {
                twoCard.push(item.platCouponId)
              })
            }
            self.$set(self.twoPartForm, 'inviteCard', twoCard)
          })
        })
      }
    }
  }
</script>

<style lang="scss">
  .lh-card-body {
    .el-upload--picture-card {
      background-color: #fbfdff;
      border-radius: 6px;
      box-sizing: border-box;
      width: 80px;
      height: 80px;
      cursor: pointer;
      line-height: 90px;
      vertical-align: top;
    }
  }
</style>
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
      width: 425px;
    }
    .quill-editor-box {
      margin-bottom: 0;
      padding-bottom: 45px;
    }
    .disabledStyle:hover{
      cursor: no-drop;
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
    .range-cont {
      margin-right: -12px;
      .list-cont {
        position: relative;
        margin-right: 12px;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        padding: 60px 12px 12px;
        box-sizing: border-box;
        width: calc(50% - 12px);
        /*height: 420px;*/
        overflow: hidden;
        .tree-cont {
          height: 360px;
          overflow-y: auto;
        }
        .fix-input {
          position: absolute;
          top: 12px;
          left: 12px;
          z-index: 2;
          width: calc(100% - 24px);
        }
      }
    }
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
