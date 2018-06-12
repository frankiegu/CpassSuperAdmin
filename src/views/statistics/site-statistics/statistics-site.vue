<template>
  <div class="statistics-site">
    <div class="card-padding">
      <div class="card-body-title">场地概况</div>
      <div class="select-type mt10 mb10">
        <el-select
          v-model="formData.type"
          @change="getPageData(1)"
          filterable
          placeholder="请选择状态"
          class="width150px fr"
          clearable>
          <el-option
            v-for="item in typeList"
            :label="item.text"
            :value="item.val"
            :key="item.val"></el-option>
        </el-select>
      </div>
      <div class="show-box"></div>
    </div>
  </div>
</template>

<script>
  import siteStatisticsMixin from './site-statistics.mixin'
  import tableMixins from '@/mixins/table'

  export default {
    mixins: [tableMixins, siteStatisticsMixin],
    components: {},
    data () {
      return {
      }
    },
    mounted () {
    },
    methods: {
    }
  }
</script>

<style lang="scss" scoped>
  @import "src/styles/config";
  .statistics-site{
    .card-body-title{
      font-size: 16px;
    }
    .select-type{
      width: 100%;
      height: 32px;
    }
  }
</style>
