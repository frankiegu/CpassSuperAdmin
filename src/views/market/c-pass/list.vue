<template>
  <div class="page-market-c-pass">
    <lh-title></lh-title>

    <el-form :inline="true" :model="formDate" class="lh-search-box" @submit.native.prevent>
      <!--v-permissions="'/manage/coupon/add'"-->
      <router-link
        to="/market/c-pass/com"
        class="el-icon-circle-plus to-bottom-right lh-form-btn">&nbsp;添加精选</router-link>

      <el-input
        v-model.trim="formDate.keywords"
        @keyup.native.nter="getPageData(1)"
        placeholder="请输入精选标题"
        class="lh-form-item">
        <i slot="suffix" @click="getPageData(1)" class="el-input__icon el-icon-search"></i>
      </el-input>
    </el-form>

    <div class="lh-card-main2">
      <h3 class="lh-text-title">橱窗位</h3>
      <el-table
        :data="tableData2"
        :empty-text="tableEmpty2"
        :slot="tableEmpty2"
        v-loading="tableLoading2"
        class="width100" border>
        <el-table-column label="橱窗位" prop="name1" type="index" width="70"></el-table-column>
        <el-table-column label="标题" align="left">
          <template slot-scope="scope">
            <router-link :to="{path: '/field/detail', query: {id: scope.row.fieldId}}" class="table-link">{{ scope.row.fieldName }}</router-link>
          </template>
        </el-table-column>

        <el-table-column label="状态" prop="name3" align="left">
          <template slot-scope="scope">
            <el-tag
              v-for="(item, idx) in statusFilters" :key="idx"
              v-if="scope.row.name3 === item.value"
              :type="item.type">{{ item.text }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="点击数" prop="name4" align="left"></el-table-column>
        <el-table-column label="添加日期" prop="name5" align="left"></el-table-column>
        <el-table-column label="操作" prop="name6" align="left">
          <template slot-scope="scope">
            <lh-svg icon-class="icon-like" class="ph4 svg18 fill-blue"></lh-svg>
            <router-link :to="'/market/c-pass/com?id=' + scope.row.id" class="lh-table-btn">编辑</router-link>
            <span @click="setFirst" class="lh-table-btn">置顶</span>
          </template>
        </el-table-column>
      </el-table>

      <h3 class="lh-text-title mt24">精选列表</h3>
      <el-table
        :data="tableData"
        :empty-text="tableEmpty"
        :slot="tableEmpty"
        v-loading="tableLoading"
        @filter-change="filterChange"
        class="width100" border>
        <el-table-column label="标题" align="left">
          <template slot-scope="scope">
            <router-link
              :to="{path: '/field/detail', query: {id: scope.row.fieldId}}"
              class="table-link">
              {{ scope.row.fieldName }}
            </router-link>
          </template>
        </el-table-column>

        <el-table-column :label="sortFileName" prop="name3"
          :filters="statusFilters"
          column-key="filterStatus"
          :filter-multiple="false"
          filter-placement="bottom-end"
          align="left" width="115">
          <template slot-scope="scope">
            <el-tag
              v-for="(item, idx) in statusFilters" :key="idx"
              v-if="scope.row.name3 === item.value"
              :type="item.type">{{ item.text }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="点击数" prop="name4" sortable align="left"></el-table-column>
        <el-table-column label="添加日期" prop="name5" align="left"></el-table-column>
        <el-table-column label="操作" prop="name6" align="left">
          <template slot-scope="scope">
            <lh-svg icon-class="icon-like" class="ph4 svg18"></lh-svg>
            <router-link :to="'c-pass/com?id=' + scope.row.id" class="lh-table-btn">编辑</router-link>
            <span @click="deleteField" class="lh-table-btn theme-gray">删除</span>
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
</template>

<script>
import listMixins from './list.mixins'
// import { fieldList } from '@/service/field'

export default {
  mixins: [listMixins],
  components: {},
  mounted () {
    this.getPageData()
  },
  methods: {
    getPageData(page) {
      this.currentPage = page || this.currentPage
      // const paramsObj = {
      //   pageSize: this.pageSize,
      //   pageNum: this.currentPage,
      //   filterStatus: this.filterStatus,
      //   fieldName: this.formData.name
      // }
      // fieldList(paramsObj).then(res => {
      //   if (res.status === 'true') {
      //     let data = res.info
      //     if (data) {
      //       this.pageTotal = data.total
      //       this.tableData = data.result
      //       this.tableData.forEach(v => {
      //         if (v.fieldType === 1) {
      //           v.fieldTypeText = '会议室'
      //         } else if (v.fieldType === 3) {
      //           v.fieldTypeText = '工位'
      //         } else if (v.fieldType === 2) {
      //           v.fieldTypeText = '路演厅'
      //         } else if (v.fieldType === 4) {
      //           v.fieldTypeText = '多功能场地'
      //         } else if (v.fieldType === 5) {
      //           v.fieldTypeText = '办公室'
      //         }
      //       })
      //     }

      //     this.tableLoading = false
      //     if (this.tableData.length === 0) {
      //       this.tableEmpty = '暂时无数据'
      //     }
      //   } else {
      //     this.setMsg('error', res.msg)
      //   }
      // })
    },
    setFirst(id) {
    },
    deleteField() {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', { type: 'warning' }).then(() => {
        this.getPageData()
        this.setMsg('success', '删除成功')
      }).catch(() => {
        this.setMsg('已取消删除')
      })
    },
    // table内筛选
    filterChange (filters) {
      // console.log('filters', filters['filterStatus'][0]);
      if (filters.hasOwnProperty('filterStatus')) {
        // 全部
        if (filters['filterStatus'].length === 0) {
          this.sortFileName = '状态'
          this.filterStatus = ''
          this.getPageData()
          return
        }

        for (let item of this.statusFilters) {
          if (filters['filterStatus'][0] === item.value) {
            this.sortFileName = item.text
            this.filterStatus = item.value
          }
        }

        this.currentPage = 1
        this.getPageData()
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "src/styles/config";
.page-market-c-pass {
}
</style>
