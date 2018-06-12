<template>
  <div class="c-pass">
    <lh-title title="C-PASS订单统计">
    </lh-title>
    <div class="select-box">
      <lh-tab :tabList="tabList"/>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
  import lhTab from '@/components/tab'

  export default {
    mixins: [],
    data() {
      return {
        tabList: [
          { type: 1, text: '场地订单统计', name: '/order-statistics/statistics-order' },
          { type: 2, text: '参观预约统计', name: '/order-statistics/statistics-visit' }
        ]
      }
    },
    props: {},
    components: { lhTab },
    mounted() {
    },
    watch: {},
    computed: {},
    filters: {},
    methods: {}
  }
</script>

<style lang="scss" scoped>
  .page-title{
    border-bottom: 1px solid #f2f2f8;
  }
  .select-box{
    width: 100%;
    height: 45px;
    background: #fff;
  }
</style>
<style lang="scss">
  .c-pass {
    .component-tab {
      .tab-link {
        width: 130px !important;
      }
    }
  }
</style>
