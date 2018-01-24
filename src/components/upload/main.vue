<template>
  <el-upload
    :before-upload="beforeAvatarUpload"
    :on-success="handleAvatarSuccess"
    :disabled="disabled"
    :style="imgSize"
    name="img"
    :action="action"
    :headers="headers"
    :show-file-list="false"
    class="avatar-uploader"
    accept="image/png, image/jpeg">

    <img
      v-if="imgUrl"
      :src="imgUrl + zoomImgSize(size, size)"
      class="avatar"
      :style="imgSize" />
    <i
      v-else
      :style="imgSize"
      class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</template>

<script>
  import {API_PATH} from '@/config/env'
  export default {
    // 这样就可以很轻易的修改组件名，又不用修改文件名
    name: 'LhUpload',
    data () {
      return {
        headers: {
          token: sessionStorage.getItem('token')
        },
        action: API_PATH + '/manage/file/uploadPic'
      }
    },
    props: ['disabled', 'imgUrl', 'size'],
    computed: {
      imgSize() {
        let size = this.size || 80
        return {
          width: size + 'px',
          height: size + 'px',
          lineHeight: size + 'px'
        }
      }
    },
    methods: {
      beforeAvatarUpload(file) {
        const isLt1M = file.size / 1024 / 1024 < 1;
        if (!isLt1M) {
          this.setMsg('上传头像图片大小不能超过 1MB!');
          return false
        }

        if (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png') {
          return true
        }

        this.setMsg('上传头像图片只能是 JPG和PNG 格式!');
        return false
      },
      handleAvatarSuccess(res, file) {
        if (res.status === 'true') {
          this.$emit('uploadImg', res.info)
          this.setMsg('success', '图片上传成功!')
        } else {
          this.setMsg('上传图片失败！')
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .avatar-uploader {
    position: relative;
    margin-bottom: 2px;

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      text-align: center;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      overflow: hidden;

      &:hover {
        border-color: #20a0ff;
      }
    }
    .theme-gray {
      vertical-align: middle;
    }
    .avatar {
      display: block;
      border-radius: 6px;
    }
  }
</style>
