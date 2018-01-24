<template>
  <lh-error
    route="/not-permission"
    conTitle="当前页面访问权限不足"
    conDec="当前页面无访问权限，请联系管理员"></lh-error>
</template>

<script>
  import error from '@/components/error'
  export default {
    components: {
      [error.name]: error
    }
  }
</script>
