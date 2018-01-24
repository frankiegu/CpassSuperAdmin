<template>
  <div class="components-container mt90">
    <el-button @click="formatJson" class="mb22">替换双引号</el-button>
    <el-button @click="clear()" class="mb22">清空</el-button>

    <div class="editor-container">
      <json-editor ref="jsonEditor" v-model="json"></json-editor>
    </div>
    <textarea class="width100" rows="20">{{ jsonPare }}</textarea>
  </div>
</template>

<script>
import JsonEditor from '../components/json-editor'

export default {
  name: 'jsonEditor-demo',
  components: { JsonEditor },
  data() {
    return {
      json: '',
      jsonPare: ''
    }
  },
  methods: {
    formatJson() {
      this.jsonPare = JSON.parse(JSON.stringify(this.json)).replace(/"/g, '\'')
    },
    clear() {
      this.jsonPare = ''
      this.json = ''
    }
  }
}
</script>

<style scoped>
  .editor-container {
    height: 100%;
  }
</style>

