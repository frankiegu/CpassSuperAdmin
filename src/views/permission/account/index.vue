<template>
  <div class="account">
    <!-- 有面包屑的时候，就隐藏这个标题 -->
    <div class="page-title">
      <h1>账号管理</h1>
    </div>

    <div class="store-setting card-padding">
      <!-- 查询表单 -->
      <el-form
        :inline="true"
        :model="spaceSort"
        class="sort-form-bar">

        <el-form-item>
          <el-select
            class="width150"
            v-model="spaceSort.storeId"
            @change="getAccountList"
            placeholder="请选择门店">
            <el-option
              v-for="item in spaceSort.storeList"
              :key="item.id"
              :label="item.storeName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="mr0">
          <el-input
            class="width220px"
            v-model.trim="spaceSort.staffName"
            placeholder="请输入员工姓名"
            @keyup.native.enter="getAccountList">

            <i slot="suffix" @click="getAccountList" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-form-item>

        <el-button class="btn-link fl" type="primary" @click="setPost()" icon="el-icon-circle-plus">新增账号</el-button>

      </el-form>

      <el-table
        :data="tableData"
        :empty-text="tableEmpty"
        :slot="tableEmpty"
        v-loading="tableLoading"
        border
        style="width: 100%">

        <!-- 1 -->
        <el-table-column
          label="员工ID">

          <template slot-scope="scope">
            <span>{{ scope.row.number }}</span>
          </template>
        </el-table-column>

        <!-- 2 -->
        <el-table-column
          label="员工姓名">

          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <!-- 3 -->
        <el-table-column
          label="登录账号">

          <template slot-scope="scope">
            <span>{{ scope.row.username }}</span>
          </template>
        </el-table-column>

        <!-- 4 -->
        <el-table-column
          label="所属门店">

          <template slot-scope="scope">
            <span>{{ scope.row.storeNames }}</span>
          </template>
        </el-table-column>

        <!-- 5 -->
        <el-table-column
          label="职务">

          <template slot-scope="scope">
            <span>{{ scope.row.roleName }}</span>
          </template>
        </el-table-column>

        <!-- 6 -->
        <el-table-column
          width="250"
          label="操作">

          <template slot-scope="scope">
            <span @click="showDialog('distribution', scope.row.id, scope.row.roleId)" class="pointer-theme-blue dib">分配职务</span>

            <span @click="setPost(scope.row.id)" class="pointer-theme-blue margin-lr6 dib">编辑</span>

            <span @click="showDialog('delete', scope.row.id)" class="theme-gray cursor-pointer margin-lr6 dib">删除</span>

            <el-tooltip :content="scope.row.status === 1 ? '点击停用该账号' : '点击开启该账号'" placement="top">
              <el-switch
                class="margin-lr6"
                v-model="scope.row.status"
                :active-value="1"
                :inactive-value="0"
                active-text=""
                inactive-text=""
                :active-color="switchActiveColor"
                inactive-color="rgb(191, 194, 217)"
                @change="businessToggle(scope.row.status, scope.row.id)">
              </el-switch>
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

      <!-- 确认停用账号或者分配职务？ -->
      <el-dialog
        :title="dialogTitle"
        class="set-dialog"
        :visible.sync="stopVisible"
        width="420px">
        <!--删除账号-->
        <p v-show="dialogType === 'delete'" class="p1">该账号将无法登陆管理系统</p>
        <!--分配职务-->
        <el-row class="line-height36" v-show="dialogType === 'distribution'">

          <span class="fl">职务</span>

          <div class="width30 fl"></div>

          <el-select
            v-model.trim="distribution"
            class="width70 fl"
            placeholder="">

            <el-option
              v-for="(item, index) in postForm.postList"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-row>

        <div slot="footer" class="dialog-footer">
          <el-button @click="stopVisible = false">取 消</el-button>
          <el-button
            @click="sureBtn()"
            type="primary">确认</el-button>
        </div>
      </el-dialog>

      <!-- 新增编辑账号 -->
      <transition name="slide-fade">
        <el-form
          :model="postForm"
          ref="postForm"
          :rules="rules"
          label-width="80px"
          class="set-table-dialog"
          v-show="postStatus">

          <div class="panel scroll-panel">
            <h1 class=""><i @click="cancelSet('postForm')" class="el-icon-arrow-right fl callback theme-gray"></i>{{ postTitle }}</h1>

            <div class="content mt40">
              <div class="content-form clearfix">

                <el-form-item class="mt40" label="员工ID">
                  <span v-if="postForm.number">{{ postForm.number }}</span>
                  <span v-else>新增账号后由系统生成</span>
                </el-form-item>

                <el-form-item class="mt40" label="员工姓名" prop="name">
                  <el-input
                    v-model.trim="postForm.name"
                    :maxlength="20"
                    placeholder="请输入员工名称"></el-input>
                </el-form-item>

                <el-form-item class="mt40" label="手机号码" prop="tel">
                  <el-input
                    v-model.trim="postForm.tel"
                    :maxlength="11"
                    placeholder="请输入员工手机号码"></el-input>
                </el-form-item>

                <el-form-item class="mt40" label="所属门店" prop="selectStoreId">
                  <el-select class="width100" v-model="postForm.selectStoreId" multiple placeholder="请选择所属门店" @remove-tag="removeTagHandle" @change="selectHandle">
                    <el-option
                      v-for="item in postForm.selectStoreList"
                      :key="item.id"
                      :label="item.storeName"
                      :value="item.id">
                    <span v-if="item.id==='-1'" style="width: 100%;" class="all-store">
                      <el-checkbox v-model="postForm.allStoreChecked" @change="checkboxHandle">全部门店</el-checkbox>
                    </span>
                      <span v-else style="float:left">{{item.storeName}}</span>
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item class="mt40" label="职务" prop="post" style="margin-bottom: 0">
                  <el-select
                    v-model.trim="postForm.post"
                    class="fl width100"
                    placeholder="请选择">

                    <el-option
                      v-for="(item, index) in postForm.postList"
                      :key="index"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item class="" label="">
                  <p class="theme-gray clearfix">可在创建账号后进行分配</p>
                </el-form-item>
              </div>

            </div>

            <div class="footer">
              <p class="theme-gray mb22">新增账号默认密码：123456a</p>

              <el-button
                class="btn-save"
                type="primary"
                @click="postSave('postForm')">保存</el-button>
              <el-button @click="cancelSet('postForm')" class="btn-clear">取消</el-button>
            </div>

          </div>

          <div @touchmove.prevent @click="cancelSet('postForm')" class="v-modal"></div>
        </el-form>
      </transition>
    </div>
  </div>
</template>

<script>
  import { findAllStore, roleList, ADD_EDIT_USER, USER_CHECK, USER_INFO, ACCOUNT_USER_LIST, DEL_ACCOUNT_USER, DISTRIBUTE_ROLE, ACCOUNT_CLOSE, ACCOUNT_OPEN } from '@/service'
  import { checkPhone } from '@/config/utils'

  export default {
    data () {
      // 检测是否已存在的用户名称和电话号码
      let checkField = (type, value, callback) => {
        const self = this
        if (value.length <= 0) callback()
        // const JSON = {
          // key: type,
          // value: value
        // }
        let JSON = {}
        if (type === 'name') {
          JSON = {
            name: value
          }
        } else if (type === 'username') {
          JSON = {
            username: value
          }
        }
        if (self.postForm.id) {
          JSON.id = self.postForm.id
        }
        USER_CHECK(JSON).then(res => {
          if (res.status !== 'true') {
            callback(new Error(res.msg))
          } else {
            callback()
          }
        })
      }
      // 检查是否重复名称
      var checkName = (rule, value, callback) => {
        checkField('name', value, callback)
      }
      // 检测电话号码
      var validateTel = (rule, value, callback) => {
        if (!checkPhone(value)) {
          callback(new Error('请输入正确的手机号'));
        } else {
          checkField('username', value, callback)
        }
      };
      return {
        title: '场地发布管理',

        postForm: {
          id: '',
          number: '', // 员工id
          name: '',
          tel: '',
          allStoreChecked: false, // 选中全部门店开关
          allStoreIdList: [], // 全部门店id数组
          selectStoreId: [],
          selectStoreList: [],
          post: '',
          postList: []
        },
        rules: {
          name: [
            {
              required: true,
              message: '请输入员工姓名',
              trigger: 'blur,change'
            }, {
              validator: checkName,
              trigger: 'blur,change'
            }
          ],
          tel: [
            {
              required: true,
              message: '请输入手机号码',
              trigger: 'blur,change'
            }, {
              validator: validateTel,
              trigger: 'blur,change'
            }
          ],
          selectStoreId: [
            {
              required: true,
              type: 'array',
              message: '请选择所属门店',
              trigger: 'blur,change'
            }
          ]
        },
        postTitle: '',
        postStatus: false,

        stopVisible: false, // 停用弹出框
        dialogType: '', // 弹出框的类型
        dialogTitle: '',
        dialogCon: '',
        id: '', // 账号id

        distribution: 2,
        distributionList: [{value: 2}],

        date: null, // 选择日期
        tableLoading: true,
        tableEmpty: ' ',

        // 分页参数
        pageTotal: 0,
        pageSize: 10,
        currentPage: 1,

        // table列表数据
        tableData: [],

        // 筛选条件
        spaceSort: {
          staffName: '', // 员工姓名
          storeList: [], // 门店列表
          storeId: null  // 门店列表
        }
      }
    },
    mounted () {
      const self = this

      // 查询账号列表
      self.getAccountList()

      // 选择门店列表
      self.getFindAllStore()
      // 选择职位列表
      self.getRoleList()

      // 模拟点击
      // self.setPost()
    },
    methods: {
      cancelSet (formName) {
        this.$refs[formName].resetFields()
        this.postStatus = false
      },
      // 点击操作会议开放情况
      setPost (id) {
        const self = this

        self.postStatus = true
        // 判断是否存在id
        if (!id) {
          self.postTitle = '新增账号'
          // 清空id
          self.postForm.id = ''
          // 清空账号id
          self.postForm.number = ''
          // 清空员工姓名
          self.postForm.name = ''
          // 清空手机号码
          self.postForm.tel = ''
          // 默认不选中全部门店开关
          self.postForm.allStoreChecked = false
          // 清空选中的门店id数组
          self.postForm.selectStoreId = []
          // 清空职务
          self.postForm.post = ''
        } else {
          self.postTitle = '编辑账号'
          self.postForm.id = id
          self.getUserInfo(id)
        }
      },
      // 获取账号信息
      getUserInfo (id) {
        const self = this
        if (id) {
          const JSON = {
            id: id
          }
          // 填充用户信息
          USER_INFO(JSON).then(res => {
            if (res.status === 'true') {
              let b = res.info
              // 员工姓名
              self.postForm.name = b.name
              // 员工账号id
              self.postForm.number = b.number
              // 手机号码
              self.postForm.tel = b.username
              // 选中的门店id数组
              let d = []
              if (b.stores) {
                b.stores.forEach(item => {
                  d.push(item.storeId)
                })
              }
              // console.log(d)
              self.postForm.selectStoreId = d
              // 判断是否为全选
              // 有可能出现可选的门店已不存在，但是之前已选中
              if (self.allStoreIdList.length <= d.length) {
                self.postForm.allStoreChecked = true
              } else {
                self.postForm.allStoreChecked = false
              }
              // 清空职务
              self.postForm.post = b.roleId
            } else {
              self.$message({
                type: 'error',
                message: res.msg
              });
            }
          })
        }
      },
      // 新增或者编辑账号
      postSave (formName) {
        const self = this

        self.$refs[formName].validate((valid) => {
          if (valid) {
            self.postStatus = false
            // console.log(self.postForm.id)
            const JSON = {
              name: self.postForm.name,
              username: self.postForm.tel,
              storeIds: self.postForm.selectStoreId
            }
            let roleArr = [self.postForm.post]
            // 职务选择为非必选
            if (self.postForm.post) {
              JSON.roleIds = roleArr
            }
            // 如果是编辑操作
            if (self.postForm.id) {
              JSON.id = self.postForm.id
            }
            // console.log(JSON)
            ADD_EDIT_USER(JSON).then(res => {
              if (res.status === 'true') {
                // console.log(res)
                self.$message({
                  showClose: true,
                  message: self.postForm.id ? '编辑成功' : '新增成功',
                  type: 'success'
                });
                self.getAccountList()
              } else {
                self.$message({
                  type: 'error',
                  message: res.msg
                });
              }
            })
          } else {
            return
          }
        })
      },
      // 切换账号启用状态
      businessToggle (currentStatus, id) {
        const self = this
        // console.log('currentStatus: ', currentStatus);
        const JSON = {
          id: id
        }
        if (currentStatus === 1) {
          ACCOUNT_OPEN(JSON).then(res => {
            if (res.status === 'true') {
              self.$message({
                type: 'success',
                message: '成功开启该账号!'
              })
            } else {
              self.$message({
                type: 'error',
                message: res.msg
              })
            }
          })
        } else {
          self.$confirm('该账号将无法登陆管理系统', '确认停用账号？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            ACCOUNT_CLOSE(JSON).then(res => {
              if (res.status === 'true') {
                self.$message({
                  type: 'success',
                  message: '账号已停用!'
                })
              } else {
                self.$message({
                  type: 'error',
                  message: res.msg
                })
              }
            })
          }).catch(() => {
            // 刷新一下账号列表，展开switch
            this.getAccountList()
            self.$message({
              type: 'info',
              message: '已取消'
            });
          });
        }
      },
      // 确认弹出框
      sureBtn () {
        const self = this
        if (self.dialogType === 'delete') {
          const JSON = {
            id: self.id
          }
          DEL_ACCOUNT_USER(JSON).then(res => {
            if (res.status === 'true') {
              self.$message({
                type: 'success',
                message: '删除成功!'
              })
              self.getAccountList()
            } else {
              self.$message({
                type: 'error',
                message: res.msg
              })
            }
          })
        } else if (self.dialogType === 'distribution') {
          const JSON = {
            adminUserId: self.id,
            roleId: self.distribution
          }
          DISTRIBUTE_ROLE(JSON).then(res => {
            if (res.status === 'true') {
              self.$message({
                type: 'success',
                message: '分配职务成功!'
              })
              self.getAccountList()
            } else {
              self.$message({
                type: 'error',
                message: res.msg
              })
            }
          })
        }

        self.stopVisible = false
        self.dialogTitle = ''
        self.dialogCon = ''
        self.id = ''
      },
      // 展示分配职务和删除账号dialog
      showDialog (type, id, roleId) {
        const self = this

        self.stopVisible = true
        self.dialogType = type
        // 账号id
        self.id = id
        // 职务id
        self.distribution = roleId

        switch (type) {
          case 'delete':
            self.dialogTitle = '确认删除账号？'
            self.dialogCon = '该账号将无法登陆管理系统'
            break
          case 'distribution':
            self.dialogTitle = '选择职务'
            self.dialogCon = ''
            break
        }
      },
      // 门店列表
      getFindAllStore () {
        const self = this
        findAllStore().then(res => {
          if (res.status === 'true') {
            // 新增账号，门店列表
            self.postForm.selectStoreList = res.info
            // 保存全部门店数组
            if (res.info) {
              let b = []
              res.info.forEach(item => {
                b.push(item.id)
              })
              self.allStoreIdList = b
            }
            // 账号管理列表选择门店
            self.spaceSort.storeList = res.info
            // 添加查看全部门店
            self.spaceSort.storeList.unshift({'id': '-1', 'storeName': '全部门店', disabled: true})
            // console.log('self.orderSort.storeList: ', self.orderSort.storeList);
          } else {
            self.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            });
          }
        })
      },
      // 门店选中值发生变化时触发
      checkboxHandle () {
        // 如果选中了全部门店这个选项，则下框全部被选中
        if (this.postForm.allStoreChecked === true) {
          this.postForm.selectStoreId = this.allStoreIdList
        } else {
          this.postForm.selectStoreId = []
        }
      },
      // 移除输入框选中的门店时触发
      removeTagHandle () {
        // 一旦触发移除动作，则取消“全部门店”这个选项
        this.postForm.allStoreChecked = false
      },
      // 下拉框选中的触发动作
      selectHandle () {
        // 如果手动全部选中了所有的门店
        if (this.postForm.selectStoreId.length === this.allStoreIdList.length) {
          this.postForm.allStoreChecked = true
        } else {
          this.postForm.allStoreChecked = false
        }
      },
      // 职位列表
      getRoleList () {
        const self = this
        roleList().then(res => {
          if (res.status === 'true') {
            // console.log(res)
            // 新增之后，职位列表
            let b = []
            // 遍历列表，获取其id和名称
            if (res.info.page.result) {
              res.info.page.result.forEach(item => {
                b.push({
                  value: item.id,
                  label: item.roleName
                })
              })
            }
            self.postForm.postList = b
          } else {
            self.$message({
              type: 'error',
              message: res.msg
            });
          }
        })
      },
      // 账号列表
      getAccountList() {
        const self = this
        const paramsObj = {
          pageNum: self.currentPage,
          pageSize: self.pageSize,
          // 搜索参数
          name: self.spaceSort.staffName,
          storeId: self.spaceSort.storeId === '-1' ? '' : self.spaceSort.storeId
        }
        // console.log('paramsObj: ', paramsObj);

        ACCOUNT_USER_LIST(paramsObj).then(res => {
          if (res.status === 'true') {
            self.pageTotal = res.info.total
            self.tableData = res.info.result
            let b = []
            if (res.info.result) {
              res.info.result.forEach(item => {
                b.push({
                  id: item.id, // 账号id
                  number: item.number, // 用户id号码
                  name: item.name, // 员工姓名
                  username: item.username, // 登录账号
                  storeNames: item.storeNames, // 所属门店
                  roleId: item.roleId, // 职务id
                  roleName: item.roleName || '', // 职务名称
                  status: item.status // 是否启用账号，0停用，1开启
                })
              })
              self.tableData = b
            }
            // table的交互
            self.tableLoading = false
            if (self.tableData.length === 0) {
              self.tableEmpty = '暂时无数据'
            }
          } else {
            self.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            });
          }
        })
      },
      // 分页器事件
      handleSizeChange(val) {
        this.pageSize = val
        this.getAccountList()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.getAccountList()
      }
    }
  }
</script>
<style lang="scss">
  /*修改checkbox点击作用范围*/
  .all-store {
    .el-checkbox {
      width: 100%;
      text-align: left;
    }
  }
</style>

<style lang="scss" scoped>
  @import '../../../styles/config.scss';
  @import '../../../styles/common.scss';

  .account {
    .set-table-dialog {
      .panel {
        min-heigth: 100%;
        overflow-y: auto;
        &.scroll-panel {
          width: 410px;
          right: -20px;
        }
        .content {
          .content-form {
            padding-bottom: 100px;
          }
          margin-bottom: 50px;
        }
        .footer {
          position: relative;
          height: 100px;
          margin-top: -100px;
          margin-bottom: 50px;
          clear: both;
        }
        .clearfix:after {content: ".";display: block;height: 0;clear: both;visibility: hidden;}
        .clearfix {display: inline-block;}
      }
      .callback {
        display: inline-block;
        font-size: 16px;
        line-height: 25px;
        padding: 0 5px;
        cursor: pointer;
        margin-left: -9px;
      }
    }
    .sort-form-bar {
      text-align: right;
    }
  }
</style>
