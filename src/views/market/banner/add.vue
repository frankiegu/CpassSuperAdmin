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
      <el-form-item prop="title" label="banner标题">
        <el-input class="width300px" v-model.trim="formData.title" :disabled="noAllow" :maxlength="30" placeholder="请输入banner标题"></el-input>
      </el-form-item>

      <el-form-item prop="subTitle" label="副标题">
        <el-input class="width300px" v-model.trim="formData.subTitle" :disabled="noAllow" :maxlength="30" placeholder="请输入副标题"></el-input>
      </el-form-item>

      <el-form-item prop="bannerPath" label="首页banner">
        <lh-upload
          @uploadImg="uploadBanner"
          :imgUrl="formData.bannerPath"
          :disabled="noAllow"
          :size="80"/>

        <i class="el-icon-question fl theme-light-gray mt8 mr5 ml15" @click="bannerUploadText = true"></i>
        <div v-if="bannerUploadText" class="fl">
          <p>建议尺寸： 670PX * 260PX<br>支持格式： JPG / PNG</p>
        </div>
        <p class="theme-red fz12 clearfix mt-6 h6">{{ verifyBanner }}</p>
      </el-form-item>

      <el-form-item prop="shareImgUrl" label="分享配图">
        <lh-upload
          @uploadImg="uploadShareImg"
          :imgUrl="formData.shareImgUrl"
          :disabled="noAllow"
          :size="80"/>

        <i class="el-icon-question fl theme-light-gray mt8 mr5 ml15" @click="ShareUploadText = true"></i>
        <div v-if="ShareUploadText" class="fl">
          <p>建议尺寸： 500PX * 400PX<br>支持格式： JPG / PNG</p>
        </div>
        <p class="theme-red fz12 clearfix mt-6 h6">{{ verifyShare }}</p>
      </el-form-item>

      <el-form-item prop="wxLink" label="APP跳转链接">
        <el-input class="width300px" v-model.trim="formData.wxLink" :disabled="noAllow" placeholder="暂仅支持h5链接跳转"></el-input>
      </el-form-item>

      <el-form-item prop="wxAppLink" label="小程序路径">
        <el-input class="width300px" v-model.trim="formData.wxAppLink" :disabled="noAllow" placeholder="请输入小程序页面路径"></el-input>
      </el-form-item>

      <el-form-item class="lh-form-item0">
        <div v-if="noAllow">
          <el-button v-if="handleHasPermissions('/supervisor/indexBanner/Update')" @click="submitForm('formData')" type="primary" class="lh-btn-mini">编辑</el-button>
        </div>
        <div v-else>
          <el-button @click="submitForm('formData')" type="primary" class="lh-btn-mini">保存</el-button>

        </div>
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
