<template>
  <div class="statistics-order">
    <div class="card-padding">

      <div class="card-body-title">场地概况</div>
      <div class="select-type mt10 mb10 clearfix">
        <el-date-picker
          class="fr"
          v-model="formData.date"
          @change="getPageData(1)"
          type="daterange"
          align="right"
          clearable
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          placeholder="选择提交日期"
          :picker-options="pickerOptions"></el-date-picker>
        <div class="select-period mr16">
          <div class="period-site" :class="{'period-site-select' : periodId === 1}" @click="changePeriod(1)">
            日
          </div>
          <div class="period-site" :class="{'period-site-select' : periodId === 2}" @click="changePeriod(2)">
            周
          </div>
          <div class="period-site" :class="{'period-site-select' : periodId === 3}" @click="changePeriod(3)">
            月
          </div>
        </div>
      </div>
      <div class="area-profile clearfix mb16">
        <div class="profile-box">
          <span class="profile-title">总订单数</span>
          <span class="profile-count">100</span>
        </div>
        <div class="profile-box">
          <span class="profile-title">待使用</span>
          <span class="profile-count">100</span>
        </div>
        <div class="profile-box">
          <span class="profile-title">已使用</span>
          <span class="profile-count">100</span>
        </div>
        <div class="profile-box">
          <span class="profile-title">待退款</span>
          <span class="profile-count">100</span>
        </div>
        <div class="profile-box">
          <span class="profile-title">已退款/已取消</span>
          <span class="profile-count">100</span>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
  import statisticsOrderMixin from './statistics-order.mixin'
  import option from '@/components/option'
  import pickerOptions from '@/mixins/pickerOptions'
  import tableMixins from '@/mixins/table'

  export default {
    mixins: [tableMixins, statisticsOrderMixin, pickerOptions],
    components: {
      [option.name]: option
    },
    data () {
      return {
      }
    },
    mounted () {
    },
    methods: {
      changePeriod (id) {
        this.periodId = id
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "src/styles/config";
  .statistics-order {
    .card-body-title{
      font-size: 16px;
    }

    .select-type{
      width: 100%;
      height: 32px;

      .select-period{
        display: block;
        width: 152px;
        border: 1px solid rgb(220, 223, 230);
        border-radius: 4px;
        text-align: center;
        float: right;


        .period-site{
          width: 50px;
          height: 30px;
          line-height: 30px;
          float: left;
          border-right: 1px solid rgb(220, 223, 230);
          color: rgba(0, 0, 0, 0.65);
          cursor: pointer;
        }
        .period-site-select{
          background: rgba(220, 223, 230, 0.65);
        }
        .period-site:last-child{
          border-right: none;
        }
      }
    }
    .area-profile{
      width: 100%;
      padding: 24px 0px;
      box-sizing: border-box;

      .profile-box{
        display: block;
        width: 12%;
        box-shadow: 0 1px 4px 0 rgba(0, 21, 41, 0.12);
        cursor: pointer;
        position: relative;
        background-color: #fff;
        border-radius: 2px;
        padding: 15px;
        box-sizing: border-box;
        text-align: center;
        margin-right: 2.66%;
        float: left;

        .profile-title{
          display: inline-block;
          width: 100%;
          color: rgba(0, 0, 0, 0.85);
          margin-bottom: 15px;
          cursor: pointer;
        }
        .profile-count{
          display: inline-block;
          width: 100%;
          color: #000;
          font-size: 24px;
        }
      }
      .profile-box-select{
      }
      .profile-box:last-child{
        margin-right: 0px;
      }
    }

  }
</style>
