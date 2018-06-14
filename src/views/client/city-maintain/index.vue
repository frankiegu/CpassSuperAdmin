<template>
  <div class="city-maintain">
    <lh-title />

    <div class="lh-form-box">
      <el-form :inline="true" :model="citySort" @submit.native.prevent>
        <el-button type="primary" class="fl" @click="isVisible = true">添加城市</el-button>
        <el-form-item>
          <el-input v-model.trim="citySort.name" @keyup.native.enter="getPageData(1)" placeholder="请输入内容">
            <i slot="suffix" @click="getPageData(1)" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-form-item>
      </el-form>
    </div>

    <div class="lh-card-main">
      <el-tabs v-model="citySort.country" class="lh-form-tab mb0" @tab-click="getPageData(1)">
        <!--<el-tab-pane label="全部" key=" " name=" " />-->
        <el-tab-pane v-for="(value, key) in countryList" :label="value" :key="key" :name="key" />
      </el-tabs>

      <div class="card-body">
        <el-table :data="tableData" :loading="tableLoading">
          <el-table-column label="城市展示图" prop="imgUrl"></el-table-column>
          <el-table-column label="国家" prop="countryName"></el-table-column>
          <el-table-column :label="citySort.country === '1' ? '省份' : '州市'" prop="provinceName"></el-table-column>
          <el-table-column label="城市" prop="cityName"></el-table-column>
          <el-table-column label="空间数" prop="spaceNum"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" class="fl">编辑</el-button>
              <el-button type="text" v-if="scope.$index === 1" class="ml0">置顶</el-button>
              <el-tooltip content="hello" placement="top" class="fr">
                <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"
                  :active-color="switchActiveColor" class="mt6"></el-switch>
              </el-tooltip>
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

    <!-- 添加城市弹窗 -->
    <el-dialog :visible.sync="isVisible" title="添加城市" :before-close="closeDialog">
      <el-form :model="addCityForm" label-width="100px" ref="addCityForm">
        <el-form-item label="所属国家" prop="country" required>
          <el-select v-model="addCityForm.country" class="width340px">
            <el-option v-for="(value, key) in countryList" :value="key" :key="key" :label="value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="城市" prop="city" :rules="[
            { required: true, message: '请选择省市', trigger: ['blur', 'change'] }]">
          <el-select v-model="addCityForm.city" placeholder="请选择省市" class="width340px">
            <!--<el-option v-for="(value, key) in countryList" :value="key" :key="key" :label="value"></el-option>-->
          </el-select>
        </el-form-item>

        <el-form-item label="城市名称" prop="city" :rules="[
          { required: true, message: '请输入城市名称', trigger: ['blur', 'change'] },
          { max: 10, message: '最大允许输入10个字', trigger: ['blur', 'change'] }]">
          <el-input v-model="addCityForm.cityName" placeholder="请输入城市名称" class="width340px"></el-input>
        </el-form-item>

        <!-- TODO 经纬度校验 -->
        <el-form-item label="经度" prop="longitude" :rules="[
          { required: true, message: '请输入经度', trigger: ['blur', 'change'] }]">
          <el-input v-model="addCityForm.longitude" placeholder="请输入经度" class="width340px"></el-input>
        </el-form-item>

        <el-form-item label="纬度" prop="latitude" :rules="[
          { required: true, message: '请输入纬度', trigger: ['blur', 'change'] }]">
          <el-input v-model="addCityForm.latitude" placeholder="请输入纬度" class="width340px"></el-input>
        </el-form-item>

        <el-form-item label="展示图" prop="imgUrl" :rules="[
          { required: true, message: '请上传展示图', trigger: ['blur', 'change'] }]">
          <lh-upload
            :imgUrl="addCityForm.imgUrl"
            class="fl"
            @uploadImg="val => addCityForm.imgUrl = val"></lh-upload>
          <i class="el-icon-question fl theme-light-gray ml10 mt8 mr5" @click="uploadText = true"></i>
          <div v-if="uploadText" class="fl">
            <p>建议尺寸： 600PX * 460PX<br>支持格式： JPG / PNG</p>
          </div>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
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
        countryList: {
          1: '中国',
          2: '美国'
        },
        citySort: {
          country: '1',
          name: ''
        },
        tableData: [],

        // 添加城市弹窗
        isVisible: false,
        addCityForm: {
          country: '1',
          city: '',
          cityName: '',
          longitude: '', // 经度
          latitude: '', // 纬度
          imgUrl: ''
        },
        uploadText: false
      }
    },
    mounted() {},
    methods: {
      getPageData(page) {},
      submitForm() {
        this.$refs['addCityForm'].validate(valid => {
          if (valid) {
            this.isVisible = false
          } else {
            this.$message.error('请确认表单填写正确')
          }
        })
      },
      closeDialog() {
        this.$confirm('确认关闭？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.isVisible = false
        }).catch(() => {})
      }
    }
  }
</script>

<style lang="scss">
  .city-maintain {
    .el-tabs__header {
      margin-bottom: 0;
    }
  }
</style>
