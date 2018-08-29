<template>
  <div class="page-market-banner">
    <lh-title />

    <el-form :inline="true" :model="formDate" class="lh-search-box" @submit.native.prevent>
      <router-link to="/market/banner/add" class="el-icon-circle-plus to-bottom-right lh-form-btn">&nbsp;添加banner</router-link>
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
        <el-table-column label="banner" width="240">
          <template slot-scope="scope">
            <img class="banner-img" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1535524151593&di=c72c6091d85e43484749de65b63664d4&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01c6d8577270370000012e7e30d877.jpg%401280w_1l_2o_100sh.jpg">
            <!--<router-link :to="'/market/c-pass/com?noAllow=true&fieldId=' + scope.row.id" class="table-link">{{ scope.row.title }}</router-link>-->
          </template>
        </el-table-column>
        <el-table-column label="标题" >
          <template slot-scope="scope">
            <router-link :to="'/market/banner/add'" class="table-link">新人礼包活动</router-link>
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
                :content="showcaseData.length <= 1 ? '至少需要有一个banner' : '点击取消加精'">
                <lh-svg @click.native="setRelease(scope.row.id, 0)" icon-class="icon-love" class="ph4 fill-blue cp"></lh-svg>
              </el-tooltip>

              <router-link :to="'/market/banner/add?fieldId=' + scope.row.id" class="lh-table-btn">编辑</router-link>
              <span v-if="scope.$index !== 0" @click="setFirst(scope.row.id)" class="lh-table-btn">置顶</span>
              </div>
          </template>
        </el-table-column>
      </el-table>

      <h3 class="lh-text-title mt24">首页banner列表</h3>
      <el-table
        :data="tableData"
        :empty-text="tableEmpty"
        :slot="tableEmpty"
        v-loading="tableLoading"
        class="width100" border>
        <el-table-column label="banner" width="240">
          <template slot-scope="scope">
            <img class="banner-img" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1535524151593&di=c72c6091d85e43484749de65b63664d4&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01c6d8577270370000012e7e30d877.jpg%401280w_1l_2o_100sh.jpg">
          </template>
        </el-table-column>
        <el-table-column label="标题" >
          <template slot-scope="scope">
            <router-link :to="'/market/banner/add?noAllow=true&fieldId=' + scope.row.id" class="table-link">{{ scope.row.title }}</router-link>
          </template>
        </el-table-column>
        <el-table-column label="状态" >
          <template slot-scope="scope">
            <el-tag>未发布</el-tag>
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
              :content="showcaseData.length >= 3 ? '最多允许展示3个加精内容' : '点击进行加精'">
              <lh-svg @click.native="setRelease(scope.row.id, 1)" icon-class="icon-love" class="ph4 fill-grayish cp"></lh-svg>
            </el-tooltip>

            <router-link :to="'/market/banner/add?fieldId=' + scope.row.id" class="lh-table-btn">编辑</router-link>
            <span @click="deleteField(scope.row.id)" class="lh-table-btn theme-gray">删除</span>
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
import { cPassShowcaseList, cPassList, cPassDelWellChosen, cPassSetTop, cPassSetSelectionType } from '@/service/market'

export default {
  mixins: [listMixins],
  components: {},
  mounted () {
    this.getShowCaseList()
    this.getPageData()
  },
  methods: {
    /**
     * 加精和取精
     * @param {[Numer]} id       [场地id]
     * @param {[Number]} status   [是否加精]
     */
    setRelease(id, status) {
      if (status && this.showcaseData.length >= 3) return

      this.$confirm(status ? '确认后将推送到活动新人限时抢展示, 是否继续?' : '确认后取消在活动展示, 是否继续?', '提示', { type: 'warning' }).then(() => {
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
      }).catch(() => {
        this.setMsg('已取消删除')
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
      this.$confirm('此操作将永久删除该banner, 是否继续?', '提示', { type: 'warning' }).then(() => {
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
.page-market-banner {
  .banner-img{
    display: block;
    width: 200px;
    height: 76px;
    margin: 0 auto;
  }
}
</style>
