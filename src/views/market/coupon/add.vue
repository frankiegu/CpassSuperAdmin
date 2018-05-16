<template>
  <div class="add-coupon">
    <lh-title />

    <div class="lh-card-main lh-card-body">
    </div>

    <!-- 添加核销点弹窗 -->
    <add-wop-dialog v-if="false" :is-visible="isWopVisible" @closeDialog="isWopVisible = false"></add-wop-dialog>
  </div>
</template>

<script>
  import addWopDialog from '../components/add-wop-dialog'
  export default {
    name: 'add',
    data() {
      return {
        isWopVisible: false // 添加核销点弹窗
      }
    },
    components: { addWopDialog },
    mounted() {
    },
    methods: {}
  }
</script>

<style lang="scss" scoped>

</style>
