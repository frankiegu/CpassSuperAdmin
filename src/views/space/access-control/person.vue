<template>
  <div class="space-access-person">
    <div class="page-title"> <h1>人员维护</h1> </div>
    <div class="card-padding">
      <el-form :model="formData" :inline="true" class="mr-10 text-right">
        <el-button
          v-permissions="'/manage/staff/add'"
          @click="getMembers()"
          class="fl"
          icon="el-icon-circle-plus"
          type="primary">
          添加人员</el-button>

        <el-form-item>
          <el-date-picker
            v-model="formData.rangeDate"
            @change="getPageData"
            :picker-options="pickerOptions"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            placeholder="选择日期"
            type="daterange"
            align="right"></el-date-picker></el-form-item>

        <el-form-item class="width170px">
          <el-select
            v-model="formData.store"
            @change="getPageData"
            placeholder="所属门店"
            clearable>

            <el-option
              v-for="i in storeList"
              :label="i.storeName"
              :value="i.id"
              :key="i.id"></el-option></el-select></el-form-item>

        <!-- 导出 -->
        <el-form-item v-permissions="'/manage/staff/export'">
          <el-button
            @click="exportExcel"
            :loading="downloadLoading"
            icon="el-icon-download"
            class="btn-green">导出表格</el-button></el-form-item></el-form>

      <el-table
        :data="tableData"
        :empty-text="tableEmpty"
        :slot="tableEmpty"
        v-loading="tableLoading"
        class="width100" border>

        <el-table-column prop="staffCode" label="工号" width="75" fixed="left" sortable></el-table-column>
        <el-table-column prop="storeName" label="门店"></el-table-column>
        <el-table-column prop="userName" label="绑定会员"></el-table-column>
        <el-table-column prop="companyName" label="所属企业"></el-table-column>

        <el-table-column prop="fingerprintCode" label="指纹">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.fingerprintCode === 1" type="success">已添加</el-tag>
            <el-tag v-else="scope.row.fingerprintCode === 2" type="info">未添加</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="password" label="密码"></el-table-column>
        <el-table-column label="添加日期" width="130" sortable>
          <template slot-scope="scope">
            <i class="el-icon-time"></i> {{ formatTime(scope.row.createDate) }}</template>
         </el-table-column>

        <!-- 操作 -->
        <el-table-column
          v-if="handleHasPermissions(['/manage/staff/delete'])"
          prop="status"
          fixed="right"
          label="操作"
          width="100">

          <!-- <template slot-scope="scope">
            <el-button @click="showDialog(scope.row.id)" size="mini">编辑</el-button>
          </template> -->
          <template slot-scope="scope">
            <span
              @click="deletePerson(scope.row.staffCode)"
              class="pointer-theme-gray dib">删除</span>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        :total="pageTotal"
        :page-size="pageSize"
        :current-page="currentPage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[10, 20, 30, 40]"
        class="pagination-container"
        background>
      </el-pagination>

      <!-- 使用范围 -->
      <lh-dialog
        :treeData="treeData"
        :treeEmpty="treeEmpty"
        :dialogVisible="rangVisible"
        :equipmentList="equipmentList"
        @updateDialogStatus="val => rangVisible = val"
        @submitLHDialog="submitLHDialog"></lh-dialog>

      <!-- 编辑工号 -->
      <!-- <el-dialog
        :title="'编辑工号'"
        :visible.sync="dialogVisible"
        class="set-dialog"
        width="420px">

        <el-form :model="dialogForm"  label-width="100px"  label-position="right">
          <el-form-item label="工号">
            <span class="theme-gray">{{ dialogForm.jobNum }}</span></el-form-item>

          <el-form-item label="对应会员">
            <el-select
              v-model.trim="dialogForm.member"
              class="width70 fl"
              placeholder="请选择对应会员">

              <el-option
                v-for="(item, index) in memberList"
                :label="item.roleName"
                :value="item.id"
                :key="item.id">
              </el-option></el-select></el-form-item></el-form>

        <div slot="footer" class="dialog-footer text-center">
          <el-button @click="dialogVisible = false" class="width100px">取 消</el-button>
          <el-button @click="sureBtn()" type="primary" class="width100px">确认</el-button>
        </div>
      </el-dialog>-->
    </div>
  </div>
</template>

<script>
  import { API_PATH } from '@/config/env'
  import headMixins from '@/config/mixins/head'
  import tableMixins from '@/config/mixins/table'
  import {comPickerOptions} from '@/config/data/head'
  import dialog from '@/components/dialog'
  import { formatTimeString, downloadFile } from '@/config/utils'
  import { staffList, staffDelete, loadCompanyUserTree, staffAdd, listBindEquipment } from '@/service/space/person'
  export default {
    mixins: [headMixins, tableMixins],
    components: { [dialog.name]: dialog },
    data () {
      return {
        // 会员查询筛选
        pickerOptions: comPickerOptions,
        downloadLoading: false, // 导出按钮loading状态
        formData: { store: '', rangeDate: '' },

        // dialogVisible: false,
        // dialogForm: {jobNum: '', member: ''},
        // memberList: [],

        // 使用范围
        equipmentList: [],
        treeData: [],
        rangVisible: false,
        treeEmpty: ' '
      }
    },
    mounted () {
      const self = this
      self.getPageData()
    },
    methods: {
      submitLHDialog(dialogData) {
        const self = this
        staffAdd(dialogData).then(res => {
          if (res.status === 'true') {
            self.setMsg('success', '添加成功')
            self.getPageData()
          } else self.setMsg('error', res.msg)
        })
      },
      getPageData() {
        const self = this
        let formData = self.formData
        self.tableLoading = true

        const ajaxParams = {
          pageNum: self.currentPage,
          pageSize: self.pageSize,
          storeId: formData.store,
          startDate: formData.rangeDate ? formatTimeString(formData.rangeDate[0]) : null,
          endDate: formData.rangeDate ? formatTimeString(formData.rangeDate[1]) : null
        }
        staffList(ajaxParams).then(res => {
          if (res.status === 'true') {
            let data = res.info

            if (data) {
              self.pageTotal = data.total
              self.tableData = data.result
            }

            self.tableLoading = false
            if (self.tableData.length === 0) {
              self.tableEmpty = '暂时无数据'
            }
          } else {
            self.tableEmpty = '暂时无数据'
            self.setMsg('error', res.msg)
          }
        })
      },
      getMembers() {
        const self = this
        loadCompanyUserTree().then(res => {
          if (res.status === 'true') {
            self.treeData = []
            self.treeData.push(res.info)
            self.rangVisible = true

            if (!self.equipmentList.length) {
              listBindEquipment().then(res => {
                if (res.status === 'true') {
                  self.equipmentList = res.info
                }
              })
            }

            if (self.treeData.length === 0) {
              self.treeEmpty = '暂时无数据'
            }
          } else {
            self.tableEmpty = '暂时无数据'
            self.setMsg('error', res.msg)
          }
        })
      },
      deletePerson(id) {
        const self = this
        self.$confirm('删除后将无法管理该会员的门禁', '确定删除？', { type: 'warning' }).then(() => {
          staffDelete({ staffCode: id }).then(res => {
            if (res.status === 'true') {
              self.getPageData()

              self.setMsg('success', '删除成功!')
            } else self.setMsg('error', res.msg)
          })
        }).catch(() => { self.setMsg('已取消删除') });
      },
      formatTime(time) {
        return formatTimeString(time)
      },
      exportExcel() {
        const self = this
        let formData = self.formData

        if (!self.tableData.length) {
          return self.setMsg('暂无数据')
        }
        self.downloadLoading = true

        downloadFile(API_PATH + '/manage/staff/export', {
          startDate: formData.rangeDate ? formatTimeString(formData.rangeDate[0]) : null,
          endDate: formData.rangeDate ? formatTimeString(formData.rangeDate[1]) : null,
          storeId: formData.store
        })
        setTimeout(function () {
          self.downloadLoading = false
        }, 500)
      }
      // sureBtn() {
      //   const self = this
      //   self.dialogVisible = false
      //   userList({
      //     adminUserId: self.id,
      //     roleId: self.distribution
      //   }).then(res => {
      //     if (res.status === 'true') {
      //       self.setMsg('success', '分配职务成功!')
      //       self.getPageData()
      //     } else self.setMsg('error', res.msg)
      //   })
      // },
      // showDialog(id) {
      //   const self = this
      //   self.dialogVisible = true
      //   userList({ id: id }).then(res => {
      //     if (res.status === 'true') {
      //     } else self.setMsg('error', res.msg)
      //   })
      // },
    }
  }
</script>

<style lang="scss" scoped>
  @import "src/styles/config";
  .space-access-person {
    .members-total {
      margin-right: 12px;
      font-size: 14px;
    }

    .cell .el-select {
      width: auto;
      padding: 10px 0;
    }
  }
</style>
