<template>
  <div class="service-detail">

    <!-- 有面包屑的时候，就隐藏这个标题 -->
    <div class="page-title">
      <!-- 根据URL是否携带id 查询，是则展示标题“企业详情”，否则展示“新建企业” -->
      <h1>{{ pageTitle() }}</h1>
    </div>

    <!--供应商信息-->
    <el-form :model="supplierForm"
             ref="supplierForm"
             :rules="rules"
             label-width="120px"
             label-position="right">
      <div class="form-box card-padding card-padding-vertical">
        <h3 class="grid-title">供应商信息</h3>

        <el-form-item class="mt40" label="供应商全称" prop="fullName">
          <el-input :disabled="notAllow"
                    class="width420px"
                    :maxlength="30"
                    v-model.trim="supplierForm.fullName"
                    placeholder="请输入供应商全称"></el-input>
          <span class="theme-gray">&nbsp;&nbsp;限制字数30</span>
        </el-form-item>

        <el-form-item class="mt40" label="供应商简称" prop="abbrName">
          <el-input :disabled="notAllow"
                    class="width220px"
                    :maxlength="10"
                    v-model.trim="supplierForm.abbrName"
                    placeholder="请输入供应商简称"></el-input>
          <span class="theme-gray">&nbsp;&nbsp;限制字数10</span>
        </el-form-item>

        <el-form-item class="mt40" label="联系电话" prop="phone">
          <el-input :disabled="notAllow"
                    class="width220px"
                    :maxlength="11"
                    type="tel"
                    v-model="supplierForm.phone"
                    placeholder="请输入联系电话"></el-input>
        </el-form-item>

        <el-form-item class="mt40" label="供应商简介" prop="introduction">
          <el-input
            :disabled="notAllow"
            class="width420px"
            type="textarea"
            :rows="6"
            :maxlength="100"
            placeholder="请输入供应商简介"
            v-model.trim="supplierForm.introduction">
          </el-input>
          <span class="theme-gray">&nbsp;&nbsp;（{{supplierForm.introduction ? supplierForm.introduction.length : 0}}/100）限制字数100</span>
        </el-form-item>

        <el-form-item v-permissions="'/manage/valueAddServiceProvider/addOrUpdate'" class="mt40" label="">
          <el-button type="primary" :loading="saveLoading" @click="handleSave('supplierForm', providerId)">{{ editTxt }}</el-button>
        </el-form-item>

        <!--服务列表-->
        <div v-if="providerId">
          <h3 class="grid-title">服务列表
            <el-button v-permissions="'/manage/valueAddService/addOrUpdate'" class="fr" size="mini" type="primary" @click="handleService()">添加服务</el-button>
          </h3>
          <el-table
            :data="tableData"
            :empty-text="tableEmpty"
            :slot="tableEmpty"
            v-loading="tableLoading"
            border
            style="width: 100%">
            <!-- 0 -->
            <el-table-column size="small"
                             label="主图">

              <template slot-scope="scope">
                <div class="table-img">
                  <img :src="scope.row.picPath + zoomImgSize()" alt="">
                </div>
              </template>
            </el-table-column>

            <!-- 1 -->
            <el-table-column size="small"
                             label="服务名称">

              <template slot-scope="scope">
                <a class="table-link" @click="handleService('view', scope.row.id)">{{scope.row.name}}</a>
              </template>
            </el-table-column>

            <!-- 2 -->
            <el-table-column size="small"
                             label="服务类型">

              <template slot-scope="scope">
                <span v-if="scope.row.type === 1">工商注册</span>
                <span v-if="scope.row.type === 2">财税服务</span>
                <span v-if="scope.row.type === 3">法律服务</span>
                <span v-if="scope.row.type === 4">网站建设</span>
                <span v-if="scope.row.type === 5">人资社保</span>
                <span v-if="scope.row.type === 6">市场媒体</span>
                <span v-if="scope.row.type === 7">其他</span>
              </template>
            </el-table-column>

            <!-- 3 -->
            <el-table-column size="small"
                             label="服务描述">

              <template slot-scope="scope">
                {{scope.row.description}}
              </template>
            </el-table-column>

            <!-- 4 -->
            <el-table-column size="small" label="价格" prop="price"></el-table-column>

            <!-- 5 -->
            <el-table-column size="small"
                             label="状态">

              <template slot-scope="scope">
                {{scope.row.statusName}}
              </template>
            </el-table-column>

            <!-- 6 -->
            <el-table-column v-if="handleHasPermissions('/manage/valueAddService/addOrUpdate')"
                             size="small"
                             label="操作">

              <template slot-scope="scope">
                <el-button type="text" @click="handleService('edit', scope.row.id)">编辑</el-button>
              </template>
            </el-table-column>

            <!-- 7 -->
            <el-table-column size="small"
                             label="">

              <template slot-scope="scope">
                <el-tooltip :content="scope.row.statusCode === 1 ? '点击关闭该服务' : '点击开启该服务'" placement="top">
                  <el-switch
                    v-model="scope.row.statusCode"
                    :active-value="1"
                    :inactive-value="2"
                    :active-color="switchActiveColor"
                    active-text=""
                    inactive-text=""
                    @change="handleUpdateStatus(scope.row.statusCode, scope.row.id)"></el-switch>
                </el-tooltip>
              </template>
            </el-table-column>

          </el-table>

          <!-- 分页器 -->
          <el-pagination background
            class="pagination-container"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageTotal">
          </el-pagination>
        </div>

      </div>

    </el-form>

    <!--打开新增或者编辑服务dialog-->
    <el-dialog :title="dialogLabel" :visible.sync="dialogFormVisible" :before-close="handleClose">
      <el-form :model="serviceForm" ref="serviceForm" :rules="serviceRules" label-width="100px" label-position="right">

        <el-form-item label="服务名称" prop="name">
          <el-input v-model.trim="serviceForm.name"
                    :maxlength="20"
                    :disabled="notAllowService"
                    auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="服务描述" prop="introduction">
          <el-input
            type="textarea"
            :rows="6"
            :maxlength="300"
            placeholder="请输入服务描述"
            :disabled="notAllowService"
            v-model.trim="serviceForm.introduction">
          </el-input>
          <span class="theme-gray fl">&nbsp;&nbsp;（{{serviceForm.introduction ? serviceForm.introduction.length : 0}}/300）限制字数300</span>
        </el-form-item>

        <el-form-item label="服务类型" prop="ServiceType">
          <el-select class="width240px" :disabled="notAllowService" v-model="serviceForm.ServiceType" placeholder="请选择服务类型">
            <el-option
              v-for="(value, key) in serviceForm.ServiceTypeList"
              :label="value"
              :value="key"
              :key="key">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="价格" prop="price">
          <el-input
            class="width240px"
            :disabled="notAllowService"
            :maxlength="30"
            v-model.trim="serviceForm.price"
            placeholder="请输入金额"></el-input>
          &nbsp;&nbsp;
          <span class="theme-gray">可输入服务的价格范围等</span>
        </el-form-item>

        <el-form-item label="展示图" prop="icon">
          <el-upload :disabled="notAllowService"
                     ref="upload"
                     name="img"
                     v-loading="loadImg"
                     :headers="headers"
                     class="avatar-uploader fl"
                     :action=imgServer
                     :show-file-list="false"
                     accept="image/png, image/jpeg, image/jpg"
                     :on-success="handleAvatarSuccess"
                     :before-upload="beforeAvatarUpload">

            <img v-if="serviceForm.icon" :src="serviceForm.icon" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>

            <span v-popover:tipPopover slot="tip" class="el-upload__tip tipStyle">
              <i class="el-icon-info"></i>
            </span>
            <el-popover
              ref="tipPopover"
              placement="right"
              title=""
              width="340"
              trigger="hover">
              <div class="tips">
                为了保证用户端显示效果，建议上传尺寸为690*380，<br>
                支持jpg/jpeg/png格式，大小不超过1M
              </div>
            </el-popover>
          </el-upload>
          &nbsp;&nbsp;

        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button
          v-permissions="'/manage/valueAddService/addOrUpdate'"
          @click="saveService('serviceForm')"
          :loading="saveServiceLoading"
          type="primary">{{serviceEditTxt}}</el-button>
        <el-button @click="cancelSet('serviceForm')">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {API_PATH} from '@/config/env'
  import handleHasPermissions from '@/config/com-mixins'
  import { checkPhone } from '@/config/utils'
  import {
    SERVICE_LIST,
    PROVIDER_DETAIL,
    CHECK_PROVIDER_NAME,
    ADD_UPDATE_PROVIDER,
    ADD_UPDATE_SERVICE,
    SERVICE_TYPE,
    CHANGE_SERVICE_STATUS,
    GET_SERVICE_DETAIL
  } from '@/service'
  export default {
    mixins: [handleHasPermissions],
    data () {
      const self = this
      let checkField = (type, value, callback) => {
        if (value.length <= 0) callback()
        const JSON = {
          type: type,
          name: value
        }
        // 如果是编辑
        if (self.providerId) {
          JSON.id = self.providerId
        }
        CHECK_PROVIDER_NAME(JSON).then(res => {
          if (res.status !== 'true') {
            callback(new Error(res.msg))
          } else {
            callback()
          }
        })
      }
      // 检查全称是否重名
      var checkFullName = (rule, value, callback) => {
        checkField('FULLNAME', value, callback)
      }
      // 检查简称是否重名
      var checkAbbrName = (rule, value, callback) => {
        checkField('ABBRNAME', value, callback)
      }
      // 检测电话号码
      var validateTel = (rule, value, callback) => {
        if (!checkPhone(value)) {
          callback(new Error('请输入正确的手机号'));
        } else {
          callback()
        }
      };
      return {
        title: '订单详情',
        providerId: this.$route.query.providerId,
        // providerAddId: '', // 点击新增供应商的时候返回的供应商id
        notAllow: !this.$route.query.edit, // 默认可编辑
        // 请求头携带token
        headers: {
          token: sessionStorage.getItem('token')
        },
        editTxt: '', // 供应商编辑保存按钮文本
        supplierForm: { // 供应商信息
          fullName: '', // 供应商全称
          abbrName: '', // 供应商简称
          phone: '', // 联系电话
          introduction: '' // 供应商简介
        },
        rules: {
          fullName: [
            {
              required: true,
              message: '请输入供应商全称',
              trigger: 'blur,change'
            }, {
              validator: checkFullName,
              trigger: 'blur,change'
            }
          ],
          abbrName: [
            {
              required: true,
              message: '请输入供应商简称',
              trigger: 'blur,change'
            }, {
              validator: checkAbbrName,
              trigger: 'blur,change'
            }
          ],
          phone: [
            {
              required: true,
              message: '请输入手机号码',
              trigger: 'blur,change'
            }, {
              validator: validateTel,
              trigger: 'blur,change'
            }
          ]
        },
        saveLoading: false, // 供应商信息保存loading状态
        saveServiceLoading: false, // 服务信息保存loading状态
        dialogFormVisible: false, // 服务dialog开关
        tableData: [],
        tableLoading: false,
        tableEmpty: ' ',
        // 图片上传地址
        imgServer: API_PATH + '/manage/file/uploadPic',
        loadImg: false, // 加载图片
        serviceForm: {
          name: '',
          introduction: '',
          ServiceType: '',
          ServiceTypeList: [],
          price: null,
          icon: '' // 上传图片
        }, // 服务表单

        // 服务表单规则
        serviceRules: {
          name: [
            {
              required: true,
              message: '请输入服务名称',
              trigger: 'blur,change'
            }
          ],
          ServiceType: [
            {
              required: true,
              message: '请选择服务类型',
              trigger: 'blur,change'
            }
          ],
          icon: [
            {
              required: true,
              message: '请选择活动展示图',
              trigger: 'blur,change'
            }
          ]
        },
        serviceOperateType: '', // 服务“查看”“编辑”类型
        dialogLabel: '添加服务', // dialog标题
        serviceEditTxt: '保存', // 服务编辑保存按钮文本
        notAllowService: false, // 默认服务可编辑
        serviceId: '', // 服务id

        // 分页参数
        pageTotal: 0,
        pageSize: 10,
        currentPage: 1
      }
    },
    watch: {
    },
    computed: {
    },
    mounted: function () {
      const self = this
      // 获取服务列表
      if (self.providerId) {
        self.getProviderDetail(self.providerId)
        // 获取服务类型
        self.getServiceType()
      }
    },
    methods: {
      // 设置文本标题
      pageTitle: function () {
        if (this.notAllow && this.providerId) {
          this.editTxt = '编辑'
          document.title = '供应商详情'
          this.title = '供应商详情'
          this.notAllow = true
        } else if (this.providerId) {
          this.editTxt = '保存'
          document.title = '编辑供应商信息'
          this.title = '编辑供应商信息'
          this.notAllow = false
        } else {
          this.editTxt = '保存'
          document.title = '添加供应商'
          this.title = '添加供应商'
          this.notAllow = false
        }
        this.$store.commit('NAV_CRUMB', this.title)
        return this.providerId === '' ? '添加供应商' : '供应商详情'
      },

      // 编辑填充供应商信息
      getProviderDetail (id) {
        const self = this
        const JSON = {
          id: id
        }
        PROVIDER_DETAIL(JSON).then(res => {
          if (res.status === 'true') {
            const b = res.info
            self.supplierForm = {
              fullName: b.fullName,
              abbrName: b.abbrName,
              phone: b.phone,
              introduction: b.introduction
            }
            // 获取服务列表
            self.getService(id)
          } else {
            self.$message({
              message: res.msg,
              type: 'error'
            });
          }
        })
      },

      // 添加或者编辑供应商信息
      handleSave (formName, id) {
        // 如果是编辑
        if (this.notAllow && this.providerId) {
          this.notAllow = false
          this.editTxt = '保存'
          return
        }
        const self = this
        const JSON = {
          fullName: self.supplierForm.fullName,
          abbrName: self.supplierForm.abbrName,
          phone: self.supplierForm.phone,
          introduction: self.supplierForm.introduction
        }
        if (id) {
          JSON.id = id
        }
        self.$refs[formName].validate((valid) => {
          if (valid) {
            self.saveLoading = true
            self.editTxt = '执行中…'
            ADD_UPDATE_PROVIDER(JSON).then(res => {
              if (res.status === 'true') {
                if (!this.notAllow && this.providerId) {
                  self.$message({
                    type: 'success',
                    message: '修改成功！'
                  })
                } else if (!this.notAllow && !this.providerId) {
                  self.$message({
                    type: 'success',
                    message: '添加成功！'
                  })
                  setTimeout(() => {
                    self.$router.replace('/service/supplier-manage/detail?providerId=' + self.providerId)
                  }, 300)
                }
                // 获取新增成功后的供应商id
                self.saveLoading = false
                self.providerId = res.info.id
                self.editTxt = '编辑'
                self.notAllow = true
              } else {
                self.saveLoading = false
                self.$message({
                  message: res.msg,
                  type: 'error'
                });
              }
            })
          }
        })
      },

      // 添加编辑查看服务
      handleService (type, id) {
        const self = this
        // 获取服务操作类型：“查看”或者“编辑”
        self.serviceOperateType = type
        self.dialogFormVisible = true
        // 如果是查看或者编辑
        if (type) {
          self.serviceId = id
          const JSON = {
            id: id
          }
          GET_SERVICE_DETAIL(JSON).then(res => {
            if (res.status === 'true') {
              self.serviceForm.name = res.info.name
              self.serviceForm.introduction = res.info.description
              self.serviceForm.ServiceType = res.info.type.toString()
              self.serviceForm.price = res.info.price || ''
              self.serviceForm.icon = res.info.imgPath
            } else {
              self.$message({
                message: res.msg,
                type: 'error'
              });
            }
          })
          if (type === 'view') {
            self.serviceEditTxt = '编辑'
            self.dialogLabel = '查看服务'
            self.notAllowService = true
          } else if (type === 'edit') {
            self.serviceEditTxt = '保存'
            self.dialogLabel = '编辑服务'
            self.notAllowService = false
          }
        } else {
          self.serviceId = ''
          self.dialogLabel = '添加服务'
          self.notAllowService = false
        }
      },

      // 保存编辑服务操作
      saveService (formName) {
        const self = this
        // 如果是查看
        if (self.notAllowService) {
          self.serviceEditTxt = '保存'
          self.dialogLabel = '编辑服务'
          self.notAllowService = false

          return
        }
        self.$refs[formName].validate((valid) => {
          if (valid) {
            self.saveServiceLoading = true
            self.serviceEditTxt = '执行中…'
            const JSON = {
              providerId: self.providerId, // 新增供应商id
              name: self.serviceForm.name,
              description: self.serviceForm.introduction,
              type: self.serviceForm.ServiceType,
              price: self.serviceForm.price || null,
              imgPath: self.serviceForm.icon
            }
            // console.log('JSON', JSON);

            if (self.serviceId) {
              JSON.id = self.serviceId
            }
            ADD_UPDATE_SERVICE(JSON).then(res => {
              if (res.status === 'true') {
                self.saveServiceLoading = false
                self.dialogFormVisible = false
                self.$message({
                  type: 'success',
                  message: self.serviceId ? '编辑成功！' : '添加成功！'
                })
                // 恢复按钮默认值
                self.serviceEditTxt = '保存'
                self.getService()
                self.$refs['serviceForm'].resetFields()
              } else {
                self.saveServiceLoading = false
                self.$refs['serviceForm'].resetFields()
                self.$message({
                  message: res.msg,
                  type: 'error'
                });
              }
            })
          }
        })
      },

      // 获取服务列表
      getService () {
        const self = this
        const JSON = {
          pageNum: self.currentPage,
          pageSize: self.pageSize,
          providerId: self.providerId
        }
        SERVICE_LIST(JSON).then(res => {
          if (res.status === 'true') {
            // 服务总条数
            self.pageTotal = res.info.total
            if (res.info.result) {
              let b = []
              res.info.result.forEach(item => {
                b.push({
                  id: item.id,
                  picPath: item.imgPath,
                  name: item.name,
                  price: item.price,
                  description: item.description,
                  type: item.type,
                  statusName: item.statusName,
                  statusCode: item.statusCode
                })
              })
              self.tableData = b
            }
          } else {
            self.$message({
              message: res.msg,
              type: 'error'
            });
          }
        })
      },

      // 变更服务状态
      handleUpdateStatus(status, id) {
        const self = this
        const JSON = {
          id: id,
          statusCode: status
        }
        if (status === 1) {
          CHANGE_SERVICE_STATUS(JSON).then(res => {
            if (res.status === 'true') {
              this.getService()
            } else {
              self.$message({
                showClose: true,
                message: res.msg,
                type: 'error'
              });
            }
          })
        } else {
          self.$confirm('该服务将被关闭', '确认关闭该服务？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            CHANGE_SERVICE_STATUS(JSON).then(res => {
              if (res.status === 'true') {
                this.getService()
                self.$message({
                  type: 'success',
                  message: '该服务已关闭!'
                })
              } else {
                self.$message({
                  type: 'error',
                  message: res.msg
                })
              }
            })
          }).catch(() => {
            // 刷新一下服务列表，展开switch
            this.getService()
            self.$message({
              type: 'info',
              message: '已取消'
            });
          });
        }
      },

      // 获取服务类型
      getServiceType () {
        const self = this
        const JSON = {
          key: 'valueAddServiceType'
        }
        SERVICE_TYPE(JSON).then(res => {
          if (res.status === 'true') {
            if (res.info) {
              // 获取服务类型列表
              self.serviceForm.ServiceTypeList = res.info
            }
          } else {
            self.$message({
              message: res.msg,
              type: 'error'
            });
          }
        })
      },

      // 关闭服务信息dialog
      handleClose(done) {
        const self = this
        self.$confirm('确认关闭？')
          .then(_ => {
            self.cancelSet('serviceForm')
            done();
          })
          .catch(_ => {});
      },

      // 取消赋值
      cancelSet (formName) {
        this.$refs[formName].resetFields()
        this.dialogFormVisible = false
      },

      // 上传
      handleAvatarSuccess(res, file) {
        this.loadImg = false
        if (res.status === 'true') {
          this.serviceForm.icon = res.info
          // console.log(res.info)
        } else {
          this.$message.error('上传图片失败！')
        }
      },
      beforeAvatarUpload(file) {
        const isLt1M = file.size / 1024 / 1024 < 1;
        if (!isLt1M) {
          this.$message.error('上传活动展示图图片大小不能超过 1M!');
        }
        if (isLt1M) {
          this.loadImg = true
        }
        return isLt1M;
      },

      // 分页器事件
      handleSizeChange(val) {
        this.pageSize = val
        this.getService()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.getService()
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../styles/config.scss';
  @import '../../../styles/common.scss';
  .service-detail {
    .avatar-uploader {
      position: relative;
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
      .tipStyle {
        position: absolute;
        top: 10px;
        margin-left: 20px;
      }
    }
    .avatar {
      width: 80px;
      height: 80px;
      display: block;
    }
  }
</style>
