<template>
  <div class="space-list main-content">
    <lh-title />

    <div class="lh-card-main">
      <!-- 明星空间 -->
      <div class="senior-title">明星空间</div>
      <div class="card-body">
        <el-table :data="starSpaceList">
          <el-table-column label="展示图" prop="imgUrl"></el-table-column>
          <el-table-column label="所属品牌" prop="brandName"></el-table-column>
          <el-table-column label="空间名称" prop="spaceName"></el-table-column>
          <el-table-column label="场地数" prop="fieldNum">
            <template slot-scope="scope">
              <router-link to="/field/list" class="table-link">{{scope.row.fieldNum}}</router-link>
            </template>
          </el-table-column>
          <el-table-column label="空间描述" prop="spaceDesc"></el-table-column>
          <el-table-column label="地址" prop="address"></el-table-column>
          <el-table-column label="空间介绍" prop="spaceIntro"></el-table-column>
          <el-table-column label="操作"></el-table-column>
        </el-table>
      </div>

      <!-- 空间列表 -->
      <div class="senior-title">空间列表
        <el-form :model="spaceSort" :inline="true" class="fr sort-form-bar" @submit.native.prevent>
          <el-form-item class="mb0">
            <el-input placeholder="请输入品牌名称/空间名称" v-model.trim="spaceSort.name"
              @keyup.native.enter="getPageData(1)">
              <i slot="suffix" @click="getPageData(1)" class="el-input__icon el-icon-search"></i>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="card-body">
        <el-table :data="spaceList"></el-table>
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

    <!-- 推荐描述 -->
    <el-dialog :visible.sync="isVisible" title="推荐描述">
      <el-form :model="spaceForm" label-width="100px" ref="spaceForm">
        <el-form-item label="空间名称">{{spaceForm.spaceName}}</el-form-item>
        <el-form-item label="空间简介">{{spaceForm.spaceIntro}}</el-form-item>
        <el-form-item label="空间描述" prop="description" :rules="[
          { required: true, message: '请输入空间描述', trigger: ['blur', 'change'] },
          { max: 30, message: '最大允许输入30字', trigger: ['blur', 'change'] }]">
          <el-input v-model.trim="spaceForm.description" placeholder="请输入空间描述"></el-input>
        </el-form-item>
        <el-form-item label="空间展示图" prop="imgUrl" :rules="[
          { required: true, message: '请上传空间展示图', trigger: ['blur', 'change'] }]">
          <lh-upload
            :imgUrl="spaceForm.imgUrl"
            class="fl"
            @uploadImg="val => spaceForm.imgUrl = val"></lh-upload>
          <i class="el-icon-question fl theme-light-gray ml10 mt8 mr5" @click="uploadText = true"></i>
          <div v-if="uploadText" class="fl">
            <p>建议尺寸： 600PX * 460PX<br>支持格式： JPG / PNG</p>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import tableMixins from '@/mixins/table'
  import upload from '@/components/upload'
  export default {
    name: '',
    mixins: [tableMixins],
    components: {
      [upload.name]: upload
    },
    data() {
      return {
        spaceSort: {
          name: ''
        },
        // 明星空间
        starSpaceList: [],
        // 空间列表
        spaceList: [],
        // 推荐描述
        isVisible: false,
        spaceForm: {
          spaceName: '七客创联·海草社区',
          spaceIntro: '七客创联·海草社区七客创联·海草社区七客创联·海草社区七客创联·海草社区七客创联·海草社区七客创联·海草社区',
          description: '',
          imgUrl: ''
        },
        uploadText: false
      }
    },
    mounted() {},
    methods: {
      getPageData(page) {},
      // 保存推荐描述
      submitForm() {
        this.$refs['spaceForm'].validate(valid => {
          if (valid) {
            this.isVisible = false
          } else {
            this.$message.error('请确认表单填写正确')
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .space-list {
    .senior-title {
      .sort-form-bar {
        margin-top: -8px;
      }
    }
    .el-form-item--small .el-form-item__content {
      line-height: 32px;
    }
  }
</style>
