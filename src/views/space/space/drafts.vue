<template>
  <div class="space-draft">
    <div class="page-title"> <h1>场地草稿箱</h1> </div>

    <div class="store-setting card-padding">
      <el-table
        :data="tableData"
        :empty-text="tableEmpty"
        :slot="tableEmpty"
        v-loading="tableLoading"
        class="width100" border>

        <el-table-column label="场地主图">
          <template slot-scope="scope">
            <div class="table-img">
              <img :src="scope.row.img + zoomImgSize()">
            </div>
          </template>
        </el-table-column>

        <el-table-column label="场地名称" prop="fieldName"></el-table-column>
        <el-table-column label="场地类型">
          <template slot-scope="scope">
            <span v-if="scope.row.type === 1">会议室</span>
            <span v-else>工位</span>
          </template>
        </el-table-column>

        <el-table-column label="所属门店" prop="storeName"></el-table-column>
        <el-table-column
          v-if="handleHasPermissions(['/manage/field/findFieldDetail', '/manage/field/delete'])"
          label="操作">

          <template slot-scope="scope">
            <router-link
              v-if="handleHasPermissions('/manage/field/findFieldDetail')"
              :to="'/space/add?id=' + scope.row.id + '&type=saveDraftTip'"
              class="table-link" >

              <span class="pointer-theme-blue dib">编辑</span>
            </router-link>

            <span
              v-if="handleHasPermissions('/manage/field/delete')"
              @click="deleteSpace(scope.row.id)"
              class="theme-gray dib ml15">删除</span>
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
  </div>
</template>

<script>
  import tableMixins from '@/config/mixins/table'
  import { draftBox, fieldDelete } from '@/service'
  export default {
    mixins: [tableMixins],
    data () {
      return {}
    },
    mounted () {
      this.getPageData()
    },
    methods: {
      deleteSpace (id) {
        this.$confirm('确定删除？删除场地不会影响已生成的订单', '提示', { type: 'warning' }).then(() => {
          fieldDelete({ fieldId: id }).then(res => {
            if (res.status === 'true') {
              this.getPageData()
              this.setMsg('success', '删除成功!')
            } else {
              this.setMsg('error', res.msg)
            }
          })
        }).catch(() => {
          this.setMsg('已取消删除!')
        });
      },
      getPageData () {
        draftBox({
          pageNum: this.currentPage,
          pageSize: this.pageSize
        }).then(res => {
          if (res.status === 'true') {
            let data = res.info
            this.pageTotal = data.total
            this.tableData = data.result

            this.tableLoading = false
            if (this.tableData.length === 0) {
              this.tableEmpty = '暂时无数据'
            }
          } else {
            this.setMsg('error', res.msg)
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .space-draft {
    // 删除按钮
    .theme-gray.dib {
      cursor: pointer;
    }
  }
</style>
