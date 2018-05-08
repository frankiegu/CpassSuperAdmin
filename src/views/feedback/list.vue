<template>
  <div class="service-list main-content">
    <lh-title></lh-title>

    <div class="card-padding">
      <el-form :model="formData" :inline="true" class="text-right mr-10">
        <!-- 选择的是到期时间，所以是往后选 -->
        <el-form-item>
          <el-date-picker
            v-model="formData.reg_date"
            @change="getPageData"
            type="daterange"
            align="right"
            clearable
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            placeholder="选择提交日期"
            :picker-options="pickerOptions"></el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-input
            v-model.trim="formData.content"
            @keyup.native.enter="getPageData"
            placeholder="请输入内容"
            class="width220px">

            <i slot="suffix" @click="getPageData" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-form-item>

        <el-form-item class="fr">
          <el-button @click="exportExcel" icon="el-icon-download" class="btn-green fr">导出表格</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" :empty-text="tableEmpty" :slot="tableEmpty" v-loading="tableLoading" border
        style="width: 100%">
        <el-table-column label="提交日期" align="left">
          <template slot-scope="scope">
            {{ scope.row.created }}
          </template>
        </el-table-column>

        <el-table-column label="功能模块" prop="moduleName" align="left"></el-table-column>
        <el-table-column label="联系人" prop="contact" align="left"></el-table-column>
        <el-table-column label="联系电话" prop="contactTel" align="left" ></el-table-column>

        <el-table-column label="所属空间" align="left">
          <template slot-scope="scope">
            {{ scope.row.spaceName }}
          </template>
        </el-table-column>

        <el-table-column label="反馈内容" align="left">
          <template slot-scope="scope">
            <p class="content">{{ scope.row.content }}</p>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="left">
          <template slot-scope="scope">
            <span class="view" @click="viewDetail(scope.row.id)">查看</span>
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
      title="反馈详情"
      :visible.sync="dialogVisible"
      width="35%">
      <div class="detail-info">
        <div class="label">功能模块</div>
        <div class="label-con"><div class="intro-desc">{{ moduleName }}</div></div>
      </div>
      <div class="detail-info">
        <div class="label">反馈内容</div>
        <div class="label-con"><div class="intro-desc">{{ content }}</div></div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import feedbackList from './list.mixins'
  import option from '@/components/option'
  import pickerOptions from '@/mixins/pickerOptions'
  export default {
    mixins: [feedbackList, pickerOptions],
    components: {
      [option.name]: option
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

<style lang="scss" scoped>
  @import "../../../src/styles/config";
  .service-list {
    .operate-btn {
      padding: 6px;
    }
    .content{
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .view{
      color: #5E80E5;
      cursor: pointer;
    }
    .detail-info{
      clear: both;
      .label{
        width: 80px;
        float: left;
      }
      .label-con{
        float: left;
        width: calc(100% - 80px);
        margin-bottom: 10px;
      }
    }
  }
</style>
