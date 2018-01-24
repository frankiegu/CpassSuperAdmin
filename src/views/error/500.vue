<template>
  <lh-error
    route="/500"
    conTitle="500-抱歉，服务端出错了"
    conDec="服务端出了点小问题"></lh-error>
</template>

<script>
  import error from '@/components/error'
  export default {
    components: {
      [error.name]: error
    }
  }
</script>
