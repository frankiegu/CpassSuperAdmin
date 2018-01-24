<template>
  <div class="enterprise-info">

    <!-- 有面包屑的时候，就隐藏这个标题 -->
    <div class="page-title">
      <h1>企业信息管理</h1>
    </div>

    <el-row :gutter="20" class="data-statistics">
      <!-- 数据统计 -->
      <el-col :span="handleHasPermissions('/manage/company/addCompany') ? 5 : 6">
        <div class="grid-content statistics-item">
          <div>现有企业</div>
          <span class="item-num theme-blue">
            {{ enterpriseSum.effectiveNum }}
            <!--<count-to ref="effectiveCompany" :startVal='initEffectiveNum' :endVal='enterpriseSum.effectiveNum || 0' :duration='3000'></count-to>-->
          </span>
        </div>
      </el-col>

      <el-col :span="handleHasPermissions('/manage/company/addCompany') ? 5 : 6">
        <div class="grid-content statistics-item">
          即将到期
          <span class="item-num theme-red">
            {{ enterpriseSum.nearExpireNum }}
            <!--<count-to :startVal='initNearExpireNum' :endVal='enterpriseSum.nearExpireNum || 0' :duration='3000'></count-to>-->
          </span>
        </div>
      </el-col>

      <el-col :span="handleHasPermissions('/manage/company/addCompany') ? 5 : 6">
        <div class="grid-content statistics-item">
          合同到期
          <span class="item-num theme-gray">
            {{ enterpriseSum.expireNum }}
            <!--<count-to :startVal='initExpireNum' :endVal='enterpriseSum.expireNum || 0' :duration='3000'></count-to>-->
          </span>
        </div>
      </el-col>

      <el-col :span="handleHasPermissions('/manage/company/addCompany') ? 5 : 6">
        <div class="grid-content statistics-item">
          合同中止
          <span class="item-num theme-gray">
            {{ enterpriseSum.stopNum }}
            <!--<count-to ref="stopCompany" :startVal='initStopNum' :endVal='enterpriseSum.stopNum || 0' :duration='3000'></count-to>-->
          </span>
        </div>
      </el-col>

      <el-col :span="4" v-permissions="'/manage/company/addCompany'">
        <div class="grid-content statistics-item operate-grid">
          <router-link to="/member/enterprise/batch-import" class="btn-link">批量导入</router-link>
          <router-link to="/member/enterprise/detail" class="btn-link" icon="el-icon-circle-plus">新增企业</router-link>
        </div>
      </el-col>
    </el-row>

    <div class="card-padding">
      <!-- 查询筛选 -->
      <el-form :inline="true" :model="enterpriseSort" class="sort-form-bar clearfix">
        <el-form-item label="">
          <el-select v-model="enterpriseSort.store" placeholder="进驻门店" @change="findCompanyList" clearable>
            <el-option v-for="storeItem in storeList" :label="storeItem.storeName" :value="storeItem.id" :key="storeItem.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="">
          <el-date-picker start-placeholder="开始日期" end-placeholder="结束日期"
            v-model="enterpriseSort.reg_date"
            type="daterange"
            align="right"
            placeholder="选择进驻日期"
            :picker-options="pickerOptions"
            @change="findCompanyList">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="">
          <el-select
            style="width: 140px;"
            v-model="enterpriseSort.status"
            placeholder="合同状态"
            clearable
            @change="findCompanyList">

            <el-option label="全部" value=" "></el-option>
            <el-option v-for="(value, key) in statusList" :label="value" :value="key" :key="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-input
            class="width220"
            v-model.trim="enterpriseSort.name"
            placeholder="请输入企业名称"
            @keyup.native.enter="findCompanyList">

            <i slot="suffix" @click="findCompanyList" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-form-item>

        <!--<el-form-item>-->
          <!--<el-button type="primary" @click="findCompanyList">开始查找</el-button>-->
        <!--</el-form-item>-->
        <el-form-item v-permissions="'/manage/company/exportCompany'">
          <a class="btn-link btn-green" @click="exportExcel" :loading="downloadLoading" icon="el-icon-download">导出表格</a>
        </el-form-item>
      </el-form>

      <!-- 表格list -->
      <el-table
        :data="enterpriseTable"
        :empty-text="tableEmpty"
        :slot="tableEmpty"
        v-loading="tableLoading"
        border
        style="width: 100%" >

        <el-table-column prop="code" label="公司号"></el-table-column>
        <el-table-column align="left" prop="name" label="公司名称">
          <template slot-scope="scope">
            <router-link class="table-link" :to="'/member/enterprise/detail?id=' + scope.row.id">
              {{ scope.row.name }}
            </router-link>
          </template>
        </el-table-column>

        <!-- 公司注册人数 带公司名称筛选会员 -->
        <el-table-column prop="memberNum" label="注册人数">
          <template slot-scope="scope">
            <router-link :to="'/member/list?companyName=' + encodeURIComponent(scope.row.name)" class="table-link" v-if="scope.row.userNum > 0">{{ scope.row.userNum }}</router-link>
            <span class="theme-gray" v-else>{{ scope.row.userNum }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="storeName" align="left" label="进驻门店"></el-table-column>
        <el-table-column prop="inDate" label="进驻日期" sortable>
          <template slot-scope="scope">
            <span v-if="scope.row.inDate">{{ scope.row.inDate }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="expireDate" label="合同期限" sortable>
          <template slot-scope="scope">
            <span v-if="scope.row.expireDate">{{ scope.row.expireDate }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="liablePerson" label="联系人"></el-table-column>
        <el-table-column prop="mobile" label="联系电话"></el-table-column>

        <!-- 合同状态——有效、临期、中止、到期，合同期限到期后不影响使用 -->
        <el-table-column prop="status" label="合同状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 10">有效</span>
            <span v-if="scope.row.status === 20">临期</span>
            <span v-if="scope.row.status === 30">到期</span>
            <span v-if="scope.row.status === 40">中止</span>
            <span v-if="scope.row.status === 50">未添加</span>
          </template>
        </el-table-column>

        <el-table-column prop="isStop" label="操作" width="124" v-if="handleHasPermissions('/manage/company/updateCompany')">
          <template slot-scope="scope">
            <router-link :to="'/member/enterprise/detail?edit=1&id=' + scope.row.id" class="table-link edit-enterprise">编辑</router-link>
            <el-tooltip :content="!scope.row.isStop ? '点击停用该企业' : '点击开放该企业'" placement="top">
              <el-switch
                v-model="scope.row.isStop"
                :active-value="false"
                :inactive-value="true"
                :active-color="switchActiveColor"
                active-text=""
                inactive-text=""
                @change="handleToggleCompany(scope.row.isStop, scope.row.id)">
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
    </div>
  </div>
</template>

<script>
  import handleHasPermissions from '@/config/com-mixins'
  import countTo from 'vue-count-to'
  import { API_PATH } from '@/config/env'
  import { formatTimeString, downloadFile } from '@/config/utils'
  import { loadConstant, companyStatistics, findAllStore, companyList, closeCompany, openCompany } from '@/service/index'
  export default {
    mixins: [handleHasPermissions],
    data () {
      return {
        title: '企业信息管理',
        token: '',
        downloadLoading: false, // 导出按钮loading状态
        exportUrl: '', // 下载链接
        downloadCode: '',

        // 企业统计
        initEffectiveNum: 0,
        initNearExpireNum: 0,
        initExpireNum: 0,
        initStopNum: 0,
        enterpriseSum: {
          effectiveNum: 0,
          nearExpireNum: 0,
          expireNum: 0,
          stopNum: 0
        },
        // 企业查询筛选
        storeList: [],
        statusList: {},
        enterpriseSort: {
          store: '',
          reg_date: '',
          status: '',
          name: ''
        },
        // 日期选择器
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        // 企业列表
        enterpriseTable: [],
        tableLoading: true,
        tableEmpty: ' ',

        // 分页器配置
        currentPage: 1,
        pageSize: 10,
        pageTotal: 0
      }
    },
    props: {},
    components: { countTo },
    mounted () {
      this.token = sessionStorage.getItem('token')
      // 统计企业数
      this.getCompanyStatistics()
      // 查询企业列表
      this.findCompanyList()
      // 查询进驻门店
      findAllStore().then(res => {
        if (res.status === 'true') {
          this.storeList = res.info
          this.storeList.unshift({'id': ' ', 'storeName': '全部门店'})
        } else {
          console.log(res.msg)
        }
      })
      // 获取企业合同状态常量
      const companyStatus = 'company.status'
      loadConstant(companyStatus).then(res => {
        if (res.status === 'true') {
          this.statusList = res.info
        } else {
          console.log(res.msg)
        }
      })
    },
    watch: {
      // 'enterpriseSum.effectiveNum': function (newVal, oldVal) {
      //   this.initEffectiveNum = newVal
      // },
      // 'enterpriseSum.stopNum': function (newVal, oldVal) {
      //   this.initStopNum = newVal
      //   // console.log(newVal, oldVal, this.initStopNum)
      // }
    },
    computed: {},
    filters: {},
    methods: {
      // 获取企业统计数
      getCompanyStatistics() {
        companyStatistics().then(res => {
          if (res.status === 'true') {
            this.enterpriseSum.effectiveNum = res.info.effectiveNum
            this.enterpriseSum.nearExpireNum = res.info.nearExpireNum
            this.enterpriseSum.expireNum = res.info.expireNum
            this.enterpriseSum.stopNum = res.info.stopNum
            // this.$refs.effectiveCompany.start()
            // this.$refs.stopCompany.start()
          } else {
            console.log(res.msg)
          }
        })
      },
      // 查询企业列表
      findCompanyList() {
        const self = this
        const paramsObj = {
          pageNum: self.currentPage,
          pageSize: self.pageSize,
          storeId: self.enterpriseSort.store,
          status: self.enterpriseSort.status,
          startTime: self.enterpriseSort.reg_date ? formatTimeString(self.enterpriseSort.reg_date[0]) : null,
          endTime: self.enterpriseSort.reg_date ? formatTimeString(self.enterpriseSort.reg_date[1]) : null,
          name: self.enterpriseSort.name
        }
        // console.log(formatTimeString(paramsObj.startTime, 'yyyy年MM月dd日'))
        companyList(paramsObj).then(res => {
          if (res.status === 'true') {
            self.pageTotal = res.info.total
            self.enterpriseTable = res.info.result

            self.tableLoading = false
            if (self.enterpriseTable.length === 0) {
              self.tableEmpty = '暂时无数据'
            }

            for (let i = 0; i < self.enterpriseTable.length; i++) {
              self.enterpriseTable[i].inDate = res.info.result[i].inDate ? res.info.result[i].inDate.split(' ')[0] : null
              self.enterpriseTable[i].expireDate = res.info.result[i].expireDate ? res.info.result[i].expireDate.split(' ')[0] : null
            }
          }
        })
      },

      // 导出表格
      exportExcel() {
        if (!this.enterpriseTable.length) {
          return this.$message.info('暂无数据')
        }
        const self = this
        const downParams = {
          storeId: self.enterpriseSort.store,
          status: self.enterpriseSort.status,
          startTime: self.enterpriseSort.reg_date ? formatTimeString(self.enterpriseSort.reg_date[0]) : null,
          endTime: self.enterpriseSort.reg_date ? formatTimeString(self.enterpriseSort.reg_date[1]) : null,
          name: self.enterpriseSort.name
        }
        let url = API_PATH + '/manage/company/exportCompany'
        downloadFile(url, downParams)
      },

      // 分页器事件
      handleSizeChange(val) {
        this.pageSize = val
        this.findCompanyList()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.findCompanyList()
      },

      // 切换启用/停用企业
      handleToggleCompany (currentStatus, id) {
        const self = this
        const target = self.enterpriseTable.find((target) => { // 目标企业
          return target.id === id
        })
        const paramsObj = { // 请求参数
          companyId: id
        }
        // 如果当前状态是“关闭企业”，则弹窗确认是否关闭；
        if (currentStatus) {
          const h = self.$createElement
          self.$msgbox({
            title: '确定停用企业？',
            message: h('p', null, [
              h('span', null, '停用后该企业下员工将无法正常使用空间服务')
            ]),
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            lockScroll: false,
            beforeClose: (action, instance, done) => {
              if (action === 'confirm') {
                instance.confirmButtonLoading = true;
                instance.confirmButtonText = '执行中...'

                // 点击确认按钮则请求关闭当前企业
                closeCompany(paramsObj).then(res => {
                  if (res.status === 'true') {
                    done() // 关闭弹窗
                    target.status = res.info
                    self.getCompanyStatistics()
                    instance.confirmButtonLoading = false
                  } else {
                    self.$message({
                      type: 'error',
                      message: res.msg
                    })
                  }
                })
              } else {
                done()
              }
            }
          }).then(action => {
            self.$message({
              type: 'success',
              message: '停用成功！'
            })
          }).catch(() => {
            target.isStop = false
            self.$message({
              type: 'info',
              message: '已取消操作'
            })
          })
        } else { // 如果当前状态为“启用企业”，则直接请求开启企业
          openCompany(paramsObj).then(res => {
            if (res.status === 'true') {
              target.isStop = false
              target.status = res.info
              self.getCompanyStatistics()
              self.$message({
                type: 'success',
                message: '启用成功！'
              })
            }
          })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../styles/config";
  .enterprise-info {
    .search-box {
      float: right;
      width: 220px;

      .el-form-item {
        float: right;
      }
    }
  }
  .data-statistics {
    margin-bottom: 20px;

    .statistics-item {
      padding: 30px 20px;
      border-radius: 4px;
      background-color: #ffffff;
      text-align: center;

      &.operate-grid {
        font-size: 0;
        padding: 54px 20px;

        a {
          font-size: 14px;
        }
      }

      @media screen and (max-width: 1715px) {
        &.operate-grid {
          padding: 31px 20px;

          .btn-link{
            display: block;
            width: 56px;
            margin-left: auto;
            margin-right: auto;
            & + .btn-link {
              margin-top: 10px;
            }
          }
        }
      }

      .item-num {
        display: block;
        font-family: PingFangSC-Regular;
        font-size: 50px;
        line-height: 36px;
        vertical-align: middle;
        margin: 15px 0 14px;
      }

      button + button {
        margin-left: 30px;
      }
    }
  }

  .sort-form-bar {
    margin-right: -10px;
    font-size: 0;
  }

  .edit-enterprise {
    display: inline-block;
    margin-right: 6px;
  }
</style>
