<template>
  <div class="push-activity-edit">

    <div class="page-title">
      <h1>{{ pageTitle }}</h1>
    </div>

    <div class="form-box card-padding">
      <!-- 禁止enter提交 -->
      <el-form
        v-on:submit.native.prevent
        :model="formData"
        ref="formData"
        label-width="300px"
      >

        <el-form-item
          label="活动名称"
          prop="name"
          :rules="[
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 1, max: 30, message: '长度不能超过30', trigger: 'blur' }
          ]"
        >
          <el-input
            :disabled="notAllow"
            class="fl"
            style="width: 460px"
            v-model.trim="formData.name"
            :maxlength="30"
            placeholder="请填写活动名称"
          >
          </el-input>

          <span class="theme-gray fl">&nbsp;&nbsp;限制字数30</span>
        </el-form-item>

        <el-form-item
          label="活动日期"
          prop="activityDate"
          :rules="[{ type: 'array',required: true, message: '请选择活动日期', trigger: 'blur' }]"
        >
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            :disabled="notAllow"
            style="width: 460px"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            v-model="formData.activityDate"
            type="datetimerange"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item
          label="报名日期"
          prop="signDate"
          :rules="[
           { type: 'array', required: true, message: '请选择报名日期', trigger: 'blur' }]"
        >
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            :disabled="notAllow"
            style="width: 460px"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            v-model="formData.signDate"
            type="datetimerange"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item
          label="报名方式"
          prop="signType"
          :rules="[
                   { required: true, message: '请输入报名方式描述', trigger: 'blur' },
                    { min: 1, max: 50, message: '长度不能超过50', trigger: 'blur' }
             ]">
          <el-input
            :disabled="notAllow"
            type="textarea"
            class="width265px fl"
            v-model.trim="formData.signType"
            :maxlength="50"
            :rows="4"
            placeholder="请填写报名方式"
          >
          </el-input>

          <span class="theme-gray fl">&nbsp;&nbsp;（{{formData.signType.length}}/50）限制字数50</span>
        </el-form-item>

        <el-form-item
          label="活动限制人数"
          prop="limitNum"
          :rules="[ { pattern: /^\d{1,}$/,  required: true, message: '人数必须为数字值,且不为空'}]"
        >
          <el-input
            :disabled="notAllow"
            class="fl"
            style="width: 260px"
            v-model.trim="formData.limitNum"
            placeholder="活动限制人数"
          >
          </el-input>
        </el-form-item>

        <el-form-item
          label="活动地址"
          prop="address"
        >
          <el-input
            :disabled="notAllow"
            class="fl"
            style="width: 460px"
            v-model.trim="formData.address"
            placeholder="请填写活动地址"
          >
          </el-input>
        </el-form-item>

        <el-form-item
          label="活动展示图"
          prop="icon"
          :rules="[{ required: true, message: '请上传展示图', trigger: 'blur' } ]"
        >
          <el-upload
            :disabled="notAllow"
            name="img"
            :headers="headers"
            class="avatar-uploader fl"
            :action=imgServer
            :show-file-list="false"
            accept="image/png, image/jpeg"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >

            <img v-if="formData.icon" :src="formData.icon + zoomImgSize(80, 80)" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>

          &nbsp;&nbsp;
          <span class="theme-gray">为了保证用户端显示效果，建议上传尺寸为690*380，支持jpg/jpeg/png格式，大小不超过5M</span>
        </el-form-item>

        <el-row class="limit-words-box">
          <!--上传图片辅助控件-->
          <el-upload
            id="quill-upload"
            class="avatar-uploader"
            :action="imgServer"
            name="img"
            :headers="headers"
            :show-file-list="false"
            :on-error="quillUploadImgError"
            :before-upload='quillBeforeUploadImg'
            :on-success="quillHandleAvatarSuccess"
          >
          </el-upload>
          <div class="limit-words-in">
            <div class="limit-words theme-gray">
              <p>字数：{{quillLength}}</p>
              <p style="color: red" v-if="quillLength > quillMaxLength">字数超限，无法提交</p>
            </div>
          </div>
          <el-form-item
            class="m-detail"
            label="活动内容(限制输入500字)"
            prop="content"
          >
            <div class="editor-container">
              <el-col
                v-loading="quillUploadImg"
                :span="24"
                class="quill-editor-box">
                <quill-editor
                  :options="editorOption"
                  :disabled="notAllow"
                  v-model.trim="formData.content"
                  ref="myQuillEditor"
                  @change="onTextChange($event)">
                </quill-editor>
              </el-col>
            </div>
          </el-form-item>
        </el-row>


        <el-row class="" v-if="!notAllow">
          <el-form-item>
            <el-button
              :disabled="quillLength > quillMaxLength"
              class="width120px mt20"
              type="primary"
              @click="submitForm('formData')">保存
            </el-button>

            <!-- <el-button class="width120" @click="resetForm('formData')">重置</el-button> -->
          </el-form-item>
        </el-row>
        <el-row class="" v-if="notAllow" v-permissions="'manage/activityDetail/modifyActivity'">
          <el-form-item>
            <router-link
              style="color:white"
              :to="{path: '/push/activity/edit', query: {id: this.$route.query.id, type: 'edit'}}">
              <el-button
                class="width120px mt20"
                type="primary">编辑
              </el-button>
            </router-link>

            <!-- <el-button class="width120" @click="resetForm('formData')">重置</el-button> -->
          </el-form-item>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {API_PATH} from '@/config/env'
  import {quillEditor} from 'vue-quill-editor' // 调用编辑器
  import {
    queryDetailById,
    addActivity,
    editActivity
  } from '@/service/push'

  export default {
    data() {
      return {
        // 左上角标题
        pageTitle: '',
        // 请求头携带token
        headers: {
          token: sessionStorage.getItem('token')
        },
        // 图片上传地址
        imgServer: '',
        // 表单实体数据
        formData: {
          name: '', // 活动名称
          activityDate: [], // 活动时间段
          activityBeginDate: '',  // 活动开始时间
          activityEndDate: '', // 活动结束时间
          signDate: [],  // 报名时间段
          signBeginDate: '', // 报名开始时间
          signEndDate: '', // 报名结束时间
          signType: '', // 报名方式
          icon: '', // 活动logo
          content: '', // 活动内容
          limitNum: null, // 活动限制人数
          address: '' // 活动地点
        },
        // 是否可编辑
        notAllow: (this.$route.query.type === 'detail'),
        // 富文本编辑器当前字数长度
        quillLength: 0,
        // 富文本编辑器输入字数上限
        quillMaxLength: 500, // 富文本编辑器的length
        // 富文本框参数设置
        editorOption: {
          placeholder: '',
          theme: 'snow',  // or 'bubble'
          modules: {
            toolbar: {
              container: [['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                ['blockquote', 'code-block'],

                [{'header': 1}, {'header': 2}],               // custom button values
                [{'list': 'ordered'}, {'list': 'bullet'}],
                [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
                [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
                [{'direction': 'rtl'}],                         // text direction

                [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
                [{'header': [1, 2, 3, 4, 5, 6, false]}],

                [{'color': []}, {'background': []}],          // dropdown with defaults from theme
                [{'font': []}],
                [{'align': []}],
                ['link', 'image', 'video'],
                ['clean']],  // 工具栏
              handlers: {
                'image': function (value) {
                  if (value) {
                    document.querySelector('#quill-upload input').click()
                  } else {
                    this.quill.format('image', false);
                  }
                }
              }
            }
          }
        },
        // 富文本框图片上传状态
        quillUploadImg: false
      }
    },
    created() {
      let _this = this
      // 初始化页面
      _this.pageInit(_this.$route.query.type)
    },
    methods: {
      // 设置动态标题，应用在一个页面展示：新增编辑和详情
      pageInit: function (type) {
        if (type === 'detail') {
          document.title = this.pageTitle = '活动详情'
        } else if (type === 'edit') {
          document.title = this.pageTitle = '编辑活动'
        } else {
          document.title = this.pageTitle = '新增活动'
        }
        this.$store.commit('NAV_CRUMB', this.pageTitle)
        // 如果是详情和编辑，则加载活动数据
        if (this.pageTitle !== '新增活动') {
          queryDetailById({
            activityId: String(this.$route.query.id)
          })
            .then(res => {
              if (res.status === 'true' && res.code === '200') {
                // 合并数据
                this.formData = Object.assign(this.formData, res.info)
                this.formData.signDate.push(this.formData.signBeginDate)
                this.formData.signDate.push(this.formData.signEndDate)
                this.formData.activityDate.push(this.formData.activityBeginDate)
                this.formData.activityDate.push(this.formData.activityEndDate)
              } else {
                this.$message.error('数据加载失败')
              }
            })
            .catch()
        }
        // 构造图片上传地址
        this.imgServer = API_PATH + '/manage/file/uploadPic'
      },
      // 表单提交
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('确认提交?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              // 时间参数赋值
              this.formData.signBeginDate = this.formData.signDate[0]
              this.formData.signEndDate = this.formData.signDate[1]
              this.formData.activityBeginDate = this.formData.activityDate[0]
              this.formData.activityEndDate = this.formData.activityDate[1]
              let promise
              switch (this.$route.query.type) {
                case 'add':
                  promise = addActivity(this.formData)
                  break
                case 'edit':
                  promise = editActivity(this.formData)
                  break
                default:
                  promise = new Promise()
              }
              promise
                .then(res => {
                  if (res.status === 'true') {
                    this.$message({
                      type: 'success',
                      message: '操作成功!'
                    })
                    setTimeout(() => {
                      this.$router.replace({
                        path: '/push/activity'
                      })
                    }, 1000)
                  } else {
                    this.$message.error(res.msg)
                  }
                })
                .catch(() => {
                  this.$message.error('操作失败')
                })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消'
              })
            })
          } else {
            this.$message.error('请补写完整信息')
            return false;
          }
        });
      },
      // 表单重置
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      onTextChange({editor, html, text}) {
        this.quillLength = text.length - 1
      },
      handleAvatarSuccess(res, file) {
        if (res.status === 'true') {
          this.formData.icon = res.info
        } else {
          this.$message.error('上传图片失败！')
        }
      },
      beforeAvatarUpload(file) {
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
          this.$message.error('上传活动展示图图片大小不能超过 5M!');
        }
        return isLt5M;
      },
      // 富文本插入图片
      quillHandleAvatarSuccess(res, file) {
        let quill = this.$refs.myQuillEditor.quill
        if (res.code === '200' && res.info !== null) {
          let range = quill.getSelection();
          let length = range.index;
          quill.insertEmbed(length, 'image', res.info)
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
        this.$message.error('上传图片失败')
      }
    },
    components: {
      quillEditor // 使用编辑器
    }
  }
</script>

<style lang="scss">
  .push-activity-edit {
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
    .m-detail .el-form-item__content {
      height: 400px;
    }
  }
</style>
<style lang="scss" scoped>
  @import "../../../styles/config";

  .push-activity-edit {
    .quill-editor-box {
      .quill-editor {
        height: 300px;
      }
    }
  }
</style>
