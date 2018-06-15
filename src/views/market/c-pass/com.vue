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
      <el-form-item prop="name" label="精选标题">
        <el-input class="width300px" v-model.trim="formData.name" :maxlength="30" placeholder="请输入精选标题"></el-input>
      </el-form-item>

      <el-form-item prop="work" label="副标题">
        <el-input class="width300px" v-model.trim="formData.work" placeholder="请输入副标题"></el-input>
      </el-form-item>

      <el-form-item prop="avator" label="活动banner">
        <lh-upload
          @uploadImg="val => formData.avator = val"
          :imgUrl="formData.avator"
          :tipsWidth="600"
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
        <el-form-item class="m-detail" label="精选内容" prop="selectedContent">
          <el-row>
            <el-col :span="18" v-loading="quillUploadImg">
              <div class="quill-editor-box">
                <quill-editor
                  v-model.trim="formData.selectedContent"
                  @change="onTextChange($event)"
                  :options="editorOption"
                  ref="myQuillEditor" />
              </div>
            </el-col>

            <el-col :span="6">
              <div class="ml16">
                <p class="lh40 theme-gray">站内资源</p>
                <el-button @click="selectedField('edit')" class="width100 lh22">场地</el-button>
              </div>
            </el-col>
          </el-row>
        </el-form-item>
      </div>

      <el-form-item class="lh-form-item0">
        <el-button @click="submitForm('formData')" type="primary" class="lh-btn-mini">确认</el-button>
      </el-form-item>
    </el-form>

    <!-- 添加、编辑空间团队 -->
    <selecet-field
      :teamData="teamData"
      :onType="onType"
      :teamVisible="teamVisible"
      @closeTeamDialog="closeTeamDialog"/>
  </div>
</template>

<script>
import comMixins from './com.mixins'
import lhUpload from '@/components/upload'
import { quillEditor } from 'vue-quill-editor' // 调用编辑器
import selecetField from './components/selecet-field'
export default {
  mixins: [comMixins],
  components: {
    quillEditor,
    [lhUpload.name]: lhUpload,
    [selecetField.name]: selecetField
  },
  data () {
    return {
      fieldId: this.$route.query.id,
      title: this.$route.query.id ? '' : '添加精选'
    }
  },
  mounted() {
    document.title = this.title
    this.$store.commit('NAV_CRUMB', this.title)
    this.$route.meta.title = this.title
    if (!this.$route.name) {
      this.$store.dispatch('addVisitedViews', this.$route)
    }
    console.log('test', this.fieldId);
  },
  methods: {
    closeTeamDialog(teamData) {
      this.teamVisible = false

      if (teamData) {
        if (!teamData.idx) {
          this.teamList.push(teamData)
        } else {
          this.teamList[teamData.idx - 1] = { ...teamData }
        }
      }
    },
    selectedField(type, teamData, idx) {
      this.onType = type
      if (type === 'edit') {
        this.teamData = { ...teamData }
        this.teamData.idx = idx
      } else {
        this.teamData = { ...this.teamData2 }
      }
      console.log('teamData', this.teamData, idx)

      this.teamVisible = true
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
        } else {
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
