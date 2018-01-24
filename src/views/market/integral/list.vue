<template>
  <div class="integral">

    <!-- 有面包屑的时候，就隐藏这个标题 -->
    <div class="page-title">
      <h1>积分规则管理</h1>
    </div>

    <div class="store-setting card-padding">
      <!-- 查询表单 -->
      <el-form :inline="true" :model="ruleSort" class="sort-form-bar">
        <router-link v-permissions="'/manage/userPoint/adminRecharge'" class="fl" :to="'/market/integral/recharge'">
          <el-button class="theme-btn-blue add-new" type="primary">积分充值</el-button>
        </router-link>

        <el-form-item class="" label="">
          <el-input
            class="width220"
            v-model.trim="ruleSort.name"
            placeholder="请输入规则名称"
            @keyup.native.enter="findRuleList">

            <i slot="suffix" @click="findRuleList" class="el-input__icon el-icon-search"></i>
          </el-input>

        </el-form-item>

        <router-link v-permissions="'/manage/grantPointRule/add'" class="" :to="'/market/integral/add'">
          <el-button class="theme-btn-blue add-new" type="primary" icon="el-icon-circle-plus">新建规则</el-button>
        </router-link>
      </el-form>

      <el-table
        :data="ruleTable"
        :empty-text="tableEmpty"
        :slot="tableEmpty"
        v-loading="tableLoading"
        border
        style="width: 100%">
        <el-table-column
          label="规则名称"
          align="left"
          prop="ruleName">
          <template slot-scope="scope">
            <router-link class="table-link" :to="'/market/integral/detail?id=' + scope.row.id">
              {{ scope.row.ruleName }}
            </router-link>
          </template>
        </el-table-column>

        <el-table-column label="适用对象(人)" prop="applicativePeople"></el-table-column>
        <el-table-column label="创建人" prop="username">
          <template slot-scope="scope">
            <span>admin</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="created"></el-table-column>
        <el-table-column label="下次生效时间" prop="nextTakeEffectTime"></el-table-column>

        <el-table-column label="适用范围" v-if="handleHasPermissions('/manage/grantPointRule/addPublishUser')">
          <template slot-scope="scope">
            <div @click="getRuleStatistics(scope.row.id)" class="scope-application">
              <div class="table-link">添加会员</div>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          width="170"
          v-if="handleHasPermissions(['/manage/grantPointRule/update', '/manage/grantPointRule/delete', '/manage/grantPointRule/updateStatus'])">
          <template slot-scope="scope">
            <router-link
              v-permissions="'/manage/grantPointRule/update'"
              :to="'/market/integral/detail?edit=1&id=' + scope.row.id"
              class="table-link">编辑</router-link>
            <span
              v-permissions="'/manage/grantPointRule/delete'"
              class="operate-del theme-gray"
              @click="handleDelete(scope.row.id)">删除</span>
            <el-tooltip
              v-permissions="'/manage/grantPointRule/updateStatus'"
              :content="scope.row.status === 1 ? '积分规则已生效' : '积分规则未生效'"
              placement="top">
              <el-switch v-model="scope.row.status" active-text="" inactive-text="" active-color="#13ce66" :active-value="1" :inactive-value="0" @change="handleToggleStatus(scope.row.status, scope.row.id)"></el-switch>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加人员弹窗 -->
      <el-dialog
        title="适用范围"
        :visible.sync="dialogVisible"
        :close-on-click-modal="allow"
        :lock-scroll="allow"
        :close-on-press-escape="allow"
        :before-close="handleCloseTree"
        custom-class="role-dialog"
        class="role-tree">

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
              :default-checked-keys="defaultChecked"
              :filter-node-method="filterNode"
              @check-change="handleCheckChange">
            </el-tree>
          </el-col>
          <el-col :span="14">
            <el-table :data="selectedMembers" height="360px" style="width: 100%" border>
              <el-table-column prop="companyName" label="企业名称"></el-table-column>
              <el-table-column prop="name" label="会员姓名"></el-table-column>
              <el-table-column prop="role" label="会员角色">
                <template slot-scope="scope">
                  <span v-if="scope.row.role === 1">企业负责人</span>
                  <span v-else>员工</span>
                </template>
              </el-table-column>
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

        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleAddPublishUser">保存</el-button>
        </div>

      </el-dialog>

      <!-- 分页 -->
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
</template>

<script>
  import handleHasPermissions from '@/config/com-mixins'
  import { pointRuleList, updateStatus, deletePointRule, loadPointRuleStatistics, addPublishUser } from '../../../service/index'
  export default {
    mixins: [handleHasPermissions],
    data () {
      return {
        title: '积分规则管理',
        pointRuleId: 0, // 积分规则id
        userIds: [], // 选中的会员id数组

        // 规则查询筛选
        ruleSort: {
          name: ''
        },
        // 规则列表
        ruleTable: [],
        tableLoading: true,
        tableEmpty: ' ',

        // 会员选择相关
        loadingTree: true,
        firstKey: '',
        // isExpandedTree: true, // 默认全展开树
        dialogVisible: false, // 弹窗是否可见
        allow: false,
        defaultChecked: [], // 默认选中的会员
        selectedMembers: [], // 选中的会员数组
        filterText: '', // 过滤文本
        roleTreeData: [], // 会员树状数组
        treeProps: {
          label: 'name',
          children: 'children'
          // disabled: 'disabled'
        },

        // 分页器配置
        currentPage: 1,
        pageSize: 10,
        pageTotal: 0
      }
    },
    mounted() {
      // 查询规则列表
      this.findRuleList()
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    methods: {
      // 查询规则列表
      findRuleList() {
        const self = this
        const ruleParams = {
          pageNum: self.currentPage,
          pageSize: self.pageSize,
          name: self.ruleSort.name
        }
        pointRuleList(ruleParams).then(res => {
          if (res.status === 'true') {
            self.pageTotal = res.info.page.total
            self.ruleTable = res.info.page.result

            self.tableLoading = false
            if (self.ruleTable.length === 0) {
              self.tableEmpty = '暂时无数据'
            }

            for (let i = 0; i < self.ruleTable.length; i++) {
              self.ruleTable[i].created = res.info.page.result[i].created.split(' ')[0]
              self.ruleTable[i].nextTakeEffectTime = res.info.page.result[i].nextTakeEffectTime.split(' ')[0]
            }
          } else {
            self.$message.error(res.msg)
          }
        })
      },

      // 分页器事件
      handleSizeChange(val) {
        this.pageSize = val
        this.findRuleList()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.findRuleList()
      },

      // 修改积分规则的状态
      handleToggleStatus(currStatus, id) {
        const self = this
        const target = self.ruleTable.find((target) => { // 目标积分规则
          return target.id === id
        })
        const paramsObj = {
          ruleId: id,
          status: currStatus
        }
        updateStatus(paramsObj).then(res => {
          if (res.status === 'true') {
            self.$message.success('修改成功！')
          } else {
            self.$message.error(res.msg)
            setTimeout(function () {
              target.status = currStatus === 0 ? 1 : 0
            }, 600)
          }
        })
        // console.log(currStatus, id)
      },

      // 删除积分规则
      handleDelete(id) {
        const deleteParams = {
          ruleId: id
        }
        deletePointRule(deleteParams).then(res => {
          if (res.status === 'true') {
            this.$message.success('删除成功！')
            this.findRuleList()
          } else {
            this.$message.error(res.msg)
          }
        })
      },

      // 积分规则与用户的树状统计 TODO 树形控件遗留问题
      getRuleStatistics(id) {
        this.pointRuleId = id
        this.dialogVisible = true
        this.roleTreeData = []
        const self = this
        loadPointRuleStatistics({
          pointRuleId: id
        }).then(res => {
          if (res.status === 'true') {
            const roleArr = []
            roleArr.push(res.info)
            const traverse = function (node) {
              const childNodes = node.children ? node.children : node
              if (childNodes.length) {
                childNodes.forEach((child) => {
                  if (child.userId && child.disabled) {
                    self.defaultChecked.push(child.nodeKey)
                  }
                  traverse(child)
                })
              }
            }
            traverse(roleArr)
            // console.log(self.defaultChecked)
            this.roleTreeData.push(res.info)
            this.firstKey = res.info.children[0].nodeKey
            this.loadingTree = false
            // this.isExpandedTree = false
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      handleCloseTree(done) {
        if (this.defaultChecked.length) {
          this.defaultChecked = []
        }
        if (this.selectedMembers.length) {
          const self = this
          self.$confirm('未保存添加，是否确认关闭？', {
            lockScroll: false
          })
              .then(_ => {
                self.selectedMembers = []
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
          if (checkedNodes[i].userId && !checkedNodes[i].disabled) {
            staffNodes.push(checkedNodes[i])
          }
        }
        // console.log(staffNodes, 'staffNodes')
        return staffNodes
      },
      // 复选框change时更新会员节点
      handleCheckChange(data, checked, indeterminate) {
        // console.log(data, checked, indeterminate)
        this.selectedMembers = this.getCheckedNodes()
        // console.log(this.selectedMembers, 'handleCheckChange')
        this.userIds = []
        for (let i = 0; i < this.selectedMembers.length; i++) {
          this.userIds.push(this.selectedMembers[i].userId)
        }
      },
      removeSelected(nodeKey) {
        // 如果没有传nodeKey，则移除所有选中的会员；否则移除当前nodeKey的会员
        if (!nodeKey) {
          this.$refs.tree.setCheckedKeys([])
          // this.handleCheckChange()
        } else {
          this.$refs.tree.setChecked(nodeKey, false, true)
          // this.handleCheckChange()
          // console.log(this.selectedMembers, 'removeSelected')
        }
      },
      // 添加适用会员
      handleAddPublishUser() {
        const self = this
        if (self.selectedMembers.length > 0) {
          const paramsObj = {
            ruleId: self.pointRuleId,
            userIds: self.userIds
          }
          addPublishUser(paramsObj).then(res => {
            if (res.status === 'true') {
              self.dialogVisible = false
              self.$message({
                type: 'success',
                message: '添加成功'
              })

              // 保存成功后清空选中的会员列表、重新请求积分规则发放情况
              self.selectedMembers = []
              self.findRuleList()
            } else {
              self.$message({
                type: 'error',
                message: res.msg
              })
            }
          })
        } else {
          self.$message({
            type: 'info',
            message: '未选择任何会员'
          })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../styles/config";
  .integral {
    .sort-form-bar {
      text-align: right;
    }
    .page-search {
      margin-left: 25px;
    }
    .el-select .el-input {
      width: 110px;
    }
    .selectWidth {
      width: 100%;
    }
    .dialog-footer {
      text-align: center;
    }

    // 删除操作
    .operate-del {
      cursor: pointer;
      margin: 0 6px;
    }
  }
</style>
