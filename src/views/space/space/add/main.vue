<template>
  <div class="admin-space">
    <lh-tab
      :activityTab="activityTab"
      :tabList="tabList"
      @tabToggle="val => activityTab = val"></lh-tab>

    <!-- first step -->
    <el-form
      v-show="activityTab === 1"
      :model="onePartForm"
      ref="onePartForm"
      :rules="onePartFormRule"
      label-width="180px"
      class="demo-ruleForm">

      <div class="card-padding card-padding-vertical mt30">
        <h3 class="grid-title">基础信息</h3>
        <el-form-item label="场地类型" prop="type">
          <el-radio-group
            v-model="onePartForm.type"
            :disabled="fieldType">
            <el-radio-button label="1">会议室</el-radio-button>
            <el-radio-button label="3">工位</el-radio-button>
          </el-radio-group>
          &nbsp;&nbsp;
          <span class="theme-gray">场地类型一旦设置不能更改</span>
        </el-form-item>

        <el-form-item label="场地名称" prop="fieldName">
          <el-input
            v-model.trim="onePartForm.fieldName"
            :maxlength="15"
            :disabled="noAllow"
            placeholder="请填写场地名称"
            class="width240px"></el-input>
            &nbsp;&nbsp;
            <span class="theme-gray">为了保证展示效果，限制字数15个字以内</span></el-form-item>

        <el-form-item label="所属门店" prop="storeId">
          <el-select
            v-model.trim="onePartForm.storeId"
            @change="showStoreAddr(onePartForm.storeId)"
            :disabled="noAllow"
            class="width240px"
            placeholder="请选择门店">
            <el-option
              v-for="item in storeList"
              :label="item.storeName"
              :value="item.id"
              :key="item.id">
            </el-option>
          </el-select>
          &nbsp;&nbsp;
          <span class="theme-gray">{{ onePartForm.storeAddr || '' }}</span></el-form-item>

        <el-form-item label="上传图片" prop="imgs">
          <lh-uploads
            :imgsArr="onePartForm.imgs"
            :imgsLenght="imgsLenght"
            :noAllow="noAllow"></lh-uploads></el-form-item>

        <h3 class="grid-title">硬件设施</h3>
        <el-form-item label="设备">
          <el-checkbox
            v-for="city in equipmentsList"
            v-model="city.checked"
            :label="city"
            :key="city.id"
            :disabled="noAllow">{{city.name}}</el-checkbox></el-form-item>

        <el-form-item label="最大容纳人数" prop="maxAdmissibleNum">
          <el-input
            :maxlength="4"
            v-model.trim="onePartForm.maxAdmissibleNum"
            :disabled="noAllow"
            class="width80px"></el-input>
            &nbsp;&nbsp;
            <span class="theme-gray">人</span></el-form-item>

        <el-form-item label="场地面积" prop="area">
          <el-input
            :maxlength="4"
            v-model.trim="onePartForm.area"
            :disabled="noAllow"
            class="width80px"></el-input>
            &nbsp;&nbsp;
            <span class="theme-gray">m²</span></el-form-item>

        <el-row class="text-center">
          <el-button
            @click="addPartOne('onePartForm')"
            class="mt20 width120px"
            type="primary">{{ !noAllow ? '保存并继续' : '编辑'}}</el-button></el-row>
      </div>
    </el-form>

    <!-- second step -->
    <el-form
      v-show="activityTab === 2"
      :model="twoPartForm"
      ref="twoPartForm"
      :rules="twoPartFormRule"
      label-width="180px"
      class="demo-ruleForm">

      <div class="card-padding card-padding-vertical mt30">
        <h3 class="grid-title">时段设置</h3>
        <el-form-item label="可预约时段" prop="startTime" required class="dib">
          <el-time-select
            v-model="twoPartForm.startTime"
            @change="changeStartTime"
            :disabled="noAllow"
            format="HH:mm"
            placeholder="起始时间"
            :picker-options="{ start: '00:00', step: '00:30', end: '23:30' }"></el-time-select></el-form-item>

        <el-form-item prop="endTime" required class="dib ml30" label-width="0">
          <el-time-select
            v-model="twoPartForm.endTime"
            :disabled="noAllow"
            placeholder="结束时间"
            format="HH:mm"
            :picker-options="{ start: twoPartForm.dateStartTime, step: '00:30', end: '23:30' }"></el-time-select></el-form-item>

        <el-form-item label="可提前取消时间" prop="type">
          <el-radio
            v-model="twoPartForm.type"
            :disabled="noAllow"
            class="radio fl line-height40"
            label="1">允许取消</el-radio>

          <el-form-item
            v-show="twoPartForm.type === '1'"
            prop="cancalBeforeHours"
            class="fl ml15">
            <el-select
              v-model="twoPartForm.cancalBeforeHours"
              @change="twoPartForm.type = '1'"
              :disabled="noAllow"
              class="width140px">
              <el-option
                v-for="item in hoursList"
                :label="item.label"
                :key="item.value"
                :value="item.value"></el-option></el-select>
            &nbsp;&nbsp;
            <span class="theme-gray">小时</span></el-form-item>

          <el-radio
            v-model="twoPartForm.type"
            :disabled="noAllow"
            class="radio ml30"
            label="2">不允许取消</el-radio></el-form-item>

        <el-form-item label="工位数量" prop="stationNum">
          <el-input
            v-model.trim="twoPartForm.stationNum"
            :disabled="noAllow"
            :maxlength="3"
            class="width210px"
            placeholder="请输入工位数"
            clearable></el-input>
            &nbsp;&nbsp;
            <span class="theme-gray">请输入1-999间的整数</span></el-form-item>

        <h3 class="grid-title">费用设置</h3>
        <el-form-item label="收费标准" prop="hourPrice">
          <el-input
            v-model.trim="twoPartForm.hourPrice"
            :disabled="noAllow"
            :maxlength="4"
            class="width80px"></el-input>
            &nbsp;&nbsp;
            <span class="theme-gray">元/天</span></el-form-item>

        <el-form-item label="支付方式" prop="payType">
          <el-checkbox-group v-model="twoPartForm.payType">
            <el-checkbox
              v-for="payItem in paymentList"
              :key="payItem.name"
              :label="payItem.name"
              :disabled="noAllow"
              border>{{ payItem.value }}</el-checkbox>
          </el-checkbox-group></el-form-item>


        <el-form-item label="优惠设置">
          <el-checkbox
            v-model="twoPartForm.canUseCoupon"
            :disabled="noAllow"
            :true-label="1"
            :false-label="0"
            border>允许使用优惠券</el-checkbox>

          <el-checkbox
            v-model="twoPartForm.canUsePoint"
            :disabled="noAllow"
            :true-label="1"
            :false-label="0"
            border>允许使用积分抵扣</el-checkbox>
            &nbsp;&nbsp;
            <span class="theme-gray">10积分=1元</span></el-form-item>

        <el-row class="text-center">
          <el-button
            @click="addPartTwo('twoPartForm')"
            class="mt20 width120px"
            type="primary" >{{ !noAllow ? '保存并继续' : '编辑'}}</el-button>
        </el-row>
      </div>
    </el-form>

    <!-- third step -->
    <el-form
      v-show="activityTab === 3"
      :model="threePartForm"
      ref="threePartForm"
      :rules="threePartFormRule"
      label-width="180px"
      class="demo-ruleForm">

      <div class="card-padding card-padding-vertical mt30">
        <h3 class="grid-title">更多设置</h3>
        <el-form-item label="场地联系人姓名" prop="contactName">
          <el-input
            v-model.trim="threePartForm.contactName"
            :disabled="noAllow"
            placeholder="请输入姓名"
            class="width210px"></el-input></el-form-item>

        <el-form-item class="is-required" label="场地联系人电话">
          <el-select
            v-model="telLineSelected"
            :disabled="noAllow"
            class="width150px fl"
            placeholder="请选择联系方式">

            <el-option label="手机号码" value="0"></el-option>
            <el-option label="固定电话" value="1"></el-option>
          </el-select>

          <el-form-item prop="contactTel" class="fl dib ml30">
            <el-input
              v-if="telLineSelected === '0'"
              v-model.trim="threePartForm.contactTel"
              :disabled="noAllow"
              :maxlength="11"
              class="width210px"
              placeholder="请输入联系方式"></el-input>

            <el-input
              v-else
              v-model.trim="threePartForm.contactTel"
              :disabled="noAllow"
              :maxlength="12"
              class="width210px"
              placeholder="请输入联系方式"></el-input>
          </el-form-item>
        </el-form-item>

        <el-row class="limit-words-box">
          <div class="limit-words-in">
            <div class="limit-words theme-gray">字数：{{ editor1TextLength }}</div>
          </div>

          <el-form-item label="设施与服务（选填）">
            <div class="editor-container quill-editor-box">
              <quill-editor
                v-model.trim="threePartForm.facilitiesAndServices"
                ref="myQuillEditor1"
                :options="editorOption1"
                @change="onTextChange1($event)"
                :disabled="noAllow"></quill-editor></div>
          </el-form-item>
        </el-row>

        <el-row class="limit-words-box">
          <div class="limit-words-in">
            <div class="limit-words theme-gray">字数：{{ editor2TextLength }}</div>
          </div>

          <el-form-item label="使用须知（选填）">
            <div class="editor-container quill-editor-box">
              <quill-editor
                v-model.trim="threePartForm.instructionsForUse"
                ref="myQuillEditor2"
                :options="editorOption1"
                @change="onTextChange2($event)"
                :disabled="noAllow"></quill-editor></div>
          </el-form-item>
        </el-row>

        <el-row class="text-center">
          <el-button
            @click="addPartThree('threePartForm', 'preview')"
            class="width120px"
            type="primary" >{{ !noAllow ? '保存并预览' : '预览'}}</el-button>

          <el-button
            v-if="type === 'new'"
            @click="addPartThree('threePartForm')"
            class="width120px"
            type="primary" >创建场地</el-button>

          <el-button
            v-else
            @click="addPartThree('threePartForm')"
            class="width120px"
            type="primary" >{{ !noAllow ? '保存' : '编辑'}}</el-button>
        </el-row>
      </div>
    </el-form>

    <!-- 扫码预览 -->
    <el-dialog
      title="扫码预览"
      :visible.sync="dialogVisible"
      width="298px"
      class="qr-box-more">

      <div class="qr-box">
        <qr-code
          :text="config.text"
          :size="258"
          error-level="L"></qr-code></div>
    </el-dialog>
  </div>
</template>

<script>
  import tab from '@/components/tab'
  import uploads from '@/components/uploads'
  import qrCode from 'vue-qrcode-component'
  import { quillEditor } from 'vue-quill-editor'
  import { pageData, onePartForm, twoPartForm, threePartForm } from './add.data'
  import { findAllStore, findFieldDetail, addOrUpdateFieldPartOne, addOrUpdateFieldPartTwo, addOrUpdateFieldPartThree, equipmentList, paymentType } from '@/service'

  export default {
    components: {
      quillEditor,
      qrCode,
      [tab.name]: tab,
      [uploads.name]: uploads
    },
    data () {
      return {
        id: this.$route.query.id,     // 场地id
        type: this.$route.query.type, // 区分新增 new和编辑edit
        noAllow: !!this.$route.query.noAllow,
        ifDraftSpace: 0,    // 是不是场地草稿，是则退出提示一下
        addEditType: 0,     // 区分编辑还是新增
        activityTab: 1,     // tab 的门
        switch: 1,          // tab 的值
        tabList: ['填写场地基本信息', '设置可用时段及费用', '使用须知及服务'],

        // tab 1
        imgsLenght: 5,      // 限制上传图片数量
        storeList: [],
        onePartFormRule: pageData.onePartFormRule,
        onePartForm: onePartForm(),
        fieldType: !(!this.$route.query.id || (this.$route.query.type === 'saveDraftTip')), // 场地类型不能更改

        // tab 2
        paymentList: [],    // 支付方式列表
        equipmentsList: [], // 设备列表
        twoPartFormRule: pageData.twoPartFormRule,
        hoursList: pageData.hoursList,
        twoPartForm: twoPartForm(),

        // tab 3
        config: { text: '' },
        editorOption1: pageData.editorOption1,
        dialogVisible: false,
        giveUpEditing: false,
        telLineSelected: '0',
        threePartFormRule: pageData.threePartFormRule,
        threePartForm: threePartForm(),
        quillLenght: 500,   // 富文本编辑器的length
        editor1TextLength: 0,
        editor2TextLength: 0
      }
    },
    beforeRouteLeave(to, from, next) {
      const self = this
      // 从新增和草稿箱进来，如果调用了第1、2步接口，没有调用第3步接口，就表示此场地为草稿箱，退出页面给予提示
      if (self.type === 'saveDraftTip' && self.ifDraftSpace) {
        self.setMsg('success', '已保存至草稿箱')
      }
      next()
    },
    computed: {
      imgsLength () {
        if (this.noAllow) {
          return this.onePartForm.imgs.length
        } else {
          return this.onePartForm.imgs[this.onePartForm.imgs.length - 1].img != null ? this.onePartForm.imgs.length : this.onePartForm.imgs.length - 1
        }
      }
    },
    created() {
      const self = this
      findAllStore().then(res => {
        if (res.status === 'true') {
          self.storeList = res.info
        }
      })
      paymentType().then(res => {
        if (res.status === 'true' && res.info) {
          self.paymentList = res.info
        }
      })
      equipmentList({ fieldId: self.id }).then(res => {
        if (res.status === 'true') {
          self.equipmentsList = res.info
        }
      })
    },
    mounted() {
      this.pageTitle()
    },
    methods: {
      pageTitle() {
        const self = this
        let titleName

        if (!self.id) {
          titleName = '发布场地'
          self.addEditType = 0
        } else {
          if (self.noAllow) {
            titleName = '场地详情'
          } else {
            titleName = '编辑场地'
          }
          self.addEditType = 1
          self.getPageData()
        }

        document.title = titleName
        self.$store.commit('NAV_CRUMB', titleName)
      },
      toggleNoAllow() {
        const self = this
        self.noAllow = !self.noAllow
        if (self.noAllow && (self.onePartForm.imgs.length < self.imgsLenght)) {
          self.onePartForm.imgs.pop()
        }
      },
      getPageData() {
        const self = this
        findFieldDetail({ fieldId: self.id }).then(res => {
          if (res.status === 'true') {
            let resInfo = res.info
            let fieldData = resInfo.field
            self.onePartForm = {
              fieldName: fieldData.fieldName,
              type: fieldData.type,
              storeId: fieldData.storeId,
              maxAdmissibleNum: fieldData.maxAdmissibleNum,
              area: fieldData.area,
              storeAddr: fieldData.storeAddr,
              imgs: resInfo.fieldImgs.map(img => ({ img: img.img, mainImg: img.mainImg }))
            }
            self.showStoreAddr(self.onePartForm.storeId)

            self.twoPartForm = {
              startTime: resInfo.appointment === null ? '' : resInfo.appointment.startTime,
              endTime: resInfo.appointment === null ? '' : resInfo.appointment.endTime,
              type: (fieldData.cancalBeforeHours > -1) ? '1' : '2',
              hourPrice: fieldData.hourPrice,
              payType: resInfo.paymentTypeList,
              cancalBeforeHours: fieldData.cancalBeforeHours || 3,
              canUseCoupon: fieldData.canUseCoupon,
              stationNum: fieldData.stationNum,
              canUsePoint: fieldData.canUsePoint
            }

            self.threePartForm = {
              contactName: fieldData.contactName,
              contactTel: fieldData.contactTel,
              telLineSelected: (fieldData.contactTel && fieldData.contactTel.length > 11) ? '1' : '0',
              facilitiesAndServices: fieldData.facilitiesAndServices,
              instructionsForUse: fieldData.instructionsForUse
            }
          }
        })
      },

      // part 1
      validateForm () {
        const self = this
        if (!self.onePartForm.imgs[0].img) {
          self.setMsg('请上传场地图片')
          return
        }

        self.onePartForm.mainImg = ''
        for (let list of self.onePartForm.imgs) {
          if (list.mainImg === 1) {
            self.onePartForm.mainImg = list.img
          }
        }
        if (!self.onePartForm.mainImg) {
          self.setMsg('请设置场地主图')
          return
        }
        return true
      },
      addPartOne(formName) {
        const self = this
        if (self.noAllow) {
          self.toggleNoAllow()
        } else {
          self.$refs[formName].validate((valid) => {
            if (valid) {
              if (!this.validateForm()) return

              let onePartForm = self.onePartForm
              const paramsJson = {
                id: self.id,
                fieldName: onePartForm.fieldName,
                type: onePartForm.type,
                storeId: onePartForm.storeId,
                maxAdmissibleNum: onePartForm.maxAdmissibleNum,
                area: onePartForm.area,
                imgs: onePartForm.imgs.map((item) => {
                  if (item.img) return item.img
                }),
                mainImg: onePartForm.mainImg,
                equipments: self.equipmentsList.map((i) => {
                  if (i.checked) return i.id
                })
              }
              // console.log('paramsJson: ', paramsJson)

              addOrUpdateFieldPartOne(paramsJson).then(res => {
                if (res.status === 'true') {
                  if (self.addEditType === 1) {
                    self.setMsg('success', '已更新')
                  } else {
                    self.setMsg('success', '完成场地新增第一步')
                  }
                  self.switch = 2       // 打开第三道门
                  self.activityTab = 2  // 切换到第二道门
                  self.id = res.info.id // 保存新增id
                  self.ifDraftSpace = 1
                } else self.setMsg('error', res.msg)
              })
            } else return
          });
        }
      },
      // 选择门店之后，旁边显示对应的地址
      showStoreAddr(id) {
        const self = this
        for (var item of self.storeList) {
          if (id === item.id) {
            self.onePartForm.storeAddr = item.provinceName + item.cityName + item.districtName + item.address
          }
        }
      },

      // part 2
      changeStartTime() {
        const self = this
        let time = self.twoPartForm.startTime.split(/:/)
        let a = time[0]
        let b = time[1]
        let c = '00'
        let d

        if (b === '00') {
          c = '30'
          d = a
        } else {
          c = '00'
          if (a <= 8) {
            a++
            d = '0' + a
          } else {
            a++
            d = a
            // 超过23:30的，就显示为空
          }
        }
        self.twoPartForm.dateStartTime = d + ':' + c
        // console.log('self.twoPartForm.dateStartTime', self.twoPartForm.dateStartTime, self.twoPartForm.date)
      },
      addPartTwo(formName) {
        const self = this
        if (self.noAllow) {
          self.toggleNoAllow()
        } else {
          self.$refs[formName].validate((valid) => {
            if (valid) {
              let twoPartForm = self.twoPartForm
              const paramsJson = {
                id: self.id,
                endTime: twoPartForm.endTime,
                payType: twoPartForm.payType,
                hourPrice: twoPartForm.hourPrice,
                startTime: twoPartForm.startTime,
                stationNum: twoPartForm.stationNum,
                canUsePoint: twoPartForm.canUsePoint ? twoPartForm.canUsePoint : 0,
                canUseCoupon: twoPartForm.canUseCoupon ? twoPartForm.canUseCoupon : 0,
                cancalBeforeHours: (twoPartForm.type === '2') ? -1 : twoPartForm.cancalBeforeHours
              }
              // console.log('paramsJson: ', paramsJson)

              addOrUpdateFieldPartTwo(paramsJson).then(res => {
                if (res.status === 'true') {
                  if (self.addEditType === 1) {
                    self.setMsg('success', '已更新')
                  } else {
                    self.setMsg('success', '完成场地新增第二步')
                  }
                  self.switch = 3      // 打开第三道门
                  self.activityTab = 3 // 切换到第二道门
                  self.ifDraftSpace = 1
                } else {
                  self.setMsg('error', res.msg)
                }
              })
            } else return
          })
        }
      },

      // part 3
      addPartThree(formName, preview) {
        const self = this
        if (self.noAllow) {
          // if 详情页，只预览不保存
          // else 点击编辑按钮
          if (preview === 'preview') {
            self.showQr()
          } else {
            self.toggleNoAllow()
          }
        } else {
          self.$refs[formName].validate((valid) => {
            if (valid) {
              let threePartForm = self.threePartForm
              const paramsJson = {
                id: self.id,
                contactName: threePartForm.contactName,
                contactTel: threePartForm.contactTel,
                facilitiesAndServices: threePartForm.facilitiesAndServices,
                instructionsForUse: threePartForm.instructionsForUse
              }
              // console.log('paramsJson: ', paramsJson)

              addOrUpdateFieldPartThree(paramsJson).then(res => {
                if (res.status === 'true') {
                  // 保存并预览的状态
                  if (preview === 'preview') {
                    if (self.id) {
                      self.setMsg('success', '保存成功!')
                      self.toggleNoAllow()
                    }
                    self.showQr()
                  } else {
                    // 新增场地之后，跳转到场地列表，其它情况做切换noAllow 不跳转
                    if (!self.$route.query.id || (self.type === 'saveDraftTip')) {
                      self.setMsg('success', '完成场地新增!')
                      self.ifDraftSpace = 0
                      self.$router.push('/')
                    } else {
                      self.setMsg('success', '保存成功!')
                      self.toggleNoAllow()
                    }
                  }
                } else self.setMsg('error', res.msg)
              })
            } else return
          });
        }
      },
      showQr() {
        const self = this
        self.dialogVisible = true
        self.config.text = location.origin + location.pathname + '#/space-preview?id=' + self.id
      },
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
  .admin-space {
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
  }
</style>
<style lang="scss" scoped>
  @import 'src/styles/config.scss';
  .admin-space {
    .limit-words-in {
      position: relative;
      width: 180px;

      .limit-words {
        position: absolute;
        top: 40px;
        right: 20px;
      }
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
    .quill-editor-box {
      .quill-editor {
        height: 250px;
      }
    }
  }
</style>
