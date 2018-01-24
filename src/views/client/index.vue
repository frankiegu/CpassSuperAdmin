<template>
  <div class="main-content">
    <div class="page-title"><h1>客户列表</h1></div>
    <div class="card-padding">
      <router-link class="btn-link" to="/client/add">新增客户</router-link>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'index',
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
