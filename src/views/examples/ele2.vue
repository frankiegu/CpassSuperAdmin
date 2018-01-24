<template>
  <div class="ele2">
    <el-button :plain="true" @click="open5">消息</el-button>
  </div>
</template>

<script>
  export default {
    data () {
      return {
      }
    },
    mounted: function () {
    },
    methods: {
      open5() {
        this.$message({
          showClose: true,
          message: '这是一条消息提示'
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .ele2 {

  }
</style>
