<!-- 富文本编辑器-升级 -->
<template>
  <div class="page-market-c-pass-com">
    <lh-title :title="title"></lh-title>

    <el-form
      :model="formData"
      :rules="formDataRule"
      ref="formData"
      label-width="180px"
      @submit.native.prevent
      label-position="right"
      class="card-padding pv32">
      <el-form-item prop="title" label="精选标题">
        <el-input class="width340px" v-model.trim="formData.title" :disabled="noAllow" :maxlength="30" placeholder="请输入精选标题"></el-input>
      </el-form-item>

      <el-form-item prop="subhead" label="副标题">
        <el-input class="width340px" v-model.trim="formData.subhead" :disabled="noAllow" :maxlength="15" placeholder="请输入副标题"></el-input>
      </el-form-item>

      <el-form-item label="作者名称">
        <el-input
          v-model.trim="formData.authorName"
          :maxlength="5"
          :disabled="noAllow"
          type="textarea"
          class="width340px"
          placeholder="请输入作者名称"></el-input>
      </el-form-item>

      <el-form-item prop="bannerPath" label="活动banner">
        <lh-upload
          @uploadImg="uploadImg"
          :imgUrl="formData.bannerPath"
          :disabled="noAllow"
          :size="80"/>
          <el-popover
            ref="tipPopover"
            placement="right"
            title=""
            width="180"
            trigger="hover">
            <div class="tips">建议尺寸： 420PX * 480PX<br>支持格式： JPG / PNG</div>
          </el-popover>
          <span v-popover:tipPopover class="fl ml10 mt24">
            <lh-svg icon-class="icon-info" class="theme-gray cp"></lh-svg>
          </span>
        <p class="theme-red fz12 clearfix mt-6 h6">{{ verifyImg }}</p>
      </el-form-item>

      <div class="limit-words-box">
        <!--上传图片辅助控件-->
        <el-upload ref="refCom"
          id="quill-upload"
          :action="imgServer"
          name="file"
          :headers="headers"
          :show-file-list="false"
          :on-error="quillUploadImgError"
          :before-upload='quillBeforeUploadImg'
          :on-success="quillHandleAvatarSuccess">
        </el-upload>
        <!-- <div class="limit-words-in">
          <div class="limit-words theme-gray">
            <p class="fz12">{{quillLength}}/{{quillMaxLength}}</p>
          </div>
        </div> -->

        <!-- 精选内容 -->
        <el-form-item class="m-detail" label="精选内容" prop="content">
          <div class="editor-box">
            <div class="quill-editor-box fl">
              <quill-editor
                v-model.trim="formData.content"
                @change="onTextChange($event)"
                :options="editorOption"
                :disabled="noAllow"
                ref="myQuillEditor"
                class="lh-quill lh-quill-modules">
                <div class="lh-toolbar" slot="toolbar">
                  <span class="ql-formats">
                    <span @click="insertDivider" class="ql-divider ql-btn">
                      <span class="ql-hr"></span>
                    </span>
                    <button class="ql-bold"></button>
                    <button class="ql-italic"></button>
                    <button class="ql-underline"></button>
                  </span>

                  <span class="ql-formats">
                    <select class="ql-align">
                      <option value=""></option>
                      <option value="center"></option>
                      <option value="right"></option>
                      <option value="justify"></option>
                    </select>
                  </span>

                  <span class="ql-formats">
                    <button class="ql-blockquote"></button>
                  </span>

                  <span class="ql-formats">
                    <button class="ql-list" value="ordered"></button>
                    <button class="ql-list" value="bullet"></button>
                  </span>

                  <span class="ql-formats">
                    <button class="ql-link"></button>
                    <button class="ql-image"></button>
                  </span>
                </div>
              </quill-editor>
              <div class="quill-mask" v-show="quillLoading"></div>
            </div>

            <div class="insert-list">
              <h4 class="insert-title">添加</h4>
              <ul>
                <li
                  v-for="(itm, key) in insertList" :key="key"
                  @click="showInsertDialog(itm.type)"
                  :class="{'btn-color-disabled': noAllow}">{{ itm.name }}</li>
              </ul>
            </div>
          </div>
          <p class="theme-red fz12" >{{ verifyCon }}</p>
        </el-form-item>

        <el-form-item label="精选外链">
          <el-input
            v-model.trim="formData.link"
            :maxlength="20"
            :disabled="noAllow"
            class="width340px"
            placeholder="若填写外链后，则不读取精选内容，以外链内容展示"></el-input>
        </el-form-item>

        <el-form-item label="样式设置" class="lh-form-item0">
          <el-switch
            v-model="formData.switch"
            :inactive-value="0"
            :disabled="noAllow"
            :active-value="1"></el-switch>
          <span class="theme-light-gray ml10">在页面中展示“标题”“副标题”“作者名称”等头部信息</span>
        </el-form-item>
      </div>

      <div class="submit-fixed-bottom">
        <el-button
          @click="previewCon"
          :class="{'ml427': sidebar.opened, 'ml271': !sidebar.opened}"
          class="lh-btn-default mr12"
          plain>预览</el-button>

        <el-button
          @click="submitForm('formData')"
          type="primary"
          class="lh-btn-default">
          {{ noAllow ? '编辑' : '保存' }}
        </el-button>
      </div>
    </el-form>

    <div v-show="false" class="copy-quill-con" v-html="copyQuillCon"></div>

    <!-- 预览 -->
    <transition name="fade">
      <div class="component-cpass-preview" v-show="showPreview">
        <div class="preview-box">
          <div class="lh-phone">
            <div class="p-con lh-quill-modules">
              <div v-html="formData.content"></div>
            </div>

            <el-button @click="closeDialog" class="lh-btn-default width120px save-btn" plain>保存</el-button>
            <el-button @click="closeDialog" class="lh-btn-default width120px close-btn" plain>关闭</el-button>
          </div>
        </div>

        <div class="preview-mask"></div>
      </div>
    </transition>

    <!-- 添加、编辑空间团队 -->
    <select-field
      :dialogStatus="showInsert"
      :insertType="insertType"
      @closeInsertDialog="closeInsertDialog"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { $ } from '@/config/utils'
import comMixin from './com.mixin'
import quillMixin from './quill.mixin'
import comExtend from './com-extend.mixin'
// import renderBlotMixin from './render-blot.mixin'
import lhUpload from '@/components/upload'
import { quillEditor, Quill } from 'vue-quill-editor' // 调用编辑器
import selectField from '../components/select-field'
import { cPassEditDetail, cPassEditWellChosen, cPassAddWellChosen } from '@/service/market'
require('./blot/index')

export default {
  mixins: [comMixin, comExtend, quillMixin],
  components: {
    quillEditor,
    [lhUpload.name]: lhUpload,
    [selectField.name]: selectField
  },
  data () {
    return {
      fieldId: this.$route.query.fieldId,
      noAllow: Boolean(this.$route.query.noAllow),
      title: ''
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    editor() {
      return this.$refs.myQuillEditor.quill
    },
    quill() {
      return Quill
    }
  },
  mounted() {
    this.quillLoading = true
    this.setPageTitle()
  },
  methods: {
    previewCon() {
      $('.p-con')[0].innerHTML = $('.ql-editor')[0].innerHTML
      this.showPreview = true
    },

    uploadImg(val) {
      this.formData.bannerPath = val
      this.verifyImage()
    },
    setTitleName() {
      this.title = this.noAllow ? '精选详情' : (this.fieldId ? '编辑精选' : '添加精选')
      document.title = this.title
      this.$store.commit('NAV_CRUMB', this.title)
      this.$route.meta.title = this.title
      if (!this.$route.name) {
        this.$store.dispatch('addVisitedViews', this.$route)
      }
    },
    setPageTitle() {
      this.setTitleName()

      if (this.fieldId) {
        this.getPageData()
        this.ajaxName = cPassEditWellChosen
      } else {
        this.ajaxName = cPassAddWellChosen
      }
    },
    getPageData() {
      cPassEditDetail({ selectionId: this.fieldId }).then(res => {
        if (res.status === 'true') {
          let resInfo = res.info
          this.formData = resInfo.platformSelection
          this.copyQuillCon = resInfo.platformSelection.content

          // 最终解，先渲染，然后再替换
          this.$nextTick(_ => {
            const quillDom = $('.copy-quill-con')[0].innerHTML
            $('.ql-editor')[0].innerHTML = quillDom
            $('.p-con')[0].innerHTML = quillDom

            this.quillLoading = false
          })
        } else {
          this.setMsg('error', res.msg)
        }
      })
    },

    getSubmitParam() {
      this.ajaxParam = {
        id: this.formData.id,
        title: this.formData.title,
        subhead: this.formData.subhead,
        bannerPath: this.formData.bannerPath,
        content: $('.ql-editor')[0].innerHTML || ''
      }
      // console.log('test', this.ajaxParam)
    },
    submitForm(formName) {
      if (this.noAllow) {
        this.noAllow = !this.noAllow
        this.setTitleName()
        return
      }
      this.verifyImage()
      this.verifyContent()

      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.getSubmitParam()

          this.ajaxName(this.ajaxParam).then(res => {
            if (res.status === 'true') {
              this.noAllow = !this.noAllow

              if (this.fieldId) {
                this.setMsg('success', '更新精选成功')
                this.setTitleName()
              } else {
                this.setMsg('success', '添加精选成功')
                this.$router.replace({ path: '/market/c-pass' })
              }
            } else {
              this.setMsg('error', res.msg)
            }
          })
        }
      })
    },
    onTextChange({ editor, html, text }) {
      // console.log('test', editor, html, text);
      text = text.trim()
      this.quillLength = text.length
      this.verifyContent()
    },
    verifyContent() {
      this.verifyCon = !this.formData.content ? '精选内容不能为空' : (this.quillLength > this.quillMaxLength) ? '字数超限，无法提交' : ''
    },
    verifyImage() {
      this.verifyImg = !this.formData.bannerPath ? '请上传头像' : ''
    }
  }
};
</script>

<style lang="scss">
.lh-main {
  padding-bottom: 89px !important;
}
</style>
<style lang="scss" scoped src='./com.scss'></style>
<style lang="scss" src='../com.scss'></style>
<style lang="scss" src='./cpass-preview.scss'></style>
