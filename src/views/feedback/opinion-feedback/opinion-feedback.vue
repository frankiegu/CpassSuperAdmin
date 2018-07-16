<template>
  <div class="member-market">
    <lh-title title="意见反馈">
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
          { type: 1, text: '管理后台', name: '/opinion-feedback/manage-feedback' },
          { type: 2, text: 'CPASS', name: '/opinion-feedback/cpass-feedback' }
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
