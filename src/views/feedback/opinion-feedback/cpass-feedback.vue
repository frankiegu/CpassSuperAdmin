<template>
  <div class="service-list main-content">
    <div class="card-padding">
      <el-form :model="formData" :inline="true" class="text-right mr-10" @submit.native.prevent>
        <!-- 选择的是到期时间，所以是往后选 -->
        <el-form-item>
          <lh-datePicker label="提交日期" :optionType="true" @datePickerChange="datePickerChange"></lh-datePicker>
        </el-form-item>

        <el-form-item>
          <el-input
            v-model.trim="formData.keyword"
            @keyup.native.enter="getPageData(1)"
            placeholder="请输入内容"
            clearable
            class="width220px">

            <i slot="suffix" @click="getPageData(1)" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-form-item>

        <el-form-item class="fr">
          <el-button @click="exportExcel" class="lh-btn-export">
            <lh-svg icon-class="icon-download" />导出
          </el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" :empty-text="tableEmpty" :slot="tableEmpty" v-loading="tableLoading" border
        style="width: 100%">
        <el-table-column label="提交日期" align="left">
          <template slot-scope="scope">
            {{ scope.row.created }}
          </template>
        </el-table-column>

        <el-table-column label="联系人" prop="nickname" align="left"></el-table-column>
        <el-table-column label="联系电话" prop="mobile" align="left" ></el-table-column>

        <el-table-column label="反馈内容" align="left">
          <template slot-scope="scope">
            <p class="content">{{ scope.row.content }}</p>
          </template>
        </el-table-column>

        <el-table-column label="来源" prop="source" align="left" ></el-table-column>

        <el-table-column label="操作" align="left">
          <template slot-scope="scope">
            <el-button type="text" class="lh-table-btn" @click="viewDetail(scope.row.id)" v-if="scope.row.showImg || scope.row.content">查看</el-button>
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
      :lock-scroll="true"
      :visible.sync="dialogVisible"
      width="55%">

      <div>
        <div class="detail-info">
          <div class="label">反馈内容</div>
          <div class="label-con"><div class="intro-desc">{{ content }}</div></div>
        </div>

        <div class="detail-info">
          <div class="label">反馈图片</div>
          <div class="label-desc">
            <div class="intro-desc">
              <img class="feedback-img" v-if="imgList" :src="item.imgPath" v-for="(item, index) in imgList" :key="index">
              <span v-else>暂无图片</span>
            </div>
          </div>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import feedbackList from './cpass-feedback.mixin'
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
      .label-desc{
        float: left;
        width: calc(100% - 80px);
        max-height: 300px;
        overflow-y: scroll;
        margin-bottom: 10px;

        .intro-desc{
          clear: both;
          .feedback-img{
            display: inline-block;
            width: 180px;
            height: 180px;
            margin-bottom: 20px;
            margin-right: 20px;
            cursor: pointer;
            float: left;
          }
        }
      }
    }
  }
</style>
