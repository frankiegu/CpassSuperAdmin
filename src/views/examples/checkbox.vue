<template>
  <div style="margin-top: 200px;">
    <el-checkbox v-for="item in checkboxData" v-model="item.checked" :key="item.id" @change="handleChange"><img :src="item.icon" alt="" style="width: 20px; height: 20px;"> {{item.name}}</el-checkbox>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        checkboxData: [

        ]
      }
    },
    created () {
      console.log('..................')
      var fetchData = [{
        'id': 1,
        'checked': true,
        'name': '无线网络',
        'icon': 'http://shared-office.oss-cn-shenzhen.aliyuncs.com/shared-office/img/20170922/20170922165713411HWJ.png',
        'created': '2017-09-22 16:58:15'
      },
      {
        'id': 2,
        'checked': false,
        'name': '音响',
        'icon': 'http://shared-office.oss-cn-shenzhen.aliyuncs.com/shared-office/img/20170922/20170922165714822E7L.png',
        'created': '2017-09-22 16:58:15'
      },
      {
        'id': 3,
        'checked': true,
        'name': '投影',
        'icon': 'http://shared-office.oss-cn-shenzhen.aliyuncs.com/shared-office/img/20170922/20170922165714239VHz.png',
        'created': '2017-09-22 16:58:15'
      }]

      // for (let i in fetchData) {
      //   fetchData[i].checked = true
      // }

      console.log(fetchData)

      this.checkboxData = fetchData;
    },
    methods: {
      handleChange () {
        console.dir(this.checkboxData)
      }
    }
  }
</script>
