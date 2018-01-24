<template>
  <div class="integral-detail">

    <!-- 有面包屑的时候，就隐藏这个标题 -->
    <div class="page-title">
      <h1>基础信息</h1>
    </div>

    <div class="form-box card-padding">
      <el-row class="mb22">
        <el-col :span="8">
          <div class="detail-info">
            <div class="label">创建时间</div>
            <div class="label-con">{{ created }}</div>
          </div>
        </el-col>

        <el-col :span="8">
          <div class="detail-info">
            <div class="label ml30 widthAuto">创建者</div>
            <div class="label-con"><span class="theme-gray">admin</span></div>
          </div>
        </el-col>

        <!--<el-col :span="8">-->
          <!--<div class="detail-info">-->
            <!--<div class="label widthAuto">生效时间</div>-->
            <!--<div class="label-con">-->
              <!--<el-tag type="gray">未生效</el-tag>-->
            <!--</div>-->
          <!--</div>-->
        <!--</el-col>-->
      </el-row>

      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="180px" class="demo-ruleForm">
        <el-form-item label="规则名称" prop="name">
          <el-col :span="9"><el-input v-model.trim="ruleForm.name" placeholder="" :disabled="notAllow"></el-input></el-col>
          <span class="theme-gray">&nbsp;&nbsp;发放时显示在用户端，限制字数20字</span>
        </el-form-item>

        <el-form-item label="规则内容" required>
          <el-col :span="4">
            <el-form-item prop="months">
              <el-select class="select-center" multiple v-model="ruleForm.months" placeholder="月份" @change="handleMonthChange" :disabled="notAllow" @visible-change="handleVisibleChange" @remove-tag="handleRemoveTag">
                <el-option-group
                  v-for="group in monthGroupOption"
                  :key="group.value"
                  :label="group.label"
                  :disabled="group.disabled">
                  <el-option
                    v-for="item in group.monthOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="4">
            <el-form-item prop="date">
              <el-select class="select-center" v-model="ruleForm.date" placeholder="日期" @change="handleDateChange" :disabled="notAllow" @visible-change="handleVisibleChange">
                <el-option
                  v-for="item in dateOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="14">
            <span class="theme-gray fl">发放&nbsp;&nbsp;</span>
            <el-col :span="12">
              <el-form-item prop="integral"><el-input type="number" v-model.number="ruleForm.integral" class="fl" :disabled="notAllow"></el-input></el-form-item>
            </el-col>
            <span class="theme-gray fl">&nbsp;&nbsp;积分</span>
            <span class="theme-gray">&nbsp;&nbsp;（10积分=1元）</span>
          </el-col>
        </el-form-item>

        <el-form-item label="">
          <div class="theme-gray">下次生效日期 {{ nextTakeEffectTime }}</div>
        </el-form-item>

        <el-form-item label="积分有效期" required prop="validDate">
          <el-col :span="2">
            <el-select class="select-center" v-model="ruleForm.validDate" :disabled="notAllow" placeholder="">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          &nbsp;&nbsp;
          <span class="theme-gray">天</span>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-col :span="9">
            <el-input type="textarea" placeholder="积分规则备注限制100个字以内" v-model.trim="ruleForm.remark" :disabled="notAllow"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item class="item-mb0 button-row" v-permissions="'/manage/grantPointRule/update'">
          <el-button type="primary" @click="handleEditRule('ruleForm')" :loading="saveLoading">{{ editTxt }}</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 选择之后再显示出来 -->
    <div class="page-title">
      <h1>适用人员</h1>
    </div>

    <div class="form-box card-padding">
      <el-button
        @click="getRuleStatistics"
        class="theme-btn-blue fr mb22"
        v-permissions="'/manage/grantPointRule/addPublishUser'"
        type="primary">添加人员</el-button>
      <el-table
        :data="selectedUsers"
        :slot="tableEmpty"
        v-loading="tableLoading"
        height="241"
        border
        style="width: 100%"
        ref="multipleTable"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55"
          v-if="handleHasPermissions('/manage/grantPointRule/removePublishUser')"></el-table-column>
        <el-table-column prop="companyName" label="企业名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="name" label="会员姓名"></el-table-column>
        <el-table-column prop="role" label="会员角色">
          <template slot-scope="scope">
            <span v-if="scope.row.role === 1">企业负责人</span>
            <span v-else>员工</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="nodeKey"
          label="操作"
          width="80"
          v-if="handleHasPermissions('/manage/grantPointRule/removePublishUser')">
          <template slot-scope="scope">
            <span class="btn-delete" @click="handleConfirm(scope.row.id)">
              <i class="el-icon-close"></i>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <el-button
        @click="handleConfirm('')"
        class="theme-btn-blue mt30"
        v-if="handleHasPermissions('/manage/grantPointRule/removePublishUser')"
        type="primary">删除</el-button>
    </div>

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
        <el-button type="primary" @click="handleAddPublishUser">保存</el-button>
      </div>

    </el-dialog>

    <!-- 确认删除弹窗 -->
    <el-dialog
      title="确认删除？"
      :visible.sync="deleteVisible"
      :lock-scroll="false"
      width="420px">
      <span>删除后该会员将不会再收到通过此规则发放的积分</span>
      <span slot="footer" class="dialog-footer">
        <el-checkbox v-model="noticeCheck" class="fl stop-notice" v-show="showCheckbox">不再提醒</el-checkbox>
        <el-button @click="cancelRemove">取 消</el-button>
        <el-button type="primary" @click="removeSelectedUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import handleHasPermissions from '@/config/com-mixins'
  import { formatTimeString } from '../../../config/utils'
  import { updatePointRule, getNextTakeEffectTime, pointRuleGetDetail, loadPointRuleStatistics, addPublishUser, removePublishUser } from '../../../service/index'
  export default {
    mixins: [handleHasPermissions],
    data () {
      var validateIntegral = (rule, value, callback) => {
        if (value < 1 || value > 9999) {
          callback(new Error('积分赠送最少1积分，最多9999积分'))
        }
        if (value.toString().indexOf('.') !== -1) {
          callback(new Error('请确认输入正整数'))
        }
        callback()
      }
      return {
        title: '积分规则详情',
        ruleId: '', // 积分规则id
        created: '',
        admin: '',
        isVisibleChange: false,
        nextTakeEffectTime: '', // 下次生效时间
        editTxt: '编辑',
        notAllow: true, // 不允许编辑控件
        saveLoading: false, // 保存按钮的loading状态
        selectedUsers: [], // 积分规则的适用人员列表
        tableLoading: true,
        tableEmpty: ' ',
        removeUsersId: [], // 适用人员表格被选中的列表

        ruleForm: {
          name: '',
          months: [],
          date: '',
          integral: '',
          remark: '',
          validDate: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入规则名称', trigger: 'blur,change' },
            { max: 20, message: '发放时显示在用户端，限制字数20字', trigger: 'blur,change' }
          ],
          date: [
            { required: true, message: '请选择日期', trigger: 'blur,change' }
          ],
          integral: [
            { required: true, message: '请输入正确的积分数额', trigger: 'blur,change', type: 'number' },
            { validator: validateIntegral, trigger: 'blur,change' }
          ],
          validDate: [
            { required: true, message: '请选择积分有效期', trigger: 'change', type: 'number' }
          ],
          remark: [
            { max: 100, message: '积分规则备注限制100个字以内', trigger: 'blur,change' }
          ]
        },

        // 固定每月
        fixMonth: [{
          label: '固定每月',
          value: 1,
          monthOption: [{
            value: 0,
            label: '每月'
          }]
        }],
        // 指定月份
        specifyMonth: [{
          label: '指定月份',
          value: 2,
          monthOption: [{
            value: 1,
            label: '1月'
          }, {
            value: 2,
            label: '2月'
          }, {
            value: 3,
            label: '3月'
          }, {
            value: 4,
            label: '4月'
          }, {
            value: 5,
            label: '5月'
          }, {
            value: 6,
            label: '6月'
          }, {
            value: 7,
            label: '7月'
          }, {
            value: 8,
            label: '8月'
          }, {
            value: 9,
            label: '9月'
          }, {
            value: 10,
            label: '10月'
          }, {
            value: 11,
            label: '11月'
          }, {
            value: 12,
            label: '12月'
          }]
        }],
        // 月份
        monthGroupOption: [{
          label: '固定每月',
          value: 1,
          monthOption: [{
            value: 0,
            label: '每月'
          }]
        }, {
          label: '指定月份',
          value: 2,
          monthOption: [{
            value: 1,
            label: '1月'
          }, {
            value: 2,
            label: '2月'
          }, {
            value: 3,
            label: '3月'
          }, {
            value: 4,
            label: '4月'
          }, {
            value: 5,
            label: '5月'
          }, {
            value: 6,
            label: '6月'
          }, {
            value: 7,
            label: '7月'
          }, {
            value: 8,
            label: '8月'
          }, {
            value: 9,
            label: '9月'
          }, {
            value: 10,
            label: '10月'
          }, {
            value: 11,
            label: '11月'
          }, {
            value: 12,
            label: '12月'
          }]
        }],
        // 每日
        dateOption: [{
          value: '1',
          label: '1号'
        }, {
          value: '5',
          label: '5号'
        }, {
          value: '10',
          label: '10号'
        }, {
          value: '15',
          label: '15号'
        }, {
          value: '20',
          label: '20号'
        }, {
          value: '25',
          label: '25号'
        }, {
          value: 'L',
          label: '最后一天'
        }],
        // 积分期限
        options: [{
          value: 3,
          label: '3'
        }, {
          value: 5,
          label: '5'
        }, {
          value: 10,
          label: '10'
        }, {
          value: 15,
          label: '15'
        }, {
          value: 30,
          label: '30'
        }, {
          value: 60,
          label: '60'
        }, {
          value: 90,
          label: '90'
        }],

        // 会员选择相关
        loadingTree: true,
        dialogVisible: false, // 弹窗是否可见
        allow: false,
        selectedMembers: [], // 选中的会员数组
        filterText: '', // 过滤文本
        roleTreeData: [], // 会员树状数组
        treeProps: {
          label: 'name',
          children: 'children',
          disabled: 'disabled'
        },
        userIds: [], // 选中的会员id数组

        // 确认删除弹窗
        noticeCheck: false, // 不再提醒
        deleteVisible: false, // 弹窗是否可见
        showCheckbox: true, // 是否显示“不再提醒”复选框
        currDeleteId: '' // 当前确认删除的会员id
      }
    },
    mounted: function () {
      this.ruleId = this.$route.query.id

      // 点击编辑进入时，表单为可编辑状态；点击规则名称进入时，表单为禁用状态
      this.notAllow = !(this.$route.query.edit)
      this.editTxt = (this.notAllow) ? '编辑' : '保存'

      if (this.notAllow && this.ruleId) {
        document.title = this.title = '积分规则详情'
      } else if (this.ruleId) {
        document.title = this.title = '编辑积分规则'
      } else {
        document.title = this.title = '新增积分规则'
      }
      this.$store.commit('NAV_CRUMB', this.title)

      // 查询积分规则详情
      this.findRuleDetail()
    },
    watch: {
      // 监听选择会员弹窗的文本过滤
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    methods: {
      // 查询积分规则详情
      findRuleDetail() {
        const detailParams = {
          ruleId: this.ruleId
        }
        pointRuleGetDetail(detailParams).then(res => {
          if (res.status === 'true') {
            this.created = res.info.created
            this.admin = res.info.createdAdminUser
            this.nextTakeEffectTime = res.info.nextTakeEffectTime.split(' ')[0]
            this.ruleForm.name = res.info.ruleName
            this.ruleForm.integral = res.info.point
            this.ruleForm.months = res.info.months
            this.ruleForm.date = res.info.day
            this.ruleForm.validDate = res.info.effectiveDays
            this.ruleForm.remark = res.info.remark
            this.selectedUsers = res.info.users

            this.tableLoading = false
            if (this.selectedUsers.length === 0) {
              this.tableEmpty = '暂时无数据'
            }
            if (this.ruleForm.months.includes(0)) {
              this.monthGroupOption = this.fixMonth
            } else {
              this.monthGroupOption = this.specifyMonth
            }
          }
        })
      },
      handleRemoveTag(val) {
        if (this.isVisibleChange) return false
        this.handleGetNextEffectTime()
      },
      handleVisibleChange(isVisible) {
        this.isVisibleChange = isVisible
      },
      // 月份发生改变时执行
      handleMonthChange(value) {
        if (!this.isVisibleChange) return false
        if (value.includes(0) || this.ruleForm.months.includes(0)) {
          this.monthGroupOption = this.fixMonth
        } else if (!this.ruleForm.months.length) {
          this.monthGroupOption = this.fixMonth.concat(this.specifyMonth)
        } else {
          this.monthGroupOption = this.specifyMonth
        }
        this.handleGetNextEffectTime()
      },
      // 日期发生改变时执行
      handleDateChange() {
        if (!this.isVisibleChange) return false
        this.handleGetNextEffectTime()
      },
      // 获取下次生效时间
      handleGetNextEffectTime() {
        if (this.ruleForm.date) {
          const nextParams = {
            grantRule: (this.ruleForm.months.length === 0 || this.ruleForm.months.length >= 12 || this.ruleForm.months.includes(0)) ? 1 : 2,
            months: this.ruleForm.months,
            day: this.ruleForm.date
          }
          getNextTakeEffectTime(nextParams).then(res => {
            if (res.status === 'true') {
              this.nextTakeEffectTime = formatTimeString(res.info)
            } else {
              console.log(res.msg)
            }
          })
        }
      },
      // 编辑积分规则
      handleEditRule(formName) {
        if (this.notAllow) {
          this.notAllow = false
          this.editTxt = '保存'
          document.title = this.title = '编辑积分规则'
          this.$store.commit('NAV_CRUMB', this.title)
        } else {
          const self = this
          self.saveLoading = true
          self.editTxt = '执行中…'
          const updateParams = {
            ruleId: self.ruleId,
            ruleName: this.ruleForm.name,
            remark: this.ruleForm.remark,
            point: this.ruleForm.integral,
            effectiveDays: this.ruleForm.validDate,
            months: this.ruleForm.months,
            day: this.ruleForm.date,
            grantRule: (this.ruleForm.months.length === 0 || this.ruleForm.months.length >= 12 || this.ruleForm.months.includes(0)) ? 1 : 2
          }
          this.$refs[formName].validate((valid) => {
            if (valid) {
              updatePointRule(updateParams).then(res => {
                if (res.status === 'true') {
                  self.saveLoading = false
                  self.editTxt = '编辑'
                  self.notAllow = true
                  document.title = this.title = '积分规则详情'
                  this.$store.commit('NAV_CRUMB', this.title)
                  self.$message({
                    type: 'success',
                    message: '修改成功！'
                  })
                } else {
                  self.saveLoading = false
                  self.editTxt = '保存'
                  self.$message({
                    type: 'error',
                    message: res.msg
                  })
                }
              })
            } else {
              self.saveLoading = false
              self.editTxt = '保存'
              return false;
            }
          })
        }
      },
      // 适用人员表格选择change时，存储待删除会员的id
      handleSelectionChange(val) {
        if (val.length === 0) {
          this.removeUsersId = []
        } else {
          for (let i = 0; i < val.length; i++) {
            this.removeUsersId[i] = val[i].id
          }
        }
      },

      // 打开删除会员确认弹窗
      handleConfirm(usersId) {
        this.currDeleteId = usersId
        this.showCheckbox = !!(usersId)
        if (usersId && this.noticeCheck) {
          const dataJson = {
            ruleId: this.ruleId,
            userIds: this.currDeleteId
          }
          removePublishUser(dataJson).then(res => {
            if (res.status === 'true') {
              this.deleteVisible = false
              this.findRuleDetail()
              this.$message.success('移除成功！')
            } else {
              this.$message({
                type: 'error',
                message: res.msg
              })
            }
          })
          return
        }
        if (!usersId && this.removeUsersId.length === 0) {
          this.$message.info('未选择任何会员')
          return
        }
        this.deleteVisible = true
      },
      // 取消移除
      cancelRemove() {
        this.deleteVisible = false
      },
      // 移除积分发放用户
      removeSelectedUser() {
        var removeParams = {
          ruleId: this.ruleId,
          userIds: this.currDeleteId || this.removeUsersId
        }
        if (this.removeUsersId.length || this.currDeleteId) {
          removePublishUser(removeParams).then(res => {
            if (res.status === 'true') {
              this.deleteVisible = false
              this.findRuleDetail()
              this.$message.success('移除成功！')
            } else {
              this.$message({
                type: 'error',
                message: res.msg
              })
            }
          })
        } else {
          this.$message.info('未选择任何会员')
        }
      },
      // 积分规则与用户的树状统计
      getRuleStatistics() {
        this.dialogVisible = true
        this.roleTreeData = []
        loadPointRuleStatistics({
          pointRuleId: this.ruleId
        }).then(res => {
          if (res.status === 'true') {
            // const roleArr = []
            // roleArr.push(res.info)
            // var index = 0
            // const traverse = function (node) {
            //   const childNodes = node.children ? node.children : node
            //   if (childNodes.length) {
            //     childNodes.forEach((child) => {
            //       child.nodeKey = index++
            //       traverse(child)
            //     })
            //   }
            // }
            // traverse(roleArr)
            this.roleTreeData.push(res.info)
            this.loadingTree = false
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      handleCloseTree(done) {
        // if (this.defaultChecked.length) {
        //   this.defaultChecked = []
        // }
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
        if (!value) return true;
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
        this.selectedMembers = this.getCheckedNodes()
        this.userIds = []
        for (let i = 0; i < this.selectedMembers.length; i++) {
          this.userIds.push(this.selectedMembers[i].userId)
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
      // 添加适用会员
      handleAddPublishUser() {
        const self = this
        if (self.selectedMembers.length > 0) {
          const paramsObj = {
            ruleId: self.ruleId,
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
              self.findRuleDetail()
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

<style lang="scss">
  .integral-detail {
    .el-select .el-tag {
      width: 52px;
      text-align: center;
    }

    .el-select .el-tag__close.el-icon-close {
      right: 0;
    }

    .stop-notice {
      margin-top: 8px;
    }
  }
</style>
<style lang="scss" scoped>
  @import "../../../styles/config";
  .integral-detail {
    .select-center {
      width: 100%;
    }
    .button-row {
      margin-top: 20px;
      margin-left: -100px;
      margin-bottom: 0;
      text-align: center;

      button {
        width: 120px;
      }

      p {
        margin-top: 10px;
      }
    }
    .btn-delete {
      display: inline-block;
      font-size: 16px;
      cursor: pointer;
      vertical-align: text-bottom;
      line-height: 1;
    }
  }
</style>
