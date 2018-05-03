<template>
  <div class="order-field">
    <lh-title></lh-title>

    <div class="content-body card-body">
      <el-form :model="formData" :inline="true" class="text-right mr-10">
        <el-form-item>
          <el-select
            v-model="formData.status"
            @change="getPageData"
            placeholder="请选择订单状态"
            class="width150px"
            clearable>
            <el-option
              v-for="item in statusList"
              :label="item.text"
              :value="item.val"
              :key="item.val"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-date-picker
            v-model="formData.orderDate"
            @change="getPageData"
            type="daterange"
            align="right"
            clearable
            start-placeholder="生成开始日期"
            end-placeholder="生成结束日期"
            placeholder="选择生成日期"
            :picker-options="pickerOptions"></el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-date-picker
            v-model="formData.bookDate"
            @change="getPageData"
            type="daterange"
            align="right"
            clearable
            start-placeholder="预定开始日期"
            end-placeholder="预定结束日期"
            placeholder="选择预定日期"
            :picker-options="pickerOptions"></el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-input
            v-model.trim="formData.name"
            @keyup.native.enter="getPageData"
            placeholder="请输入订单编号"
            class="width210px">

            <i slot="suffix" @click="getPageData" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-form-item>

        <el-form-item class="fr">
          <el-button @click="exportExcel" icon="el-icon-download" class="btn-green fr">导出表格</el-button>
        </el-form-item>
      </el-form>

      <el-table
        :data="tableData"
        :empty-text="tableEmpty"
        :slot="tableEmpty"
        v-loading="tableLoading"
        class="width100" border>

        <el-table-column label="订单编号" fixed="left" align="left">
          <template slot-scope="scope">
            <router-link
              :to="{path: '/order/field/detail', query: {id: scope.row.id}}"
              class="table-link">
              {{ scope.row.orderNum }}
            </router-link>
          </template>
        </el-table-column>

        <!--<el-table-column label="生成时间" :formatter="formatTime" align="left" width="155" sortable></el-table-column>-->
        <el-table-column label="生成时间" prop="created" align="left" width="155" sortable></el-table-column>

        <el-table-column label="场地类型" align="left">
          <template slot-scope="scope">
            <span v-if="scope.row.type === 3">工位</span>
            <span v-else>会议室</span>
          </template>
        </el-table-column>

        <el-table-column label="预约日期" prop="bookDate" align="left"></el-table-column>
        <el-table-column label="预约时段" prop="bookingPeriod" align="left" sortable sort-by="bookStartTime"></el-table-column>
        <el-table-column label="场地所属" prop="spaceName" align="left">
          <template slot-scope="scope">
            <span>{{ scope.row.spaceName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单总金额" prop="formatPrice" align="left" sortable sort-by="orderAmount"></el-table-column>

        <el-table-column label="支付状态" align="left">
          <template slot-scope="scope">
            <span v-if="scope.row.payStatus === 10">待支付</span>
            <span v-else-if="scope.row.payStatus === 20">已支付</span>
            <span v-else-if="scope.row.payStatus === 10">已退款</span>
            <span v-else>待退款</span>
          </template>
        </el-table-column>
        <el-table-column label="订单状态" align="left">
          <template slot-scope="scope">
            <span
              v-for="(item, index) in statusList" :key="index"
              v-if="scope.row.status === item.val">
              {{ item.text }}
            </span>
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
  import tableMixins from '@/mixins/table'
  import fieldMixins from './field.mixins'
  import option from '@/components/option'
  import pickerOptions from '@/mixins/pickerOptions'

  export default {
    mixins: [fieldMixins, tableMixins, pickerOptions],
    components: {
      [option.name]: option
    },
    data () {
      return {
      }
    },
    created () {
    },
    methods: {
    }
  }
</script>

<style lang="scss" scoped>
  @import "src/styles/config";
  .order-field {
  }
</style>
