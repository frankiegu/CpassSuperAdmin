<template>
  <div class="service-list main-content">
    <lh-title></lh-title>

    <div class="card-padding">
      <el-form :model="formData" :inline="true" class="text-right mr-10">

        <router-link :to="{path: '/product/add'}">
          <div class="to-bottom-right fl add-btn">新增版本</div>
        </router-link>

        <el-form-item>
          <el-input
            v-model.trim="formData.name"
            @keyup.native.enter="getPageData(1)"
            placeholder="请输入版本名称"
            class="width200px">

            <i slot="suffix" @click="getPageData(1)" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-form-item>

      </el-form>

      <el-table
        :data="tableData"
        :empty-text="tableEmpty"
        :slot="tableEmpty"
        v-loading="tableLoading"
        border
        style="width: 100%">

        <el-table-column label="版本名称" prop="name" align="left">
          <template slot-scope="scope">
            {{ scope.row.name }}
            <!--<router-link-->
              <!--:to="{path: '/activity/detail', query: {id: scope.row.id}}"-->
              <!--class="table-link">-->
              <!--{{ scope.row.name }}-->
            <!--</router-link>-->
          </template>
        </el-table-column>
        <el-table-column label="包含功能" prop="type" align="left" min-width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.type === 1">普通活动</span>
            <span v-if="scope.row.type === 2">互动活动</span>
          </template>
        </el-table-column>
        <el-table-column label="售价" prop="startDate" align="left" width="120"></el-table-column>
        <el-table-column label="签约数量" prop="endDate" align="left" width="120"></el-table-column>
        <el-table-column label="可用状态" align="left" width="120">
          <template slot-scope="scope">
            <el-tag type="success" v-if="true">可用</el-tag>
            <el-tag type="danger" v-if="false">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="描述" prop="startDate" align="left"></el-table-column>


        <el-table-column label="操作" align="left" width="120">
          <template slot-scope="scope">
            <router-link :to="{path: '/product/add', query: {id: scope.row.id, type: 'edit'}}">
              <el-button type="text" class="operate-btn">编辑</el-button>
            </router-link>

            <span>
              <el-button type="text"
                         @click="disable(scope.row.id, 0)"
                         class="operate-btn">禁用</el-button>
              <el-button type="text"
                         v-if="false"
                         @click="restore(scope.row.id, 1)"
                         class="operate-btn">恢复</el-button>
            </span>
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
