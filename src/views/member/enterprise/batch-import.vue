<template>
  <div class="enterprise-import">

    <!-- 有面包屑的时候，就隐藏这个标题 -->
    <div class="page-title">
      <h1>批量导入</h1>
    </div>

    <div class="card-padding">
      <el-row class="import-step-cont">
        <el-col :span="8"><span class="import-step theme-blue">1</span>下载模板，填写企业信息</el-col>
        <el-col :span="12">
          <a class="btn-link" @click="handleDownload">下载模板</a>
        </el-col>
      </el-row>
      <el-row class="import-step-cont">
        <el-col :span="8"><span class="import-step theme-blue">2</span>上传填写完成的表格</el-col>
        <el-col :span="12">
          <el-upload
            class="upload-excel"
            :action="uploadUrl"
            :headers="uploadHead"
            name="batchCompany"
            accept=".xlsx, .xls"
            ref="uploadExcel"
            :multiple="false"
            :on-change="handleFileChange"
            :before-upload="beforeFileUpload"
            :on-success="handleFileSuccess"
            :on-remove="handleRemove"
            :file-list="fileList"
            :auto-upload="false">
            <el-button slot="trigger" type="primary" :disabled="notAllowAdd">点击上传</el-button>
          </el-upload>
        </el-col>
      </el-row>
      <el-row class="import-step-cont">
        <el-col :span="8"><span class="import-step theme-blue">3</span>批量新增，不影响原有企业信息</el-col>
        <el-col :span="12">
          <el-button type="primary" @click="submitUpload" :loading="isLoading">开始导入</el-button>
        </el-col>
      </el-row>
      <el-row class="import-step-cont">
        <el-row><span class="import-step theme-blue">4</span>导入结果</el-row>
        <div class="result-box" v-show="hasResult" :class="{'show-box' : hasResult}">
          <el-row>
            <el-col :span="4">总共 <span class="summary theme-gray">{{ uploadTotal }}</span></el-col>
            <el-col :span="4">成功 <span class="summary theme-gray">{{ successNum }}</span></el-col>
            <el-col :span="4">失败 <span class="summary theme-red">{{ failNum }}</span></el-col>
          </el-row>
          <el-table :data="reportData" border class="result-table">
            <el-table-column prop="row" label="行数"></el-table-column>
            <el-table-column prop="company.name" label="公司名称"></el-table-column>
            <el-table-column prop="errMsgs" label="错误原因"></el-table-column>
          </el-table>
        </div>
      </el-row>
      <el-row v-if="hasResult">
        <router-link to="/member/enterprise" class="btn-link btn-finish">完成</router-link>
      </el-row>
    </div>
  </div>
</template>

<script>
  // import { applyDownloadCode } from '@/service/index'
  import { API_PATH } from '@/config/env'
  import { downloadFile } from '@/config/utils'
  export default {
    data () {
      return {
        title: '企业信息管理',
        token: sessionStorage.getItem('token'),
        downloadUrl: '', // 下载链接
        uploadUrl: API_PATH + '/manage/company/batchAddCompany', // 上传地址
        fileList: [], // 文件列表
        notAllowAdd: false, // 是否允许选择文件
        isLoading: false,
        hasResult: false, // 导入成功后是否有返回错误结果列表
        uploadTotal: 0, // 总共导入数
        successNum: 0, // 导入成功数
        failNum: 0, // 导入失败数
        uploadHead: {
          token: sessionStorage.getItem('token')
        },

        reportData: [] // 导入结果table
      }
    },
    props: {},
    components: {},
    mounted () {
      this.token = sessionStorage.getItem('token')
    },
    watch: {},
    computed: {},
    filters: {},
    methods: {
      // 下载模板
      handleDownload() {
        let url = API_PATH + '/manage/company/downloadTemplate'
        downloadFile(url)
      },
      // 添加文件时判断
      handleFileChange(file, fileList) {
        // 若当前文件的状态为准备上传，则禁止用户继续添加文件
        if (file.status === 'ready') {
          this.notAllowAdd = true
        }
        // 若当前文件的状态为已上传，则允许用户添加文件
        if (file.status === 'success') {
          this.notAllowAdd = false
        }
      },
      // 上传之前文件过滤
      beforeFileUpload(file) {
        // 格式限制 xlsx 或者 xls，大小不超过4M
        const isXls = file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        const isLt4M = file.size / 1024 / 1024 < 4

        if (!isXls) {
          this.$message.error('上传文件只能是 xlsx 或者 xls 格式!')
        }
        if (!isLt4M) {
          this.$message.error('上传文件大小不能超过 4MB!')
        }

        return isXls && isLt4M
      },
      // 提交上传请求
      submitUpload() {
        this.$refs.uploadExcel.submit()
      },
      // 上传成功后获取导入结果列表
      handleFileSuccess(res, file, fileList) {
        if (res.status === 'true') {
          this.hasResult = true
          this.uploadTotal = res.info.totalNum
          this.failNum = res.info.failNum
          this.successNum = res.info.successNum
          this.reportData = res.info.failList
          // this.fileList = fileList.slice(-1)
        } else {
          this.$message.error(res.msg)
        }
      },
      // 文件移除时判断
      handleRemove(file, fileList) {
        // 若文件列表为空，或者被移除的文件是准备上传的文件，则允许用户重新添加文件
        if (fileList.length === 0 || file.status === 'ready') {
          this.notAllowAdd = false
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../styles/config";
  .enterprise-import {
    .import-step-cont {
      margin-bottom: 24px;

      .import-step {
        box-sizing: border-box;
        display: inline-block;
        margin-right: 20px;
        border: 1px solid $theme-blue;
        border-radius: 50%;
        width: 36px;
        height: 36px;
        font-size: 16px;
        line-height: 36px;
        text-align: center;
      }
    }

    .upload-excel {
      display: -webkit-flex;
      display: flex;

      button {
        margin-right: 10px;
      }
    }

    .result-box {
      margin-top: 20px;
      opacity: 0;
      transform: translateY(-20px);
      transition: all ease .25s;
      animation: fadeIn ease .6s forwards;

      .result-table {
        margin-top: 20px;
      }
    }

    .summary {
      margin-left: 20px;
      font-size: 28px;
      text-decoration: underline;
      vertical-align: baseline;
    }

    .btn-finish {
      display: block;
      margin: 0 auto;
      width: 120px;
      text-align: center;
    }
  }
  @keyframes fadeIn {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
