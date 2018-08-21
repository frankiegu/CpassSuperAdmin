<template>
  <div class="field-list">
    <lh-title></lh-title>

    <div class="lh-form-box">
      <el-form :model="formData" :inline="true" class="text-right mr-10" @submit.native.prevent>
        <!--选择预约日期-->
        <el-form-item>
          <lh-datePicker label="更新日期" :optionType="true" @datePickerChange="datePickerChange"></lh-datePicker>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model.trim="formData.name"
            @keyup.native.enter="getPageData(1)"
            placeholder="请输入场地名称"
            class="lh-form-input">

            <i slot="suffix" @click="getPageData(1)" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-form-item>
      </el-form>

    </div>

    <div class="lh-card-main">
      <el-tabs v-model="statusType" class="lh-form-tab mb0" @tab-click="getPageData(1)">
        <el-tab-pane v-for="item in statusList" :label="item.label" :key="item.type" :name="item.type" />
      </el-tabs>

      <div class="card-body">
        <!-- @#TODO 测试排序 排序规则：根据添加时间倒序显示，最近设置为对外开放的场地显示在最上方 -->
        <el-table
          :data="tableData"
          :empty-text="tableEmpty"
          :slot="tableEmpty"
          v-loading="tableLoading"
          @sort-change="change"
          class="width100" border>

          <el-table-column label="场地名称" fixed="left" align="left">
            <template slot-scope="scope">
              <router-link
                :to="{path: '/field/detail', query: {id: scope.row.fieldId}}"
                class="table-link">
                {{ scope.row.fieldName }}
              </router-link>
            </template>
          </el-table-column>

          <el-table-column label="所属品牌" prop="spaceName" align="left"></el-table-column>
          <el-table-column label="所属空间" prop="storeName" align="left"></el-table-column>
          <el-table-column label="所在地区" prop="address" align="left"></el-table-column>
          <el-table-column label="场地类型" prop="fieldTypeName" align="left"></el-table-column>

          <el-table-column label="历史预定数" prop="bookNum" sortable="custom" align="left" width="115"></el-table-column>

          <el-table-column label="预定价格" :formatter="formatterPrice" align="left"></el-table-column>
          <el-table-column label="联系人" prop="contact" align="left"></el-table-column>
          <el-table-column label="联系方式" prop="phone" align="left" width="110"></el-table-column>

          <el-table-column label="场地更新时间" prop="updated" align="left" width="105"></el-table-column>

          <el-table-column label="操作" fixed="right" align="left">
            <template slot-scope="scope">
              <el-tooltip
                :content="scope.row.isOpen === 1 ? '点击停用场地' : '点击启用场地'"
                placement="top"
                class="margin-lr6">

                <el-switch
                  v-model="scope.row.isOpen"
                  :active-value="1"
                  :inactive-value="0"
                  :active-color="switchActiveColor"
                  active-text=""
                  inactive-text=""
                  @change="handleUpdateStatus(scope.row.fieldId, scope.row.isOpen)"></el-switch>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          :total="pageTotal"
          :layout="layoutArr"
          :page-size="pageSize"
          :page-sizes="pageSizeArr"
          :current-page="currentPage"
          class="pagination-container"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          background></el-pagination>
      </div>

    </div>

  </div>
</template>

<script>
  import tableMixins from '@/mixins/table'
  import listMixins from './list.mixins'
  import { fieldList, setFieldStatus } from '@/service/field'
  import { formatTimeString } from '@/config/utils'

  export default {
    mixins: [listMixins, tableMixins],
    components: {},
    data () {
      return {
        bookNumSort: '',
        statusType: '-1',
        statusList: [
          {
            label: '全部',
            type: '-1'
          },
          {
            label: '待审核',
            type: '0'
          },
          {
            label: '审核通过',
            type: '1'
          }
        ],
        formData: {
          update: '', // 更新时间
          name: ''
        }
      }
    },
    mounted () {
      this.getPageData()
    },
    methods: {
      // 承接datePicker
      datePickerChange (page, dateRange) {
        this.formData.update = dateRange
        this.getPageData(1)
      },
      formatterPrice(row, column) {
        let price = row.minPrice === row.maxPrice ? row.minPrice : row.minPrice + '-' + row.maxPrice
        // 1=会议室, 2=路演厅,3=工位,4=其他.5=办公室6=时租工位
        let unit
        if (row.fieldType === 3) {
          unit = ' 元/天'
        } else if (row.fieldType === 5) {
          unit = ' 元/月'
        } else {
          unit = ' 元/小时'
        }
        return (price + unit)
      },
      change(sort) {
        // console.log('sort', sort);
        if (sort.order === 'ascending') {
          this.bookNumSort = 1
        } else if (sort.order === 'descending') {
          this.bookNumSort = 0
        } else if (sort.order === null) {
          this.bookNumSort = ''
        }

        this.currentPage = 1
        this.getPageData()
      },
      getPageData(page) {
        this.currentPage = page || this.currentPage
        const paramsObj = {
          pageSize: this.pageSize,
          pageNum: this.currentPage,
          bookNumSort: this.bookNumSort,
          fieldName: this.formData.name,
          storeId: this.$route.query.storeId,
          status: this.statusType !== '-1' ? this.statusType : null,
          startTime: this.formData.update ? formatTimeString(this.formData.update[0]) : null,
          endTime: this.formData.update ? formatTimeString(this.formData.update[1]) : null
        }
        fieldList(paramsObj).then(res => {
          if (res.status === 'true') {
            let data = res.info
            if (data) {
              this.pageTotal = data.total
              this.tableData = data.result
            }

            this.tableLoading = false
            if (this.tableData.length === 0) {
              this.tableEmpty = '暂时无数据'
            }
          } else {
            this.setMsg('error', res.msg)
          }
        })
      },
      // 更新场地状态
      handleUpdateStatus(id, status) {
        setFieldStatus({ fieldId: id, isOpen: status }).then(res => {
          if (res.status === 'true') {
            this.$message.success('修改成功！')
            // this.getPageData()
          } else {
            this.$message.error(res.msg)
          }
        })
        // const statusParams = {
        //   userId: id,
        //   status: status
        // }
        // userUpdateStatus(statusParams).then(res => {
        //  if (res.status === 'true') {
        //    this.$message.success('修改成功！')
        //  } else {
        //    this.$message.error(res.msg)
        //  }
        // })
      }
    }
  }
</script>

<style lang="scss">
  @import "src/styles/config";
  .field-list {
    .el-tabs__header {
    margin-bottom: 0;
    }
  }
</style>
