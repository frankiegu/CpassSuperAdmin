<template>
  <div class="logout-container"></div>
</template>

<script>
  export default {
    data() {
      return {}
    },
    mounted() {
      this.logout()
    },
    methods: {
      logout() {
        this.$store.commit('SET_TOKEN', '')
        this.$store.commit('SET_RESOURCES', 'no')
        sessionStorage.removeItem('token')
        this.$store.commit('SET_PERMISSION', '')

        this.$router.replace({
          path: '/login'
        })
      }
    }
  }
</script>
