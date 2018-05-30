<template>
  <div class="service-list main-content">
    <lh-title></lh-title>

    <div class="card-padding">
      <el-form :model="formData" :inline="true" class="text-right mr-10">

        <router-link to="/activity/add">
          <div class="to-bottom-right fl add-btn">添加活动</div>
        </router-link>

        <el-form-item>
          <el-input
            v-model.trim="formData.name"
            @keyup.native.enter="getPageData"
            placeholder="请输入活动名称"
            class="width200px">

            <i slot="suffix" @click="getPageData" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-form-item>

        <el-select
          v-model="formData.type"
          filterable
          placeholder="请选择类型"
          class="width150px"
          clearable>
          <el-option
            v-for="item in typeList"
            :label="item.text"
            :value="item.val"
            :key="item.val"></el-option>
        </el-select>

        <el-select
          v-model="formData.status"
          filterable
          placeholder="请选择活动状态"
          class="width150px"
          clearable>
          <el-option
            v-for="item in statusList"
            :label="item.text"
            :value="item.val"
            :key="item.val"></el-option>
        </el-select>

      </el-form>

      <el-table :data="tableData" :empty-text="tableEmpty" :slot="tableEmpty" v-loading="tableLoading" border
        style="width: 100%">

        <el-table-column label="活动ID" prop="name" align="left"></el-table-column>
        <el-table-column label="活动名称" prop="name" align="left">
          <template slot-scope="scope">
            <router-link
              :to="{path: '/activity/detail', query: {id: 3210}}"
              class="table-link">
              {{ scope.row.name }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="活动类型" prop="price"></el-table-column>
        <el-table-column label="活动开始时间" prop="providerName" align="left" sortable sort-by="created"></el-table-column>
        <el-table-column label="活动结束时间" prop="providerName" align="left" sortable sort-by="created"></el-table-column>
        <el-table-column label="活动状态">
          <template slot-scope="scope">
            <span v-if="scope.row.type === 1">未发布</span>
            <span v-if="scope.row.type === 2">未开始</span>
            <span v-if="scope.row.type === 3">进行中</span>
            <span v-if="scope.row.type === 4">已结束</span>
            <span v-if="scope.row.type === 5">暂停</span>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" v-if="scope.row.statusCode === 1"
              class="operate-btn">编辑</el-button>

            <el-button type="text" v-if="scope.row.statusCode === 1"
                       class="operate-btn">复制</el-button>
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
  import serviceList from './list.mixins'
  export default {
    mixins: [serviceList],
    data() {
      return {
      }
    },
    methods: {
    }
  }
</script>

<style lang="scss" scoped>
  @import "src/styles/config";
  .service-list {
    .add-btn{
      padding: 0px 20px;
      line-height: 32px;
      color: #fff;
      cursor: pointer;
    }
    .operate-btn {
      padding: 6px;
    }
  }
</style>
