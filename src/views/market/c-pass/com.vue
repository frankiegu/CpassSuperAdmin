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
        <el-input class="width300px" v-model.trim="formData.title" :disabled="noAllow" :maxlength="30" placeholder="请输入精选标题"></el-input>
      </el-form-item>

      <el-form-item prop="subhead" label="副标题">
        <el-input class="width300px" v-model.trim="formData.subhead" :disabled="noAllow" placeholder="请输入副标题"></el-input>
      </el-form-item>

      <el-form-item prop="bannerPath" label="活动banner">
        <lh-upload
          @uploadImg="val => formData.bannerPath = val"
          :imgUrl="formData.bannerPath"
          :tipsWidth="600"
          :disabled="noAllow"
          :size="80"/>
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
        <div class="limit-words-in">
          <div class="limit-words theme-gray">
            <p class="fz12">{{quillLength}}/{{quillMaxLength}}</p>
            <p class="theme-red fz12" v-if="quillLength > quillMaxLength">字数超限，无法提交</p>
          </div>
        </div>
        <el-form-item class="m-detail" label="精选内容" prop="content">
          <div class="quill-editor-box" v-loading="quillUploadImg">
            <quill-editor
              v-model.trim="formData.content"
              @change="onTextChange($event)"
              :options="editorOption"
              :disabled="noAllow"
              ref="myQuillEditor" />
          </div>
        </el-form-item>
      </div>

      <el-form-item label="精选列表">
        <el-button @click="showTeamDialog('add')" type="primary" :disabled="noAllow" icon="el-icon-circle-plus" class="mb18">添加场地</el-button>
        <el-table :data="teamsData" class="width100" max-height="295" border>
          <el-table-column label="所属品牌" prop="spaceName"></el-table-column>
          <el-table-column label="所属空间" prop="storeName"></el-table-column>
          <el-table-column label="场地名称" prop="fieldName"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope" v-if="!noAllow">
              <span @click="showTeamDialog('edit', scope.row, scope.$index)" class="lh-table-btn theme-blue">编辑</span>
              <span @click="deleteField(scope.$index)" class="lh-table-btn theme-gray">删除</span>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item class="lh-form-item0">
        <el-button @click="submitForm('formData')" type="primary" class="lh-btn-mini">{{ noAllow ? '编辑' : '保存' }}</el-button>
      </el-form-item>
    </el-form>

    <!-- 添加、编辑空间团队 -->
    <select-field
      :onType="onType"
      :teamData="teamData"
      :teamsData="teamsData"
      :teamVisible="teamVisible"
      :renderSelectField="renderSelectField"
      @closeTeamDialog="closeTeamDialog"/>
  </div>
</template>

<script>
import comMixins from './com.mixins'
import lhUpload from '@/components/upload'
import { quillEditor } from 'vue-quill-editor' // 调用编辑器
import selectField from './components/select-field'
import { cPassEditDetail, cPassEditWellChosen, cPassAddWellChosen } from '@/service/market'
export default {
  mixins: [comMixins],
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
  mounted() {
    this.setPageTitle()
  },
  methods: {
    setPageTitle() {
      this.title = this.noAllow ? '精选详情' : (this.fieldId ? '编辑精选' : '添加精选')
      document.title = this.title
      this.$store.commit('NAV_CRUMB', this.title)
      this.$route.meta.title = this.title
      if (!this.$route.name) {
        this.$store.dispatch('addVisitedViews', this.$route)
      }

      if (this.fieldId) {
        this.getPageData()
        this.ajaxName = cPassEditWellChosen
      } else {
        this.ajaxName = cPassAddWellChosen
      }
    },
    closeTeamDialog(teamData) {
      // console.log('closeTeamDialog', teamData);
      this.teamVisible = false

      // 第一次渲染添加场地弹出框请求接口数据，往后再不请求品牌、空间、场地列表数据
      if (!this.renderSelectField) {
        this.renderSelectField = true
      }

      if (teamData) {
        if (teamData.idx === 'add') {
          this.teamsData.push(teamData)
        } else {
          this.teamsData.splice(teamData.idx, 1, teamData)
        }
      }

      // 清空数据
      if (this.teamData.spaceId) {
        this.teamData = { ...this.teamDefaultData }
      }

      // console.log('closeTeamDialog', this.teamData)
    },
    showTeamDialog(type, teamData, idx) {
      this.onType = type
      if (type === 'edit') {
        this.teamData = { ...teamData }
        this.teamData.idx = idx
      } else {
        this.teamDefaultData.idx = this.teamsData.length
        this.teamData = { ...this.teamDefaultData }
      }
      // console.log('showTeamDialog', this.teamData.idx, idx)

      this.teamVisible = true
    },
    getPageData() {
      cPassEditDetail({ selectionId: this.fieldId }).then(res => {
        if (res.status === 'true') {
          let resInfo = res.info
          this.formData = resInfo.platformSelection
          this.teamsData = resInfo.platformSelectionField
        } else {
          this.setMsg('error', res.msg)
        }
      })
    },
    deleteField(idx) {
      this.teamsData.splice(idx, 1)
    },
    getSubmitParam() {
      this.ajaxParam = {
        id: this.formData.id,
        title: this.formData.title,
        subhead: this.formData.subhead,
        bannerPath: this.formData.bannerPath,
        content: this.formData.content,
        selectionFieldListParam: this.teamsData.map((item) => ({
          spaceId: item.spaceId,
          fieldName: item.fieldName,
          storeId: item.storeId,
          fieldId: item.fieldId,
          imgPath: item.imgPath
        }))
      }
      // console.log('test', this.ajaxParam)
    },
    submitForm(formName) {
      if (this.noAllow) {
        this.noAllow = !this.noAllow
        return
      }

      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.getSubmitParam()

          this.ajaxName(this.ajaxParam).then(res => {
            if (res.status === 'true') {
              this.noAllow = !this.noAllow

              if (this.fieldId) {
                this.setMsg('success', '更新精选成功')
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
      this.quillLength = text.length - 1
    },
    // 富文本插入图片
    quillHandleAvatarSuccess(res, file) {
      let quill = this.$refs.myQuillEditor.quill
      if (res.code === '200' && res.info.path !== null) {
        let range = quill.getSelection()
        let length = range.index;
        quill.insertEmbed(length, 'image', res.info.path)
        quill.setSelection(length + 1)
      }
      this.quillUploadImg = false
    },
    // 富文本框上传图片前
    quillBeforeUploadImg() {
      this.quillUploadImg = true
    },
    // 富文本框上传图片失败
    quillUploadImgError() {
      this.quillUploadImg = false
      this.setMsg('error', '上传图片失败')
    }
  }
};
</script>

<style lang="scss">
  .page-market-c-pass-com {
    .m-detail .el-form-item__content {
      height: 400px;
    }
    .ql-toolbar.ql-snow .ql-formats {
      line-height: 24px;
    }
  }
</style>
<style lang="scss" scoped src='./com.scss'></style>
