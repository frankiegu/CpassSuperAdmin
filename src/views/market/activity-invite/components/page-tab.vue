<template>
  <div class="lh-page-tab">
    <div class="mh24">
      <span
        v-for="(item, idx) in tabList"
        :key="idx"
        @click="tabToggle(idx+1)"
        :class="['tab', {'tab-activity': (selectedTab === idx+1)}]">
        {{ item }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LhPageTab',
  props: ['activityTab', 'tabList', 'addEditType', 'tabSwitch'],
  data () {
    return {
      selectedTab: ''
    }
  },
  watch: {
    activityTab: {
      handler: function (val, oldVal) {
        this.selectedTab = val
      },
      immediate: true
    }
  },
  methods: {
    tabToggle (index) {
      /**
       * new ，需要完成第一步tab才能切换下一步，但是可以随便回到前面的步骤，类推
       * 添加的时候，门是否已经打开？
       * edit，随便切换tab
       */
      this.selectedTab = index
      // if (!this.addEditType && index === 2 && !this.tabSwitch) {
      //   this.setMsg('请先完成第一步的信息录入')
      //   return
      // } else {
      //   this.selectedTab = index
      // }
      this.$emit('tabToggle', index)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../../styles/variables";
.lh-page-tab {
  width: 100%;
  background-color: #fff;
  box-sizing: border-box;

  .tab {
    display: inline-block;
    padding: 0 1px;
    height: 22px;
    line-height: 22px;

    padding-bottom: 11px;
    margin-right: 36px;
    border-bottom: 2px solid #fff;
    cursor: pointer;
  }
  .tab-activity {
    color: $theme-blue;
    border-color: $theme-blue;
  }
}
</style>
