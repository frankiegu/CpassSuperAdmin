<template>
  <div class="order-field">
    <lh-title></lh-title>

    <div class="card-padding">
      <el-form class="text-right mr-10" :model="formData" :inline="true" @submit.native.prevent>

        <el-form-item>
          <lh-datePicker label="生成日期" :dateType="1" :optionType="true" @datePickerChange="datePickerChange"></lh-datePicker>
        </el-form-item>

        <el-form-item>
          <lh-datePicker label="预约日期" :dateType="2" @datePickerChange="datePickerChange"></lh-datePicker>
        </el-form-item>

        <el-form-item>
          <el-select
            v-model="formData.status"
            @change="getPageData(1)"
            placeholder="订单状态"
            class="width120px"
            clearable>
            <el-option
              v-for="item in statusList"
              :label="item.text"
              :value="item.val"
              :key="item.val"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-select
            v-model="formData.couponUse"
            @change="getPageData(1)"
            placeholder="是否使用优惠券"
            class="width140px"
            clearable>
            <el-option
              v-for="item in couponUseList"
              :label="item.text"
              :value="item.val"
              :key="item.val"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-select
            v-model="formData.couponStatus"
            @change="getPageData(1)"
            placeholder="优惠券类型"
            class="width140px"
            clearable>
            <el-option
              v-for="item in couponStatusList"
              :label="item.text"
              :value="item.val"
              :key="item.val"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-input
            v-model.trim="formData.name"
            @keyup.native.enter="getPageData(1)"
            placeholder="请输入订单编号"
            class="width180px">

            <i slot="suffix" @click="getPageData(1)" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button @click="exportExcel" class="lh-btn-export">
            <lh-svg icon-class="icon-download" />导出
          </el-button>
        </el-form-item>
      </el-form>

      <el-table
        :data="tableData"
        :empty-text="tableEmpty"
        :slot="tableEmpty"
        v-loading="tableLoading"
        @sort-change="change"
        class="width100" border>

        <el-table-column label="订单编号" fixed="left" align="left" width="140">
          <template slot-scope="scope">
            <router-link
              :to="{path: '/field/order/detail', query: {id: scope.row.platformOrderId}}"
              class="table-link">
              {{ scope.row.orderNum }}
            </router-link>
          </template>
        </el-table-column>

        <!--<el-table-column label="生成时间" :formatter="formatTime" align="left" width="155" sortable></el-table-column>-->
        <el-table-column label="生成时间" prop="created" align="left" width="155" sortable="custom"></el-table-column>

        <el-table-column label="场地类型" prop="typeText" align="left"></el-table-column>

        <el-table-column label="预约日期" prop="bookDate" align="left"></el-table-column>
        <el-table-column label="预约时段" prop="bookingPeriod" align="left" sortable="custom"></el-table-column>
        <el-table-column label="场地所属" prop="storeName" align="left">
          <template slot-scope="scope">
            <span>{{ scope.row.storeName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单总金额" prop="formatPrice" align="left" sortable="custom" width="116"></el-table-column>
        <el-table-column label="是否使用优惠券" prop="isUseCouponText" align="left"></el-table-column>
        <el-table-column label="优惠券类型" prop="couponTypeText" align="left"></el-table-column>

        <el-table-column label="支付状态" align="left">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.payStatus === 10">待支付</el-tag>
            <el-tag v-else-if="scope.row.payStatus === 20" type="success">已支付</el-tag>
            <el-tag v-else-if="scope.row.payStatus === 30" type="warning">已退款</el-tag>
            <el-tag v-else >待退款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="订单状态" align="left">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 5" type="warning">未支付</el-tag>
            <el-tag v-else-if="scope.row.status === 10" type="success">未使用</el-tag>
            <el-tag v-else-if="scope.row.status === 20" type="success">已使用</el-tag>
            <el-tag v-else-if="scope.row.status === 30" type="warning">已取消</el-tag>
            <el-tag v-else-if="scope.row.status === 40">待退款</el-tag>
            <el-tag v-else-if="scope.row.status === 50" type="success">已退款</el-tag>
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
  import fieldMixins from './order.mixins'
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
