<template>
  <div class="city-maintain">
    <lh-title />

    <div class="lh-form-box">
      <el-form :inline="true" :model="citySort" @submit.native.prevent>
        <el-button v-if="handleHasPermissions('/supervisor/regionInfo/add')" type="primary" class="fl" @click="openAddDialog">添加城市</el-button>
        <el-form-item>
          <el-input v-model.trim="citySort.keyword" @keyup.native.enter="getPageData(1)" placeholder="请输入内容">
            <i slot="suffix" @click="getPageData(1)" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-form-item>
      </el-form>
    </div>

    <div class="lh-card-main">
      <el-tabs v-model="citySort.countryId" class="lh-form-tab mb0" @tab-click="getPageData(1)">
        <el-tab-pane v-for="item in countryList" :label="item.cnName" :key="item.id" :name="item.id + ''" />
      </el-tabs>

      <div class="card-body">
        <el-table :data="tableData" :loading="tableLoading">
          <el-table-column label="城市展示图" prop="url">
            <template slot-scope="scope">
              <img :src="scope.row.url + zoomImgSize(80)" alt="">
            </template>
          </el-table-column>

          <el-table-column label="国家" prop="countryName"></el-table-column>
          <el-table-column :label="citySort.countryId === '44' ? '省市' : '州市'" prop="provinceName">
            <template slot-scope="scope">
              <span>{{scope.row.provinceName + scope.row.cityName}}</span>
            </template>
          </el-table-column>

          <el-table-column label="城市名称" prop="cityAliasName"></el-table-column>
          <el-table-column label="空间数" prop="storeCount"></el-table-column>

          <el-table-column v-if="handleHasPermissions(['/supervisor/regionInfo/update', '/supervisor/regionInfo/top', '/supervisor/regionInfo/openStatus'])" label="操作">
            <template slot-scope="scope">
              <el-button v-if="handleHasPermissions('/supervisor/regionInfo/update')" type="text" class="fl" @click="openEditDialog(scope.row.id)">编辑</el-button>
              <el-button type="text" v-if="handleHasPermissions('/supervisor/regionInfo/top') && scope.row.sort !== 1" @click="setTopCity(scope.row.id)" class="ml0">置顶</el-button>
              <el-tooltip v-if="handleHasPermissions('/supervisor/regionInfo/openStatus')" :content="scope.row.status === 1 ? '点击关闭城市' : '点击开启城市'" placement="top" class="fr">
                <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"
                  @change="changeCityStatus(scope.row.id, scope.row.status)"
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
    <el-dialog :visible.sync="isVisible" :title="dialogTitle" :before-close="closeEditDialog">
      <el-form :model="addCityForm" label-width="100px" ref="addCityForm">
        <el-form-item label="所属国家" prop="countryId" required>
          <el-select v-model="addCityForm.countryId" class="width340px" @change="getCityTree">
            <el-option v-for="item in countryList" :value="item.id" :key="item.cnName"
              :label="item.cnName"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="城市" prop="regionCode" :rules="[
            { required: true, message: '请选择省市', trigger: ['blur', 'change'] },
            { validator: checkCityCode, trigger: ['blur', 'change'] }]">
          <el-cascader :options="cityTree" v-model="city" :props="cityProps" @change="changeCity" filterable
            placeholder="请选择省市" class="width340px">
          </el-cascader>
        </el-form-item>

        <el-form-item label="城市名称" prop="cityAliasName" :rules="[
          { required: true, message: '请输入城市名称', trigger: ['blur', 'change'] },
          { max: 10, message: '最大允许输入10个字', trigger: ['blur', 'change'] },
          { validator: checkCityName, trigger: ['blur'] }]">
          <el-input v-model="addCityForm.cityAliasName" placeholder="请输入城市名称" class="width340px"></el-input>
        </el-form-item>

        <!--<el-form-item label="经度" prop="longitude" :rules="[-->
          <!--{ required: true, message: '请输入经度', trigger: ['blur', 'change'] },-->
          <!--{ validator: checkLongitude, trigger: ['blur', 'change'] }]">-->
          <!--<el-input v-model="addCityForm.longitude" placeholder="请输入经度" :maxlength="15" class="width340px"></el-input>-->
        <!--</el-form-item>-->

        <!--<el-form-item label="纬度" prop="latitude" :rules="[-->
          <!--{ required: true, message: '请输入纬度', trigger: ['blur', 'change'] },-->
          <!--{ validator: checkLatitude, trigger: ['blur', 'change'] }]">-->
          <!--<el-input v-model="addCityForm.latitude" placeholder="请输入纬度" :maxlength="14" class="width340px"></el-input>-->
        <!--</el-form-item>-->

        <el-form-item label="展示图" prop="url" :rules="[
          { required: true, message: '请上传展示图', trigger: ['blur', 'change'] }]">
          <lh-upload
            :imgUrl="addCityForm.url"
            class="fl"
            @uploadImg="val => addCityForm.url = val"></lh-upload>
          <i class="el-icon-question fl theme-light-gray mt8 mr5" @click="uploadText = true"></i>
          <div v-if="uploadText" class="fl">
            <p>建议尺寸： 758PX * 276PX<br>支持格式： JPG / PNG</p>
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
  import { listCountry, listCity, listCityTree, addCity, updateCity, switchCity, topCity, isNotCityCodeExists, isNotCityNameExists } from '@/service/city-maintain'
  export default {
    name: '',
    mixins: [tableMixins],
    components: {
      [upload.name]: upload
    },
    data() {
      return {
        countryList: [],
        citySort: {
          countryId: '44', // 默认中国
          keyword: ''
        },
        tableData: [],
        tableLoading: true,

        // 添加或编辑城市弹窗
        dialogTitle: '添加城市',
        isVisible: false,
        isFormInit: true,
        cityId: null,
        addCityForm: {
          countryId: 44, // 默认中国
          regionCode: '',
          cityAliasName: '',
          longitude: '', // 经度
          latitude: '', // 纬度
          url: ''
        },
        city: [], // 级联选择城市
        // 树状城市列表
        cityTree: [],
        cityProps: {
          value: 'code',
          label: 'name'
        },
        uploadText: false
      }
    },
    mounted() {
      // 获取树状城市列表
      this.getCityTree()
      // 获取国家列表
      this.getCountryList()
      // 获取城市列表
      this.getPageData()
    },
    methods: {
      // 树状城市列表
      getCityTree() {
        listCityTree({
          countryId: this.addCityForm.countryId
        }).then(res => {
          if (res.status === 'true' && res.info) {
            this.cityTree = res.info.children || []
          }
        })
      },

      // 选择省市
      changeCity(val) {
        // 省市选择器改变时存储最后一个城市code
        if (val && val.length > 1) this.addCityForm.regionCode = val[1]
      },

      // 国家列表
      getCountryList() {
        listCountry().then(res => {
          if (res.status === 'true') {
            this.countryList = res.info
          }
        })
      },

      // 城市列表
      getPageData(page) {
        this.tableLoading = true
        this.currentPage = page || this.currentPage
        let params = Object.assign({
          pageSize: this.pageSize,
          pageNum: this.currentPage
        }, this.citySort)
        listCity(params).then(res => {
          if (res.status === 'true' && res.info) {
            this.pageTotal = res.info.total
            this.tableData = res.info.result
            this.tableLoading = false
          } else {
            this.$message.info(res.msg || '暂无数据')
          }
        })
      },

      openAddDialog() {
        this.isVisible = true
        this.isFormInit = false
      },

      // 添加/编辑城市
      submitForm() {
        this.$refs['addCityForm'].validate(valid => {
          if (valid) {
            let params = this.addCityForm
            let promise = this.addCityForm.id ? updateCity(params) : addCity(params)
            let successTips = this.addCityForm.id ? '修改成功！' : '添加成功！'
            promise.then(res => {
              if (res.status === 'true') {
                this.isVisible = false
                this.$message.success(successTips)
                this.resetForm()
                this.getPageData()
                this.isFormInit = true
              } else {
                this.$message.error(res.msg || 'something error')
              }
            })
          } else {
            this.$message.error('请确认表单填写正确')
          }
        })
      },

      // 打开编辑对话框
      openEditDialog(id) {
        this.cityId = id
        this.dialogTitle = '编辑城市'
        let target = this.tableData.find(item => item.id === id)
        this.isVisible = true
        this.addCityForm = Object.assign({}, {
          id: target.id,
          countryId: target.countryId,
          regionCode: target.regionCode,
          cityAliasName: target.cityAliasName,
          longitude: target.longitude,
          latitude: target.latitude, // 纬度
          url: target.url
        })
        this.city = [target.provinceCode, target.cityCode]
        this.$nextTick(() => {
          this.isFormInit = false
          this.$refs['addCityForm'].clearValidate(['regionCode'])
        })
      },

      // 关闭编辑对话框
      closeEditDialog() {
        this.isFormInit = true
        this.$confirm('确认关闭？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.resetForm()
          this.isVisible = false
        }).catch(() => {})
      },

      // 重置表单
      resetForm() {
        this.dialogTitle = '添加城市'
        this.cityId = null
        this.addCityForm = {
          countryId: 44, // 默认中国
          regionCode: '',
          cityAliasName: '',
          longitude: '', // 经度
          latitude: '', // 纬度
          url: ''
        }
        this.city = []
        this.$nextTick(() => {
          this.$refs['addCityForm'].clearValidate()
        })
      },

      // 置顶城市
      setTopCity(id) {
        topCity({ regionInfoId: id }).then(res => {
          if (res.status === 'true') {
            this.$message.success('置顶成功！')
            this.getPageData()
          } else {
            this.$message.error(res.msg)
          }
        })
      },

      // 切换城市开关
      changeCityStatus(id, val) {
        let target = this.tableData.find(item => item.id === id)
        let params = {
          regionInfoId: id,
          status: val
        }
        if (val === 0) { // 关闭城市
          this.$confirm('确认关闭该城市？', '提示', {
            type: 'warning'
          }).then(() => {
            this.handleSwitchCity(params)
          }).catch(() => {
            this.$message.info('已取消操作')
            target.status = 1
          })
        } else { // 开启城市
          this.handleSwitchCity(params)
        }
      },

      // 城市开启/关闭
      handleSwitchCity(obj) {
        switchCity(obj).then(res => {
          if (res.status === 'true') {
            this.$message.success('修改成功！')
          } else {
            this.$message.error(res.msg)
            this.getPageData()
          }
        })
      },

      // 自定义校验城市code
      checkCityCode(rule, value, callback) {
        if (value && !this.isFormInit) {
          let params = {
            cityCode: value
          }
          if (this.cityId != null) {
            params.regionInfoId = this.cityId
          }
          isNotCityCodeExists(params).then(res => {
            if (res.status === 'false') {
              callback(new Error(res.msg))
            } else {
              callback()
            }
          })
        }
      },

      // 自定义校验城市别名
      checkCityName(rule, value, callback) {
        if (value && !this.isFormInit) {
          let params = {
            cityAliasName: value
          }
          if (this.cityId != null) {
            params.regionInfoId = this.cityId
          }
          isNotCityNameExists(params).then(res => {
            if (res.status === 'false') {
              callback(new Error(res.msg))
            } else {
              callback()
            }
          })
        }
      },

      // 自定义校验经度
      checkLongitude(rule, value, callback) {
        if (value && isNaN(value)) {
          callback(new Error('请输入数字'))
        }
        if (Math.abs(value) > 180) {
          callback(new Error('请输入正确的经度（-180～180）'))
        }
        callback()
      },

      // 自定义校验纬度
      checkLatitude: (rule, value, callback) => {
        if (value && isNaN(value)) {
          callback(new Error('请输入数字'))
        }
        if (Math.abs(value) > 90) {
          callback(new Error('请输入正确的纬度（-90～90）'))
        }
        callback()
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
