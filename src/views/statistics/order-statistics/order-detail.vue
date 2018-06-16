<template>
  <div class="order-detail">
    <lh-title title="X月X日订单明细"/>

    <div class="card-padding">
      <el-row class="mb16" :gutter="20">
        <el-col :span="6">
          <span class="mr12">场地类型</span>
          <el-select v-model="fieldType" placeholder="全部" clearable class="width100px" @change="getPageData(1)">
            <el-option
              v-for="item in fieldTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <span class="mr12">订单类型</span>
          <el-select v-model="orderType" placeholder="全部" clearable class="width100px" @change="getPageData(1)">
            <el-option
              v-for="item in orderTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-table :data="tableData" :empty-text="tableEmpty" :slot="tableEmpty" v-loading="tableLoading" border style="width: 100%">
        <el-table-column label="单号" prop="contactTel" align="left" ></el-table-column>
        <el-table-column label="下单时间" prop="moduleName" align="left"></el-table-column>
        <el-table-column label="下单会员" prop="contact" align="left"></el-table-column>
        <el-table-column label="联系人" prop="contactTel" align="left" ></el-table-column>
        <el-table-column label="联系方式" prop="contactTel" align="left"></el-table-column>
        <el-table-column label="场地" prop="contactTel" align="left"></el-table-column>
        <el-table-column label="使用时间" prop="contactTel" align="left"></el-table-column>
        <el-table-column label="使用时长" prop="contactTel" align="left"></el-table-column>
        <el-table-column label="订单原价" prop="contactTel" align="left"></el-table-column>
        <el-table-column label="订单折扣" prop="contactTel" align="left"></el-table-column>
        <el-table-column label="实付金额" prop="contactTel" align="left"></el-table-column>
        <el-table-column label="订单状态" prop="contactTel" align="left"></el-table-column>
        <el-table-column label="优惠券使用情况" prop="contactTel" width="120" align="left"></el-table-column>
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
  export default {
    mixins: [tableMixins],
    data () {
      return {
        fieldType: '',
        fieldTypeList: [{
          value: '1',
          label: '会议室'
        }, {
          value: '2',
          label: '多功能场地'
        }],
        orderType: '',
        orderTypeList: [{
          value: '1',
          label: '待使用'
        }, {
          value: '2',
          label: '已使用'
        }]
      }
    },
    methods: {
      getPageData(page) {
        this.currentPage = page || this.currentPage
        console.log('C-PASS-order')
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>
