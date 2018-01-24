<template>
  <el-table
    :data="tableData"
    :empty-text="tableEmpty"
    :slot="tableEmpty"
    v-loading="tableLoading"
    fit border class="width100">

    <el-table-column label="工号ID" prop="staffCode"></el-table-column>
    <el-table-column label="通行密码" prop="password"></el-table-column>

    <el-table-column label="指纹">
      <template slot-scope="scope">
        <el-tag v-if="scope.row.fingerprintCode === 1" type="success">已添加</el-tag>
        <el-tag v-else="scope.row.fingerprintCode === 2" type="info">未添加</el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { staffDetail } from '@/service/space/person'
export default {
  props: {
    id: { type: String },
    noAllow: { type: Boolean },
    type: {type: String, default: 'CN'}
  },
  data() {
    return {
      tableData: [],
      tableLoading: true,
      tableEmpty: ' '
    }
  },
  watch: {
    noAllow: {
      handler: function (val, oldVal) {
        this.getPageData()
      },
      immediate: true
    }
  },
  methods: {
    getPageData() {
      const self = this
      staffDetail({ userId: self.id }).then(res => {
        if (res.status === 'true') {
          self.tableData = res.info

          self.tableLoading = false
          if (!self.tableData || self.tableData.length === 0) {
            self.tableEmpty = '暂时无数据'
          }
        } else {
          self.tableLoading = false
          self.tableEmpty = '暂时无数据'
          self.setMsg('error', res.msg)
        }
      })
    }
  }
}
</script>
