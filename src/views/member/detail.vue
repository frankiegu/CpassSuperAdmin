<template>
  <div class="member-detail">
    <!-- 会员信息 -->
    <lh-title title="刘奔明">
      <lh-item class="ml12" label="ID" label-width="20px">424242</lh-item>
      <el-row :gutter="20">
        <el-col :span="8">
          <lh-item class="nowrap" label="手机号" label-width="80px">13684848484</lh-item>
        </el-col>
        <el-col :span="8">
          <lh-item class="nowrap" label="邮箱" label-width="60px">liubenming@wenben7.com</lh-item>
        </el-col>
        <el-col :span="8">
          <lh-item class="nowrap" label="生日" label-width="60px">1968-10-10</lh-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <lh-item class="nowrap" label="职业" label-width="80px">老司机</lh-item>
        </el-col>
        <el-col :span="8">
          <lh-item class="nowrap" label="性别" label-width="60px">男</lh-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="8">
          <lh-item class="nowrap" label="会员等级" label-width="80px">联盟会员</lh-item>
        </el-col>
        <el-col :span="8">
          <lh-item class="nowrap" label="付费记录" label-width="80px">2018-3-20  20:50:15</lh-item>
        </el-col>
        <el-col :span="8">
          <lh-item class="nowrap" label="金额" label-width="60px">¥399</lh-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <lh-item class="nowrap" label="购买项目" label-width="80px">联盟会员（一年有效）</lh-item>
        </el-col>
        <el-col :span="8">
          <lh-item class="nowrap" label="会员有效期" label-width="80px">2018-3-20 ~ 2019-3-2</lh-item>
        </el-col>
      </el-row>

      <el-row>
        <el-tabs class="detail-tab" v-model="activeTab">
          <el-tab-pane
            v-for="item in tabList"
            :label="item.text"
            :key='item.type'
            :name="item.type">
          </el-tab-pane>
        </el-tabs>
      </el-row>
    </lh-title>

    <div class="card-padding">
      <!-- 如果数据没有更新，则查看缓存的数据 -->
      <keep-alive>
        <tab-pane
          ref="tabPane"
          :activeTab="activeTab"></tab-pane>
      </keep-alive>
    </div>

  </div>
</template>

<script>
  import tabPane from './components/tab-pane'
  export default {
    mixins: [],
    data() {
      return {
        activeTab: '1',
        tabList: [
          { type: '1', text: '订单记录' },
          // { type: '2', text: '积分' },
          { type: '3', text: '优惠券' }
        ]
      }
    },
    props: {},
    components: { tabPane },
    mounted() {
    },
    watch: {},
    computed: {},
    filters: {},
    methods: {
    }
  }
</script>

<style lang="scss">
  .member-detail {
    .page-title {
      &>h1 {
        width: 100px;
        line-height: 1;
      }
    }
    .detail-tab {
      .el-tabs__header {
        margin: 0;
      }
    }
  }
</style>

<style lang="scss" scoped>
  .member-detail {
    color: #000;
    .detail-item {
      display: inline-block;
    }
  }
  .page-title{
    color: #000;
    border-bottom: 1px solid #f2f2f8;
  }
  .select-box{
    width: 100%;
    height: 45px;
    background: #fff;
  }
</style>
