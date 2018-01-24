<template>
  <div class="lh-name-list">
    <el-table
      :data="tableData"
      :empty-text="tableEmpty"
      :slot="tableEmpty"
      v-loading="tableLoading"
      class="width100" border>
      <el-table-column prop="companyName" label="企业名称"></el-table-column>
      <el-table-column prop="storeName" label="所属门店"></el-table-column>
      <el-table-column prop="companyContact" label="企业联系人"></el-table-column>
      <el-table-column prop="companyPhone" label="联系方式"></el-table-column>
      <el-table-column
        v-if="handleHasPermissions(['/manage/spaceKeeper/deleteCompany'])"
        prop="status"
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <span
            @click="deletePerson(scope.row.id)"
            class="pointer-theme-gray dib">解绑</span>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :total="pageTotal"
      :page-size="pageSize"
      :current-page="currentPage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[10, 20, 30, 40]"
      class="pagination-container"
      background></el-pagination>
  </div>
</template>

<script>
  import tableMixins from '@/config/mixins/table'
  import { formatTimeString } from '@/config/utils'
  import { byKeeper, deleteCompany } from '@/service/housekeeper'

  export default {
    mixins: [tableMixins],
    props: ['sidebarData', 'activeIndex', 'activeId'],
    data () {
      return {}
    },
    watch: {
      activeIndex: {
        handler: function (val, oldVal) {
          if (val > 0) {
            this.getPageData()
          }
        },
        immediate: true
      }
    },
    methods: {
      formatTime(time) {
        return formatTimeString(time)
      },
      deletePerson(id) {
        this.$confirm('确认解绑企业？', '', { type: 'warning' })
          .then(() => {
            deleteCompany({ id: id }).then(res => {
              if (res.status === 'true') {
                this.setMsg('success', '解绑成功!')
                this.getPageData()
              } else {
                this.setMsg('error', res.msg)
              }
            })
          })
          .catch(() => { this.setMsg('已取消解绑') });
      },
      getPageData() {
        byKeeper({
          spaceKeeperId: this.activeId,
          pageNum: this.currentPage,
          pageSize: this.pageSize
        }).then(res => {
          if (res.status === 'true') {
            let data = res.info
            if (data) {
              this.pageTotal = data.total
              this.tableData = data.result
            }

            this.tableLoading = false
            if (this.tableData.length === 0) {
              this.tableEmpty = '暂时无数据'
            }
          } else {
            this.tableEmpty = '暂时无数据'
            this.setMsg('error', res.msg)
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "src/styles/config";
  .lh-name-list {
    .data-statistics {
      margin-bottom: 20px;

      .statistics-item {
        height: 60px;
        line-height: 60px;
        text-align: center;
        border-radius: 4px;
        background-color: #eff2fc;
      }
    }
  }
</style>
