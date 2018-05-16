<template>
  <div class="add-coupon">
    <lh-title />

    <el-form :model="couponForm" :rules="couponFormRules" ref="couponForm" label-width="80px">
      <!-- 基础信息 -->
      <div class="content-body">
        <h3 class="senior-title">基础信息</h3>
        <div class="card-body">
          <el-form-item label="卡券名称" prop="name">
            <el-input v-model.trim="couponForm.name" class="width300px"></el-input>
          </el-form-item>

          <el-form-item label="卡券说明" prop="desc">
            <el-input v-model.trim="couponForm.desc" type="textarea" class="width300px"></el-input>
          </el-form-item>

          <el-form-item label="券数量" prop="amount">
            <el-input v-model="couponForm.amount" class="width300px"></el-input>
          </el-form-item>

          <el-form-item label="使用期限" prop="expireDate">
            <el-date-picker
              value-format="yyyy-MM-dd"
              style="width: 300px"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              v-model="couponForm.expireDate"
              type="daterange">
            </el-date-picker>
          </el-form-item>
        </div>
      </div>

      <!-- 卡券内容 -->
      <div class="content-body">
        <h3 class="senior-title">卡券内容</h3>
        <div class="card-body"></div>
      </div>

      <!-- 领取方式 -->
      <div class="content-body">
        <h3 class="senior-title">领取方式</h3>
        <div class="card-body">
          <el-form-item label="领取方式" prop="receiveWay">
            <el-checkbox-group v-model="couponForm.receiveWay">
              <el-checkbox :label="1">条件触发</el-checkbox>
              <el-button v-if="couponForm.receiveWay.includes(1)" type="text" class="ml12">添加</el-button><br>
              <el-checkbox :label="2">支持手动领取</el-checkbox><br>
              <el-checkbox :label="3">支持手动下发</el-checkbox><br>
            </el-checkbox-group>
          </el-form-item>
        </div>
      </div>
    </el-form>

    <!-- 添加核销点弹窗 -->
    <add-wop-dialog v-if="false" :is-visible="isWopVisible" @closeDialog="isWopVisible = false"></add-wop-dialog>
  </div>
</template>

<script>
  import addWopDialog from '../components/add-wop-dialog'
  export default {
    name: 'add',
    data() {
      const checkInt = (rule, value, callback) => {
        if (value && (value.toString().indexOf('.') !== -1 ||
            isNaN(Number(value)) || Number(value) < 1 || Number(value) > 99999)) {
          callback(new Error('请输入1-99999的正整数'))
        }
        callback()
      }
      return {
        couponForm: {
          name: '',
          desc: '',
          amount: '',
          expireDate: [],
          receiveWay: []
        },
        couponFormRules: {
          name: [ // TODO 判断唯一
            { required: true, message: '请输入卡券名称', trigger: ['blur', 'change'] },
            { max: 20, message: '最大允许输入20个字', trigger: ['blur', 'change'] }
          ],
          desc: [
            { max: 100, message: '最大允许输入100字', trigger: ['blur', 'change'] }
          ],
          amount: [
            { required: true, message: '请输入券数量', trigger: ['blur', 'change'] },
            { validator: checkInt, trigger: ['blur', 'change'] }
          ],
          expireDate: [
            { required: true, message: '请选择使用期限', trigger: ['blur', 'change'] }
          ],
          receiveWay: [
            { required: true, message: '至少选择一种领取方式', trigger: ['blur', 'change'], type: 'array' }
          ]
        },
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 3600 * 1000 * 24;
          }
        },
        isWopVisible: false // 添加核销点弹窗
      }
    },
    components: { addWopDialog },
    mounted() {
    },
    methods: {}
  }
</script>

<style lang="scss" scoped>

</style>
