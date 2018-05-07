<template>
  <div class="field-list">
    <lh-title></lh-title>

    <div class="card-padding">
      <el-form :model="formData" :inline="true" class="text-right mr-10">
        <el-form-item>
          <el-input
            v-model.trim="formData.name"
            @keyup.native.enter="getPageData"
            placeholder="请输入场地名称"
            class="width220px">

            <i slot="suffix" @click="getPageData" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-form-item>
      </el-form>

      <!-- @#TODO 测试排序 排序规则：根据添加时间倒序显示，最近设置为对外开放的场地显示在最上方 -->
      <el-table
        :data="tableData"
        :empty-text="tableEmpty"
        :slot="tableEmpty"
        v-loading="tableLoading"
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

        <el-table-column label="场地所属" prop="spaceName" align="left"></el-table-column>
        <el-table-column label="所在地区" prop="address" align="left"></el-table-column>
        <el-table-column label="场地类型" prop="fieldTypeText" align="left"></el-table-column>
        <el-table-column label="历史预定数" prop="bookNum" align="left" sortable sort-by="bookNum" width="115"></el-table-column>
        <el-table-column label="预定价格" :formatter="formatterPrice" align="left"></el-table-column>
        <el-table-column label="联系人" prop="contact" align="left"></el-table-column>
        <el-table-column label="联系方式" prop="phone" align="left" width="110"></el-table-column>

        <el-table-column label="状态" fixed="right" align="left">
          <template slot-scope="scope">
            <el-tooltip
              :content="scope.row.isOpen === 1 ? '点击停用会员' : '点击启用会员'"
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
        :page-size="pageSize"
        :current-page="currentPage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[10, 20, 30, 40]"
        class="pagination-container"
        background></el-pagination>
    </div>
  </div>
</template>

<script>
  import tableMixins from '@/mixins/table'
  import listMixins from './list.mixins'
  import { fieldList, setFieldStatus } from '@/service/field'

  export default {
    mixins: [listMixins, tableMixins],
    components: {},
    data () {
      return {
        formData: {
          name: ''
        },
        pageSize: 10
      }
    },
    mounted () {
      this.getPageData()
    },
    methods: {
      formatterPrice(row, column) {
        return (row.minPrice + '-' + row.maxPrice + (row.fieldType === 3 ?  ' 元/天' : ' 元/小时'))
      },
      getPageData() {
        const paramsObj = {
          pageSize: this.pageSize,
          pageNum: this.currentPage,
          fieldName: this.formData.name
        }
        fieldList(paramsObj).then(res => {
          if (res.status === 'true') {
            let data = res.info
            if (data) {
              this.pageTotal = data.total
              this.tableData = data.result
              this.tableData.forEach(v => {
                if (v.fieldType === 1) {
                  v.fieldTypeText = '会议室'
                } else if (v.fieldType === 3) {
                  v.fieldTypeText = '工位'
                }
              })
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
      // 更新会员状态
      handleUpdateStatus(id, status) {
        setFieldStatus({ fieldId: id, isOpen: status }).then(res => {
          if (res.status === 'true') {
            this.$message.success('修改成功！')
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

<style lang="scss" scoped>
  @import "src/styles/config";
  .field-list {
  }
</style>
