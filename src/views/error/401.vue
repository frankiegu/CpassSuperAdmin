<template>
  <lh-error errorTitle="401" errorDec="抱歉，你无权访问该页面" />
</template>

<script>
  import { error } from '@/components'
  export default {
    components: {
      [error.name]: error
    }
  }
</script>
