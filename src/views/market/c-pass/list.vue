<template>
  <div class="page-market-c-pass">
    <lh-title />

    <el-form :inline="true" :model="formDate" class="lh-search-box" @submit.native.prevent>
      <router-link to="/market/c-pass/com" class="el-icon-circle-plus to-bottom-right lh-form-btn">&nbsp;添加精选</router-link>
      <el-input v-model.trim="formDate.title" @keyup.native.enter="getPageData(1)"  placeholder="请输入精选标题" class="lh-form-item">
        <i slot="suffix" @click="getPageData(1)" class="el-input__icon el-icon-search"></i>
      </el-input>
    </el-form>

    <div class="lh-card-main2">
      <h3 class="lh-text-title">橱窗位</h3>
      <el-table
        :data="showcaseData"
        :empty-text="showcaseTableEmpty"
        :slot="showcaseTableEmpty"
        v-loading="showcaseTableLoading"
        class="width100" border>
        <el-table-column label="橱窗位" type="index" width="70">
          <template slot-scope="scope"><span class="theme-blue">{{ scope.$index + 1 }}</span></template>
        </el-table-column>
        <el-table-column label="标题" >
          <template slot-scope="scope">
            <router-link :to="'/market/c-pass/com?noAllow=true&fieldId=' + scope.row.id" class="table-link">{{ scope.row.title }}</router-link>
          </template>
        </el-table-column>
        <el-table-column label="状态" >
          <template slot-scope="scope">
            <el-tag type="success">展示中</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="点击数" prop="pvCount" ></el-table-column>
        <el-table-column label="添加日期" >
          <template slot-scope="scope">
            {{ scope.row.created.substring(0, 16) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" >
          <template slot-scope="scope">
            <div class="width110px tl mc">
              <el-tooltip placement="top"
                :content="showcaseData.length <= 1 ? '至少需要有一个精选内容' : '点击取消加精'">
                <lh-svg @click.native="setRelease(scope.row.id, 0)" icon-class="icon-love" class="ph4 fill-blue cp"></lh-svg>
              </el-tooltip>

              <router-link :to="'/market/c-pass/com?fieldId=' + scope.row.id" class="lh-table-btn">编辑</router-link>
              <span v-if="scope.$index !== 0" @click="setFirst(scope.row.id)" class="lh-table-btn">置顶</span>
              </div>
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
        <el-table-column label="标题" >
          <template slot-scope="scope">
            <router-link :to="'/market/c-pass/com?noAllow=true&fieldId=' + scope.row.id" class="table-link">{{ scope.row.title }}</router-link>
          </template>
        </el-table-column>

        <!-- @#注意：table内筛选记得加：prop="status" -->
        <el-table-column :label="sortFileName" prop="status"
          :filters="statusFilters"
          column-key="filterStatus"
          :filter-multiple="false"
          filter-placement="bottom-end"
          width="115">
          <template slot-scope="scope">
            <el-tag v-for="(item, idx) in statusFilters" :key="idx" v-if="scope.row.status === item.value" :type="item.type">{{ item.text }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="点击数" prop="pvCount" sortable ></el-table-column>
        <el-table-column label="添加日期" prop="created" >
          <template slot-scope="scope">
            {{ scope.row.created.substring(0, 16) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" >
          <template slot-scope="scope">
            <el-tooltip placement="top"
              :content="scope.row.status === 1 ? (showcaseData.length >= 3 ? '最多允许展示3个加精内容' : '点击进行加精') : '开放状态下才能加精'">
              <lh-svg @click.native="setRelease(scope.row.id, 1, scope.row.status)" icon-class="icon-love" class="ph4 fill-grayish cp"></lh-svg>
            </el-tooltip>

            <router-link :to="'/market/c-pass/com?fieldId=' + scope.row.id" class="lh-table-btn">编辑</router-link>
            <span @click="deleteField(scope.row.id)" class="lh-table-btn theme-gray">删除</span>

            <el-tooltip :content="scope.row.status === 1 ? '点击关闭精选' : '点击开启精选'" placement="top">
              <el-switch v-model="scope.row.status" @change="changeStatus(scope.row.id, scope.row.status)" class="lh-table-switch" :active-value="1" :inactive-value="0" :active-color="switchActiveColor"></el-switch>
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
</template>

<script>
import listMixins from './list.mixins'
import { cPassShowcaseList, cPassList, cPassDelWellChosen, cPassSetTop, cPassSetSelectionType, cPassSetReleaseType } from '@/service/market'

export default {
  mixins: [listMixins],
  components: {},
  mounted () {
    this.getShowCaseList()
    this.getPageData()
  },
  methods: {
    changeStatus(id, val) {
      let target = this.tableData.find(item => item.id === id)
      let ajaxParam = {
        selectionId: id,
        releaseType: val
      }
      if (val === 0) {
        this.$confirm('确认关闭该精选？', '提示', { type: 'warning' }).then(() => {
          this.handleSwitchStatus(ajaxParam)
        }).catch(() => {
          this.setMsg('已取消操作')
          target.status = 1
        })
      } else {
        this.handleSwitchStatus(ajaxParam)
      }
    },
    // 精选 开启/关闭
    handleSwitchStatus(ajaxParam) {
      cPassSetReleaseType(ajaxParam).then(res => {
        if (res.status === 'true') {
          this.setMsg('success', '修改成功')
        } else {
          this.setMsg('error', res.msg)
          this.getPageData()
        }
      })
    },
    /**
     * 加精和取精
     * @param {[Numer]} id       [场地id]
     * @param {[Number]} status   [是否加精]
     * @param {[Number]} released [是否发布]
     */
    setRelease(id, status, released) {
      if (!status && this.showcaseData.length <= 1) return
      if (status && this.showcaseData.length >= 3) return
      if (released === 0) return

      cPassSetSelectionType({
        selectionId: id,
        selectionType: status
      }).then(res => {
        if (res.status === 'true') {
          this.getShowCaseList()
          this.getPageData()
          this.setMsg('success', (status ? '加精成功' : '取消成功'))
        } else {
          this.setMsg('error', res.msg)
        }
      })
    },
    /**
     * 精选列表
     * @param  {[Number]} page [每次触发筛选条件，分页数重置为1]
     */
    getPageData(page) {
      this.currentPage = page || this.currentPage

      const ajaxParam = {
        pageSize: this.pageSize,
        pageNum: this.currentPage,
        releaseType: this.filterStatus,
        title: this.formDate.title
      }
      cPassList(ajaxParam).then(res => {
        if (res.status === 'true') {
          let resInfo = res.info
          if (resInfo) {
            this.pageTotal = resInfo.total
            this.tableData = resInfo.result
          }

          this.tableLoading = false
          if (this.tableData.length === 0) {
            this.tableEmpty = '暂无数据'
          }
        } else {
          this.tableLoading = false
          this.tableEmpty = '暂无数据'
          this.setMsg('error', res.msg)
        }
      })
    },
    // 置顶操作
    setFirst(id) {
      cPassSetTop({ selectionId: id }).then(res => {
        if (res.status === 'true') {
          this.getShowCaseList()
          this.setMsg('success', '置顶成功')
        } else {
          this.setMsg('error', res.msg)
        }
      })
    },
    // 删除精选
    deleteField(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', { type: 'warning' }).then(() => {
        cPassDelWellChosen({ selectionId: id }).then(res => {
          if (res.status === 'true') {
            this.getPageData()
            this.setMsg('success', '删除成功')
          } else {
            this.setMsg('已取消删除')
          }
        })
      }).catch(() => {
        this.setMsg('已取消删除')
      })
    },
    // table内状态筛选
    filterChange(filters) {
      if (filters.hasOwnProperty('filterStatus')) {
        // 全部
        if (filters['filterStatus'].length === 0) {
          this.sortFileName = '状态'
          this.filterStatus = null
          this.getPageData(1)
          return
        }

        for (let item of this.statusFilters) {
          if (filters['filterStatus'][0] === item.value) {
            this.sortFileName = item.text
            this.filterStatus = item.value
          }
        }

        this.getPageData(1)
      }
    },
    // 橱窗列表
    getShowCaseList() {
      cPassShowcaseList().then(res => {
        if (res.status === 'true') {
          this.showcaseData = res.info

          this.showcaseTableLoading = false
          if (this.showcaseData.length === 0) {
            this.showcaseTableEmpty = '暂无数据'
          }
        } else {
          this.showcaseTableEmpty = '暂无数据'
          this.showcaseTableLoading = false
          this.setMsg('error', res.msg)
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
@import "src/styles/config";
.page-market-c-pass {}
</style>
