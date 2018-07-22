<template>
  <div class="service-list main-content">
    <lh-title></lh-title>

    <div class="card-padding">
      <el-form :model="formData" :inline="true" class="text-right mr-10" @submit.native.prevent>
        <!-- 选择提交日期 -->
        <el-form-item>
          <lh-datePicker label="提交日期" :dateType="1" :optionType="true" @datePickerChange="datePickerChange"></lh-datePicker>
        </el-form-item>

        <!--选择预约日期-->
        <el-form-item>
          <lh-datePicker label="预约日期" :dateType="2" @datePickerChange="datePickerChange"></lh-datePicker>
        </el-form-item>
        <el-form-item>
          <el-select v-model="formData.reservationType" placeholder="预约状态" clearable class="width120px" @change="getPageData(1)">
            <el-option
              v-for="(value, key) in reservationList"
              :label="value"
              :value="key"
              :key="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model.trim="formData.content"
            @keyup.native.enter="getPageData(1)"
            placeholder="请输入预约人姓名/电话"
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

      <el-table :data="tableData"
                :empty-text="tableEmpty"
                :slot="tableEmpty"
                v-loading="tableLoading"
                border
                style="width: 100%">
        <el-table-column label="预约日期" prop="bookDate" align="left" width="100"></el-table-column>
        <el-table-column label="预约时间" prop="bookTime" align="left"></el-table-column>
        <el-table-column label="预约品牌" align="left">
          <template slot-scope="scope">
            {{ scope.row.spaceName || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="预约空间" align="left">
          <template slot-scope="scope">
            {{ scope.row.storeName || '-' }}
          </template>
        </el-table-column>

        <el-table-column label="预约人" prop="reservator" align="left"></el-table-column>
        <el-table-column label="联系电话" prop="mobile" align="left"></el-table-column>
        <el-table-column label="提交时间" prop="createDate" align="left"></el-table-column>
        <el-table-column label="预约状态" prop="statusName" align="left"></el-table-column>

        <el-table-column label="参观目的" show-overflow-tooltip align="left">
          <template slot-scope="scope">
            {{ scope.row.visitTypeName || '-' }}
          </template>
        </el-table-column>

        <el-table-column label="意向" fixed="right" prop="isExistNote" align="left">
          <template slot-scope="scope">
            <span v-if="!scope.row.isExistNote">未填写</span>
            <el-button type="text" v-else class="lh-table-btn" @click="viewDetail(scope.row.id)">查看</el-button>
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

    <el-dialog
      title="参观意向"
      :visible.sync="dialogVisible"
      custom-class="dialogClass"
      width="35%">
      <div class="detail-info">
        {{ content }}
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import reservationList from './list.mixins'
  export default {
    mixins: [reservationList],
    components: {
    },
    data() {
      return {
        dialogVisible: false
      }
    },
    methods: {
    }
  }
</script>
<style lang="scss">
  .service-list {
    .dialogClass {
      min-height: 40% !important;
    }
  }
</style>
<style lang="scss" scoped>
  @import "../../../../src/styles/config";
  .service-list {
    .operate-btn {
      padding: 6px;
    }
    .content{
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
</style>
