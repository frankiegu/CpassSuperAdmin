<template>
  <div id="picker">
    <el-form label-width="180px">
      <el-form-item label="Select a date">

        <flat-pickr
          v-model="date"
          placeholder="请设置日期范围"
          :config="config"
          :required="true"
          class="flatpickr-ipt"
          name="date">
        </flat-pickr>
        <i data-clear class="el-icon-close"></i>

      </el-form-item>
      <pre>选中的日期是 - {{date}}</pre>
    </el-form>
  </div>
</template>

<script>
  import flatPickr from 'vue-flatpickr-component'
  import 'flatpickr/dist/themes/airbnb.css'
  // const Hindi = require('flatpickr/dist/l10n/hi.js').hi
  export default {
    name: 'test',
    data () {
      return {
        date: new Date(),
        config: {
          wrap: true, // set wrap to true when using 'input-group'
          mode: 'multiple',
          altInput: true,
          dateFormat: 'Y-m-d',
          defaultDate: ['2017-10-14'],
          shorthandCurrentMonth: true,
          minDate: new Date().fp_incr(1),
          onMonthChange: function(selectedDates, dateStr, instance) {
            console.log('test', dateStr, instance);
            console.log('currentMonth', instance.currentMonth);
          }
          // maxDate: new Date().fp_incr(14),
        }
      }
    },
    methods: {
      clear () {
        flatPickr.clear()
        console.log('date: ', this.date);
      }
    },
    components: {
      flatPickr
    },
    mounted () {
      // const self = this
      // const fp = flatpickr("#myID", {self.config});
    },
    props: {},
    watch: {},
    computed: {},
    filters: {}
  }
</script>


<style lang="scss">
  #picker {
    .flatpickr-ipt {
      background-color: #fff;
      background-image: none;
      border-radius: 4px;
      border: 1px solid rgb(191, 194, 217);
      box-sizing: border-box;
      color: rgb(31, 35, 61);
      display: inline-block;
      font-size: inherit;
      height: 36px;
      line-height: 1;
      outline: none;
      padding: 3px 10px;
      transition: border-color .2s cubic-bezier(.645,.045,.355,1);
      width: 100%;
    }
    ::-moz-placeholder {
      color: #bfcbd9;
    }
    ::-webkit-input-placeholder {
      color: #bfcbd9;
    }
    :-ms-input-placeholder {
      color: #bfcbd9;
    }
    .el-icon-close {
      position: absolute;
      z-index: 2;
      width: 35px;
      height: 34px;
      line-height: 34px;
      right: 0;
      top: 1px;
      text-align: center;
      color: rgb(191, 194, 217);
      transition: all .3s;
      border: 1px solid rgb(191, 194, 217);
      background-color: #FFF;
      border-left: 0;
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  }
</style>
<style lang="scss" scoped>
  #picker {
    width: 50%;
    margin: 20px auto;
    padding-top: 20px;
      
    .flatpickr {
      input {
        float: left;
        border: 1px solid #c3c3c3;
        height: 36px;
        line-height: 36px;
        padding: 8px;
        width: 250px;
        border-radius: 3px;
        background: #fff;
      }
      .el-icon-date, .el-icon-close {
        float: left;
        height: 36px;
        line-height: 36px;
        padding: 0 8px;
        border: 1px solid #c3c3c3;
        box-sizing: border-box;
      }
    }
    .flatpickr-ipt {
      border: 1px solid #868696;
      border-radius: 4px;
      height: 36px;
      line-height: 36px;
      background-color: transparent;
    }
  }
</style>
