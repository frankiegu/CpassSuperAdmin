<template>
  <div class="space-list main-content">
    <lh-title />

    <div class="lh-card-main">
      <!-- 明星空间 -->
      <div class="senior-title">明星空间</div>
      <div class="card-body">
        <el-table :data="starSpaceList">
          <el-table-column label="展示图" prop="showImg">
            <template slot-scope="scope">
              <img :src="scope.row.showImg + zoomImgSize(80)" alt="">
            </template>
          </el-table-column>

          <el-table-column label="所属品牌" prop="spaceName" show-overflow-tooltip />
          <el-table-column label="空间名称" prop="storeName" show-overflow-tooltip />
          <el-table-column label="场地数" prop="fieldCount">
            <template slot-scope="scope">
              <router-link to="/field/list" class="table-link">{{scope.row.fieldCount}}</router-link>
            </template>
          </el-table-column>

          <el-table-column label="空间描述" prop="recommendDescription" show-overflow-tooltip />

          <el-table-column label="地址" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.provinceName + '·' + scope.row.cityName + '·' + scope.row.districtName}}</span>
            </template>
          </el-table-column>

          <el-table-column label="空间介绍" prop="brief" show-overflow-tooltip />

          <el-table-column label="操作" width="140" align="left" header-align="center">
            <template slot-scope="scope">
              <el-tooltip placement="top" content="点击取消该明星空间">
                <lh-svg icon-class="icon-like" class="ph4 svg18 fill-blue table-link"></lh-svg>
              </el-tooltip>

              <el-button type="text" class="lh-table-btn">编辑</el-button>
              <el-button type="text" @click="" v-if="!scope.row.topTime" class="lh-table-btn ml0">置顶</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 空间列表 -->
      <div class="senior-title">空间列表
        <el-form :model="spaceSort" :inline="true" class="fr sort-form-bar" @submit.native.prevent>
          <el-form-item class="mb0">
            <el-input placeholder="请输入品牌名称/空间名称" v-model.trim="spaceSort.name"
              @keyup.native.enter="getPageData(1)">
              <i slot="suffix" @click="getPageData(1)" class="el-input__icon el-icon-search pointer-theme-gray"></i>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="card-body">
        <el-table :data="spaceList">
          <el-table-column label="展示图" prop="showImg">
            <template slot-scope="scope">
              <img :src="scope.row.showImg + zoomImgSize(80)" alt="">
            </template>
          </el-table-column>

          <el-table-column label="所属品牌" prop="spaceName" show-overflow-tooltip />
          <el-table-column label="空间名称" prop="storeName" show-overflow-tooltip />
          <el-table-column label="场地数" prop="fieldCount">
            <template slot-scope="scope">
              <router-link to="/field/list" class="table-link">{{scope.row.fieldCount}}</router-link>
            </template>
          </el-table-column>

          <el-table-column label="空间描述" prop="recommendDescription" show-overflow-tooltip />

          <el-table-column label="地址" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.provinceName + '·' + scope.row.cityName + '·' + scope.row.districtName}}</span>
            </template>
          </el-table-column>

          <el-table-column label="空间介绍" prop="brief" show-overflow-tooltip />

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-tooltip placement="top">
                <p slot="content">{{starSpaceList.length < 5 ? '点击设置为明星空间' : '最多允许设置5个明星空间'}}</p>
                <lh-svg icon-class="icon-like" :class="['ph4', 'svg18', {'table-link': starSpaceList.length < 5}]"></lh-svg>
              </el-tooltip>

              <el-button type="text" class="lh-table-btn">编辑</el-button>
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

    <!-- 推荐描述 -->
    <el-dialog :visible.sync="isVisible" title="推荐描述">
      <el-form :model="spaceForm" label-width="100px" ref="spaceForm">
        <el-form-item label="空间名称">{{spaceForm.spaceName}}</el-form-item>
        <el-form-item label="空间简介">{{spaceForm.brief}}</el-form-item>
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
  import { listShowcase, listSpace } from '@/service/space'
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
          spaceName: '',
          brief: '',
          description: '',
          imgUrl: ''
        },
        uploadText: false
      }
    },
    mounted() {
      // 获取明星空间列表
      this.getStarSpaceList()
      // 获取空间列表
      this.getPageData()
    },
    methods: {
      // 明星空间列表
      getStarSpaceList() {
        listShowcase().then(res => {
          if (res.status === 'true') {
            this.starSpaceList = res.info
          }
        })
      },

      // 空间列表
      getPageData(page) {
        this.currentPage = page || this.currentPage
        let params = Object.assign({
          pageSize: this.pageSize,
          pageNum: this.currentPage
        }, this.spaceSort)
        listSpace(params).then(res => {
          if (res.status === 'true' && res.info) {
            this.pageTotal = res.info.total
            this.spaceList = res.info.result
          } else {
            this.$message.info(res.msg || '暂无数据')
          }
        })
      },

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
