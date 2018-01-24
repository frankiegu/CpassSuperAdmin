<template>
  <div class="credit-set">

    <!-- 有面包屑的时候，就隐藏这个标题 -->
    <div class="page-title">
      <h1>信用值登记</h1>
    </div>

    <div class="card-padding">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="180px">
        <el-form-item label="登记对象"  prop="userIds">
          <el-button @click="getRuleStatistics" class="theme-btn-blue" type="primary">添加人员</el-button>
          &nbsp;&nbsp;
          <span class="theme-gray">已选{{ selectedMembers.length }}人</span>
        </el-form-item>

        <!-- 会员选中列表 -->
        <el-form-item>
          <el-table border :data="selectedMembers" height="241" style="width: 80%" class="member-table">
            <el-table-column prop="companyName" label="企业名称"></el-table-column>
            <el-table-column prop="name" label="会员姓名"></el-table-column>
            <el-table-column prop="role" label="会员角色">
              <template slot-scope="scope">
                <span v-if="scope.row.role === 1">企业负责人</span>
                <span v-else>员工</span>
              </template>
            </el-table-column>
            <el-table-column prop="nodeKey" label="操作" width="80">
              <template slot-scope="scope">
                <span class="btn-delete" @click="removeSelected(scope.row.nodeKey)">
                  <i class="el-icon-close"></i>
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

        <el-form-item label="登记事项" prop="registerMatter">
          <el-col :span="9">
            <el-select
              v-model="ruleForm.registerMatter"
              multiple
              placeholder="请选择"
              value-key="id"
              @change="handleChangeRegister"
              style="width: 100%">
              <el-option
                v-for="item in registerMatter"
                :key="item.id"
                :label="item.pointItem"
                :value="item">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>

        <!-- 登记事项选中列表 -->
        <el-form-item>
          <el-table border :data="selectedMatter" height="241" style="width: 80%" class="matter-table">
            <el-table-column prop="pointItem" label="已选事项"></el-table-column>
            <el-table-column prop="pointRemark" label="事项描述"></el-table-column>
            <el-table-column prop="creditPoint" label="分值">
              <template slot-scope="scope">
                <span v-if="scope.row.operate === 0" class="theme-red">-{{ scope.row.creditPoint }}</span>
                <span v-if="scope.row.operate === 1" class="theme-blue">+{{ scope.row.creditPoint }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

        <el-form-item label="登记备注" prop="remark">
          <el-col :span="9">
            <el-input type="textarea" placeholder="请填写登记备注，100个字以内" v-model="ruleForm.remark"></el-input>
          </el-col>
          &nbsp;&nbsp;
        </el-form-item>

        <el-form-item class="item-mb0">
          <el-button type="primary" @click="submitForm('ruleForm')">登记</el-button>
        </el-form-item>

        <el-form-item>
          <el-col :span="10">
            <span class="theme-gray">登记事项后不可恢复，请谨慎操作</span>
          </el-col>
        </el-form-item>
      </el-form>
    </div>

    <!-- 添加人员弹窗 -->
    <el-dialog
      title="适用范围"
      :visible.sync="dialogVisible"
      :close-on-click-modal="allow"
      :lock-scroll="allow"
      :close-on-press-escape="allow"
      custom-class="role-dialog"
      class="role-tree">

      <el-row :gutter="10" class="filter-bar">
        <el-col :span="10">
          <el-input
            placeholder="输入姓名/企业名字"
            v-model="filterText">
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
            :default-checked-keys="defaultSelectMember"
            :filter-node-method="filterNode"
            @check-change="handleCheckChange">
          </el-tree>
        </el-col>
        <el-col :span="14">
          <el-table border :data="selectedMembers" height="360px" style="width: 100%">
            <el-table-column prop="companyName" label="企业名称"></el-table-column>
            <el-table-column prop="name" label="会员姓名"></el-table-column>
            <el-table-column prop="role" label="会员角色">
              <template slot-scope="scope">
                <span v-if="scope.row.role === 1">企业负责人</span>
                <span v-else>员工</span>
              </template>
            </el-table-column>
            <el-table-column prop="nodeKey" label="操作" width="80">
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
        <el-button type="primary" @click="handleCloseDialog">保存</el-button>
      </div>

    </el-dialog>
  </div>
</template>

<script>
  import { creditRegister, loadPointRuleStatistics, judgeList } from '../../../service/index'
  export default {
    data () {
      return {
        title: '信用值登记',

        // 会员选择相关
        loadingTree: true,
        dialogVisible: false, // 弹窗是否可见
        allow: false,
        selectedMembers: [], // 选中的会员数组
        defaultSelectMember: [], // 默认选中的会员
        filterText: '', // 过滤文本
        roleTreeData: [], // 会员树状数组
        treeProps: {
          label: 'name',
          children: 'children'
          // disabled: 'disabled'
        },

        ruleForm: {
          userIds: [], // 选中的会员id数组
          registerMatter: [],
          remark: ''
        },
        rules: {
          remark: [
            { max: 100, message: '登记备注限制100个字符以内', trigger: 'blur,change' }
          ],
          userIds: [
            { type: 'array', required: true, message: '请选择登记对象', trigger: 'blur,change' }
          ],
          registerMatter: [
            { type: 'array', required: true, message: '请选择登记事项', trigger: 'blur,change' }
          ]
        },

        // 登记事项
        registerMatter: [], // 所有的事项
        selectedMatter: [], // 选中的事项,
        selectedMatterIds: [] // 选中的事项id 组
      }
    },
    mounted: function () {
      // 获取信用规则判定列表
      this.getJudgeList()
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    methods: {
      // 获取信用规则判定列表
      getJudgeList() {
        judgeList().then(res => {
          if (res.status === 'true') {
            this.registerMatter = res.info
          }
        })
      },
      // 选择登记事项
      handleChangeRegister(val) {
        const self = this
        self.selectedMatterIds = []
        for (let i = 0; i < val.length; i++) {
          self.selectedMatterIds.push(val[i].id)
        }
        this.selectedMatter = val
      },

      // 积分规则与用户的树状统计
      getRuleStatistics() {
        this.dialogVisible = true
        if (!this.roleTreeData.length) {
          loadPointRuleStatistics({
            pointRuleId: null
          }).then(res => {
            if (res.status === 'true') {
              this.roleTreeData.push(res.info)
              this.loadingTree = false
            } else {
              this.$message.error(res.msg)
            }
          })
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
        const leafOnly = true
        const checkedNodes = this.$refs.tree.getCheckedNodes(leafOnly)
        const staffNodes = []
        for (let i = 0; i < checkedNodes.length; i++) {
          if (checkedNodes[i].userId && !checkedNodes[i].disabled) {
            staffNodes.push(checkedNodes[i])
          }
        }
        return staffNodes
      },
      // 复选框change时更新会员节点
      handleCheckChange(data, checked, indeterminate) {
        console.log(data, checked, indeterminate)
        this.selectedMembers = this.getCheckedNodes()
        this.ruleForm.userIds = []
        for (let i = 0; i < this.selectedMembers.length; i++) {
          this.ruleForm.userIds.push(this.selectedMembers[i].userId)
        }
      },
      // 移除选中的会员
      removeSelected(nodeKey) {
        // 如果没有传nodeKey，则移除所有选中的会员；否则移除当前nodeKey的会员
        if (!nodeKey) {
          this.$refs.tree.setCheckedKeys([])
        } else {
          this.$refs.tree.setChecked(nodeKey, false, true)
        }
      },
      handleCloseDialog() {
        this.dialogVisible = false
      },

      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const registerParams = {
              userIds: this.ruleForm.userIds,
              detailIds: this.selectedMatterIds,
              remark: this.ruleForm.remark
            }
            creditRegister(registerParams).then(res => {
              if (res.status === 'true') {
                this.$message.success('登记成功！')
                const self = this
                setTimeout(function () {
                  self.selectedMembers = []
                  self.$refs.tree.setCheckedKeys([])
                  self.$refs[formName].resetFields()
                  self.selectedMatterIds = []
                  self.$router.replace('/member/list')
                }, 800)
              } else {
                this.$message.error(res.msg)
              }
            })
          } else {
            console.log('error submit!!')
            return false
          }
        });
      }
    }
  }
</script>

<style lang="scss">
  .credit-set {
    .el-table--hidden {
      visibility: visible;
      .el-table__header, .el-table__body {
        width: 100%!important;
      }
    }
    .el-form-item__label {
      line-height: 36px;
    }
    .el-form-item__content {
      line-height: 34px;
    }
    .member-table, .matter-table {
      line-height: initial;
    }
  }
</style>
<style lang="scss" scoped>
  .btn-delete {
    display: inline-block;
    font-size: 18px;
    cursor: pointer;
    vertical-align: text-bottom;
    line-height: 1;
  }
</style>
