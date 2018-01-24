<template>
  <div class="push-notice-edit">

    <div class="page-title">
      <h1>{{ pageTitle() }}</h1>
    </div>

    <div class="form-box card-padding">
      <!-- 禁止enter提交 -->
      <el-form v-on:submit.native.prevent
        :model="formData"
        ref="formData"
        :rules="formRule"
        label-width="200px">

        <el-form-item label="公告标题" prop="title">
          <el-input :disabled="notAllow"
            class="fl"
            style="width: 460px"
            v-model.trim="formData.title"
            :maxlength="30"
            placeholder="请填写公告标题"></el-input>

          <span class="theme-gray fl">&nbsp;&nbsp;限制字数30</span>
        </el-form-item>

        <el-row class="limit-words-box">
          <div class="limit-words-in">
            <div class="limit-words theme-gray">字数：{{ formData.editor1TextLength }}</div>
          </div>
          <el-form-item class="m-detail" label="公告内容(限制输入500字)" prop="noticeContent">
            <div class="editor-container">
              <el-col :span="24" class="quill-editor-box">
                <quill-editor
                  v-model.trim="formData.noticeContent"
                  ref="myQuillEditor1"
                  :options="editorOption1"
                  @change="onTextChange1($event)"></quill-editor>
              </el-col>
            </div>
          </el-form-item>
        </el-row>

        <el-row class="" v-permissions="'/manage/notice/addOrUpdate'">
          <el-form-item>
            <el-button
              class="width120px mt20"
              type="primary"
              @click="handleAddOrUpdateNotice('formData')"
              :loading="saveLoading">{{ editTxt }}</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {quillEditor} from 'vue-quill-editor' // 调用编辑器
  import { getNoticeDetail, addOrUpdateNotice } from '@/service'

  export default {
    data () {
      return {
        title: '公告详情',
        type: this.$route.query.type, // 不允许编辑控件
        noticeId: this.$route.query.id, // 公告id
        editTxt: '编辑', // “编辑”或者“保存”按钮文本
        saveLoading: false,
        notAllow: (this.$route.query.type === 'detail'),

        // 表单字段
        formData: {
          title: '',
          noticeContent: '',
          editor1TextLength: 0
        },
        formRule: {
          title: [
            { required: true, message: '请填写公告标题，30个字以内', trigger: 'blur,change' }
          ],
          noticeContent: [
            { required: true, message: '请填写公告内容，500个字以内', trigger: 'blur,change' }
          ]
        },

        // 富文本编辑器
        quillLenght: 500, // 富文本编辑器的length
        editorOption1: {
          modules: {
            toolbar: [
              ['bold', 'italic'],
              [{'list': 'ordered'}, {'list': 'bullet'}],
              ['link']
            ],
            history: {
              delay: 1000,
              maxStack: 50,
              userOnly: false
            }
          },
          placeholder: ' ',
          theme: 'snow'  // or 'bubble'
        }
      }
    },
    watch: {
      type: function (val, newVal) {
        // console.log('test', val, newVal);
        this.pageTitle()
      }
    },
    mounted () {
      // 获取公告详情
      if (this.noticeId != null) {
        this.handleGetNoticeDetail()
      }
    },
    methods: {
      // 设置动态标题，应用在一个页面展示：新增编辑和详情
      pageTitle: function () {
        if (this.type === 'detail') {
          this.editTxt = '编辑'
          document.title = '公告详情'
          this.title = '公告详情'
        } else if (this.type === 'edit') {
          this.editTxt = '保存'
          document.title = '编辑公告'
          this.title = '编辑公告'
        } else {
          this.editTxt = '保存'
          document.title = '新增公告'
          this.title = '新增公告'
        }
        this.$store.commit('NAV_CRUMB', this.title)

        setTimeout(() => {
          this.$refs.myQuillEditor1.quill.enable(!this.notAllow)
        }, 300)
        switch (this.type) {
          case 'detail':
            return '公告详情'
          case 'edit':
            return '编辑公告'
          case 'add':
            return '新增公告'
        }
      },
      // 新增或编辑公告
      handleAddOrUpdateNotice(formName) {
        const _this = this
        _this.notAllow = false
        if (_this.type === 'detail') {
          _this.type = 'edit'
          _this.editTxt = '保存'
        } else {
          _this.$refs[formName].validate((valid) => {
            if (valid) {
              _this.saveLoading = true
              _this.editTxt = '执行中…'
              const noticeParams = {
                id: _this.noticeId,
                title: _this.formData.title,
                content: _this.formData.noticeContent
              }
              addOrUpdateNotice(noticeParams).then(res => {
                if (res.status === 'true') {
                  _this.$message.success('保存成功！')
                  setTimeout(() => {
                    _this.$router.go(-1)
                  }, 300)
                } else {
                  _this.$message.error(res.msg)
                }
              })
            } else {
              _this.saveLoading = false
              _this.editTxt = '保存'
              return false
            }
          })
        }
      },
      // 编辑器字数限制
      onTextChange1 (editor) {
        // 针对只是列表的可以满足需求，但是复杂就不好做字数限制了
        let formartObject
        formartObject = this.$refs.myQuillEditor1.quill.getFormat(0, this.$refs.myQuillEditor1.quill.getLength())
        this.formData.editor1TextLength = this.$refs.myQuillEditor1.quill.getLength() - 1

        // console.log('text-change111', this.$refs.myQuillEditor1.quill.getLength())
        if (this.$refs.myQuillEditor1.quill.getLength() > this.quillLenght + 1) {
          this.$refs.myQuillEditor1.quill.setText(this.$refs.myQuillEditor1.quill.getText().substring(0, this.quillLenght))
          this.$refs.myQuillEditor1.quill.formatText(0, this.$refs.myQuillEditor1.quill.getLength(), formartObject)
        }
        // console.log('text-change111', this.$refs.myQuillEditor1.quill.getLength())
      },
      // 获取公告详情
      handleGetNoticeDetail () {
        const _this = this
        const detailParams = {
          noticeId: _this.noticeId
        }
        getNoticeDetail(detailParams).then(res => {
          if (res.status === 'true' && res.info) {
            _this.formData.title = res.info.title
            _this.formData.noticeContent = res.info.content
          } else {
            _this.$message.error(res.msg)
          }
        })
      }
    },
    components: {
      quillEditor // 使用编辑器
    }
  }
</script>

<style lang="scss">
  .push-notice-edit {
    .avatar-uploader {
      .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }
      .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
      }
      .avatar-uploader-icon {
        font-size: 14px;
        color: #8c939d;
        width: 80px;
        height: 80px;
        line-height: 80px;
        text-align: center;
      }
    }
    .avatar {
      width: 80px;
      height: 80px;
      display: block;
    }
  }
</style>
<style lang="scss" scoped>
  @import "../../../styles/config";
  .push-notice-edit {
    .quill-editor-box {
      .quill-editor {
        height: 300px;
        line-height: initial;
      }
    }
  }
</style>
