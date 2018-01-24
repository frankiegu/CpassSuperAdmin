<template>
  <div class="base-info">
    <el-form-item label="客户名称">
      <el-input class="width300px" placeholder="填写完整客户名称" :maxlength="200"></el-input>
    </el-form-item>

    <el-form-item label="联系人">
      <el-input class="width300px" placeholder="填写联系人名称" :maxlength="100"></el-input>
    </el-form-item>

    <el-form-item label="联系电话">
      <el-input class="width300px" placeholder="填写联系人电话号码" :maxlength="12"></el-input>
    </el-form-item>

    <el-form-item label="联系邮箱">
      <el-input class="width300px" placeholder="填写联系人的邮箱地址" :maxlength="200"></el-input>
    </el-form-item>

    <el-form-item label="联系地址">
      <el-input class="width300px" placeholder="填写联系人的联系地址" :maxlength="500"></el-input>
    </el-form-item>

    <el-form-item label="微信服务号">
      <el-input class="width300px" placeholder="填写微信服务号"></el-input>
    </el-form-item>

    <el-form-item label="备注">
      <el-input class="width300px" placeholder="可填写联系人职位、负责事宜等内容" :maxlength="500"></el-input>
    </el-form-item>

    <el-form-item label="销售经理">
      <el-input class="width300px" placeholder="填写负责跟进该客户的销售经理" :maxlength="100"></el-input>
    </el-form-item>

    <el-form-item label="创建智众账户">
      <el-switch></el-switch>
    </el-form-item>
  </div>
</template>

<script>
  export default {
    name: 'base-info',
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
