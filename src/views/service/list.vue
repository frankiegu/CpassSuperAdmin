<template>
  <div class="service-list main-content">
    <lh-title></lh-title>

    <div class="card-padding">
      <el-table :data="tableData" :empty-text="tableEmpty" :slot="tableEmpty" v-loading="tableLoading" border
        style="width: 100%">
        <el-table-column label="主图">
          <template slot-scope="scope">
            <div class="table-img">
              <img :src="scope.row.imgPath + zoomImgSize()" alt="">
            </div>
          </template>
        </el-table-column>

        <el-table-column label="服务名称" prop="name" align="left"></el-table-column>
        <el-table-column label="价格" prop="price"></el-table-column>
        <el-table-column label="供应商名称" prop="providerName" align="left" ></el-table-column>

        <el-table-column label="服务类型">
          <template slot-scope="scope">
            <span v-if="scope.row.type === 1">工商注册</span>
            <span v-if="scope.row.type === 2">财税服务</span>
            <span v-if="scope.row.type === 3">法律服务</span>
            <span v-if="scope.row.type === 4">网站建设</span>
            <span v-if="scope.row.type === 5">人资社保</span>
            <span v-if="scope.row.type === 6">市场媒体</span>
            <span v-if="scope.row.type === 7">其他</span>
          </template>
        </el-table-column>

        <el-table-column label="开放状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isPermitOpen === 1" type="success">开启</el-tag>
            <el-tag v-else type="danger">关闭</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="handleSetTop(scope.row.id)" v-if="scope.row.statusCode === 1"
              class="operate-btn">置顶</el-button>
            <el-tooltip :content="scope.row.isPermitOpen === 1 ? '关闭将不在小程序服务列表展示' : '开启将展示在小程序服务列表'"
              placement="top" style="margin-top: -5px">
              <el-switch
                v-model="scope.row.isPermitOpen"
                :active-value="1"
                :inactive-value="0"
                :active-color="switchActiveColor"
                @change="handleUpdateStatus(scope.row.id, scope.row.isPermitOpen)"></el-switch>
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
  @import "../../../src/styles/config";
  .service-list {
    .operate-btn {
      padding: 6px;
    }
  }
</style>
