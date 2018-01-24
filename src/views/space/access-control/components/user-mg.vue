<template>
  <div class="user-mg">
    <!-- 查询表单 -->
    <el-form :inline="true" :model="userSort" class="sort-form-bar">
      <el-button
        v-permissions="'/manage/lockMaintain/batchAdd'"
        type="primary"
        plain
        class="width120px fl"
        @click="handleLoadUsers(lockId)">添加</el-button>

      <el-form-item>
        <el-select
          v-model="userSort.status"
          class="width220px"
          placeholder="使用状态"
          clearable
          @change="handleGetUserList">
          <el-option value=" " label="全部"></el-option>
          <el-option :value="1" label="正常"></el-option>
          <el-option :value="3" label="停用"></el-option>
          <el-option :value="2" label="失效"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-input
          v-model.trim="userSort.userName"
          placeholder="请输入会员姓名"
          @keyup.native.enter="handleGetUserList">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="handleGetUserList"></i>
        </el-input>
      </el-form-item>
    </el-form>

    <!-- 用户管理表格 -->
    <el-table :data="lockUserTable" border style="width: 100%;" v-loading="listLoading">
      <el-table-column label="会员姓名" prop="userName"></el-table-column>

      <el-table-column label="来源" prop="source">
        <template slot-scope="scope">
          <span>{{scope.row.source === 1 ? '手动添加' : '预约场地'}}</span>
        </template>
      </el-table-column>

      <el-table-column label="所属公司" prop="companyName"></el-table-column>
      <el-table-column label="所属门店" prop="storeName"></el-table-column>
      <!--<el-table-column label="通行方式" prop="passWay"></el-table-column>-->

      <el-table-column label="使用期限" width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.useTimeLimit === 2">起：{{scope.row.useStartTime}}</span>
          <span v-if="scope.row.useTimeLimit === 2">止：{{scope.row.useEndTime}}</span>
          <span v-if="scope.row.useTimeLimit === 1">长期有效</span>
        </template>
      </el-table-column>

      <el-table-column label="使用状态" prop="useStatus">
        <template slot-scope="scope">
          <span v-if="scope.row.useStatus === 1">正常</span>
          <span v-if="scope.row.useStatus === 2">失效</span>
          <span v-if="scope.row.useStatus === 3">停用</span>
        </template>
      </el-table-column>

      <el-table-column label="权限状态" prop="permissionStatus">
        <template slot-scope="scope">
          <span v-if="scope.row.permissionStatus === 1 || (scope.row.permissionStatus === 5 && scope.row.useStatus === 1)">未下发</span>
          <span v-if="scope.row.permissionStatus === 2">已下发</span>
          <span v-if="scope.row.permissionStatus === 3">下发人员成功</span>
          <span v-if="scope.row.permissionStatus === 4">删除命令已下发</span>
          <span v-if="scope.row.useStatus !== 1 && scope.row.permissionStatus === 5">删除命令下发成功</span>
          <span v-if="scope.row.permissionStatus === 0">下发失败</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="130"
        v-if="handleHasPermissions(['/manage/lockMaintain/update', '/manage/lockMaintain/delete', '/manage/lockMaintain/changeUseStatus'])">
        <!-- “来源”为预约场地，不展示操作栏 -->
        <template slot-scope="scope" v-if="scope.row.source === 1">
          <!-- “手动添加”的人员在下发命令成功的前提下才能被编辑或删除 -->
          <div v-if="scope.row.source === 1 && (scope.row.permissionStatus === 3 || scope.row.permissionStatus === 5)">
            <span class="table-link" @click="handleEditUser(scope.row.id, scope.row.userName)">编辑</span>
            <span class="table-link theme-gray" @click="handleDelete(scope.row.id)">删除</span>

            <el-tooltip placement="top" :content="scope.row.useStatus === 1 ? '点击停用该会员的使用权限' : '点击启用该会员的使用权限'">
              <el-switch
                v-model="scope.row.useStatus"
                v-if="scope.row.useStatus !== 2"
                :active-value="1"
                :inactive-value="3"
                :active-color="switchActiveColor"
                active-text=""
                inactive-text=""
                @change="handleToggleUse(scope.row.useStatus, scope.row.id)">
              </el-switch>
            </el-tooltip>
          </div>
          <span
            class="theme-gray"
            style="font-size: 12px"
            v-else-if="scope.row.permissionStatus !== 0 || (scope.row.permissionStatus === 5 && scope.row.useStatus === 1)">
            等待命令下发成功（<span class="table-link" @click="refresh">刷新</span>）
          </span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination
      background
      class="pagination-container"
      @size-change="handleUserSizeChange"
      @current-change="handleUserCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageTotal">
    </el-pagination>

    <!-- 添加人员弹窗 -->
    <el-dialog
      title="编辑权限"
      :width="dialogType === 'add' ? '60%' : '50%'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :lock-scroll="false"
      :close-on-press-escape="false"
      :before-close="handleCloseTree"
      :custom-class="customClass"
      class="role-tree">

      <!-- 树状 -->
      <div v-if="dialogType === 'add'">
        <el-row :gutter="10" class="filter-bar">
          <el-col :span="10">
            <el-input
              placeholder="输入姓名/企业名字"
              v-model.trim="filterText">
            </el-input>
          </el-col>
          <el-col :span="14">
            <div class="summary fl">
              已选<span class="selectedNum ml30">{{selectedMembers.length}}</span>
            </div>
            <div class="btn-reset fr" @click="removeSelected()">清空</div>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="10">
            <el-tree
              v-loading="loadingTree"
              class="filter-tree"
              :data="roleTreeData"
              :props="treeProps"
              node-key="nodeKey"
              accordion
              show-checkbox
              ref="tree"
              :default-expand-all="true"
              :filter-node-method="filterNode"
              @check-change="handleCheckChange">
            </el-tree>
          </el-col>
          <el-col :span="14">
            <el-table :data="selectedMembers" height="360px" style="width: 100%" border>
              <el-table-column prop="companyName" label="企业名称"></el-table-column>
              <el-table-column prop="name" label="会员姓名"></el-table-column>
              <el-table-column prop="staffCode" label="工号"></el-table-column>
              <el-table-column prop="nodeKey" label="操作" width="50">
                <template slot-scope="scope">
                <span class="btn-delete" @click="removeSelected(scope.row.nodeKey)">
                  <i class="el-icon-close"></i>
                </span>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>

      <!-- 添加会员并设置权限表单 -->
      <el-form
        :model="userAccessForm"
        class="mt15"
        label-width="80px"
        ref="userAccessForm"
        :rules="periodRules">
        <el-form-item label="会员姓名" v-if="dialogType === 'edit'">{{currMember}}</el-form-item>

        <el-form-item label="使用期限" class="mb10">
          <el-row :gutter="10">
            <el-col :span="8" style="margin-left: -5px">
              <el-select v-model="userAccessForm.period" style="width: 100%" @change="resetTime">
                <el-option :value="1" label="长期有效"></el-option>
                <el-option :value="2" label="自定义"></el-option>
              </el-select>
            </el-col>

            <el-col v-if="userAccessForm.period === 2" :span="8">
              <el-form-item prop="startTime">
                <el-date-picker
                  v-model="userAccessForm.startTime"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm"
                  :picker-options="periodOptions"
                  style="width: 100%"
                  value-format="yyyy-MM-dd HH:mm"
                  placeholder="请选择开始日期"></el-date-picker>
              </el-form-item>
            </el-col>

            <el-col v-if="userAccessForm.period === 2" :span="8">
              <el-form-item prop="endTime">
                <el-date-picker
                  v-model="userAccessForm.endTime"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm"
                  :picker-options="periodOptions"
                  style="width: 100%"
                  value-format="yyyy-MM-dd HH:mm"
                  placeholder="请选择结束日期"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>

        <!--<el-form-item label="通行方式" style="margin-bottom: 0">-->
        <!--<el-checkbox-group v-model="userAccessForm.passWay">-->
        <!--<el-checkbox label="指纹"></el-checkbox>-->
        <!--<el-checkbox label="密码"></el-checkbox>-->
        <!--</el-checkbox-group>-->
        <!--</el-form-item>-->
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addOrUpdateUser">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import handleHasPermissions from '@/config/com-mixins'
  import {listMaintain, loadUsers, batchAddLockUser, deleteLockUser, updateLockUser, changeUseStatus} from '@/service'
  export default {
    name: 'user-mg',
    mixins: [handleHasPermissions],
    data() {
      // 自定义日期选择范围校验
      var validateStartTime = (rule, value, callback) => {
        if (this.userAccessForm.period === 2) {
          if (!value) {
            callback(new Error('请选择开始时间'))
          } else if (this.userAccessForm.endTime && value >= this.userAccessForm.endTime) {
            callback(new Error('开始时间须小于结束时间'))
          }
        }
        callback()
      }
      var validateEndTime = (rule, value, callback) => {
        if (this.userAccessForm.period === 2) {
          if (!value) {
            callback(new Error('请选择结束时间'))
          } else if (this.userAccessForm.startTime && value <= this.userAccessForm.startTime) {
            callback(new Error('结束时间须大于开始时间'))
          }
        }
        callback()
      }
      return {
        // 用户管理选项卡
        listLoading: true,
        userIds: [], // 选中的会员id数组
        currUserId: '',
        userSort: {
          status: '',
          userName: ''
        },
        lockUserTable: [],
        currentPage: 1,
        pageSize: 10,
        pageTotal: 10,

        // 会员选择相关
        loadingTree: true,
        dialogVisible: false, // 弹窗是否可见
        selectedMembers: [], // 选中的会员数组
        filterText: '', // 过滤文本
        roleTreeData: [], // 会员树状数组
        treeProps: {
          label: 'name',
          children: 'children'
        },
        // 权限设置
        customClass: 'role-dialog',
        dialogType: 'edit',
        currMember: '',
        userAccessForm: {
          period: 1,
          startTime: '',
          endTime: ''
          // passWay: []
        },
        // 弹窗日期选择器配置
        periodOptions: {
          disabledDate(time) {
            return time.getTime() < (Date.now() - 3600 * 1000 * 24)
          }
        },
        // 使用期限验证
        periodRules: {
          startTime: [
            { validator: validateStartTime, trigger: 'blur, change', type: 'date' }
          ],
          endTime: [
            { validator: validateEndTime, trigger: 'blur, change', type: 'date' }
          ]
        }
      }
    },
    props: {
      lockId: [String, Number],
      lockName: [String],
      lockStatus: [String, Number],
      storeName: [String]
    },
    mounted() {
      // 查询门禁下的会员列表
      this.handleGetUserList()
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val)
      }
    },
    methods: {
      // 刷新会员列表
      refresh() {
        this.listLoading = true
        setTimeout(() => {
          this.handleGetUserList()
          setTimeout(() => {
            this.listLoading = false
          }, 500)
        }, 1000)
      },
      // 查询门禁下的会员列表
      handleGetUserList() {
        let paramsObj = {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          lockBaseId: this.lockId,
          useStatus: this.userSort.status,
          userName: this.userSort.userName
        }
        listMaintain(paramsObj).then(res => {
          if (res.status === 'true' && res.info) {
            this.pageTotal = res.info.total
            this.lockUserTable = res.info.result
            this.listLoading = false

            let REG = /:\d{2}$/
            for (let i = 0; i < this.lockUserTable.length; i++) {
              this.lockUserTable[i].useEndTime = res.info.result[i].useEndTime
                ? res.info.result[i].useEndTime.replace(REG, '') : null
              this.lockUserTable[i].useStartTime = res.info.result[i].useStartTime
                ? res.info.result[i].useStartTime.replace(REG, '') : null
            }
          } else {
            console.error(res.msg)
          }
        })
      },

      // resetTime
      resetTime() {
        this.userAccessForm.startTime = ''
        this.userAccessForm.endTime = ''
      },

      // 加载当前门禁未关联用户
      handleLoadUsers(id) {
        this.dialogType = 'add'
        this.customClass = 'role-dialog'
        this.dialogVisible = true
        this.userAccessForm.period = 1
        this.userAccessForm.startTime = ''
        this.userAccessForm.endTime = ''
        this.roleTreeData = []
        const _this = this
        loadUsers({
          lockBaseId: id
        }).then(res => {
          if (res.status === 'true') {
            _this.roleTreeData.push(res.info)
            _this.loadingTree = false
          } else {
            _this.$message.error(res.msg)
          }
        })
      },
      // 关闭弹窗
      handleCloseTree(done) {
        if (this.selectedMembers.length) {
          const _this = this
          _this.$confirm('未保存添加，是否确认关闭？', {
            lockScroll: false
          })
          .then(_ => {
            _this.selectedMembers = []
            done()
          })
          .catch(_ => {
            return
          })
        } else {
          done()
        }
      },
      // 会员选择相关
      // 过滤树节点
      filterNode(value, data, node) {
        if (!value) return true
        if (data.name.indexOf(value) !== -1) {
          return true
        } else if (node.parent.data.name && node.parent.data.name.indexOf(value) !== -1) {
          return true
        } else if (node.parent.parent && node.parent.parent.level > 0 && node.parent.parent.data.name.indexOf(value) !== -1) {
          return true
        }
      },
      // 获取选中的树节点，只返回会员节点
      getCheckedNodes() {
        let leafOnly = true
        const checkedNodes = this.$refs.tree.getCheckedNodes(leafOnly)
        const staffNodes = []
        for (let i = 0; i < checkedNodes.length; i++) {
          if (checkedNodes[i].staffCode != null && !checkedNodes[i].disabled) {
            staffNodes.push(checkedNodes[i])
          }
        }
        return staffNodes
      },
      // 复选框change时更新会员节点
      handleCheckChange(data, checked, indeterminate) {
        this.selectedMembers = this.getCheckedNodes()
        this.userIds = []
        for (let i = 0; i < this.selectedMembers.length; i++) {
          this.userIds.push(this.selectedMembers[i].userId)
        }
      },
      // 移除会员
      removeSelected(nodeKey) {
        // 如果没有传nodeKey，则移除所有选中的会员；否则移除当前nodeKey的会员
        if (!nodeKey) {
          this.$refs.tree.setCheckedKeys([])
        } else {
          this.$refs.tree.setChecked(nodeKey, false, true)
        }
      },

      // 添加或编辑用户
      addOrUpdateUser() {
        this.$refs['userAccessForm'].validate((valid) => {
          if (valid) {
            // 新增会员
            if (this.dialogType === 'add') {
              let batchParams = {
                lockBaseId: this.lockId,
                userIds: this.userIds,
                useTimeLimit: this.userAccessForm.period,
                useStartTime: this.userAccessForm.startTime,
                useEndTime: this.userAccessForm.endTime
              }
              if (!this.selectedMembers.length) {
                this.$message.info('未选中任何会员')
              } else {
                batchAddLockUser(batchParams).then(res => {
                  if (res.status === 'true') {
                    this.dialogVisible = false
                    if (this.lockStatus === 0) {
                      this.$message.success('添加成功，当前设备已离线，请检查设备')
                    } else {
                      this.$message.success('添加成功')
                    }
                    this.handleGetUserList()
                  } else {
                    this.$message.error(res.msg)
                  }
                })
              }
              return
            }
            if (this.dialogType === 'edit') {
              let params = {
                id: this.currUserId,
                useTimeLimit: this.userAccessForm.period,
                useStartTime: this.userAccessForm.startTime,
                useEndTime: this.userAccessForm.endTime
              }
              updateLockUser(params).then(res => {
                if (res.status === 'true') {
                  this.dialogVisible = false
                  if (this.lockStatus === 0) {
                    this.$message.success('修改成功，当前设备已离线，请检查设备')
                  } else {
                    this.$message.success('成功修改使用期限')
                  }
                  this.handleGetUserList()
                } else {
                  this.$message.error(res.msg)
                }
              })
              return
            }
          } else {
            return
          }
        })
      },

      // 删除会员权限
      handleDelete(id) {
        let h = this.$createElement
        this.$msgbox({
          title: '删除会员权限？',
          message: h('p', null, ['确定删除该会员对' + this.lockName + '门禁的使用权限？']),
          showCancelButton: true,
          lockScroll: false
        }).then(_ => {
          deleteLockUser({id: id}).then(res => {
            if (res.status === 'true') {
              if (res.code === '2822') {
                this.$message.success('即将删除该会员的门禁工号及' + this.storeName + '门店的所有门禁使用权限！')
              } else {
                this.$message.success('删除成功！')
              }
              this.handleGetUserList()
            } else {
              this.$message.error(res.msg)
            }
          })
        }).catch(_ => {
          this.$message.info('已取消操作！')
        })
      },
      // 打开编辑使用期限弹窗
      handleEditUser(id, name) {
        this.currMember = name
        this.currUserId = id
        this.dialogType = 'edit'
        this.dialogVisible = true
        let target = this.lockUserTable.find((target) => {
          return target.id === id
        })
        this.userAccessForm.startTime = target.useStartTime
        this.userAccessForm.endTime = target.useEndTime
        this.userAccessForm.period = target.useTimeLimit
        this.customClass = 'role-dialog small-role-dialog'
      },

      // 切换使用状态
      handleToggleUse(status, id) {
        console.log(status, id)
        let params = {
          id: id,
          useStatus: status
        }
        changeUseStatus(params).then(res => {
          if (res.status === 'true') {
            if (status === 3) {
              this.$message.success('停用成功！')
            } else {
              this.$message.success('启用成功！')
            }
            this.handleGetUserList()
          } else {
            this.$message.error(res.msg)
            this.handleGetUserList()
          }
        })
      },

      // 分页器事件
      handleUserSizeChange(val) {
        this.pageSize = val
        this.handleGetUserList()
      },
      handleUserCurrentChange(val) {
        this.currentPage = val
        this.handleGetUserList()
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../../styles/config";
  .theme-gray {
    color: $theme-gray;
  }
</style>
