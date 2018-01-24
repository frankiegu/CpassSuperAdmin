<template>
  <div class="credit-list">

    <!-- 有面包屑的时候，就隐藏这个标题 -->
    <div class="page-title">
      <h1>信用值设置</h1>
    </div>

    <div class="card-padding">
      <div class="operate-bar">
        <el-button type="primary" @click="openDialogSet('creditRewardForm', '信用奖励设置')">信用奖励设置</el-button>
        <el-button type="primary" @click="handleExplainDialog">信用体系说明</el-button>
        <el-button
          v-permissions="'/manage/creditRule/addDetail'"
          type="primary"
          @click="openDialogSet('accessRuleForm', '评定规则')"
          icon="el-icon-circle-plus">添加评分规则</el-button>
      </div>

      <!-- list表格 -->
      <el-table
        :empty-text="tableEmpty"
        :slot="tableEmpty"
        v-loading="tableLoading"
        :data="creditRuleTable"
        border style="width: 100%">
        <el-table-column prop="pointItem" label="评分项"></el-table-column>

        <el-table-column prop="pointRemark" align="left" label="评分说明"></el-table-column>

        <el-table-column prop="creditPoint" label="分值">
          <template slot-scope="scope">
            {{ scope.row.operate === 1 ? '+' + scope.row.creditPoint : '-' + scope.row.creditPoint }}
          </template>
        </el-table-column>

        <el-table-column prop="judgeType" label="判定方式">
          <template slot-scope="scope">
            {{ scope.row.judgeType === 1 ? '系统判定' : '人工判定' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="操作"
          v-if="handleHasPermissions(['/manage/creditRule/deleteDetail', '/manage/creditRule/updateDetail'])">
          <template slot-scope="scope">
            <span
              v-permissions="'/manage/creditRule/updateDetail'"
              :class="['table-link', {'align-link' : scope.row.judgeType === 1 || !handleHasPermissions('/manage/creditRule/deleteDetail')}]"
              @click="openDialogSet('accessRuleForm', '评定规则', scope.row.id)">编辑</span>

            <!-- 系统判定的规则隐藏删除操作 -->
            <span
              v-permissions="'/manage/creditRule/deleteDetail'"
              class="table-link theme-gray"
              v-if="scope.row.judgeType !== 1"
              @click="handleDeleteCreditRule(scope.row.id)">删除</span>

            <el-tooltip :content="scope.row.status === 1 ? '点击禁用此规则' : '点击启用此规则'" placement="top">
              <el-switch
                v-permissions="['/manage/creditRule/closeDetail', '/manage/creditRule/openDetail']"
                v-model="scope.row.status"
                :active-value="1"
                :inactive-value="2"
                :active-color="switchActiveColor"
                active-text=""
                inactive-text=""
                @change="handleUpdateStatus(scope.row.id, scope.row.status)"></el-switch>
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

    <!-- 侧弹窗 -->
    <transition name="slide-fade">
      <set-table-dialog v-show="setDialogVisible" :dialogType="showDialogType" :dialogTitle="dialogTitle" :dialogId="dialogId" :accessRuleForm="accessRuleForm"></set-table-dialog>
    </transition>

    <!-- 信用体系说明对话框 -->
    <transition name="fade">
      <el-dialog
        title="信用规则说明"
        :lock-scroll="false"
        :visible.sync="explainDialogVisible"
        :before-close="cancelExplainDialog"
        width="500px">
        <el-form :model="explainForm" :rules="explainRule" label-width="80px" ref="explainForm">
          <el-form-item label="规则说明" prop="description">
            <el-input
              v-permissions="'/manage/creditRule/updateRemark'"
              type="textarea"
              placeholder="请输入信用分的简介、规则说明等信息（100个字以内）"
              v-model.trim="explainForm.description"
              :maxlength="100"
              :autosize="{minRows: 5, maxRows: 6}" @change="explainChange = true"></el-input>
            <p v-if="!handleHasPermissions('/manage/creditRule/updateRemark')">{{explainForm.description}}</p>
            <span class="fr" v-permissions="'/manage/creditRule/updateRemark'">{{explainForm.description.length}}/100</span>
          </el-form-item>

          <el-form-item label-width="0" class="explain-btn-bar" v-permissions="'/manage/creditRule/updateRemark'">
            <el-button class="btn-save" type="primary" @click="handleSaveExplain('explainForm')">保存</el-button>
            <el-button @click="cancelExplainDialog('')" class="btn-clear">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </transition>
  </div>
</template>

<script>
  import handleHasPermissions from '@/config/com-mixins'
  import { creditRuleList, closeCreditRule, openCreditRule, deleteCreditRule, getCreditRuleRemark, updateCreditRuleRemark } from '@/service/index'
  import setTableDialog from './components/set-table-dialog.vue'
  export default {
    name: 'credit-list',
    mixins: [handleHasPermissions],
    data () {
      return {
        title: '信用值设置',

        // 信用体系说明对话框
        explainChange: false, // 信用体系说明是否改变
        explainDialogVisible: false,
        explainForm: {
          description: ''
        },
        explainRule: {
          description: [
            { required: true, message: '信用规则说明不能为空', trigger: 'blur' }
          ]
        },

        // 设置对话框
        setDialogVisible: false,
        showDialogType: '',
        dialogTitle: '',
        dialogId: null,
        accessRuleForm: {
          accessWay: '人工判定',
          ruleName: '',
          ruleDesc: '',
          creditPoint: '',
          symbol: 1
        },

        creditRuleTable: [],
        tableLoading: true,
        tableEmpty: ' ',

        // 分页器配置
        currentPage: 1,
        pageSize: 10,
        pageTotal: 0
      }
    },
    props: {},
    components: {
      setTableDialog
    },
    mounted () {
      // 查询信用规则列表
      this.findCreditRuleList()
    },
    watch: {},
    computed: {},
    filters: {},
    methods: {
      // 打开信用体系说明
      handleExplainDialog() {
        this.explainDialogVisible = true
        getCreditRuleRemark().then(res => {
          if (res.status === 'true') {
            this.explainForm.description = res.info ? res.info : this.explainForm.description
            if (res.info !== this.explainForm.description) {
              this.explainChange = true
            }
          }
        })
      },
      // 保存信用体系说明
      handleSaveExplain(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && this.explainChange) {
            let remarkParams = {
              remark: this.explainForm.description
            }
            updateCreditRuleRemark(remarkParams).then(res => {
              if (res.status === 'true') {
                this.$message.success('保存成功！')
                this.explainDialogVisible = false
                this.explainChange = false
              } else {
                this.explainChange = false
                this.$message.error(res.msg)
              }
            })
          } else {
            if (!this.explainChange) {
              // this.$message.info('未做修改')
              this.explainDialogVisible = false
            }
            return false;
          }
        })
      },
      // 关闭信用体系说明
      cancelExplainDialog(done) {
        if (this.explainChange) {
          this.$confirm('当前信息未保存，是否确认关闭？', {
            lockScroll: false
          }).then(_ => {
            this.$refs['explainForm'].clearValidate()
            this.explainDialogVisible = false
            this.explainChange = false
            done()
          }).catch(_ => {})
        } else {
          this.explainDialogVisible = false
        }
      },

      // 关闭设置对话框（侧弹窗）
      cancelDialogSet () {
        this.setDialogVisible = false
      },
      // 打开设置对话框（侧弹窗）
      openDialogSet (type, title, id) {
        this.setDialogVisible = true
        this.showDialogType = type
        this.dialogTitle = title
        this.dialogId = id
        // 点击编辑时传入对应id记录的数据；添加规则时评定规则初始为空
        if (id) {
          const targetRule = this.creditRuleTable.find((target) => { // 目标信用规则
            return target.id === id
          })
          this.accessRuleForm.ruleName = targetRule.pointItem
          this.accessRuleForm.ruleDesc = targetRule.pointRemark
          this.accessRuleForm.creditPoint = targetRule.creditPoint
          this.accessRuleForm.symbol = targetRule.operate
          this.accessRuleForm.accessWay = targetRule.judgeType === 1 ? '系统判定' : '人工判定'
        } else {
          this.accessRuleForm.ruleName = ''
          this.accessRuleForm.ruleDesc = ''
          this.accessRuleForm.creditPoint = ''
          this.accessRuleForm.symbol = 1
          this.accessRuleForm.accessWay = '人工判定'
        }
      },

      // 查询信用判定规则列表
      findCreditRuleList() {
        const self = this
        const paramsObj = {
          pageNum: self.currentPage,
          pageSize: self.pageSize
        }
        creditRuleList(paramsObj).then(res => {
          if (res.status === 'true') {
            self.pageTotal = res.info.total
            self.creditRuleTable = res.info.result

            self.tableLoading = false
            if (self.creditRuleTable.length === 0) {
              self.tableEmpty = '暂时无数据'
            }
          } else {
            self.$message.error(res.msg)
          }
        })
      },
      // 编辑信用判定规则
      handleEditCreditRule(id) {
        console.log('handleEditCreditRule', id)
      },
      // 删除信用规则
      handleDeleteCreditRule(id) {
        console.log('handleDeleteCreditRule', id)
        const self = this
        const deleteParams = {
          detailId: id
        }
        self.$confirm('确认删除此规则？', {
          lockScroll: false
        }).then(_ => {
          deleteCreditRule(deleteParams).then(res => {
            if (res.status === 'true') {
              self.$message.success('删除成功！')
              self.findCreditRuleList()
            }
          })
        }).catch(_ => {
          self.$message.info('已取消操作')
        })
      },
      // 更新信用规则状态
      handleUpdateStatus(id, status) {
        const self = this
        const statusParams = {
          detailId: id
        }
        console.log(status)
        if (status === 2) {
          closeCreditRule(statusParams).then(res => {
            if (res.status === 'true') {
              self.$message.success('停用成功！')
            } else {
              self.$message.error(res.msg)
            }
          })
        } else if (status === 1) {
          openCreditRule(statusParams).then(res => {
            if (res.status === 'true') {
              self.$message.success('启用成功！')
            } else {
              self.$message.error(res.msg)
            }
          })
        }
      },

      // 分页器事件
      handleSizeChange(val) {
        this.pageSize = val
        this.findCreditRuleList()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.findCreditRuleList()
      }
    }
  }
</script>

<style lang="scss">
  textarea {
    font-family: "PingFang SC";
  }
</style>

<style lang="scss" scoped>
  @import "../../../styles/config";
  .credit-list {
    .operate-bar {
      margin-bottom: 22px;
      text-align: right;
      font-size: 0;
    }
    .table-link {
      margin-right: 6px;
    }
    .align-link {
      margin-right: 45px;
    }
    .explain-btn-bar {
      margin-top: 40px;
      margin-bottom: 0;
      text-align: center;
      button {
        width: 100px;
      }
    }
  }
</style>
