<template>
  <div id="picker">
    <el-form label-width="180px">
      <el-form-item label="Select a date">
        <flat-pickr
          v-model="date"
          placeholder="Select date"
          :config="config"
          :required="true"
          class="flatpickr-ipt"
          name="date">
        </flat-pickr>
      </el-form-item>
      <!--<pre>选中的日期是 - {{date}}</pre>-->
    </el-form>
  </div>
</template>

<script>
  import flatPickr from 'vue-flatpickr-component'
  import 'flatpickr/dist/flatpickr.css'
  import 'flatpickr/dist/themes/material_blue.css'
  export default {
    name: 'test',
    data () {
      return {
        date: new Date(),
        config: {
          wrap: true, // set wrap to true when using 'input-group'
          // altFormat: 'M j, Y',
          // altInput: true,
          mode: 'multiple',
          dateFormat: 'Y-m-d',
          defaultDate: ['2017-10-14', '2017-10-15', '2017-10-16', '2017-10-20', '2017-10-21', '2017-10-22', '2017-10-23'],
          minDate: new Date().fp_incr(1),
          enable: [
            function (date) {
              // return true to enable
              return (date.getDate() < 24)
            }
          ],
          onChange: function (selectedDates, dateStr, instance) {
            console.log(selectedDates, dateStr, instance)
          },
          onDayCreate: function(dObj, dStr, fp, dayElem) {
            // Utilize dayElem.dateObj, which is the corresponding Date

            // dummy logic
            if (Math.random() < 0.15) {
              dayElem.innerHTML += "<span class='event'></span>"
              console.log(dayElem.innerHTML)
            } else if (Math.random() > 0.85) {
              dayElem.innerHTML += "<span class='event busy'></span>"
            }
          }
        }
      }
    },
    props: {},
    components: {
      flatPickr
    },
    mounted () {
    },
    watch: {},
    computed: {},
    filters: {},
    methods: {}
  }
</script>

<style>
  .event {
    position: absolute;
    width: 3px;
    height: 3px;
    border-radius: 150px;
    bottom: 3px;
    left: calc(50% - 1.5px);
    content: " ";
    display: block;
    background: #3d8eb9;
  }

  .event.busy {
    background: #f64747;
  }
</style>
<style lang="scss" scoped>
  #picker {
    width: 50%;
    margin: 20px auto;
    padding-top: 20px;

    .flatpickr-ipt {
      border: 1px solid #868696;
      border-radius: 4px;
      height: 36px;
      line-height: 36px;
      background-color: transparent;
    }
  }
</style>
