<template>
  <div class="fixed-assets-detail">
    <div class="page-title"><h1>{{pageTitle()}}</h1></div>

    <div class="card-padding card-padding-vertical">
      <h3 class="grid-title">基础信息</h3>
      <el-form :model="assetsForm" :rules="assetsRules" ref="assetsForm" label-width="100px">
        <el-form-item label="固资编号"><p class="theme-gray">{{assetsForm.code}}</p></el-form-item>

        <el-form-item label="固资名称" prop="name">
          <el-input
            class="width300px"
            v-model.trim="assetsForm.name"
            :disabled="isNotAllow"
            placeholder="请输入名称">
          </el-input>
          <span class="theme-gray ml5">10</span>
        </el-form-item>

        <el-form-item label="固资描述" prop="desc">
          <el-input
            class="width300px"
            type="textarea"
            v-model.trim="assetsForm.desc"
            :autosize="{minRows: 3, maxRows: 4}"
            :disabled="isNotAllow"
            placeholder="可简单描述物品信息、说明使用须知等">
          </el-input>
          <span class="theme-gray ml5">50</span>
        </el-form-item>

        <el-form-item label="图片" prop="image">
          <el-upload
            :class="{'disabled-upload' : isNotAllow}"
            :action="uploadUrl"
            :disabled="isNotAllow"
            :show-file-list="false"
            name="img"
            :headers="headers"
            list-type="picture-card"
            accept="image/png,image/jpeg"
            :before-upload="handleBeforeUpload"
            :on-success="handleUploadSuccess">
            <div class="assets-image" v-if="assetsForm.image.length"><img :src="assetsForm.image" alt=""></div>
            <i v-show="!assetsForm.image.length" class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="规格型号" prop="model">
          <el-input
            class="width300px"
            v-model.trim="assetsForm.model"
            :disabled="isNotAllow"
            placeholder="请输入规格型号">
          </el-input>
          <span class="theme-gray ml5">20</span>
        </el-form-item>

        <el-form-item label-width="0" class="text-center">
          <!-- 新增时的保存按钮 -->
          <el-button v-if="!detailId" class="width120px" type="primary" @click="handleAddAssets">保存</el-button>

          <!-- 查看时的编辑保存按钮 -->
          <el-button
            v-permissions="'/manage/fixAssert/edit'"
            class="width120px"
            type="primary"
            @click="handleUpdateAssets"
            v-else>{{isNotAllow ? '编辑' : '保存'}}</el-button>

          <el-button class="width120px" @click="handleCancel">{{isNotAllow ? '返回' : '取消'}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {API_PATH} from '@/config/env'
  import {addFixAssert, fixAssertDetail, editFixAssert} from '@/service'
  export default {
    name: 'detail',
    data () {
      const checkImage = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请添加固资图片'))
        } else {
          callback()
        }
      }
      return {
        title: '',
        detailId: this.$route.query.id,
        isNotAllow: true,
        hasChangeForm: false,
        uploadUrl: API_PATH + '/manage/file/uploadPic',
        // uploadUrl: 'https://jsonplaceholder.typicode.com/posts/',
        headers: {
          token: sessionStorage.getItem('token')
        },

        assetsForm: {
          code: '添加完成后由系统自动生成',
          name: '',
          desc: '',
          image: '',
          model: ''
        },
        assetsRules: {
          name: [
            {required: true, message: '请输入固资名称', trigger: 'blur, change'},
            {max: 10, message: '名称不超过10个字', trigger: 'blur, change'}
          ],
          desc: [
            {max: 50, message: '描述不超过50个字', trigger: 'blur, change'}
          ],
          image: [
            {required: true, validator: checkImage, trigger: 'blur, change'}
          ],
          model: [
            {max: 20, message: '规格型号不超过20个字', trigger: 'blur, change'}
          ]
        }
      }
    },
    props: {},
    components: {},
    mounted () {
      // 根据url的参数id来查询固资详情
      if (this.detailId) {
        this.handleGetDetail()
      }
      if (this.$route.query.type === 'add' || this.$route.query.type === 'edit') {
        this.isNotAllow = false
      }
      this.$watch('assetsFormStr', {
        handler: function (newVal, oldVal) {
          if (!newVal || !newVal.length && !oldVal.length) {
            this.hasChangeForm = false
            return
          } else if (this.detailId) {
            if (newVal.length && oldVal.length) {
              this.hasChangeForm = newVal !== oldVal
            }
          } else {
            if (newVal.length && !oldVal.length) {
              this.hasChangeForm = newVal !== oldVal
            }
          }
        }
      })
    },
    watch: {},
    computed: {
      assetsFormStr: function () {
        return this.assetsForm.name + this.assetsForm.desc + this.assetsForm.image + this.assetsForm.model
      }
    },
    filters: {},
    methods: {
      pageTitle() {
        if (this.$route.query.type === 'add') {
          this.title = document.title = '新增固资'
        } else {
          this.title = document.title = '固资详情'
        }
        this.$store.commit('NAV_CRUMB', this.title)
        return this.detailId == null ? '新增固资' : '固资详情'
      },

      // 查询固资详情
      handleGetDetail() {
        let obj = {
          assertId: this.detailId
        }
        fixAssertDetail(obj).then(res => {
          if (res.status === 'true') {
            this.assetsForm.code = res.info.assertCode
            this.assetsForm.name = res.info.assertName
            this.assetsForm.desc = res.info.assertDescription
            this.assetsForm.image = res.info.assertLogo
            this.assetsForm.model = res.info.assertType
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      // 图片上传之前判断图片格式
      handleBeforeUpload(file) {
        let isPic = file.type === 'image/png' || file.type === 'image/jpeg'
        if (!isPic) {
          this.$message.error('图片只支持jpeg/jpg/png格式')
        }
        return isPic
      },
      // 图片上传成功
      handleUploadSuccess(response) {
        this.assetsForm.image = response.info
      },

      // 新增固资
      handleAddAssets() {
        let obj = {
          assertName: this.assetsForm.name,
          assertDescription: this.assetsForm.desc,
          assertType: this.assetsForm.model,
          assertLogo: this.assetsForm.image
        }
        this.$refs['assetsForm'].validate((valid) => {
          if (valid) {
            addFixAssert(obj).then(res => {
              if (res.status === 'true') {
                this.$message.success('添加成功！')
                setTimeout(() => {
                  this.$router.replace('/fixed/assets')
                }, 300)
              } else {
                this.$message.error(res.msg)
              }
            })
          } else {
            return
          }
        })
      },
      // 更新固资
      handleUpdateAssets() {
        if (this.isNotAllow) {
          this.isNotAllow = false
        } else {
          let obj = {
            id: this.detailId,
            assertName: this.assetsForm.name,
            assertDescription: this.assetsForm.desc,
            assertType: this.assetsForm.model,
            assertLogo: this.assetsForm.image
          }
          this.$refs['assetsForm'].validate((valid) => {
            if (valid) {
              editFixAssert(obj).then(res => {
                if (res.status === 'true') {
                  this.$message.success('修改成功！')
                  setTimeout(() => {
                    this.$router.replace('/fixed/assets')
                  }, 300)
                } else {
                  this.$message.error(res.msg)
                }
              })
            } else {
              return
            }
          })
        }
      },
      // 取消保存
      handleCancel() {
        if (this.hasChangeForm) {
          this.$confirm('确认取消保存并跳转至固资列表页吗？', '确认取消？', {
            lockScroll: false
          }).then(_ => {
            this.$router.replace('/fixed/assets')
          }).catch(_ => {
            return false
          })
        } else {
          this.$router.replace('/fixed/assets')
        }
      }
    }
  }
</script>

<style lang="scss">
  .fixed-assets-detail {
    .disabled-upload {
      .el-upload--picture-card {
        cursor: not-allowed;
        .assets-image:hover:before {
          opacity: 0;
        }
      }
    }
  }
</style>

<style lang="scss" scoped>
  @import "../../../styles/config";
  .fixed-assets-detail {
    .assets-image {
      position: relative;
      border-radius: 4px;
      width: 100%;
      height: 100%;
      overflow: hidden;
      img {
        display: block;
        width: 100%;
        height: 100%;
      }
      &:before {
        position: absolute;
        content: '点击更换图片';
        display: block;
        width: 100%;
        height: 100%;
        opacity: 0;
        color: #fff;
        background-color: rgba(#000, .5);
        -webkit-transition: all ease .25s;
        -moz-transition: all ease .25s;
        -ms-transition: all ease .25s;
        -o-transition: all ease .25s;
        transition: all ease .25s;
      }
      &:hover:before{
        opacity: 1;
      }
    }
  }
</style>
