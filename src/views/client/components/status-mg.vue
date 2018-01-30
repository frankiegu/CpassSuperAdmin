<template>
  <div class="status-mg">
    <el-form-item label="产品" prop="product" ref="product"
      :rules="dataRules.product" :required="dataForm.isCreateAccount">
      <el-select v-model="dataForm.product" class="width300px">
        <el-option value="完整版"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="有效期" required>
      <el-form-item prop="validity" ref="validity" class="fl mr20"
        :rules="dataRules.validity" :required="dataForm.isCreateAccount && !dataForm.isPermanent">
        <el-date-picker
          v-model="dataForm.validity"
          :disabled="dataForm.isPermanent"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 300px">
        </el-date-picker>
      </el-form-item>
      <el-form-item class="fl">
        <el-checkbox v-model="dataForm.isPermanent" @change="resetItemField('validity', true)">永久</el-checkbox>
      </el-form-item>
    </el-form-item>
  </div>
</template>

<script>
  export default {
    name: 'status-mg',
    data() {
      return {}
    },
    props: {},
    components: {},
    mounted() {
      this.$nextTick(() => {
      })
    },
    watch: {},
    computed: {},
    filters: {},
    methods: {}
  }
</script>

<style lang="scss" scoped></style>
