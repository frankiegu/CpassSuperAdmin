<template>
  <div class="role-list main-content">
    <lh-title title="角色设置"></lh-title>

    <div class="lh-form-box">
      <el-form :model="formData" :inline="true" class="text-right mr-10" @submit.native.prevent>
        <router-link
          v-if="handleHasPermissions('/supervisor/role/add')"
          class="fl el-icon-circle-plus to-bottom-right"
          to="/user-management/role/com?type=add" tag="a">
          &nbsp;新增角色
        </router-link>

        <el-form-item>
          <el-input
            v-model.trim="formData.roleName"
            @keyup.native.enter="getPageData(1)"
            placeholder="请输入角色名称"
            class="lh-form-input">

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
        class="width100" border>

        <el-table-column label="角色名称" prop="roleName" align="center"></el-table-column>
        <el-table-column label="已分配用户" prop="adminUserCount" align="center" width="100">
          <template slot-scope="scope">
            {{scope.row.adminUserCount}}
          </template>
        </el-table-column>
        <el-table-column label="可用状态" prop="status" align="center" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 1" type="success" size="mini">可用</el-tag>
            <el-tag v-else type="danger" size="mini">不可用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="描述" prop="roleDesc" align="left">
          <template slot-scope="scope">
            {{scope.row.roleDesc || '-'}}
          </template>
        </el-table-column>
        <el-table-column
          v-if="handleHasPermissions([
          '/supervisor/role/update',
          '/supervisor/role/close',
          '/supervisor/role/delete'])"
          label="操作"
          align="center">
          <template slot-scope="scope">
            <router-link
              v-if="handleHasPermissions('/supervisor/role/update')"
              :to="{path: '/user-management/role/com', query: {type: 'edit', id: scope.row.id}}"
              tag="a"
              class="table-link mr10">
              <el-button type="text">编辑</el-button>
            </router-link>
            <el-button v-if="handleHasPermissions('/supervisor/role/close') && scope.row.status === 1" type="text" @click="handleChangeUseState(1, scope.row)">禁用</el-button>
            <el-button v-else-if="handleHasPermissions('/supervisor/role/open')" type="text" @click="handleChangeUseState(2, scope.row)">恢复</el-button>
            <el-button v-if="handleHasPermissions('/supervisor/role/delete')" type="text" @click="handleChangeUseState(3, scope.row)">删除</el-button>
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
  import tableMixins from '@/mixins/table'
  import indexMixins from './index.mixins'
  export default {
    mixins: [tableMixins, indexMixins],
    data () {
      return {
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
