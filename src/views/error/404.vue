<template>
  <lh-error errorTitle="404" errorDec="抱歉，你访问的页面不存在" />
</template>

<script>
  import { error } from '@/components'
  export default {
    components: {
      [error.name]: error
    }
  }
</script>
