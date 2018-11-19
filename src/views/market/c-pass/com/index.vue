<!-- 富文本编辑器-升级 -->
<template>
  <div class="page-market-c-pass-com">
    <lh-title :title="title" />

    <el-form
      :model="formData"
      :rules="formDataRule"
      ref="formData"
      label-width="180px"
      @submit.native.prevent
      label-position="right"
      class="card-padding pv32">
      <el-form-item prop="title" label="精选标题">
        <el-input
          placeholder="请输入精选标题（30字内）"
          v-model.trim="formData.title"
          @blur="clearEmoji('title')"
          :maxlength="30"
          :disabled="noAllow"
          class="width340px"></el-input>
      </el-form-item>

      <el-form-item prop="subhead" label="副标题">
        <el-input
          v-model.trim="formData.subhead"
          :maxlength="30"
          @blur="clearEmoji('subhead')"
          placeholder="请输入副标题（30字内）"
          :disabled="noAllow"
          class="width340px"></el-input>
      </el-form-item>

      <el-form-item label="作者名称">
        <el-input
          v-model.trim="formData.authorName"
          placeholder="请输入作者名称（5字内）"
          :maxlength="5"
          :disabled="noAllow"
          class="width340px"></el-input>
      </el-form-item>

      <el-form-item prop="bannerPath" label="文章封面">
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
            <div class="tips">建议尺寸： 258PX * 288PX<br>支持格式： JPG / PNG</div>
          </el-popover>
          <span v-popover:tipPopover class="fl ml10 mt24">
            <lh-svg icon-class="icon-info" class="theme-gray cp"></lh-svg>
          </span>
        <p class="theme-red fz12 clearfix mt-6 h6">{{ verifyImg }}</p>
      </el-form-item>

      <div class="limit-words-box">
        <!--上传图片辅助控件-->
        <el-upload ref="refCom"
          class="quill-upload"
          :action="imgServer"
          name="file"
          :headers="headers"
          :show-file-list="false"
          :on-error="quillUploadImgError"
          :before-upload='quillBeforeUploadImg'
          :on-success="quillHandleAvatarSuccess">
        </el-upload>
        <div class="limit-words-in">
          <div class="limit-words theme-gray">
            <p class="fz12">{{quillLength}}/{{quillMaxLength}}</p>
          </div>
        </div>

        <!-- 精选内容 -->
        <el-form-item class="m-detail" label="精选内容" prop="content">
          <div class="editor-box">
            <div class="quill-editor-box fl">
              <!-- 历史记录和剪贴板，暂时没有实现 -->
              <quill-editor
                ref="myQuillEditor"
                v-model.trim="formData.content"
                @change="onTextChange($event)"
                :options="editorOption"
                :disabled="noAllow"
                class="lh-quill-modules">
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
                    <select class="ql-header">
                      <option value="6">12px</option>
                      <option value="5">14px</option>
                      <option value="4">16px</option>
                      <option value="3">18px</option>
                      <option value="2">20px</option>
                      <option value="1">24px</option>
                    </select>
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
                    <select class="ql-color">
                      <option v-for="(itm, idx) in colorBgc" :key="idx" :value="itm" />
                    </select>

                    <select class="ql-background">
                      <option v-for="(itm, idx) in colorBgc" :key="idx" :value="itm" />
                    </select>
                  </span>

                  <span class="ql-formats">
                    <!-- <button class="ql-link"></button> -->
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
            v-model.trim="formData.selectionLink"
            :disabled="noAllow"
            class="select-link"
            placeholder="若填写外链后，则不读取精选内容，以外链内容展示"></el-input>
        </el-form-item>

        <el-form-item label="样式设置" class="lh-form-item0">
          <el-switch
            v-model="formData.styleSwitch"
            :inactive-value="0"
            :active-value="1"
            :disabled="noAllow"></el-switch>
          <span class="theme-light-gray ml10">在页面中展示“标题”“副标题”“作者名称”等头部信息</span>
        </el-form-item>
      </div>

      <div class="submit-fixed-bottom">
        <el-button
          @click="previewQuillCon"
          :disabled="quillLoading"
          :class="{'ml427': sidebar.opened, 'ml271': !sidebar.opened}"
          class="lh-btn-default mr12"
          plain>预览</el-button>

        <div v-if="noAllow">
          <el-button
            v-if="handleHasPermissions('/supervisor/marketing/editWellChosen')"
            @click="submitForm('formData')"
            type="primary"
            :disabled="quillLoading"
            class="lh-btn-default">
            编辑
          </el-button>
        </div>
        <div v-else>
          <el-button
            @click="submitForm('formData')"
            type="primary"
            :disabled="quillLoading"
            class="lh-btn-default">
            保存
          </el-button>
        </div>

      </div>
    </el-form>

    <div v-show="false" class="copy-quill-con" v-html="copyQuillCon"></div>

    <!-- 预览 -->
    <transition name="fade">
      <div class="component-cpass-preview" v-show="showPreview">
        <div class="preview-box">
          <div class="lh-phone">
            <div class="p-con">
              <iframe
                v-if="formData.selectionLink"
                class="preview-iframe"
                :src="formData.selectionLink"
                width="319px"
                height="563px"
                frameborder="0"></iframe>
              <div v-else class="lh-quill-modules preview-html" v-html="formData.content"></div>
            </div>

            <!--TODO: 编辑和新增的保存需要拆分-->
            <el-button
              v-if="!noAllow"
              @click="submitForm('formData')"
              class="lh-btn-default width120px save-btn"
              plain>{{ noAllow ? '编辑' : '保存' }}</el-button>
            <el-button
              @click="showPreview = false"
              class="lh-btn-default width120px close-btn"
              plain>关闭</el-button>
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
import { REG_EMOJI } from '@/config/env';
import comMixin from './com.mixin'
import quillMixin from './quill.mixin'
import updateQuill from './update-quill.mixin'
import lhUpload from '@/components/upload'
import selectField from '../components/select-field'
import { quillEditor, Quill } from 'vue-quill-editor'
import cpassLogo from './imgs/cpass-logo-featured.png'
import { cPassEditDetail, cPassEditWellChosen, cPassAddWellChosen } from '@/service/market'

// 自定义quill 插入节点
require('./blot/index')

export default {
  mixins: [comMixin, updateQuill, quillMixin],
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
    this.setPageTitle()
    this.handleQuillImage()
  },
  methods: {
    clearEmoji(type) {
      if (type === 'title') {
        this.formData.title = this.formData.title.replace(REG_EMOJI, '')
      } else {
        this.formData.subhead = this.formData.subhead.replace(REG_EMOJI, '')
      }
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
        this.quillLoading = true
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
          this.formData.created = resInfo.platformSelection.created.split(' ')[0]

          // 最终解，先渲染，然后再替换
          this.$nextTick(_ => {
            // 刷新插入的数据
            this.updateData()
          })
        } else {
          this.setMsg('error', res.msg)
        }
      })
    },
    getSubmitParam() {
      $('.copy-quill-con')[0].innerHTML = $('.ql-editor')[0].innerHTML

      // 删除已关闭DOM
      $('.copy-quill-con .quill-close').forEach((itm, idx) => {
        itm.parentNode.removeChild(itm)
      })

      this.ajaxParam = {
        id: this.formData.id,
        title: this.formData.title,
        subhead: this.formData.subhead,
        bannerPath: this.formData.bannerPath,
        content: $('.copy-quill-con')[0].innerHTML || '',
        authorName: this.formData.authorName,
        selectionLink: this.formData.selectionLink,
        styleSwitch: this.formData.styleSwitch
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

    /* 弹出框及预览 */
    showInsertDialog(type) {
      if (this.noAllow) return

      this.showInsert = true
      this.insertType = type
      switch (type) {
        case 'title':
          break
        case 'store':
          break
        case 'field':
          break
      }

      // console.log('type', this.insertType);
    },
    closeInsertDialog(insertData) {
      // console.log('closeInsertDialog', insertData);
      this.showInsert = false

      if (!insertData) return

      switch (this.insertType) {
        case 'title':
          switch (insertData.titleType) {
            case 'brand':
              // console.log('brand', insertData.brandItm, insertData);

              this.handleInsertBrandTitle(insertData.brandItm)
              break
            case 'store':
              this.handleInsertStoreTitle(insertData.storeItm)
              break
            case 'field':
              this.handleInsertFieldTitle(insertData.fieldItm)
              break
            case 'arbitrarily':
              this.handleInsertArbitrarilyTitle(insertData.arbitrarilyName)
              break
          }
          break
        case 'store':
          this.handleInsertStores(insertData.addArr)
          break
        case 'field':
          this.handleInsertFields(insertData.addArr)
          break
      }
    },
    // 预览展示，创建日期文本
    getPublishDate () {
      let actual = new Date(this.formData.created).valueOf()
      let now = Date.now()
      let day = (now - actual) / (24 * 60 * 60 * 1000)
      if (day > 0 && day < 1) {
        this.displayPublishDate = '今天'
      } else if (day < 2 && day >= 1) {
        this.displayPublishDate = '昨天'
      } else {
        this.displayPublishDate = this.formData.created
      }
      // console.log('date', [actual, now, now - actual])
    },
    // 预览内容替换
    previewQuillCon() {
      if (!this.formData.selectionLink) {
        let previewDom = ''
        this.getPublishDate()

        if (this.formData.styleSwitch) {
          previewDom += `<div class="featured-content">
            <h3 class="featured-title">${this.formData.title}</h3>
            <div class="clearfix">
              <div class="sub-title fl">
                <img src="${cpassLogo}" class="cpass-logo">
                <span class="cpass-name">${this.formData.authorName || 'CPASS'}</span>
                <span class="publish-date">${this.displayPublishDate}</span>
              </div>
              <div class="read-times fr">阅读数 ${this.formData.pvCount}</div>
            </div>
          </div>`
        }

        previewDom += $('.ql-editor')[0].innerHTML
        $('.preview-html')[0].innerHTML = previewDom

        // 隐藏已经关闭的项
        $('.preview-html .quill-close').forEach((itm, idx) => {
          itm.parentNode.parentNode.removeChild(itm.parentNode)
        })
      }

      this.showPreview = true
    }
  }
};
</script>

<style lang="scss" scoped src='./com.scss'></style>
<style lang="scss" src='./cpass-preview.scss'></style>
<style lang="scss">
// 遮住footer
.lh-main {
  padding-bottom: 89px !important;
}
</style>
