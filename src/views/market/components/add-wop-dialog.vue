<template>
  <!-- 添加核销点弹窗 -->
  <el-dialog class="add-wop-dialog" title="添加核销点" :lock-scroll="false" :visible.sync="isVisible"
    :before-close="closeDialog" width="500px">
    <el-form :model="formData" label-width="100px" :rules="formRules" ref="addWop">
      <el-form-item label="核销点名称" prop="name">
        <el-input v-model.trim="formData.name" placeholder="请输入核销点名称"></el-input>
      </el-form-item>

      <el-form-item label="关联门店">
        <el-cascader v-model="formData.storeId" :options="addressList"></el-cascader>
      </el-form-item>

      <el-form-item label="地址" prop="address">
        <el-cascader v-model="formData.address" placeholder="省/市/区" :options="addressList"></el-cascader>
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
  export default {
    name: 'add-wop-dialog',
    data() {
      return {
        // 地址列表
        addressList: [{
          value: 'zhinan',
          label: '指南',
          children: [{
            value: 'shejiyuanze',
            label: '设计原则',
            children: [{
              value: 'yizhi',
              label: '一致'
            }]
          }]
        }, {
          value: 'zujian',
          label: '组件',
          children: [{
            value: 'basic',
            label: 'Basic',
            children: [{
              value: 'layout',
              label: 'Layout 布局'
            }]
          }]
        }, {
          value: 'ziyuan',
          label: '资源',
          children: [{
            value: 'axure',
            label: 'Axure Components'
          }]
        }],
        // 表单数据
        formData: {
          name: '',
          storeId: [],
          address: [],
          addressDetail: ''
        },
        formRules: {
          name: [ // TODO 判断名称唯一
            { required: true, message: '请输入核销点名称', trigger: ['blur', 'change'] },
            { max: 20, message: '最大允许输入20字', trigger: ['blur', 'change'] }
          ],
          address: [
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
    mounted() {
    },
    methods: {
      closeDialog() {
        this.$emit('closeDialog')
      },
      submitForm() {
        this.$refs['addWop'].validate((valid) => {
          if (valid) {
            this.$emit('closeDialog')
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
