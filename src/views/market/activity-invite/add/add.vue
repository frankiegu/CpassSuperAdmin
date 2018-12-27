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
      <h3 class="step-one-title" v-if="activityTab === 3">获奖图片配置</h3>
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
          <el-button v-model="onePartForm.recommendField1" type="primary" @click="addRecommendField('recommendField1')">{{onePartForm.recommendField1.text}}</el-button>
          <el-button v-model="onePartForm.recommendField2" type="primary" @click="addRecommendField('recommendField2')">{{onePartForm.recommendField2.text}}</el-button>
          <el-button v-model="onePartForm.recommendField3" type="primary" @click="addRecommendField('recommendField3')">{{onePartForm.recommendField3.text}}</el-button>
        </el-form-item>

        <el-form-item label="显示消息栏" label-width="120px">
          <el-switch :disabled="status === 'ing' || status === 'ed'" active-value="true" inactive-value="false" v-model="onePartForm.showMsg"></el-switch>
        </el-form-item>

        <el-form-item prop="grant" label="加码好礼" label-width="120px">
          <el-row style="margin-bottom: 10px;">
            <el-select :disabled="status === 'ing' || status === 'ed'" placeholder="选择发放方式" v-model="onePartForm.grantType1" style="width:138px;">
              <el-option label="线上发放" value="online"></el-option>
              <el-option label="线下发放" value="offline"></el-option>
            </el-select>
            <el-input :disabled="status === 'ing' || status === 'ed'" v-model="onePartForm.grantName1" class="activity-name" style="width: 138px;" :maxlength="10" placeholder="奖品名称"></el-input>
            <el-input :disabled="status === 'ing' || status === 'ed'" v-model="onePartForm.grantNum1" class="activity-name" style="width: 138px;" placeholder="数量展示"></el-input>
            <!--<el-upload name="file"-->
                       <!--:action="action"-->
                       <!--:disabled="status === 'ing' || status === 'ed'"-->
                       <!--accept="image/png, image/jpeg"-->
                       <!--:headers="headers"-->
                       <!--v-model="onePartForm.grantImg1"-->
                       <!--style="display: inline-block;"-->
                       <!--:on-success="uploadGrantImg1"-->
                       <!--:show-file-list="false">-->
              <!--<el-button :disabled="status === 'ing' || status === 'ed'" slot="trigger" size="medium" type="primary">图片1</el-button>-->
            <!--</el-upload>-->
          </el-row>
          <el-row style="margin-bottom: 10px;">
            <lh-upload :accept="'.jpg,png'"
                       :imgUrl="onePartForm.grantImg1" class="fl" :disabled="status === 'ing' || status === 'ed'"
                       @uploadImg="showGrantImg1"></lh-upload>
            <i class="el-icon-question fl theme-light-gray date-warnning upload-text-icon ml10 mt6 mr5" @click="isShowGrantImg1 = true"></i>
            <div v-if="isShowGrantImg1">
              <p>建议尺寸： 750 * 1206PX</p>
              <p class="banner-format">支持格式： JPG / PNG</p>
            </div>
          </el-row>
          <el-row style="margin-bottom: 10px;">
            <el-select :disabled="status === 'ing' || status === 'ed'" placeholder="选择发放方式" v-model="onePartForm.grantType2" style="width:138px;">
              <el-option label="线上发放" value="online"></el-option>
              <el-option label="线下发放" value="offline"></el-option>
            </el-select>
            <el-input :disabled="status === 'ing' || status === 'ed'" v-model="onePartForm.grantName2" class="activity-name" style="width: 138px;" :maxlength="10" placeholder="奖品名称"></el-input>
            <el-input :disabled="status === 'ing' || status === 'ed'" v-model="onePartForm.grantNum2" class="activity-name" style="width: 138px;" placeholder="数量展示"></el-input>
            <!--<el-upload name="file"-->
                       <!--:action="action"-->
                       <!--:disabled="status === 'ing' || status === 'ed'"-->
                       <!--accept="image/png, image/jpeg"-->
                       <!--:headers="headers"-->
                       <!--v-model="onePartForm.grantImg2"-->
                       <!--style="display: inline-block;"-->
                       <!--:on-success="uploadGrantImg2"-->
                       <!--:show-file-list="false">-->
              <!--<el-button :disabled="status === 'ing' || status === 'ed'" slot="trigger" size="medium" type="primary">图片2</el-button>-->
            <!--</el-upload>-->
          </el-row>
          <el-row style="margin-bottom: 10px;">
            <lh-upload :accept="'.jpg,png'"
                       :imgUrl="onePartForm.grantImg2" class="fl" :disabled="status === 'ing' || status === 'ed'"
                       @uploadImg="showGrantImg2"></lh-upload>
            <i class="el-icon-question fl theme-light-gray date-warnning upload-text-icon ml10 mt6 mr5" @click="isShowGrantImg2 = true"></i>
            <div v-if="isShowGrantImg2">
              <p>建议尺寸： 750 * 1206PX</p>
              <p class="banner-format">支持格式： JPG / PNG</p>
            </div>
          </el-row>
          <el-row style="margin-bottom: 10px;">
            <el-select :disabled="status === 'ing' || status === 'ed'" placeholder="选择发放方式" v-model="onePartForm.grantType3" style="width:138px;">
              <el-option label="线上发放" value="online"></el-option>
              <el-option label="线下发放" value="offline"></el-option>
            </el-select>
            <el-input :disabled="status === 'ing' || status === 'ed'" v-model="onePartForm.grantName3" class="activity-name" style="width: 138px;" :maxlength="10" placeholder="奖品名称"></el-input>
            <el-input :disabled="status === 'ing' || status === 'ed'" v-model="onePartForm.grantNum3" class="activity-name" style="width: 138px;" placeholder="数量展示"></el-input>
            <!--<el-upload name="file"-->
                       <!--:action="action"-->
                       <!--:disabled="status === 'ing' || status === 'ed'"-->
                       <!--accept="image/png, image/jpeg"-->
                       <!--:headers="headers"-->
                       <!--v-model="onePartForm.grantImg3"-->
                       <!--style="display: inline-block;"-->
                       <!--:on-success="uploadGrantImg3"-->
                       <!--:show-file-list="false">-->
              <!--<el-button :disabled="status === 'ing' || status === 'ed'" slot="trigger" size="medium" type="primary">图片3</el-button>-->
            <!--</el-upload>-->
          </el-row>
          <el-row>
            <lh-upload :accept="'.jpg,png'"
                       :imgUrl="onePartForm.grantImg3" class="fl" :disabled="status === 'ing' || status === 'ed'"
                       @uploadImg="showGrantImg3"></lh-upload>
            <i class="el-icon-question fl theme-light-gray date-warnning upload-text-icon ml10 mt6 mr5" @click="isShowGrantImg3 = true"></i>
            <div v-if="isShowGrantImg3">
              <p>建议尺寸： 750 * 1206PX</p>
              <p class="banner-format">支持格式： JPG / PNG</p>
            </div>
          </el-row>
        </el-form-item>

        <el-form-item prop="morePrizesLimit" label="加码好礼获奖人数限制" label-width="120px">
          <el-input :disabled="status === 'ing' || status === 'ed'" v-model="onePartForm.morePrizesLimit" class="activity-name" placeholder="加码好礼获奖人数限制"></el-input>
        </el-form-item>

        <el-form-item prop="bestPrize" label="终极大奖" label-width="120px">
          <el-row style="margin-bottom: 10px;">
            <el-input :disabled="status === 'ing' || status === 'ed'" v-model="onePartForm.bestPrizeName" class="activity-name" style="width: 210px;" :maxlength="10" placeholder="奖品名称"></el-input>
            <el-input :disabled="status === 'ing' || status === 'ed'" v-model="onePartForm.bestPrizeMum" class="activity-name" style="width: 210px;" placeholder="数量展示"></el-input>
          </el-row>
          <!--<el-upload style="display: inline-block;"-->
                     <!--v-model="onePartForm.bestPrizeImg"-->
                     <!--:action="action"-->
                     <!--:disabled="status === 'ing' || status === 'ed'"-->
                     <!--accept="image/png, image/jpeg"-->
                     <!--:headers="headers"-->
                     <!--:on-success="uploadBestImg"-->
                     <!--:show-file-list="false">-->
            <!--<el-button :disabled="status === 'ing' || status === 'ed'" slot="trigger" size="medium" type="primary">配图</el-button>-->
          <!--</el-upload>-->
          <el-row>
            <lh-upload :accept="'.jpg,png'"
                       :imgUrl="onePartForm.bestPrizeImg" class="fl" :disabled="status === 'ing' || status === 'ed'"
                       @uploadImg="showBestPrizeImg"></lh-upload>
            <i class="el-icon-question fl theme-light-gray date-warnning upload-text-icon ml10 mt6 mr5" @click="isShowBestPrizeImg = true"></i>
            <div v-if="isShowBestPrizeImg">
              <p>建议尺寸： 750 * 1206PX</p>
              <p class="banner-format">支持格式： JPG / PNG</p>
            </div>
          </el-row>
          <!--<el-upload style="display: inline-block;"-->
                     <!--v-model="onePartForm.winImg"-->
                     <!--:action="action"-->
                     <!--:disabled="status === 'ing' || status === 'ed'"-->
                     <!--accept="image/png, image/jpeg"-->
                     <!--:headers="headers"-->
                     <!--:on-success="uploadWinImg"-->
                     <!--:show-file-list="false">-->
            <!--<el-button :disabled="status === 'ing' || status === 'ed'" slot="trigger" size="medium" type="primary">获奖图片</el-button>-->
          <!--</el-upload>-->
        </el-form-item>

        <el-form-item label="显示排行榜" label-width="120px">
          <el-switch @change="showRankListChange" :disabled="status === 'ing' || status === 'ed'" active-value="true" inactive-value="false" v-model="onePartForm.showRankList"></el-switch>
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
          <el-button v-model="twoPartForm.recommendField1" type="primary" @click="addRecommendField('recommendField1')">{{twoPartForm.recommendField1.text}}</el-button>
          <el-button v-model="twoPartForm.recommendField2" type="primary" @click="addRecommendField('recommendField2')">{{twoPartForm.recommendField2.text}}</el-button>
          <el-button v-model="twoPartForm.recommendField3" type="primary" @click="addRecommendField('recommendField3')">{{twoPartForm.recommendField3.text}}</el-button>
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
      <el-form :model="threePartForm" v-if="activityTab === 3" ref="threePartForm">

        <el-form-item label="获奖图片" label-width="120px">
          <lh-upload
            :imgUrl="threePartForm.winImg" class="fl"
            @uploadImg="showWinImg"></lh-upload>
          <i class="el-icon-question fl theme-light-gray date-warnning upload-text-icon ml10 mt6 mr5" @click="isShowWinImg = true"></i>
          <div v-if="isShowWinImg">
            <p>建议尺寸： 750 * 1206PX</p>
            <p class="banner-format">支持格式： JPG / PNG</p>
          </div>
        </el-form-item>

        <el-button
          @click="sure('threePartForm')"
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
              <!--<el-table-column label="优惠券类型" prop="type">-->

              <!--</el-table-column>-->
              <el-table-column label="优惠券类型">
                <template slot-scope="scope">
                  <!--小时券, 礼品券, 折扣券, 满减券-->
                  <span v-if="scope.row.type === 1">小时券</span>
                  <span v-if="scope.row.type === 2">代金券</span>
                  <span v-if="scope.row.type === 3">礼品券</span>
                </template>
              </el-table-column>
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
  import { platformActivityInviteAdd, platformActivityInviteList, platformActivityInviteEdit, findUsableCoupons,
    platformActivityInviteCardList, platformActivityInviteCardNewList,
    platformActivityInviteCardAddArr, platformActivityInviteCardDeleteArr,
    platformActivityInviteCardNewAddArr, platformActivityInviteCardNewDeleteArr,
    platformActivityInviteFieldAddArr, platformActivityInviteFieldNewAddArr,
    platformActivityInviteFieldDeleteArr, platformActivityInviteFieldNewDeleteArr,
    platformActivityInviteFieldList, platformActivityInviteFieldNewList,
    stroeList, spaceList, fieldList } from '@/service/market'

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
        let isShow = true
        if (this.onePartForm.grantType1) {
          if (!this.onePartForm.grantName1) {
            callback(new Error('请输入奖品1的名称'));
            isShow = false
          } else if (!this.onePartForm.grantNum1) {
            callback(new Error('请输入奖品1的数量'));
            isShow = false
          } else if (this.onePartForm.grantNum1 && !reg.test(this.onePartForm.grantNum1)) {
            callback(new Error('仅支持输入数字'));
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
          } else if (this.onePartForm.grantNum2 && !reg.test(this.onePartForm.grantNum2)) {
            callback(new Error('仅支持输入数字'));
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
          } else if (this.onePartForm.grantNum3 && !reg.test(this.onePartForm.grantNum3)) {
            callback(new Error('仅支持输入数字'));
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
          name: [{ required: true, trigger: [], validator: onePartFormRuleName }],
          topBanner: [{ required: true, trigger: [], validator: onePartFormRuleTopBanner }],
          regulation: [{ required: true, trigger: [], validator: onePartFormRuleRegulation }],
          rangeActivityDate: [{ required: true, trigger: [], validator: onePartFormRuleRangeActivityDate }],
          winningMaxTime: [{ required: true, trigger: [], validator: onePartFormRuleWinningMaxTime }],
          winningTime: [{ required: true, trigger: [], validator: onePartFormRuleWinningTime }],
          grant: [{ required: false, trigger: [], validator: onePartFormRuleGrant }],
          morePrizesLimit: [{ required: false, trigger: [], validator: onePartFormRuLemorePrizesLimit }],
          bestPrize: [{ required: false, trigger: [], validator: onePartFormRuleBestPrize }],
          limitNum: [{ required: false, trigger: [], validator: onePartFormRuleLimitNum }],
          payLimit: [{ required: false, trigger: [], validator: onePartFormRulePayLimit }],
          inviteCard: [{ required: true, trigger: [], validator: twoPartFormRuleInviteCard }]
        },
        towPartFormRule: {
          title: [{ required: true, trigger: [], validator: onePartFormRuleName }],
          inviteCard: [{ required: true, trigger: [], validator: twoPartFormRuleInviteCard }],
          actBanner: [{ required: true, trigger: [], validator: twoPartFormRuleActBanner }],
          advBanner: [{ required: true, trigger: [], validator: twoPartFormRuleAdvBanner }]
        },
        headers: {
          token: sessionStorage.getItem('token')
        }, // 上传图片时设置请求头
        action: API_PATH + '/supervisor/file/upload', // 图片上传路径
        activityId: this.$route.query.id, // 编辑的数据id
        type: this.$route.query.type, // 页面类型  add || edit
        status: this.$route.query.status, // 该活动所处的状态   will:未开始   ing:正在进行   ed:已结束
        titleName: '', // 页面展示的title
        tabList: ['① 邀请有礼页配置', '② 新人活动页配置', '③ 获奖图片'], // tab页显示文字
        activityTab: 1, // 当前展示tab页
        addEditType: 0, // 0为新增  1为编辑
        orderSortDate: {}, // 日期选择范围
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
          recommendField1: {
            text: '添加场地'
          }, // 推荐场地1
          recommendField2: {
            text: '添加场地'
          }, // 推荐场地2
          recommendField3: {
            text: '添加场地'
          }, // 推荐场地3
          showRankList: 'true',
          showMsg: 'true' //
        }, // 第一步的表单绑定的变量
        tabSwitch: false, // 是否可以展示第二步
        twoPartForm: {
          inviteCard: [], // 邀请新人的选择卡券
          recommendField1: {
            text: '添加场地'
          }, // 推荐场地1
          recommendField2: {
            text: '添加场地'
          }, // 推荐场地2
          recommendField3: {
            text: '添加场地'
          } // 推荐场地3
        }, // 第二步的表单绑定的变量
        threePartForm: {}, // 第三步的表单绑定的变量
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
        isShowGrantImg1: false, // 是否展示加码好礼图片一的提示文字
        isShowGrantImg2: false, // 是否展示加码好礼图片二的提示文字
        isShowGrantImg3: false, // 是否展示加码好礼图片三的提示文字
        isShowBestPrizeImg: false, // 是否展示终极大奖配图的提示文字
        isShowWinImg: false, // 是否展示获奖图片的提示文字
        submitObject: {}, // "确定"按钮的参数对象
        currentCode: '', // 当前字段
        list: [], // 用于限制阶段时间可选范围
        thisStageId: '' // 记录上一个阶段id的值
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
      this.getSpace()
      this.getField()
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
          if (res.data.info.result.length > 0) {
            res.data.info.result.forEach((item, index) => {
              this.list.push([item.startDate, item.endDate])
              self.orderSortDate = {
                disabledDate(time) {
                  return self.returnDate(time)
                }
              }
            })
          }
        })
        platformActivityInviteList({
          filters: {
            'platform_activity': {
              'type': {
                equalTo: 3
              }
            }
          },
          sort_item: 'created',
          sort_order: 'desc'
        }).then(res => {
          console.log(JSON.parse(res.data.info.result[0].properties).stage_id)
          if (!self.addEditType) {
            if (JSON.parse(res.data.info.result[0].properties).stage_id) {
              self.thisStageId = JSON.parse(res.data.info.result[0].properties).stage_id
            } else {
              self.thisStageId = 0
            }
          }
        })
      },
      showRankListChange(data) {
        console.log(data)
        if (data === 'true') {
          this.onePartFormRule.limitNum[0].required = true
          this.onePartFormRule.payLimit[0].required = true
        } else {
          this.onePartFormRule.limitNum[0].required = false
          this.onePartFormRule.payLimit[0].required = false
        }
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
          return data
        }
      },
      /**
       * 查询品牌列表
       */
      getStroe() {
        stroeList({
          pageSize: 1000
        }).then(res => {
          this.stroeeData = []
          res.info.forEach((item, index) => {
            this.stroeeData.push({ 'id': item.id, 'name': item.spaceName })
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
        let params = {}
        if (self.fieldAdd.stroe) {
          params = {
            space_id: self.fieldAdd.stroe,
            pageSize: 1000
          }
        } else {
          params = {
            pageSize: 1000
          }
        }
        spaceList(params).then(res => {
          console.log('res.info', res.info)
          self.spaceData = []
          res.info.forEach((item, index) => {
            self.spaceData.push({ 'id': item.id, 'name': item.storeName })
          })
        })
      },
      /**
       * 查询场地列表
       */
      getField() {
        const self = this
        self.fieldAdd.field = ''
        let params = {}
        if (self.fieldAdd.space) {
          params = {
            store_id: self.fieldAdd.space,
            pageSize: 1000
          }
        } else {
          params = {
            pageSize: 1000
          }
        }
        fieldList(params).then(res => {
          this.fieldData = []
          if (res.info.result.length > 0) {
            res.info.result.forEach((item, index) => {
              this.fieldData.push({ 'id': item.id, 'name': item.fieldName })
            })
          }
        })
      },
      /**
       * 上传图片之后展示上传图片
       */
      showTopBanner(val) { // 顶部图片
        this.$set(this.onePartForm, 'topBanner', val)
      },
      showActBanner(val) { // 活动图片
        this.$set(this.twoPartForm, 'actBanner', val)
      },
      showAdvBanner(val) { // 广告图片
        this.$set(this.twoPartForm, 'advBanner', val)
      },
      showGrantImg1(val) {
        this.$set(this.onePartForm, 'grantImg1', val)
      },
      showGrantImg2(val) {
        this.$set(this.onePartForm, 'grantImg2', val)
      },
      showGrantImg3(val) {
        this.$set(this.onePartForm, 'grantImg3', val)
      },
      showBestPrizeImg(val) {
        this.$set(this.onePartForm, 'bestPrizeImg', val)
      },
      showWinImg(val) {
        this.$set(this.threePartForm, 'winImg', val)
      },
      /**
       * 上传图片之后的赋值
       */
      // uploadGrantImg1(response) {
      //   this.onePartForm.grantImg1 = response.info.path
      //   this.$refs.onePartForm.validateField('grant')
      // },
      // uploadGrantImg2(response) {
      //   this.onePartForm.grantImg2 = response.info.path
      //   this.$refs.onePartForm.validateField('grant')
      // },
      // uploadGrantImg3(response) {
      //   this.onePartForm.grantImg3 = response.info.path
      //   this.$refs.onePartForm.validateField('grant')
      // },
      // uploadBestImg(response) {
      //   this.onePartForm.bestPrizeImg = response.info.path
      // },
      // uploadWinImg(response) {
      //   this.onePartForm.winImg = response.info.path
      // },
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
        this.currentCode = code
        this.isFieldAdd = true
        if (this.activityTab === 1) {
          if (this.onePartForm[this.currentCode].stroe) {
            this.fieldAdd.stroe = this.onePartForm[this.currentCode].stroe
            this.fieldAdd.space = this.onePartForm[this.currentCode].space
            this.fieldAdd.field = this.onePartForm[this.currentCode].field
          } else {
            this.fieldAdd.space = ''
            this.fieldAdd.field = ''
          }
        } else if (this.activityTab === 2) {
          if (this.twoPartForm[this.currentCode].stroe) {
            this.fieldAdd.stroe = this.twoPartForm[this.currentCode].stroe
            this.fieldAdd.space = this.twoPartForm[this.currentCode].space
            this.fieldAdd.field = this.twoPartForm[this.currentCode].field
          } else {
            this.fieldAdd.space = ''
            this.fieldAdd.field = ''
          }
        }
      },
      /**
       * 推荐场地的"确认"按钮
       */
      addFieldSure() {
        if (this.activityTab === 1) {
          this.onePartForm[this.currentCode].stroe = this.fieldAdd.stroe
          this.onePartForm[this.currentCode].space = this.fieldAdd.space
          this.onePartForm[this.currentCode].field = this.fieldAdd.field
          if (this.fieldAdd.field !== '') {
            this.onePartForm[this.currentCode].text = '已选场地'
          } else {
            this.onePartForm[this.currentCode].text = '添加场地'
          }
        } else if (this.activityTab === 2) {
          this.twoPartForm[this.currentCode].stroe = this.fieldAdd.stroe
          this.twoPartForm[this.currentCode].space = this.fieldAdd.space
          this.twoPartForm[this.currentCode].field = this.fieldAdd.field
          if (this.fieldAdd.field !== '') {
            this.twoPartForm[this.currentCode].text = '已选场地'
          } else {
            this.onePartForm[this.currentCode].text = '添加场地'
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
        findUsableCoupons().then(res => {
          if (res.status === 'true' && res.info) {
            if (!res.info.couponList.length) {
              self.treeData = []
              this.choiceCoupon = true
            } else {
              self.treeData[0].children[0]['children'] = []
              self.treeData[0].children[1]['children'] = []
              self.treeData[0].children[2]['children'] = []
              res.info.couponList.forEach((item, index) => {
                item.id = item.id
                if (item.type === 1) { // 小时券
                  self.treeData[0].children[0]['children'].push(item)
                } else if (item.type === 2) { // 代金券
                  self.treeData[0].children[1]['children'].push(item)
                } else if (item.type === 3) { // 礼品券
                  self.treeData[0].children[2]['children'].push(item)
                }
                self.choiceCoupon = true
              })
              console.log('编辑的选择卡券')
              self.submitData = []
              if (self.activityTab === 1) {
                if (self.onePartForm.inviteCard.length === 0) {
                  self.selectedCoupons = []
                  const setInterval1 = setInterval(function() {
                    if (self.choiceCoupon === true) {
                      clearInterval(setInterval1)
                      self.removeSelected()
                    }
                  }, 100)
                } else {
                  self.submitData = self.onePartForm.inviteCard
                  setTimeout(function () {
                    self.selectedCoupons = []
                    self.selectedCoupons = self.$refs.rangeTree.getCheckedNodes(true)
                    self.selectedCoupons.forEach((item, index) => {
                      item.surplus = item.quantity - item.statistics.received
                    })
                  }, 10)
                }
              } else if (self.activityTab === 2) {
                if (self.twoPartForm.inviteCard.length === 0) {
                  self.selectedCoupons = []
                  const setInterval2 = setInterval(function() {
                    if (self.choiceCoupon === true) {
                      clearInterval(setInterval2)
                      self.removeSelected()
                    }
                  }, 100)
                } else {
                  self.submitData = self.twoPartForm.inviteCard
                  setTimeout(function () {
                    self.selectedCoupons = []
                    self.selectedCoupons = self.$refs.rangeTree.getCheckedNodes(true)
                    self.selectedCoupons.forEach((item, index) => {
                      item.surplus = item.quantity - item.statistics.received
                    })
                  }, 10)
                }
              }
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
        // let treeName = 'rangeTree'
        if (!nodeKey) {
          this.$refs.rangeTree.setCheckedKeys([])
        } else {
          this.$refs.rangeTree.setChecked(nodeKey, false, true)
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
        console.log(self.threePartForm)
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (self.addEditType) {
              const properties = {
                stage_id: JSON.stringify(self.thisStageId * 1), // 本阶段id
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
                  win_img: self.threePartForm.winImg // 大奖获奖图片
                },
                show_rank_list: self.onePartForm.showRankList, // 显示排行榜,
                limit_num: self.onePartForm.limitNum, // 截止名次,
                pay_limit: self.onePartForm.payLimit, // 实付金额限制,
                title: self.twoPartForm.title, // 新人活动的标题
                newuser_banner: self.twoPartForm.actBanner, // 新人活动banner,
                newuser_adv_banner: self.twoPartForm.advBanner // 新人广告banner,
              }
              self.submitObject = {
                name: self.onePartForm.name,
                type: 3,
                template: 1,
                code: 31,
                start_date: self.onePartForm.rangeActivityDate[0],
                end_date: self.onePartForm.rangeActivityDate[1],
                properties: JSON.stringify(properties)
              }
              // console.log('编辑的确定按钮')
              platformActivityInviteEdit(this.submitObject, self.activityId).then(res => {
                let q = []
                // 查看邀请有礼卡券信息、批量删除后批量新建
                q.push(new Promise(function(resolve) {
                  self.editCard(res.info.id).then(function (resp) {
                    resolve(resp)
                  })
                }))
                // 查看邀请新人卡券信息、批量删除后批量新建
                q.push(new Promise(function(resolve) {
                  self.editCardNew(res.info.id).then(function (resp) {
                    resolve(resp)
                  })
                }))
                // 查看邀请有礼场地、批量删除后批量新建
                q.push(new Promise(function(resolve) {
                  self.editField(res.info.id).then(function (resp) {
                    resolve(resp)
                  })
                }))
                // 查看邀请新人场地、批量删除后批量新建
                q.push(new Promise(function(resolve) {
                  self.editFieldNew(res.info.id).then(function (resp) {
                    resolve(resp)
                  })
                }))
                Promise.all(q).then(function () {
                  self.$message({
                    type: 'success',
                    message: '修改成功!'
                  });
                  self.$router.push('/activityInvite')
                })
              })
            } else {
              const properties = {
                stage_id: JSON.stringify(self.thisStageId * 1 + 1), // 本阶段id
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
                  win_img: self.threePartForm.winImg // 大奖获奖图片
                },
                show_rank_list: self.onePartForm.showRankList, // 显示排行榜,
                limit_num: self.onePartForm.limitNum, // 截止名次,
                pay_limit: self.onePartForm.payLimit, // 实付金额限制,
                title: self.twoPartForm.title, // 新人活动的标题
                newuser_banner: self.twoPartForm.actBanner, // 新人活动banner,
                newuser_adv_banner: self.twoPartForm.advBanner // 新人广告banner,
              }
              self.submitObject = {
                name: self.onePartForm.name,
                type: 3,
                template: 1,
                code: 31,
                start_date: self.onePartForm.rangeActivityDate[0],
                end_date: self.onePartForm.rangeActivityDate[1],
                properties: JSON.stringify(properties)
              }
              // console.log('新增的确定按钮')
              platformActivityInviteAdd(this.submitObject).then(res => {
                this.$message({
                  type: 'success',
                  message: '保存成功!'
                });
                let q = []
                // 新建邀请有礼卡券
                q.push(new Promise(function(resolve) {
                  self.newCard(res.info.id).then(function (resp) {
                    resolve(resp)
                  })
                }))
                // 新建邀请新人卡券
                q.push(new Promise(function(resolve) {
                  self.newCardNew(res.info.id).then(function (resp) {
                    resolve(resp)
                  })
                }))
                // 新建邀请有礼场地
                q.push(new Promise(function(resolve) {
                  self.newField(res.info.id).then(function (resp) {
                    resolve(resp)
                  })
                }))
                // 新建邀请新人场地
                q.push(new Promise(function(resolve) {
                  self.newFieldNew(res.info.id).then(function (resp) {
                    resolve(resp)
                  })
                }))
                Promise.all(q).then(function () {
                  self.$message({
                    type: 'success',
                    message: '新建成功!'
                  });
                  self.$router.push('/activityInvite')
                })
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
       * 新建：邀请有礼卡券
       */
      newCard(id) {
        const self = this
        let newCard = new Promise(function(resolve) {
          const createArr = []
          self.onePartForm.inviteCard.forEach((item, index) => {
            createArr.push({ 'platCouponId': item, 'platformActivityId': id, 'isDelete': 1 })
          })
          platformActivityInviteCardAddArr({
            params: JSON.stringify(createArr)
          }).then(function (res) {
            resolve(res)
          })
        })
        return newCard
      },
      /**
       * 新建：邀请新人卡券
       */
      newCardNew(id) {
        const self = this
        let newCardNew = new Promise(function(resolve) {
          const createNewArr = []
          self.twoPartForm.inviteCard.forEach((item, index) => {
            createNewArr.push({ 'platCouponId': item, 'platformActivityId': id, 'isDelete': 1 })
          })
          platformActivityInviteCardNewAddArr({
            params: JSON.stringify(createNewArr)
          }).then(function (res) {
            resolve(res)
          })
        })
        return newCardNew
      },
      /**
       * 新建：邀请有礼场地
       */
      newField(id) {
        const self = this
        let newField = new Promise(function(resolve) {
          const fieldArr = []
          if (self.onePartForm.recommendField1.field) {
            fieldArr.push({
              'platformFieldId': self.onePartForm.recommendField1.field,
              'platformActivityId': id,
              'isDelete': 1
            })
          }
          if (self.onePartForm.recommendField2.field) {
            fieldArr.push({
              'platformFieldId': self.onePartForm.recommendField2.field,
              'platformActivityId': id,
              'isDelete': 1
            })
          }
          if (self.onePartForm.recommendField3.field) {
            fieldArr.push({
              'platformFieldId': self.onePartForm.recommendField3.field,
              'platformActivityId': id,
              'isDelete': 1
            })
          }
          platformActivityInviteFieldAddArr({
            params: JSON.stringify(fieldArr)
          }).then(function (res) {
            resolve(res)
          })
        })
        return newField
      },
      /**
       * 新建：邀请新人场地
       */
      newFieldNew(id) {
        const self = this
        let newFieldNew = new Promise(function(resolve) {
          const fieldNewArr = []
          if (self.twoPartForm.recommendField1.field) {
            fieldNewArr.push({
              'platFieldId': self.twoPartForm.recommendField1.field,
              'platformActivityId': id,
              'isDelete': 1
            })
          }
          if (self.twoPartForm.recommendField2.field) {
            fieldNewArr.push({
              'platFieldId': self.twoPartForm.recommendField2.field,
              'platformActivityId': id,
              'isDelete': 1
            })
          }
          if (self.twoPartForm.recommendField3.field) {
            fieldNewArr.push({
              'platFieldId': self.twoPartForm.recommendField3.field,
              'platformActivityId': id,
              'isDelete': 1
            })
          }
          platformActivityInviteFieldNewAddArr({
            params: JSON.stringify(fieldNewArr)
          }).then(function (res) {
            resolve(res)
          })
        })
        return newFieldNew
      },
      /**
       * 编辑：查看邀请有礼卡券信息、批量删除后批量新建
       */
      editCard(id) {
        const self = this
        let editCard = new Promise(function(resolve) {
          platformActivityInviteCardList({
            filters: {
              act_inv_coupon: {
                platformActivityId: {
                  equalTo: id
                }
              }
            },
            page_size: 1000
          }).then(resList => {
            const deleArr = []
            resList.info.result.forEach((item, index) => {
              deleArr.push(item.id)
            })
            const deleteParams = {
              ids: JSON.stringify(deleArr)
            }
            platformActivityInviteCardDeleteArr(deleteParams).then(resp => {
              const createArr = []
              self.onePartForm.inviteCard.forEach((item, index) => {
                createArr.push({ 'platCouponId': item, 'platformActivityId': id, 'isDelete': 1 })
              })
              platformActivityInviteCardAddArr({
                params: JSON.stringify(createArr)
              }).then(function (res) {
                resolve(res)
              })
            })
          })
        })
        return editCard
      },
      /**
       * 编辑：查看邀请新人卡券信息、批量删除后批量新建
       */
      editCardNew(id) {
        const self = this
        let editCardNew = new Promise(function(resolve) {
          platformActivityInviteCardNewList({
            filters: {
              act_inv_newuser_coupon: {
                platformActivityId: {
                  equalTo: id
                }
              }
            },
            page_size: 1000
          }).then(resList => {
            const deleNewArr = []
            resList.info.result.forEach((item, index) => {
              deleNewArr.push(item.id)
            })
            const deleteNewParams = {
              ids: JSON.stringify(deleNewArr)
            }
            platformActivityInviteCardNewDeleteArr(deleteNewParams).then(resp => {
              const createNewArr = []
              self.twoPartForm.inviteCard.forEach((item, index) => {
                createNewArr.push({ 'platCouponId': item, 'platformActivityId': id, 'isDelete': 1 })
              })
              platformActivityInviteCardNewAddArr({
                params: JSON.stringify(createNewArr)
              }).then(function (res) {
                resolve(res)
              })
            })
          })
        })
        return editCardNew
      },
      /**
       * 编辑：查看邀请新人卡券信息、批量删除后批量新建
       */
      editField(id) {
        const self = this
        let editField = new Promise(function(resolve) {
          platformActivityInviteFieldList({
            filters: {
              act_inv_rec_field: {
                platformActivityId: {
                  equalTo: id
                }
              }
            }
          }).then(resList => {
            const deleFieldArr = []
            if (resList.info.result.length > 0) {
              resList.info.result.forEach((item, index) => {
                deleFieldArr.push(item.id)
              })
              const deleteFieldParams = {
                ids: JSON.stringify(deleFieldArr)
              }
              platformActivityInviteFieldDeleteArr(deleteFieldParams).then(resp => {
                const fieldArr = []
                if (self.onePartForm.recommendField1.field) {
                  fieldArr.push({
                    'platformFieldId': self.onePartForm.recommendField1.field,
                    'platformActivityId': id,
                    'isDelete': 1
                  })
                }
                if (self.onePartForm.recommendField2.field) {
                  fieldArr.push({
                    'platformFieldId': self.onePartForm.recommendField2.field,
                    'platformActivityId': id,
                    'isDelete': 1
                  })
                }
                if (self.onePartForm.recommendField3.field) {
                  fieldArr.push({
                    'platformFieldId': self.onePartForm.recommendField3.field,
                    'platformActivityId': id,
                    'isDelete': 1
                  })
                }
                platformActivityInviteFieldAddArr({
                  params: JSON.stringify(fieldArr)
                }).then(function (res) {
                  resolve(res)
                })
              })
            } else {
              const fieldArr = []
              if (self.onePartForm.recommendField1.field) {
                fieldArr.push({
                  'platformFieldId': self.onePartForm.recommendField1.field,
                  'platformActivityId': id,
                  'isDelete': 1
                })
              }
              if (self.onePartForm.recommendField2.field) {
                fieldArr.push({
                  'platformFieldId': self.onePartForm.recommendField2.field,
                  'platformActivityId': id,
                  'isDelete': 1
                })
              }
              if (self.onePartForm.recommendField3.field) {
                fieldArr.push({
                  'platformFieldId': self.onePartForm.recommendField3.field,
                  'platformActivityId': id,
                  'isDelete': 1
                })
              }
              platformActivityInviteFieldAddArr({
                params: JSON.stringify(fieldArr)
              }).then(function (res) {
                resolve(res)
              })
            }
          })
        })
        return editField
      },
      /**
       * 编辑：查看邀请新人卡券信息、批量删除后批量新建
       */
      editFieldNew(id) {
        const self = this
        let editFieldNew = new Promise(function(resolve) {
          platformActivityInviteFieldNewList({
            filters: {
              act_inv_newuser_rec_field: {
                platformActivityId: {
                  equalTo: id
                }
              }
            }
          }).then(resList => {
            const deleFieldNewArr = []
            if (resList.info.result.length > 0) {
              resList.info.result.forEach((item, index) => {
                deleFieldNewArr.push(item.id)
              })
              const deleteFieldNewParams = {
                ids: JSON.stringify(deleFieldNewArr)
              }
              platformActivityInviteFieldNewDeleteArr(deleteFieldNewParams).then(resp => {
                const fieldArr = []
                if (self.twoPartForm.recommendField1.field) {
                  fieldArr.push({
                    'platFieldId': self.twoPartForm.recommendField1.field,
                    'platformActivityId': id,
                    'isDelete': 1
                  })
                }
                if (self.twoPartForm.recommendField2.field) {
                  fieldArr.push({
                    'platFieldId': self.twoPartForm.recommendField2.field,
                    'platformActivityId': id,
                    'isDelete': 1
                  })
                }
                if (self.twoPartForm.recommendField3.field) {
                  fieldArr.push({
                    'platFieldId': self.twoPartForm.recommendField3.field,
                    'platformActivityId': id,
                    'isDelete': 1
                  })
                }
                platformActivityInviteFieldNewAddArr({
                  params: JSON.stringify(fieldArr)
                }).then(function (res) {
                  resolve(res)
                })
              })
            } else {
              const fieldArr = []
              if (self.twoPartForm.recommendField1.field) {
                fieldArr.push({
                  'platFieldId': self.twoPartForm.recommendField1.field,
                  'platformActivityId': id,
                  'isDelete': 1
                })
              }
              if (self.twoPartForm.recommendField2.field) {
                fieldArr.push({
                  'platFieldId': self.twoPartForm.recommendField2.field,
                  'platformActivityId': id,
                  'isDelete': 1
                })
              }
              if (self.twoPartForm.recommendField3.field) {
                fieldArr.push({
                  'platFieldId': self.twoPartForm.recommendField3.field,
                  'platformActivityId': id,
                  'isDelete': 1
                })
              }
              platformActivityInviteFieldNewAddArr({
                params: JSON.stringify(fieldArr)
              }).then(function (res) {
                resolve(res)
              })
            }
          })
        })
        return editFieldNew
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
          self.$set(self.threePartForm, 'winImg', JSON.parse(res.data.info.result[0].properties).best_prize.win_img)
          self.$set(self.onePartForm, 'showRankList', JSON.parse(res.data.info.result[0].properties).show_rank_list)
          self.$set(self.onePartForm, 'limitNum', JSON.parse(res.data.info.result[0].properties).limit_num)
          self.$set(self.onePartForm, 'payLimit', JSON.parse(res.data.info.result[0].properties).pay_limit)
          self.$set(self.twoPartForm, 'title', JSON.parse(res.data.info.result[0].properties).title)
          self.$set(self.twoPartForm, 'actBanner', JSON.parse(res.data.info.result[0].properties).newuser_banner)
          self.$set(self.twoPartForm, 'advBanner', JSON.parse(res.data.info.result[0].properties).newuser_adv_banner)
          self.thisStageId = JSON.parse(res.data.info.result[0].properties).stage_id
          // 查询邀请有礼卡券信息
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
            if (resList.info.result.length > 0) {
              resList.info.result.forEach((item, index) => {
                oneCard.push(item.platCouponId)
              })
            }
            self.$set(self.onePartForm, 'inviteCard', oneCard)
          })
          // 查询邀请新人卡券信息
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
          // 查询邀请有礼场地信息
          platformActivityInviteFieldList({
            filters: {
              act_inv_rec_field: {
                platformActivityId: {
                  equalTo: res.data.info.result[0].id
                }
              }
            },
            includes: {
              platform_field: {
                includes: ['platformFieldId']
              }
            }
          }).then(resList => {
            if (resList.info.length === 1) {
              self.$set(self.onePartForm.recommendField1, 'stroe', resList.info[0].includes.platform_field.spaceId)
              self.$set(self.onePartForm.recommendField1, 'space', resList.info[0].includes.platform_field.storeId)
              self.$set(self.onePartForm.recommendField1, 'field', resList.info[0].includes.platform_field.id)
            } else if (resList.info.length === 2) {
              self.$set(self.onePartForm.recommendField1, 'stroe', resList.info[0].includes.platform_field.spaceId)
              self.$set(self.onePartForm.recommendField1, 'space', resList.info[0].includes.platform_field.storeId)
              self.$set(self.onePartForm.recommendField1, 'field', resList.info[0].includes.platform_field.id)
              self.$set(self.onePartForm.recommendField2, 'stroe', resList.info[1].includes.platform_field.spaceId)
              self.$set(self.onePartForm.recommendField2, 'space', resList.info[1].includes.platform_field.storeId)
              self.$set(self.onePartForm.recommendField2, 'field', resList.info[1].includes.platform_field.id)
            } else if (resList.info.length === 3) {
              self.$set(self.onePartForm.recommendField1, 'stroe', resList.info[0].includes.platform_field.spaceId)
              self.$set(self.onePartForm.recommendField1, 'space', resList.info[0].includes.platform_field.storeId)
              self.$set(self.onePartForm.recommendField1, 'field', resList.info[0].includes.platform_field.id)
              self.$set(self.onePartForm.recommendField2, 'stroe', resList.info[1].includes.platform_field.spaceId)
              self.$set(self.onePartForm.recommendField2, 'space', resList.info[1].includes.platform_field.storeId)
              self.$set(self.onePartForm.recommendField2, 'field', resList.info[1].includes.platform_field.id)
              self.$set(self.onePartForm.recommendField3, 'stroe', resList.info[2].includes.platform_field.spaceId)
              self.$set(self.onePartForm.recommendField3, 'space', resList.info[2].includes.platform_field.storeId)
              self.$set(self.onePartForm.recommendField3, 'field', resList.info[2].includes.platform_field.id)
            }
          })
          // 查询邀请新人场地信息
          platformActivityInviteFieldNewList({
            filters: {
              act_inv_newuser_rec_field: {
                platformActivityId: {
                  equalTo: res.data.info.result[0].id
                }
              }
            },
            includes: {
              platform_field: {
                includes: ['platFieldId']
              }
            }
          }).then(resList => {
            if (resList.info.length === 1) {
              self.$set(self.twoPartForm.recommendField1, 'stroe', resList.info[0].includes.platform_field.spaceId)
              self.$set(self.twoPartForm.recommendField1, 'space', resList.info[0].includes.platform_field.storeId)
              self.$set(self.twoPartForm.recommendField1, 'field', resList.info[0].includes.platform_field.id)
            } else if (resList.info.length === 2) {
              self.$set(self.twoPartForm.recommendField1, 'stroe', resList.info[0].includes.platform_field.spaceId)
              self.$set(self.twoPartForm.recommendField1, 'space', resList.info[0].includes.platform_field.storeId)
              self.$set(self.twoPartForm.recommendField1, 'field', resList.info[0].includes.platform_field.id)
              self.$set(self.twoPartForm.recommendField2, 'stroe', resList.info[1].includes.platform_field.spaceId)
              self.$set(self.twoPartForm.recommendField2, 'space', resList.info[1].includes.platform_field.storeId)
              self.$set(self.twoPartForm.recommendField2, 'field', resList.info[1].includes.platform_field.id)
            } else if (resList.info.length === 3) {
              self.$set(self.twoPartForm.recommendField1, 'stroe', resList.info[0].includes.platform_field.spaceId)
              self.$set(self.twoPartForm.recommendField1, 'space', resList.info[0].includes.platform_field.storeId)
              self.$set(self.twoPartForm.recommendField1, 'field', resList.info[0].includes.platform_field.id)
              self.$set(self.twoPartForm.recommendField2, 'stroe', resList.info[1].includes.platform_field.spaceId)
              self.$set(self.twoPartForm.recommendField2, 'space', resList.info[1].includes.platform_field.storeId)
              self.$set(self.twoPartForm.recommendField2, 'field', resList.info[1].includes.platform_field.id)
              self.$set(self.twoPartForm.recommendField3, 'stroe', resList.info[2].includes.platform_field.spaceId)
              self.$set(self.twoPartForm.recommendField3, 'space', resList.info[2].includes.platform_field.storeId)
              self.$set(self.twoPartForm.recommendField3, 'field', resList.info[2].includes.platform_field.id)
            }
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
