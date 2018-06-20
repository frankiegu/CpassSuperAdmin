<template>
  <div>
    <lh-title title="会员管理">
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
    components: { lhTab },
    data() {
      return {
        tabList: [
          { type: 1, text: 'APP会员', name: '/member/list/app-list' },
          { type: 2, text: '小程序会员', name: '/member/list/wechat-list' }
        ]
      }
    }
  }
</script>
<style lang="scss" scoped>
  .select-box{
    width: 100%;
    height: 45px;
    background: #fff;
  }
</style>
