<template>
  <div class="member-list">
    <lh-title title="会员列表" v-if="isShow">
    </lh-title>
    <div v-if="isShow" class="select-box">
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
        isShow: true,
        tabList: [
          { type: 1, text: 'APP会员', name: '/member/list/app-list' },
          { type: 2, text: '小程序会员', name: '/member/list/wechat-list' }
        ]
      }
    },
    mounted() {
      // 如果是APP会员详情
      if (this.$route.path === '/member/list/app-detail') {
        this.isShow = false
      } else {
        this.isShow = true
      }
    }
  }
</script>
<style lang="scss">
  .member-list {
    .page-title {
      border-bottom: 1px solid #f2f2f8;
    }
  }
</style>
<style lang="scss" scoped>
  .member-list {
    .select-box{
      width: 100%;
      height: 45px;
      background: #fff;
    }
  }
</style>
