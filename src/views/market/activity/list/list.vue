<template>
  <div class="service-list main-content">
    <lh-title></lh-title>

    <div class="card-padding">
      <el-form :model="formData" :inline="true" class="text-right mr-10">

        <router-link :to="{path: '/activity/add'}">
          <div class="to-bottom-right fl add-btn">添加活动</div>
        </router-link>

        <el-form-item>
          <el-input
            v-model.trim="formData.name"
            @keyup.native.enter="getPageData(1)"
            placeholder="请输入活动名称"
            class="width200px">

            <i slot="suffix" @click="getPageData(1)" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-form-item>

        <el-select
          v-model="formData.type"
          @change="getPageData(1)"
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
          @change="getPageData(1)"
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

      <el-table
        :data="tableData"
        :empty-text="tableEmpty"
        :slot="tableEmpty"
        v-loading="tableLoading"
        @sort-change="change"
        border
        style="width: 100%">

        <el-table-column label="活动ID" prop="code" align="left"></el-table-column>
        <el-table-column label="活动名称" prop="name" align="left">
          <template slot-scope="scope">
            <router-link
              :to="{path: '/activity/detail', query: {activityId: scope.row.id}}"
              class="table-link">
              {{ scope.row.name }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="活动类型" prop="type" align="left">
          <template slot-scope="scope">
            <span v-if="scope.row.type === 1">普通活动</span>
            <span v-if="scope.row.type === 2">互动活动</span>
          </template>
        </el-table-column>
        <el-table-column label="活动开始时间" prop="startDate" align="left" sortable="custom"></el-table-column>
        <el-table-column label="活动结束时间" prop="endDate" align="left" sortable="custom"></el-table-column>
        <el-table-column label="活动状态" align="left">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0">未发布</span>
            <span v-if="scope.row.status === 1">未开始</span>
            <span v-if="scope.row.status === 2">进行中</span>
            <span v-if="scope.row.status === 3">已结束</span>
            <span v-if="scope.row.status === 4">暂停</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="left">
          <template slot-scope="scope">
            <router-link :to="{path: '/activity/add', query: {activityId: scope.row.id, type: 'edit'}}">
              <el-button type="text" v-if="scope.row.status === 1 || scope.row.status === 2 || scope.row.status === 4 || scope.row.status === 0"
                class="operate-btn">编辑</el-button>
            </router-link>

            <router-link :to="{path: '/activity/add', query: {activityId: scope.row.id, type: 'copy'}}">
              <el-button type="text"
                         class="operate-btn" :class="{'ml45' : scope.row.status === 3 }">复制</el-button>
            </router-link>
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
  import activityList from './list.mixins'
  export default {
    mixins: [activityList],
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
    .ml45{
      margin-left: 45px;
    }
  }
</style>
