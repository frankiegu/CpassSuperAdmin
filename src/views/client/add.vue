<template>
  <div class="main-content client-data">
    <div class="page-title">
      <h1>{{pageTitle}}</h1>
      <span class="fr"><i class="el-icon-close"></i></span>
    </div>
    <div class="card-padding card-padding-vertical">
      <el-form label-width="100px" :model="dataForm">
        <h3 class="grid-title">基础信息</h3>
        <base-info :model-form="dataForm"></base-info>
      </el-form>
    </div>
  </div>
</template>

<script>
  import baseInfo from './components/base-info'

  export default {
    name: 'add',
    data() {
      return {
        pageTitle: this.$route.query.id ? 'xx有限公司' : '新增客户',
        clientId: this.$route.query.id,

        dataForm: {
          clientName: '',
          userName: '',
          tel: '',
          email: '',
          address: '',
          wxService: '',
          remark: '',
          saleManager: '',
          isCreateAccount: false
        }
      }
    },
    props: {},
    components: {
      baseInfo
    },
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

<style lang="scss" scoped>
  .client-data {
  }
</style>
