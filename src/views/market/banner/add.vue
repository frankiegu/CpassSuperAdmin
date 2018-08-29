<template>
  <div class="add-market-banner">
    <lh-title :title="title"></lh-title>

    <el-form
      :model="formData"
      :rules="formDataRule"
      ref="formData"
      label-width="180px"
      @submit.native.prevent
      label-position="right"
      class="card-padding pv32">
      <el-form-item prop="bannerPath" label="首页banner">
        <lh-upload
          @uploadImg="val => formData.bannerPath = val"
          :imgUrl="formData.bannerPath"
          :disabled="noAllow"
          :size="80"/>

        <el-popover ref="tipPopover" placement="right" title="" width="167" trigger="hover">
          <div class="fz12">
            建议尺寸：670PX * 260PX<br>
            支持格式：JPG / PNG
          </div>
        </el-popover>
        <span v-popover:tipPopover class="fl lh66 ml10">
          <lh-svg icon-class="icon-info" class="theme-gray"></lh-svg>
        </span>
        <!--<p class="theme-red fz12 clearfix mt-6 h6">{{ verifyImg }}</p>-->
      </el-form-item>

      <el-form-item prop="title" label="banner标题">
        <el-input class="width300px" v-model.trim="formData.title" :disabled="noAllow" :maxlength="30" placeholder="请输入banner标题"></el-input>
      </el-form-item>

      <el-form-item prop="wxLink" label="APP跳转链接">
        <el-input class="width300px" v-model.trim="formData.wxLink" :disabled="noAllow":maxlength="15" placeholder="暂仅支持h5链接跳转"></el-input>
      </el-form-item>

      <el-form-item prop="wxAppLink" label="小程序路径">
        <el-input class="width300px" v-model.trim="formData.wxAppLink" :disabled="noAllow":maxlength="15" placeholder="请输入小程序页面路径"></el-input>
      </el-form-item>

      <el-form-item class="lh-form-item0">
        <el-button @click="submitForm('formData')" type="primary" class="lh-btn-mini">{{ noAllow ? '编辑' : '保存' }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import lhUpload from '@/components/upload'
import addMixins from './add.mixin'

export default {
  mixins: [addMixins],
  components: {
    [lhUpload.name]: lhUpload
  },
  mounted () {
  },
  methods: {
  }
};
</script>

<style lang="scss" scoped>
@import "src/styles/config";
.add-market-banner {
}
</style>
