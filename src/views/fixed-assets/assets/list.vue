<template>
  <div class="fixed-assets-list">
    <div class="page-title"><h1>固定资产管理</h1></div>

    <div class="card-padding">
      <!-- 查询筛选 -->
      <el-form :inline="true" :model="assetsSort" class="sort-form-bar" @submit.native.prevent>
        <router-link
          v-permissions="'/manage/fixAssert/add'"
          class="btn-link fl el-icon-circle-plus"
          to="/fixed/assets/detail?type=add">&nbsp;添加固资</router-link>

        <router-link
          v-permissions="'/manage/fixAssert/recordAssert'"
          class="btn-link fl"
          to="/fixed/assets/register">固资登记</router-link>

        <el-form-item>
          <el-input
            class="width220px"
            v-model.trim="assetsSort.name"
            placeholder="请输入固资名称"
            @keyup.native.enter="findAssetsList">
            <i slot="suffix" @click="findAssetsList" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-form-item>
      </el-form>

      <!-- 固资列表 -->
      <el-table :data="assetsTable" v-loading="tableLoading" border>
        <el-table-column label="固资主图" prop="assertLogo">
          <template slot-scope="scope">
            <div class="table-img">
              <img :src="scope.row.assertLogo + zoomImgSize()" alt="">
            </div>
          </template>
        </el-table-column>

        <el-table-column label="固资编号" prop="assertCode"></el-table-column>

        <el-table-column label="名称" prop="assertName">
          <template slot-scope="scope">
            <router-link class="table-link" :to="'/fixed/assets/detail?id=' + scope.row.id">{{scope.row.assertName}}</router-link>
          </template>
        </el-table-column>

        <el-table-column label="规格型号" prop="assertType"></el-table-column>

        <el-table-column label="操作" v-if="handleHasPermissions(['/manage/fixAssert/edit', '/manage/fixAssert/delete'])">
          <template slot-scope="scope">
            <router-link
              v-permissions="'/manage/fixAssert/edit'"
              :to="'/fixed/assets/detail?type=edit&id=' + scope.row.id"
              class="table-link">编辑</router-link>
            <span
              v-permissions="'/manage/fixAssert/delete'"
              class="table-link theme-gray"
              @click="handleDelAssets(scope.row.id, scope.row.assertName)">删除</span>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <el-pagination
        background
        class="pagination-container"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageTotal">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import handleHasPermissions from '@/config/com-mixins'
  import {listFixAssert, deleteFixAssert} from '@/service'

  export default {
    name: 'list',
    mixins: [handleHasPermissions],
    data () {
      return {
        tableLoading: true,
        assetsSort: {
          name: ''
        },
        assetsTable: [],
        currentPage: 1,
        pageSize: 10,
        pageTotal: 0
      }
    },
    props: {},
    components: {},
    mounted () {
      this.findAssetsList()
    },
    watch: {},
    computed: {},
    filters: {},
    methods: {
      // 查询固资列表
      findAssetsList() {
        let obj = {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          name: this.assetsSort.name
        }
        listFixAssert(obj).then(res => {
          if (res.status === 'true') {
            this.tableLoading = false
            this.pageTotal = res.info.total
            this.assetsTable = res.info.result
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      // 删除固资
      handleDelAssets(id, name) {
        let h = this.$createElement
        this.$confirm(h('span', null, ['确认删除', h('i', null, name), ' 吗？']), '确认删除？', {
          lockScroll: false
        }).then(_ => {
          deleteFixAssert({
            assertId: id
          }).then(res => {
            if (res.status === 'true') {
              this.$message.success('删除成功！')
              this.findAssetsList()
            }
          })
        }).catch(_ => {
          this.$message.info('已取消操作')
        })
      },

      // 分页器事件
      handleSizeChange(val) {
        this.pageSize = val
        this.findAssetsList()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.findAssetsList()
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../styles/config";
  .fixed-assets-list {
    .table-link + .table-link {
      margin-left: 6px;
    }
  }
</style>
