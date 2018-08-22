<template>
  <!-- 添加核销点弹窗 -->
  <el-dialog class="add-wop-dialog" title="添加核销点" :lock-scroll="false" :visible.sync="isVisible" v-if="isVisible"

             :before-close="closeDialog" width="500px">
    <el-form :model="formData" label-width="100px" :rules="formRules" ref="addWop">
      <el-form-item label="核销点名称" prop="name">
        <el-input v-model.trim="formData.name" placeholder="请输入核销点名称"></el-input>
      </el-form-item>

      <el-form-item label="关联空间">
        <el-cascader v-model="formData.storeId" :props="storeProp" :options="storeList" clearable></el-cascader>
      </el-form-item>

      <el-form-item label="地址" prop="addressCode">
        <el-cascader v-model="formData.addressCode" placeholder="省/市/区" :props="addressProp"
          :options="addressList" clearable></el-cascader>
      </el-form-item>

      <el-form-item prop="addressDetail">
        <el-input type="textarea" v-model.trim="formData.addressDetail" placeholder="请输入核销点地址"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { addPlatformVerifyStation, stationStoreTree, checkStationName } from '@/service/market'
  export default {
    name: 'add-wop-dialog',
    data() {
      const checkUnique = (rule, value, callback) => {
        if (value) {
          checkStationName({ name: value }).then(res => {
            if (res.status === 'false') {
              return callback(new Error(res.msg))
            } else {
              callback()
            }
          })
        }
      }
      return {
        storeList: [], // 关联空间列表
        storeProp: {
          label: 'name',
          value: 'code',
          children: 'children'
        },
        addressProp: {
          label: 'name',
          value: 'code',
          children: 'children',
          disabled: 'disabled'
        },
        // 表单数据
        formData: {
          name: '',
          storeId: [],
          addressCode: [],
          addressDetail: ''
        },
        formRules: {
          name: [
            { required: true, message: '请输入核销点名称', trigger: ['blur', 'change'] },
            { max: 20, message: '最大允许输入20字', trigger: ['blur', 'change'] },
            { validator: checkUnique, trigger: ['blur'] }
          ],
          addressCode: [
            { required: true, message: '请选择省市区', trigger: ['blur', 'change'] }
          ],
          addressDetail: [
            { required: true, message: '请输入详细地址', trigger: ['blur', 'change'] },
            { max: 50, message: '最大允许输入50字', trigger: ['blur', 'change'] }
          ]
        }
      }
    },
    props: {
      isVisible: [Boolean]
    },
    computed: {
      ...mapGetters({
        addressList: 'regionList'
      })
    },
    mounted() {
      // 获取省市区列表
      this.getRegionList()
      // 获取关联空间列表
      if (this.storeList.length === 0) this.handleGetStoreList()
    },
    methods: {
      ...mapActions([
        'getRegionList'
      ]),
      // 获取关联空间列表
      handleGetStoreList() {
        stationStoreTree().then(res => {
          if (res.status === 'true') {
            this.storeList = res.info
          }
        })
      },
      // 关闭对话框
      closeDialog() {
        this.$emit('closeDialog')
      },
      // 提交表单
      submitForm() {
        this.$refs['addWop'].validate((valid) => {
          if (valid) {
            let formData = this.formData
            let params = {
              name: formData.name,
              storeId: formData.storeId ? formData.storeId[1] : '',
              provinceCode: formData.addressCode ? formData.addressCode[0] : '',
              cityCode: formData.addressCode ? formData.addressCode[1] : '',
              districtCode: formData.addressCode ? formData.addressCode[2] : '',
              address: formData.addressDetail
            }
            addPlatformVerifyStation(params).then(res => {
              if (res.status === 'true') {
                this.$message.success('添加成功！')
                this.$emit('refreshData')

                // 提交成功之后清空表单
                this.formData.name = ''
                this.formData.storeId = []
                this.formData.addressCode = []
                this.formData.addressDetail = ''
              } else {
                this.$message.error(res.msg)
              }
            })
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
