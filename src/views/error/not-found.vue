<template>
  <lh-error
    route="/not-found"
    conTitle="404 NOT FOUND"
    conDec="对不起，没有找到您访问的页面"></lh-error>
</template>

<script>
  import error from '@/components/error'
  export default {
    components: {
      [error.name]: error
    }
  }
</script>
