<template>
  <div id="practise">

    <div class="page-title">
      <h1>小组件</h1>
    </div>
    <div class="store-setting card-padding">
      <p>mock-test: {{ mockName }}</p>

      <input type="text" style="border: 1px solid red" v-focus="true">
      <div class='component-item'>
        <pan-thumb image='https://wpimg.wallstcn.com/577965b9-bb9e-4e02-9f0c-095b41417191'>
          上海花裤衩
        </pan-thumb>
        <code class='code-part'>图片hover效果</code>
      </div>

      <el-button class="filter-item" type="primary" v-waves icon="search">水波纹效果</el-button>

      <p>筛选：{{ message | capitalize }}</p>

      <p>计算机属性，反序：{{ message2 }} : {{ message3 }}</p>

      <ol>
        <li v-for="(value, key, index) in object">
          {{ value }} : {{ key }} : {{ index }}
        </li>
      </ol>
    </div>

  </div>
</template>

<script>
  import PanThumb from './components/panThumb';
  import { examplesDemo } from '@/mock/api';
  export default {
    data () {
      return {
        title: '小组件',
        message: 'filters',
        message2: 'filters!',
        mockName: '',
        object: {
          name: 'sdf',
          url: 'ht',
          sologan: 'sdf'
        }
      }
    },
    methods: {},
    components: { PanThumb },
    mounted () {
      examplesDemo().then(res => {
        if (res.status) {
          this.mockName = res.info[1].storeName
        }
      })
    },
    props: {},
    watch: {},
    // 复杂逻辑
    // 性能更好
    computed: {
      message3: function () {
        return this.message2.split('').reverse().join('')
      }
    },
    filters: {
      capitalize: function (value) {
        if (!value) return ''
        value = value.toString()
        return value.charAt(0).toUpperCase() + value.slice(1)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/config";

  #practise {
    .component-item {
      margin-bottom: 30px;
    }
    p, li {
      padding: 10px 0;
    }
  }
</style>
