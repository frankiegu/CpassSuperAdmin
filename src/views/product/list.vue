<template>
  <div class="service-list main-content">
    <lh-title></lh-title>

    <div class="lh-form-box">
      <!-- 查询筛选 -->
      <el-form :model="formData" :inline="true" class="sort-form-bar">

        <router-link
          v-if="handleHasPermissions('/supervisor/product/save')"
          :to="'/product/add'"
          class="fl">
          <el-button class="el-icon-circle-plus to-bottom-right add-btn"> 新增版本</el-button>
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
    </div>

    <div class="card-padding">
     <el-table
        :data="tableData"
        :empty-text="tableEmpty"
        :slot="tableEmpty"
        v-loading="tableLoading"
        border
        style="width: 100%">

        <el-table-column label="版本名称" prop="name" align="left">
          <template slot-scope="scope">
            {{ scope.row.name || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="包含功能" align="left" min-width="150">
          <template slot-scope="scope">
            <span v-for="(item, index) in scope.row.permisList">{{ item }}<span v-if="index < scope.row.permisList.length - 1">、</span></span>
            <span v-if="!scope.row.permisList || scope.row.permisList === null">-</span>
          </template>
        </el-table-column>
        <el-table-column label="售价" align="left" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.price">{{ parseFloat((scope.row.price / 100).toPrecision(12)).toFixed(2) }}</span>
            <span v-else>0.00</span>
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
        <el-table-column label="描述" prop="description" align="left" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.description || '-' }}</span>
          </template>
        </el-table-column>


        <el-table-column label="操作" align="left" width="120" v-if="handleHasPermissions(['/supervisor/product/update', '/supervisor/product/open', '/supervisor/product/close'])">
          <template slot-scope="scope">
            <router-link :to="{path: '/product/add', query: {id: scope.row.id, type: 'edit'}}" v-if="handleHasPermissions('/supervisor/product/update') && scope.row.id !== 1 && scope.row.status">
              <el-button type="text" class="operate-btn">编辑</el-button>
            </router-link>

            <el-tooltip :content="scope.row.status === 1 ? '点击禁用' : '点击恢复'" placement="top" v-if="handleHasPermissions(['/supervisor/product/open', '/supervisor/product/close']) && scope.row.id !== 1" :class="{'ml48': scope.row.status === 0}">
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
    .ml48{
      margin-left: 48px;
    }
  }
</style>
<style>
  /*根据ui设计稿修改element样式*/
  .el-message-box__content{
    margin-bottom: 35px;
  }
  .el-message-box__status{
    margin-left: 20px;
  }
  .el-message-box__message{
    font-size:16px;
    font-family:PingFangSC-Medium;
    font-weight:500;
    color:rgba(51,51,51,1);
    line-height:22px;
    margin-left: 20px;
  }
</style>
