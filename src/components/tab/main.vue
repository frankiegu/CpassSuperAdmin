<template>
  <div class="lh-tab">
    <el-row type="flex" class="row-bg" justify="space-between">
      <el-col
        v-for="(item, index) in tabList"
        :key="index"
        :span="7">
        <div
          @click.stop="tabToggle(index+1)"
          :class="['tab', {'tab-activity': !!(selectedTab >= index+1)}]"
          :span="7">
          <div class="tab-in">
            <i v-if="!!(selectedTab > index+1)" class="circle el-icon-check"></i>
            <span v-else class="circle">{{ index+1 }}</span>
            {{ item }}
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'LhTab',
    props: ['activityTab', 'tabList'],
    data () {
      return {}
    },
    computed: {
      selectedTab() {
        return this.activityTab
      }
    },
    methods: {
      tabToggle (index) {
        const self = this
        /**
         * new，需要完成第一步tab才能切换下一步，但是可以随便回到前面的步骤，类推
         * edit，随便切换tab
         */
        switch (self.switch) {
          case 1:
            if (!self.id) {
              if (index > 1) {
                self.setMsg('请先完成第一步的信息录入')
                return
              }
            }
            self.selectedTab = index
            break;
          case 2:
            if (index > 2) {
              self.setMsg('请先完成第二步的信息录入')
              return
            }
            self.selectedTab = index
            break;
          case 3:
            self.selectedTab = index
            break;
        }
        self.$emit('tabToggle', index)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import 'src/styles/config.scss';
  .lh-tab {
    padding-top: 30px;

    .tab {
      padding: 0 35px;
      background-color: #fff;
      cursor: pointer;

      .tab-in {
        padding: 20px 0;
        border-bottom: 3px solid #fff;
      }
      .circle {
        display: inline-block;
        width: 36px;
        height: 36px;
        line-height: 36px;
        margin-right: 35px;
        text-align: center;
        color: $theme-gray;
        border: 1px solid $theme-gray;
        border-radius: 50%;
      }
    }
    .tab-activity {
      color: $theme-blue;

      .circle {
        color: $theme-blue;
        border: 1px solid $theme-blue;
      }
      .tab-in {
        border-color: $theme-blue;
      }
    }
  }
</style>
