<template>
  <div class="member-tab-pane">
    <order-record v-if="activeTab === '1'" :id="id"></order-record>
    <integral v-else-if="activeTab === '2'" :id="id"></integral>
    <coupon v-else-if="activeTab === '3'" :id="id"></coupon>
  </div>
</template>
<script>
  import orderRecord from './order-record'
  import integral from './integral'
  import coupon from './coupon'
  export default {
    props: {
      activeTab: {
        type: String,
        default: '1'
      },
      id: {
        type: String
      }
    },
    components: {
      orderRecord,
      integral,
      coupon
    },
    data() {
      return {}
    }
  }
</script>
<style lang="scss">
  .member-tab-pane {
    .detail-item {
      height: 100%;
      .label {
        line-height: inherit;
      }
      .label-con {
        line-height: inherit;
      }
    }
    .num-style {
      color: #5A72F6;
      font-weight: 600;
    }
    .numberCount {
      width: 100%;
      height: 60px;
      line-height: 60px;
      border: 1px solid rgba(0, 21, 41, 0.12);
      margin-left: 0 !important;
      margin-right: 0 !important;
    }
    .lh-btn-export {
      position: absolute;
      right: 0;
      top: 18px;
    }
  }
</style>
