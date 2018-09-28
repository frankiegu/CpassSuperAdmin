<template>
  <transition name="fade">
    <div class="component-cpass-preview" v-if="dialogStatus">
      <div class="preview-box">
        <div class="lh-phone">
          <div class="p-con lh-quill-modules">
            <div v-html="content"></div>
          </div>

          <el-button @click="closeDialog" class="lh-btn-default width120px save-btn" plain>保存</el-button>
          <el-button @click="closeDialog" class="lh-btn-default width120px close-btn" plain>关闭</el-button>
        </div>
      </div>

      <div class="preview-mask"></div>
    </div>
  </transition>
</template>
<script>
  export default {
    name: 'CpassPreview',
    props: {
      dialogStatus: Boolean,
      content: String
    },
    watch: {
      dialogStatus: function(val, oldVal) {
        console.log('CpassPreview', this.content);
      }
    },
    methods: {
      closeDialog() {
        this.$emit('closeDialog')
      }
    }
  }
</script>

<style lang="scss" scoped src='./main.scss'></style>
<style lang="scss" src='../../com.scss'></style>