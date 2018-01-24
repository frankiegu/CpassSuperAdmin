<template>
  <div class="access-detail">
    <div class="page-title">
      <!-- 根据URL的type参数展示标题 -->
      <h1>{{ pageTitle() }}</h1>
    </div>

    <div class="card-padding card-padding-vertical">
      <h3 class="grid-title">门禁基础信息</h3>

      <el-form :model="lockForm" :rules="lockRule" ref="lockForm" label-width="100px" :inline="true">
        <el-form-item label="名称" prop="lockName">
          <el-input v-model.trim="lockForm.lockName" :disabled="isNotAllow" class="width220px"></el-input>
        </el-form-item>

        <el-form-item label="所属门店" prop="storeId">
          <!-- 大佬威说主设备的门店不能修改 -->
          <span class="dib width220px" v-if="lockForm.isMain === 1">{{lockForm.storeName}}</span>
          <el-select
            v-model="lockForm.storeId"
            :disabled="isNotAllow"
            class="width220px"
            @change="findFieldListUsable('refresh')"
            v-else>
            <el-option
              v-for="storeItem in storeList"
              :label="storeItem.storeName"
              :value="storeItem.id"
              :key="storeItem.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="场地类型" prop="fieldType">
          <el-select
            v-model="lockForm.fieldType"
            :disabled="isNotAllow"
            class="width220px"
            @change="findFieldListUsable('refresh')">
            <el-option
              v-for="(value, key) in fieldTypeList"
              :label="value"
              :value="key"
              :key="key"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所属场地" prop="fieldId" v-if="lockForm.fieldType !== '3'">
          <el-select v-model="lockForm.fieldId" :disabled="isNotAllow" class="width220px">
            <el-option
              v-for="item in siteList"
              :label="item.fieldName"
              :value="item.id"
              :key="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="供应商" prop="supplierId">
          <el-select v-if="!lockForm.supplierId || !lockForm.supplierId.length || !lockForm.id" v-model="lockForm.supplierId" :disabled="isNotAllow" class="width220px">
            <el-option
              v-for="(value, key) in supplierList"
              :label="value"
              :value="key"
              :key="key"></el-option>
          </el-select>
          <span class="dib width220px" v-else-if="lockForm.id">{{supplierList[lockForm.supplierId]}}</span>
        </el-form-item>

        <el-form-item label="门禁ID" prop="snId" ref="lockIdInput">
          <el-input v-if="!lockForm.snId || !lockForm.snId.length || !lockForm.id" :maxlength="20" v-model.trim="lockForm.snId" :disabled="isNotAllow" class="width220px"></el-input>
          <!-- 门禁ID不允许修改 -->
          <span v-else-if="lockForm.id">{{lockForm.snId}}</span>
        </el-form-item>

        <el-form-item
          label=""
          label-width="0"
          style="display: block; text-align: center"
          v-if="handleHasPermissions(['/manage/lockBase/update', '/manage/lockBase/add'])">
          <el-button type="primary" class="width120px" @click="handleAddOrUpdate">{{editTxt}}</el-button>
        </el-form-item>
      </el-form>

      <!-- tab标签 -->
      <el-tabs v-model="activeTab" v-if="isShowTab">
        <!-- 用户管理标签页 -->
        <el-tab-pane label="用户管理" name="userManage" v-if="handleHasPermissions('/manage/lockMaintain/list')">
          <user-mg
            :lock-id="lockForm.id"
            :lock-name="lockForm.lockName"
            :store-name="lockForm.storeName"
            :lockStatus="lockForm.lockStatus"></user-mg>
        </el-tab-pane>

        <!-- 开锁记录标签页 -->
        <el-tab-pane label="开锁记录" name="usageRecord" v-if="handleHasPermissions('/manage/lockBase/unlockRecord')">
          <unlock-record :lock-base-id="lockForm.id"></unlock-record>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import handleHasPermissions from '@/config/com-mixins'
  import {loadConstant, findAllStore, listUsable, addLockBase, updateLockBase, lockDetail} from '@/service'
  import userMg from './components/user-mg'
  import unlockRecord from './components/unlock-record'
  export default {
    name: 'detail',
    mixins: [handleHasPermissions],
    data () {
      return {
        title: '',
        editTxt: '编辑',
        isNotAllow: true,
        isShowTab: false,
        hasChangeForm: false,
        // 门禁基础信息
        lockForm: {
          id: this.$route.query.id,
          isMain: 0, // 是否主设备
          lockStatus: '', // 门禁状态
          storeName: '',

          lockName: '', // 门禁名称
          storeId: '', // 门店
          fieldType: '', // 场地类型
          fieldId: '', // 所属场地
          supplierId: '', // 供应商id
          snId: '' // 门禁ID
        },
        lockRule: {
          lockName: [
            { required: true, message: '请输入门禁名称', trigger: 'blur,change' },
            { max: 20, message: '名称最长20个字', trigger: 'blur,change' }
          ],
          storeId: [
            { required: true, message: '请选择门店', trigger: 'blur,change' }
          ],
          fieldType: [
            { required: true, message: '请选择场地类型', trigger: 'blur,change' }
          ],
          fieldId: [
            { required: true, message: '请选择场地', trigger: 'blur,change' }
          ],
          supplierId: [
            { required: true, message: '请选择供应商', trigger: 'blur,change' }
          ],
          snId: [
            { required: true, message: '请输入门禁ID', trigger: 'blur,change' },
            { max: 20, message: 'ID最长20个字符', trigger: 'blur,change' }
          ]
        },
        // 门店列表
        storeList: [],
        // 场地类型列表
        fieldTypeList: [],
        // 场地列表
        siteList: [],
        // 供应商列表
        supplierList: [],

        // 选项卡
        activeTab: 'userManage'
      }
    },
    props: {},
    components: {userMg, unlockRecord},
    mounted () {
      if (this.$route.query.type === 'add' || this.$route.query.type === 'edit') {
        this.isNotAllow = false
        this.editTxt = '保存'
      }
      // 查询门禁详情
      if (this.$route.query.id) {
        this.handleGetLockDetail()
      }
      // 获取门店列表
      findAllStore({token: this.token}).then(res => {
        if (res.status === 'true') {
          this.storeList = res.info
        } else {
          console.log(res.msg)
        }
      })

      // 查询可用场地列表
      if (!this.$route.query.id) {
        this.findFieldListUsable()
      }

      // 获取场地类型常量
      const fieldType = 'lockBase.fieldType'
      loadConstant(fieldType).then(res => {
        if (res.status === 'true') {
          this.fieldTypeList = res.info
        } else {
          console.log(res.msg)
        }
      })
      // 获取供应商列表
      const supplierKey = 'lockBase.supplier'
      loadConstant(supplierKey).then(res => {
        if (res.status === 'true') {
          this.supplierList = res.info
        } else {
          console.log(res.msg)
        }
      })

      // 侦听基础信息表单变化
      this.$watch('lockFormStr', {
        handler: function (newVal, oldVal) {
          if (!newVal || !newVal.length && !oldVal.length) {
            this.hasChangeForm = false
            return
          } else if (oldVal.length && newVal.length) {
            this.hasChangeForm = newVal !== oldVal
          }
        }
      })
    },
    watch: {},
    computed: {
      lockFormStr: function () {
        return this.lockForm.lockName + this.lockForm.storeId + this.lockForm.fieldType + this.lockForm.fieldId + this.lockForm.supplierId + this.lockForm.snId
      }
    },
    filters: {},
    methods: {
      pageTitle() {
        let pageType = this.$route.query.type
        switch (pageType) {
          case 'add':
            this.isShowTab = false
            this.title = document.title = '新增门禁'
            break
          case 'read':
            this.isShowTab = true
            this.title = document.title = '门禁详情'
            break
          case 'edit':
            this.isShowTab = true
            this.title = document.title = '编辑门禁'
            break
          default:
            this.isShowTab = true
            this.title = document.title = '门禁详情'
            break
        }
        this.$store.commit('NAV_CRUMB', this.title)
        return this.title
      },

      // 查询可用的场地列表
      findFieldListUsable(isRefresh) {
        if (isRefresh) {
          this.lockForm.fieldId = ''
        }
        let params = {
          storeId: this.lockForm.storeId,
          fieldType: this.lockForm.fieldType
        }
        listUsable(params).then(res => {
          if (res.status === 'true' && res.info) {
            this.siteList = res.info
            if (!this.siteList.length && this.lockForm.fieldType !== '3') {
              this.$message.error({
                message: '该条件下没有场地，请选择其他门店或场地类型',
                duration: 3500
              })
            }
          } else {
            console.error(res.msg)
          }
        })
      },

      // 查询门禁详情
      handleGetLockDetail() {
        let detailParams = {
          id: this.lockForm.id
        }
        lockDetail(detailParams).then(res => {
          if (res.status === 'true' && res.info) {
            this.lockForm.lockName = res.info.lockName
            this.lockForm.snId = res.info.snId
            this.lockForm.supplierId = res.info.supplierId.toString()
            this.lockForm.storeId = res.info.storeId
            this.lockForm.fieldType = res.info.fieldType.toString()
            this.lockForm.fieldId = res.info.fieldId
            this.lockForm.lockStatus = res.info.lockStatus
            this.lockForm.isMain = res.info.isMain
            this.lockForm.storeName = res.info.storeName

            this.findFieldListUsable()
          } else {
            console.error(res.msg)
          }
        })
      },

      // 添加或更新门禁基础信息
      handleAddOrUpdate() {
        let _this = this
        let lockParams = {
          id: _this.lockForm.id,
          lockName: _this.lockForm.lockName,
          snId: _this.lockForm.snId,
          supplierId: _this.lockForm.supplierId,
          storeId: _this.lockForm.storeId,
          fieldType: _this.lockForm.fieldType,
          fieldId: _this.lockForm.fieldId
        }
        if (this.lockForm.id) {
          if (_this.isNotAllow) {
            _this.editTxt = '保存'
            _this.isNotAllow = false
          } else {
            _this.$refs['lockForm'].validate((valid) => {
              if (valid) {
                updateLockBase(lockParams).then(res => {
                  if (res.status === 'true') {
                    _this.isNotAllow = true
                    _this.editTxt = '编辑'
                    _this.$message.success('修改成功！')
                    _this.hasChangeForm = false
                  } else {
                    _this.$message.error(res.msg + '，保存失败！')
                  }
                })
              } else {
                return false
              }
            })
          }
        } else {
          _this.$refs['lockForm'].validate((valid) => {
            if (valid) {
              addLockBase(lockParams).then(res => {
                if (res.status === 'true' && res.info) {
                  let id = res.info.id
                  _this.$message.success('成功添加门禁！')
                  _this.hasChangeForm = false
                  setTimeout(function () {
                    _this.$router.replace('/space/access-control/detail?type=read&id=' + id)
                  }, 100)
                } else {
                  _this.$message.error(res.msg + '，保存失败！')
                  if (res.code === 2819) {
                    _this.$refs.lockIdInput.validateState = 'error'
                    _this.$refs.lockIdInput.validateMessage = '门禁ID有误'
                  }
                }
              })
            } else {
              return false
            }
          })
        }
      }
    },
    // 路由跳转前判断当前表单是否保存
    beforeRouteLeave(to, from, next) {
      let pageType = this.$route.query.type
      if (this.hasChangeForm) {
        if (pageType === 'add') {
          // console.log('flag')
          this.$confirm('当前页面信息尚未保存，是否放弃？', '确认放弃？', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            lockScroll: false,
            closeOnClickModal: false,
            closeOnPressEscape: false,
            showClose: false
          }).then(_ => {
            next()
          }).catch(_ => {
            return
          })
          return
        } else {
          // console.log('flag+1')
          this.$confirm('当前页面信息尚未保存，是否需要保存？', '是否保存？', {
            confirmButtonText: '保存',
            cancelButtonText: '不保存',
            lockScroll: false,
            closeOnClickModal: false,
            closeOnPressEscape: false,
            showClose: false,
            beforeClose: (action, instance, done) => {
              if (action === 'confirm') {
                instance.confirmButtonLoading = true
                instance.confirmButtonText = '执行中...'
                this.handleAddOrUpdate()
                setTimeout(() => {
                  done()
                  setTimeout(() => {
                    instance.confirmButtonLoading = false
                  }, 300)
                }, 1000)
              } else {
                done()
              }
            }
          }).then(_ => {
            next()
          }).catch(_ => {
            next()
          })
        }
      } else {
        next()
      }
    }
  }
</script>

<style lang="scss">
  .access-detail {
    .role-tree {
      .el-dialog__body {
        padding: 20px;
      }
    }
    @media screen and (max-height: 768px) {
      .role-dialog {
        margin-top: 1vh!important;
        &.small-role-dialog {
          margin-top: 15vh!important;
        }
        .el-dialog__body {
          padding: 10px;
        }
      }
    }
    .el-tabs__nav-wrap::after {
      height: 1px;
    }
  }
</style>
<style lang="scss" scoped>
  @import '../../../styles/config';
  .access-detail {
    .sort-form-bar {
      font-size: 0;
      margin-right: -10px;
    }
    .theme-gray {
      color: $theme-gray;
    }
  }
</style>
