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
        <el-table-column label="包含功能" align="left" min-width="150">
          <template slot-scope="scope">
            <span v-for="(item, index) in scope.row.permisList">{{ item }}<span v-if="index < scope.row.permisList.length - 1">、</span></span>
          </template>
        </el-table-column>
        <el-table-column label="售价" align="left" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.price">{{ scope.row.price.toFixed(2) }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="签约数量" align="left" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.signingAccount || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="可用状态" align="left" width="120">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.status === 1">可用</el-tag>
            <el-tag type="danger" v-if="scope.row.status === 0">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="描述" prop="description" align="left" min-width="100"></el-table-column>


        <el-table-column label="操作" align="left" width="120">
          <template slot-scope="scope">
            <router-link :to="{path: '/product/add', query: {id: scope.row.id, type: 'edit'}}">
              <el-button type="text" class="operate-btn">编辑</el-button>
            </router-link>

            <span>
              <el-button type="text"
                         v-if="scope.row.status === 1"
                         @click="disable(scope.row.id, 0)"
                         class="operate-btn">禁用</el-button>
              <el-button type="text"
                         v-if="scope.row.status === 0"
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
