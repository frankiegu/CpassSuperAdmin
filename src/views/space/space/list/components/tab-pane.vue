<template>
  <div class="space-list-tabpane">
    <el-table
      :data="tableData"
      :slot="tableEmpty"
      :empty-text="tableEmpty"
      v-loading="tableLoading"
      class="width100" border>

      <el-table-column size="small" :label="fieldType === '3' ? '工位主图' : '场地主图'">
        <template slot-scope="scope">
          <div class="table-img">
            <img :src="scope.row.img + zoomImgSize()">
          </div>
        </template>
      </el-table-column>

      <el-table-column :label="fieldType === '3' ? '工位名称' : '场地名称'">
        <template slot-scope="scope">
          <router-link class="table-link" :to="'/space/add?noAllow=1&id=' + scope.row.id">
            {{ scope.row.fieldName }}</router-link></template></el-table-column>

      <el-table-column label="所属门店" prop="storeName"></el-table-column>
      <el-table-column label="门店状态">
        <template slot-scope="scope">
          <span v-if="scope.row.storeStatus === 1">营业中</span>
          <span v-else>未营业</span>
        </template>
      </el-table-column>

      <el-table-column label="费用" :formatter="formatterPrice"></el-table-column>
      <el-table-column label="预约情况">
        <template slot-scope="scope">
          <span v-if="fieldType === '3'">{{ scope.row.useNum || 0 }} / {{ scope.row.stationNum }}</span>

          <router-link
            v-else
            :to="{path: '/space/detail', query: {fieldId: scope.row.id, date: formFilter.date}}"
            class="table-link">
            <span v-if="scope.row.useRate === 0">空</span>
            <span v-else-if="scope.row.useRate === 100">满</span>
            <span v-else>部</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column label="当日状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.businessStatus === 1" type="success">开放</el-tag>
          <el-tag v-else="scope.row.businessStatus === 0" type="danger">关闭</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        v-if="handleHasPermissions(['/manage/field/getFieldBusinessStatus', '/manage/field/findFieldDetail', '/manage/field/delete'])"
        width="140"
        label="操作">
        <template slot-scope="scope">
          <span
            v-if="handleHasPermissions('/manage/field/getFieldBusinessStatus')"
            class="pointer-theme-blue dib"
            @click="setFlatpickr(scope.row.id)">排期</span>

          <router-link
            v-if="handleHasPermissions('/manage/field/findFieldDetail')"
            :to="'/space/add?id=' + scope.row.id"
            class="table-link margin-lr6">编辑</router-link>

          <span
            v-if="handleHasPermissions('/manage/field/delete')"
            @click="deleteSpace(scope.row.id)"
            class="pointer-theme-gray dib">删除</span>
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
  import { fieldList } from '@/service'
  import tableMixins from '@/config/mixins/table'
  import { formatTimeString } from '@/config/utils'
  export default {
    mixins: [tableMixins],
    props: ['fieldType', 'formFilter'],
    data() {
      return {}
    },
    watch: {
      fieldType: {
        handler: function (val, oldVal) {
          this.getPageData()
        },
        immediate: true
      }
    },
    mounted() {
      this.getPageData()
    },
    methods: {
      formatterPrice(row, column) {
        return (row.dateHourPrice ? row.dateHourPrice : row.hourPrice) + '元/天'
      },
      getPageData() {
        let formFilter = this.formFilter
        const paramsObj = {
          pageSize: this.pageSize,
          pageNum: this.currentPage,
          storeId: formFilter.storeId,
          fieldType: this.fieldType,
          businessStatus: formFilter.businessStatus,
          date: formFilter.date ? formatTimeString(formFilter.date) : null
        }

        fieldList(paramsObj).then(res => {
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
      },
      setFlatpickr(id) {
        this.$emit('setFlatpickr', id)
      },
      deleteSpace(id) {
        this.$emit('deleteSpace', id)
      }
    }
  }
</script>
