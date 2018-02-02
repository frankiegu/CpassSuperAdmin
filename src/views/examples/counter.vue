<template>
  <div>
    <h2>Clicked: {{ $store.state.counter.count }} times, count is {{ evenOrOdd }}.</h2>
    <br>
    <div @click="increment">+</div>
    <div @click="decrement">-</div>
    <br>
    <div @click="incrementIfOdd">Increment if odd</div>
    <div @click="incrementAsync">Increment async</div>
    <br>
    <div size="small" type="default"  @click="log(getCount)">SHOW LOG</div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'evenOrOdd',
      'getCount'
    ])
  },
  methods: {
    log (num) {
      console.dir(this.$route)
      console.log('SHOW LOG---->' + num)
    },
    ...mapActions([
      'increment',
      'decrement',
      'incrementIfOdd',
      'incrementAsync'
    ])
  }
}
</script>
