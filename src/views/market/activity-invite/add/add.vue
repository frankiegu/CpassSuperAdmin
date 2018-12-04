<template>
  <div class="page-activity-com">
    <lh-title :title="titleName" :noBorder="true"></lh-title>

    <!-- tab 切换 -->
    <lh-page-tab
      :activityTab="activityTab"
      :tabList="tabList"
      @tabToggle="toggleTab" />

    <div class="lh-card-main lh-card-body">
      <h3 class="step-one-title" v-if="activityTab === 1">邀请有礼页配置</h3>
      <h3 class="step-one-title" v-if="activityTab === 2">新人活动页配置</h3>
      <!-- first step -->
      <el-form :model="onePartForm" v-show="activityTab === 1" ref="onePartForm">
        <el-form-item label="标题" label-width="120px" class="mt40">
          <el-input v-model="onePartForm.title" class="activity-name" placeholder="标题"></el-input>
        </el-form-item>

        <el-form-item label="顶部banner" label-width="120px">
          <el-upload style="width: 100px;display: inline-block;"
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card">
            <i class="el-icon-plus"></i>
          </el-upload>
          <div style="width: 200px;display: inline-block;vertical-align: top;margin-left: 20px;">
            <p>建议尺寸： 750 * 1206PX</p>
            <p>支持格式： JPG / PNG</p>
          </div>
        </el-form-item>

        <el-form-item label="活动规则 " label-width="120px">
          <div class="editor-container quill-editor-box">
            <quill-editor
              ref="myQuillEditor1"
              :options="editorOption1"
              @change="onTextChange1($event)"></quill-editor>
          </div>
        </el-form-item>

        <el-form-item label="阶段活动时间" label-width="120px">
          <div>
            <el-date-picker
              class="width340px"
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

        <el-form-item label="最高奖励金额" label-width="120px">
          <el-input class="activity-name" placeholder="最高奖励金额"></el-input>
        </el-form-item>

        <el-form-item label="单次奖励" label-width="120px">
          <el-input class="activity-name" placeholder="单次奖励"></el-input>
        </el-form-item>

        <el-form-item label="成功邀请人数" label-width="120px">
          <p>12</p>
        </el-form-item>

        <el-form-item label="选择卡券" label-width="120px">
          <el-button type="primary">选择卡券</el-button>
        </el-form-item>

        <el-form-item label="推荐场地" label-width="120px">
          <el-button type="primary">添加场地1</el-button>
          <el-button type="primary">添加场地2</el-button>
          <el-button type="primary">添加场地3</el-button>
        </el-form-item>

        <el-form-item label="显示消息栏" label-width="120px">
          <el-switch v-model="onePartForm.title"></el-switch>
        </el-form-item>

        <el-form-item label="加码好礼" label-width="120px">
          <el-row style="margin-bottom: 10px;">
            <el-select placeholder="选择发放方式" style="width:125px;">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
            <el-input class="activity-name" style="width: 110px;" placeholder="奖品名称"></el-input>
            <el-input class="activity-name" style="width: 110px;" placeholder="数量展示"></el-input>
            <el-button type="primary">图片1</el-button>
          </el-row>
          <el-row style="margin-bottom: 10px;">
            <el-select placeholder="选择发放方式" style="width:125px;">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
            <el-input class="activity-name" style="width: 110px;" placeholder="奖品名称"></el-input>
            <el-input class="activity-name" style="width: 110px;" placeholder="数量展示"></el-input>
            <el-button type="primary">图片2</el-button>
          </el-row>
          <el-row>
            <el-select placeholder="选择发放方式" style="width:125px;">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
            <el-input class="activity-name" style="width: 110px;" placeholder="奖品名称"></el-input>
            <el-input class="activity-name" style="width: 110px;" placeholder="数量展示"></el-input>
            <el-button type="primary">图片3</el-button>
          </el-row>
        </el-form-item>

        <el-form-item label="加码好礼获奖人数限制" label-width="120px">
          <el-input class="activity-name" placeholder="加码好礼获奖人数限制"></el-input>
        </el-form-item>

        <el-form-item label="终极大奖" label-width="120px">
          <el-input class="activity-name" style="width: 180px;" placeholder="奖品名称"></el-input>
          <el-input class="activity-name" style="width: 180px;" placeholder="数量展示"></el-input>
          <el-button type="primary">配图</el-button>
        </el-form-item>

        <el-form-item label="显示排行榜" label-width="120px">
          <el-switch v-model="onePartForm.title"></el-switch>
        </el-form-item>

        <el-form-item label="截止名次" label-width="120px">
          <el-input class="activity-name" placeholder="截止名次"></el-input>
        </el-form-item>

        <el-form-item label="实付金额限制" label-width="120px">
          <el-input class="activity-name" placeholder="实付金额限制"></el-input>
        </el-form-item>

        <el-button
          @click="nextForm"
          class="to-bottom-right width80px mt30"
          type="primary">下一步</el-button>
      </el-form>

      <!-- second step -->
      <el-form :model="twoPartForm" v-show="activityTab === 2" ref="twoPartForm">
        <el-form-item label="标题" label-width="120px" class="mt40">
          <el-input v-model="twoPartForm.title" class="activity-name" placeholder="标题"></el-input>
        </el-form-item>

        <el-form-item label="活动banner" label-width="120px">
          <el-upload style="width: 100px;display: inline-block;"
                     action="https://jsonplaceholder.typicode.com/posts/"
                     list-type="picture-card">
            <i class="el-icon-plus"></i>
          </el-upload>
          <div style="width: 200px;display: inline-block;vertical-align: top;margin-left: 20px;">
            <p>建议尺寸： 750 * 1206PX</p>
            <p>支持格式： JPG / PNG</p>
          </div>
        </el-form-item>

        <el-form-item label="添加卡券" label-width="120px">
          <el-button type="primary">添加卡券</el-button>
        </el-form-item>

        <el-form-item label="推荐场地" label-width="120px">
          <el-button type="primary">添加场地1</el-button>
          <el-button type="primary">添加场地2</el-button>
          <el-button type="primary">添加场地3</el-button>
        </el-form-item>

        <el-form-item label="广告banner" label-width="120px">
          <el-upload style="width: 100px;display: inline-block;"
                     action="https://jsonplaceholder.typicode.com/posts/"
                     list-type="picture-card">
            <i class="el-icon-plus"></i>
          </el-upload>
          <div style="width: 200px;display: inline-block;vertical-align: top;margin-left: 20px;">
            <p>建议尺寸： 750 * 1206PX</p>
            <p>支持格式： JPG / PNG</p>
          </div>
        </el-form-item>

        <el-button plain class="ml12" @click="toPrev(1)">上一步</el-button>
        <el-button
          @click="sure"
          class="to-bottom-right width80px mt30"
          type="primary">确认</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
  import upload from '@/components/upload'
  import pageTab from '../components/page-tab.vue'
  import { quillEditor } from 'vue-quill-editor'

  export default {
    mixins: [],
    components: {
      [pageTab.name]: pageTab,
      [upload.name]: upload,
      quillEditor
    },
    data () {
      return {
        activityId: this.$route.query.id, // 编辑的数据id
        type: this.$route.query.type, // 页面类型  add || edit
        titleName: '', // 页面展示的title
        tabList: ['① 邀请有礼页配置', '② 新人活动页配置'], // tab页显示文字
        activityTab: 1, // 当前展示tab页
        // addEditType: 0, // 0:添加  1:编辑
        orderSortDate: { // 日期选择范围
          disabledDate(time) {
            return time.getTime() < Date.now() - 3600 * 1000 * 24
          }
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
        onePartForm: {}, // 第一步的表单绑定的变量
        twoPartForm: {} // 第二步的表单绑定的变量
      }
    },
    watch: {
    },
    mounted() {
      // 设置标题之后，里面去填充页面内容
      this.setPageTitle()
    },
    methods: {
      /**
       * 根据type确定title展示文字
       */
      setPageTitle() {
        let titleName
        if (this.type === 'add') {
          titleName = '添加活动'
          // this.addEditType = 0
        } else if (this.type === 'edit') {
          titleName = '编辑活动'
          // this.addEditType = 0
          this.getPageData()
        }
        this.titleName = titleName
        document.title = titleName
      },
      /**
       * 第一步："下一步"按钮
       */
      nextForm() {
        const self = this
        this.$refs.onePartForm.validate((valid) => {
          if (valid) {
            console.log(valid)
            self.activityTab = 2
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
       * 第二步："确定"按钮
       */
      sure() {
        const self = this
        this.$refs.twoPartForm.validate((valid) => {
          if (valid) {
            console.log(valid)
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
       * 第二步："上一步"按钮
       */
      toPrev(val) {
        this.activityTab = val
      },
      /**
       * 点击tab页，切换步骤
       */
      toggleTab(val) {
        this.activityTab = val
      },
      /**
       * 编辑活动是数据的渲染
       */
      getPageData() {
      },
      /**
       * part 1         // 带处理
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
       * part 3          // 待处理
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
      width: 100px;
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
