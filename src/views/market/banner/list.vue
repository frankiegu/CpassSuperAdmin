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
            <img class="banner-img" :src="scope.row.imgUrl">
          </template>
        </el-table-column>
        <el-table-column label="标题" >
          <template slot-scope="scope">
            <router-link :to="'/market/banner/add?noAllow=true&bannerId=' + scope.row.id" class="table-link">{{ scope.row.title }}</router-link>
          </template>
        </el-table-column>
        <el-table-column label="状态" >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0" type="info">未发布</el-tag>
            <el-tag v-if="scope.row.status === 1" type="success">展示中</el-tag>
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
                :content="'点击取消展示'">
                <lh-svg @click.native="setRelease(scope.row.id, 0)" icon-class="icon-love" class="ph4 fill-blue cp"></lh-svg>
              </el-tooltip>

              <router-link :to="'/market/banner/add?bannerId=' + scope.row.id" class="lh-table-btn">编辑</router-link>
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
            <img class="banner-img" :src="scope.row.imgUrl">
          </template>
        </el-table-column>
        <el-table-column label="标题" >
          <template slot-scope="scope">
            <router-link :to="'/market/banner/add?noAllow=true&bannerId=' + scope.row.id" class="table-link">{{ scope.row.title }}</router-link>
          </template>
        </el-table-column>
        <el-table-column label="状态" >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0" type="info">未发布</el-tag>
            <el-tag v-if="scope.row.status === 1" type="success">展示中</el-tag>
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
              :content="showcaseData.length >= 3 ? '最多允许展示3个banner' : '点击展示banner'">
              <lh-svg @click.native="setRelease(scope.row.id, 1)" icon-class="icon-love" class="ph4 fill-grayish cp"></lh-svg>
            </el-tooltip>

            <router-link :to="'/market/banner/add?bannerId=' + scope.row.id" class="lh-table-btn">编辑</router-link>
            <span @click="deleteBanner(scope.row.id)" class="lh-table-btn theme-gray">删除</span>
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

export default {
  mixins: [listMixins],
  components: {},
  mounted () {
  },
  methods: {
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
