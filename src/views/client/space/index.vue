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
              <router-link :to="'/field/list?storeId=' + scope.row.storeId" class="table-link">
                {{scope.row.fieldCount}}
              </router-link>
            </template>
          </el-table-column>

          <el-table-column label="空间描述" prop="recommendDescription" show-overflow-tooltip />

          <el-table-column label="地址" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.provinceName + '·' + scope.row.cityName + '·' + scope.row.districtName}}</span>
            </template>
          </el-table-column>

          <el-table-column label="空间介绍" prop="storeIntroduction" show-overflow-tooltip />

          <el-table-column label="操作" width="140" align="left" header-align="center">
            <template slot-scope="scope">
              <el-tooltip placement="top"
                :content="starSpaceList.length === 1 ? '至少保留一个明星空间，不可取消' : '点击取消该明星空间'">
                <span @click="setStarSpace(scope.row)">
                  <lh-svg icon-class="icon-love" class="ph4 fill-blue table-link"></lh-svg>
                </span>
              </el-tooltip>

              <el-button type="text" @click="openEditDialog(scope.row)" class="lh-table-btn">编辑</el-button>
              <el-button type="text" @click="setTopSpace(scope.row.storeId)" v-if="scope.$index !== 0"
                class="lh-table-btn ml0">置顶
              </el-button>
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
              <router-link :to="'/field/list?storeId=' + scope.row.storeId" class="table-link">
                {{scope.row.fieldCount}}
              </router-link>
            </template>
          </el-table-column>

          <el-table-column label="空间描述" prop="recommendDescription" show-overflow-tooltip />

          <el-table-column label="地址" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.provinceName + '·' + scope.row.cityName + '·' + scope.row.districtName}}</span>
            </template>
          </el-table-column>

          <el-table-column label="空间介绍" prop="storeIntroduction" show-overflow-tooltip />

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-tooltip placement="top">
                <p slot="content">{{starSpaceList.length < 5 ? '点击设置为明星空间' : '最多允许设置5个明星空间'}}</p>
                <span @click="setStarSpace(scope.row)">
                  <lh-svg icon-class="icon-love" :class="['ph4', 'fill-grayish', {'table-link': starSpaceList.length < 5}]" />
                </span>
              </el-tooltip>

              <el-button type="text" class="lh-table-btn" @click="openEditDialog(scope.row)">编辑</el-button>
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
    <el-dialog :visible.sync="isVisible" title="推荐描述" :before-close="closeEditDialog">
      <el-form :model="spaceForm" label-width="100px" ref="spaceForm" @submit.native.prevent>
        <el-form-item label="空间名称">{{spaceForm.storeName}}</el-form-item>
        <el-form-item label="空间简介">{{spaceForm.storeIntroduction || '暂无'}}</el-form-item>
        <el-form-item label="空间描述" prop="recommendDescription" :rules="[
          { required: true, message: '请输入空间描述', trigger: ['blur', 'change'] },
          { max: 30, message: '最大允许输入30字', trigger: ['blur', 'change'] }]">
          <el-input v-model.trim="spaceForm.recommendDescription" placeholder="请输入空间描述"></el-input>
        </el-form-item>
        <el-form-item label="空间展示图" prop="showImg" :rules="[
          { required: true, message: '请上传空间展示图', trigger: ['blur', 'change'] }]">
          <lh-upload
            :imgUrl="spaceForm.showImg"
            class="fl"
            @uploadImg="val => spaceForm.showImg = val"></lh-upload>
          <i class="el-icon-question fl theme-light-gray mt8 mr5" @click="uploadText = true"></i>
          <div v-if="uploadText" class="fl">
            <p>建议尺寸： 750PX * 360PX<br>支持格式： JPG / PNG</p>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeEditDialog">取 消</el-button>
        <el-button type="primary" @click="submitForm">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import tableMixins from '@/mixins/table'
  import upload from '@/components/upload'
  import { listShowcase, listSpace, setWellChosen, topSpace, editSpace } from '@/service/space'
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
        isSettingStar: false, // 标记设置明星空间（为true时，设置空间推荐描述之后将其设置为明星空间）
        // 推荐描述
        isVisible: false,
        spaceForm: {
          storeName: '',
          storeIntroduction: '',
          recommendDescription: '',
          showImg: ''
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

      // 打开推荐描述对话框
      openEditDialog(space) {
        this.isVisible = true
        this.spaceForm = Object.assign({}, {
          storeId: space.storeId,
          isWellChosen: space.isWellChosen,
          storeName: space.storeName,
          storeIntroduction: space.storeIntroduction,
          recommendDescription: space.recommendDescription,
          showImg: space.showImg
        })
      },

      // 关闭推荐描述对话框
      closeEditDialog() {
        this.$confirm('确认关闭？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.resetForm()
          this.isSettingStar = false
          this.isVisible = false
        }).catch(() => {})
      },

      // 重置表单
      resetForm() {
        this.spaceForm = {
          storeName: '',
          storeIntroduction: '',
          recommendDescription: '',
          showImg: ''
        }
        this.$nextTick(() => {
          this.$refs['spaceForm'].clearValidate()
        })
      },

      // 保存推荐描述
      submitForm() {
        this.$refs['spaceForm'].validate(valid => {
          if (valid) {
            let params = Object.assign({}, {
              storeId: this.spaceForm.storeId,
              recommendDescription: this.spaceForm.recommendDescription,
              showImg: this.spaceForm.showImg
            })
            editSpace(params).then(res => {
              if (res.status === 'true') {
                // 如果标记了设置明星空间，则保存空间描述之后再将其设置为明星空间
                // 否则直接刷新列表
                if (this.isSettingStar) {
                  this.setStarSpace(this.spaceForm)
                  this.isSettingStar = false
                } else {
                  this.spaceForm.isWellChosen === 0 ? this.getPageData() : this.getStarSpaceList()
                }
                this.isVisible = false
                this.resetForm()
              } else {
                this.isVisible = false
                this.resetForm()
                this.$message.error(res.msg)
              }
            })
          } else {
            this.$message.error('请确认表单填写正确')
          }
        })
      },

      // 设置/撤销明星空间
      setStarSpace(space) {
        // 最多设置5个明星空间，至少保留一个明星空间
        if (space.isWellChosen === 0 && this.starSpaceList.length >= 5) return
        if (space.isWellChosen === 1 && this.starSpaceList.length === 1) return
        /**
         * 点击红心进行设置明星空间，如果已经有输入空间描述，则直接设置为明星空间，
         * 如未添加空间描述，则出现弹窗进行设置，保存后设置为明星空间
         */
        if (!space.recommendDescription) {
          this.isSettingStar = true
          this.openEditDialog(space)
          return
        }
        let params = {
          storeId: space.storeId,
          wellChosenType: !space.isWellChosen ? 1 : 0
        }
        setWellChosen(params).then(res => {
          if (res.status === 'true' && res.info) {
            this.$message.success('设置成功！')
            this.starSpaceList = res.info
            this.getPageData(1)
          } else {
            this.$message.error(res.msg)
          }
        })
      },

      // 置顶明星空间
      setTopSpace(id) {
        topSpace({ storeId: id }).then(res => {
          if (res.status === 'true' && res.info) {
            this.$message.success('置顶成功！')
            this.starSpaceList = res.info
          } else {
            this.$message.error(res.msg)
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
