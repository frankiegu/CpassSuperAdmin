<template>
  <div class="system-parameter-style">
    <div class="page-title"> <h1>{{ pageTitle() }}</h1> </div>

    <div class="card-padding card-padding-vertical">
      <el-form :model="parameter" ref="parameter" label-width="200px" class="demo-parameter">
        <h3 class="grid-title">预约设置</h3>
        <p class="form-item-style ml15">路演厅预约限制</p>

        <el-form-item label="单次预约时长不可超过" required>
          <el-select v-model.trim="parameter.singleTime" :disabled="notAllow" class="width70 fl">
            <el-option
              v-for="(item, index) in parameter.singleList"
              :key="index"
              :value="item.value">
            </el-option>
          </el-select>

          <div class="width30 fl"></div>
          <span class="theme-gray fl">小时</span>
        </el-form-item>

        <el-form-item label="同一企业" required>
          <el-select v-model.trim="parameter.enterpriseDate" :disabled="notAllow" class="width70 fl">
            <el-option
              v-for="(item, index) in parameter.enterpriseDateList"
              :key="index"
              :value="item.value">
            </el-option>
          </el-select>

          <div class="width30 fl"></div>
          <span class="theme-gray fl">天内未使用的预约时间不可超过</span>

          <div class="width30 fl"></div>
          <el-select v-model.trim="parameter.enterpriseHour" :disabled="notAllow" class="width70 fl">
            <el-option
              v-for="(item, index) in parameter.enterpriseHourList"
              :key="index"
              :value="item.value">
            </el-option>
          </el-select>

          <div class="width30 fl"></div>
          <span class="theme-gray fl">小时</span>
        </el-form-item>

        <el-form-item label="预约提示">
          <el-input
            :disabled="notAllow"
            v-model.trim="parameter.reservationNotice"
            type="textarea"
            class="fl width420px"
            :maxlength="100"
            placeholder="请输入预约参观提示，不超过100个字">
          </el-input>
        </el-form-item>

        <h3 class="grid-title">财务管理</h3>
        <p class="form-item-style ml15">结算日期设置</p>
        <el-form-item label="最晚缴费日" required>
          <span class="theme-gray fl">每月</span>
          <div class="width30 fl"></div>

          <el-select v-model.trim="parameter.pay" :disabled="notAllow" class="width70 fl">
            <el-option
              v-for="(item, index) in parameter.accountCreditPay"
              :key="index"
              :value="item.value">
            </el-option>
          </el-select>

            <div class="width30 fl"></div>
            <span class="theme-gray fl">日</span>
          </el-form-item>

        <h3 class="grid-title">信用体系</h3>
        <p class="form-item-style ml15">审核日期设置</p>

        <el-form-item label="奖励发放日" required>
          <span class="theme-gray fl">每月</span>
          <div class="width30 fl"></div>

          <el-select v-model.trim="parameter.credit" :disabled="notAllow" class="width70 fl">
            <el-option
              v-for="(item, index) in parameter.accountCreditPay"
              :key="index"
              :value="item.value">
            </el-option>
          </el-select>

          <div class="width30 fl"></div>
          <span class="theme-gray fl">日</span>
        </el-form-item>

        <h3 class="grid-title">门禁管理</h3>

        <el-form-item label="录入设备维护">
          <el-table border style="width: 60%;" v-loading="tableLoading" :data="deviceTable">
            <el-table-column label="门店" prop="storeName"></el-table-column>

            <el-table-column label="设备" prop="lockName">
              <template slot-scope="scope">
                <span
                  class="table-link"
                  @click="openBindDialog(scope.row.storeId)"
                  v-if="!scope.row.lockName || scope.row.lockName === ''">未绑定</span>
                <span v-else>{{scope.row.lockName}}</span>
              </template>
            </el-table-column>
          </el-table>

          <span class="theme-gray">录入设备绑定后无法更改，请谨慎操作</span>
        </el-form-item>

        <el-form-item>
          <el-button @click="subimitForm('parameter')" :loading="saveLoading" class="width120px mt20" type="primary">{{ editTxt }}</el-button>
          <span class="theme-gray ml30">（设置将在下一个月生效）</span>
        </el-form-item>
      </el-form>

      <!-- 录入设备弹窗 -->
      <el-dialog
        title="录入设备"
        :lock-scroll="false"
        :before-close="handleCancel"
        :visible.sync="dialogVisible">

        <el-form :model="deviceForm" label-width="80px">
          <el-form-item label="门店">{{deviceForm.storeName}}</el-form-item>

          <el-form-item label="设备">
            <el-select v-model="deviceForm.lockId" class="width220px">
              <el-option v-for="item in deviceList" :key="item.lockId" :value="item.lockId" :label="item.lockName"></el-option>
            </el-select>
            <p>录入设备绑定后无法更改，请谨慎操作</p>
          </el-form-item>

          <el-form-item label-width="0" class="text-center">
            <el-button type="primary" class="width120px" @click="handleBindDevice" :disabled="!deviceForm.lockId">保存</el-button>
            <el-button class="width120px" @click="handleCancel">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import setMsg from '@/config/com-mixins'
  import {parameter} from './parameter.text.js'
  import { getConfig, updateConfig, listEquipment, listLockByStore, setMainEquipment } from '@/service/index'
  export default {
    mixins: [setMsg],
    data () {
      return {
        parameter,
        notAllow: true, // 不允许编辑控件
        editTxt: '编辑', // “编辑”或者“保存”按钮文本
        saveLoading: false,

        // 门禁管理
        deviceTable: [],
        tableLoading: false,
        dialogVisible: false,
        deviceList: [],
        deviceForm: {
          storeId: '',
          storeName: '',
          lockId: ''
        }
      }
    },
    watch: {
      notAllow: function (val, newVal) {
        this.pageTitle()
      }
    },
    mounted () {
      let newDate = new Date()
      // 拿到当前月份的最后一天
      let monthLastDay = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0).getDate()
      this.parameter.accountCreditPay.push({
        value: monthLastDay
      })

      this.getPageData()
      this.findDeviceList()
    },
    methods: {
      getPageData () {
        getConfig().then(res => {
          if (res.status === 'true') {
            this.parameter.id = res.info.id
            this.parameter.singleTime = res.info.singleBookMaxHour
            this.parameter.enterpriseDate = res.info.companyBookDays
            this.parameter.enterpriseHour = res.info.companyBookMaxHour
            this.parameter.pay = res.info.payLatestDay
            this.parameter.credit = res.info.creditRewardDay
            this.parameter.reservationNotice = res.info.reservationNotice
          } else {
            this.setMsg('error', res.msg)
          }
        })
      },
      // 设置动态标题，应用在一个页面展示：新增编辑和详情
      pageTitle: function () {
        if (this.notAllow) {
          this.editTxt = '编辑'
          document.title = '参数配置'
        } else {
          this.editTxt = '保存'
          document.title = '编辑参数配置'
        }
        return this.notAllow ? '参数配置' : '编辑参数配置';
      },
      subimitForm(formName) {
        if (this.notAllow) {
          this.notAllow = false
          this.editTxt = '保存'
        } else {
          this.saveLoading = true
          this.editTxt = '执行中…'

          const updateParams = {
            id: this.parameter.id,
            singleBookMaxHour: this.parameter.singleTime,
            companyBookDays: this.parameter.enterpriseDate,
            companyBookMaxHour: this.parameter.enterpriseHour,
            payLatestDay: this.parameter.pay,
            creditRewardDay: this.parameter.credit,
            reservationNotice: this.parameter.reservationNotice
          }
          // console.log('updateParams: ', updateParams)

          updateConfig(updateParams).then(res => {
            if (res.status === 'true') {
              this.saveLoading = false
              this.notAllow = true
              this.editTxt = '编辑'

              this.setMsg('success', '修改成功！')
            } else {
              setTimeout(() => {
                this.editTxt = '保存'
                this.saveLoading = false
              }, 1000)

              this.setMsg('error', res.msg)
            }
          })
        }
      },

      // 查询门禁列表
      findDeviceList() {
        listEquipment().then(res => {
          if (res.status === 'true') {
            this.deviceTable = res.info
          } else {
            console.error(res.msg)
          }
        })
      },
      // 打开绑定设备弹窗
      openBindDialog(storeId) {
        this.dialogVisible = true
        this.deviceForm.lockId = ''
        let target = this.deviceTable.find((target) => {
          return target.storeId === storeId
        })
        this.deviceForm.storeName = target.storeName
        this.deviceForm.storeId = storeId
        // 查询门店下的设备列表
        listLockByStore({storeId: storeId}).then(res => {
          if (res.status === 'true' && res.info) {
            this.deviceList = res.info
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      // 确认绑定设备
      handleBindDevice() {
        this.dialogVisible = false
        let params = {
          storeId: this.deviceForm.storeId,
          lockId: this.deviceForm.lockId
        }
        setMainEquipment(params).then(res => {
          if (res.status === 'true') {
            this.$message.success('绑定成功!')
            this.findDeviceList()
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      // 取消
      handleCancel() {
        this.$confirm('未绑定设备，确认关闭？', '确认关闭？', {
          lockScroll: false
        }).then(_ => {
          this.dialogVisible = false
          this.$message.info('已取消绑定')
        }).catch(_ => {
          return
        })
      }
    }
  }
</script>

<style lang="scss">
  @import "../../../styles/config";
  .system-parameter-style {
    .el-form-item__label {
      text-align: left;
      padding-left: 15px;
    }
  }
</style>

<style lang="scss" scoped>
  @import "../../../styles/config";
  .system-parameter-style {
    .width70 {
      width: 70px;
    }
    .el-select, .el-cascader {
      display: block;
    }
  }
  .el-table {
    line-height: normal;
  }
</style>
