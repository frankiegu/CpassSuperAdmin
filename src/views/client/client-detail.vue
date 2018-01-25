<template>
  <div class="main-content">
    <lh-title
      title="详情"
      :level2="false"
      @goBack="goBack"></lh-title>

    Component: detail
  </div>
</template>

<script>
  export default {
    name: 'detail',
    data() {
      return {}
    },
    props: {},
    components: {},
    mounted() {
      this.$nextTick(() => {
      })
    },
    watch: {},
    computed: {},
    filters: {},
    methods: {
      goBack() {
        console.log('详情');
      }
    }
  }
</script>

<style lang="scss" scoped></style>
