<template>
  <div class="space-add-upload">
    <el-col :span="24">
      <el-upload
        v-for="(item, index) in imgs"
        :key="index"
        :action="action"
        :on-success="handleOnSuccess"
        @click.native="handleNativeClick(index)"
        name="img"
        :headers="headers"
        :disabled="noAllow"
        :show-file-list="false"
        accept="image/png, image/jpeg"
        class="avatar-uploader">

        <div class="img-box">
          <!-- 主图 -->
          <img v-if="item.img" :src="item.img + zoomImgSize(178, 178)" :class="{'avatar': true, 'mainimg-border': item.mainImg === 1}">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>

          <!-- 主图删除 -->
          <div v-if="item.img && !noAllow" class="delete-box">
            <i @click.stop="handleRemove(index)" class="el-icon-delete2"></i>
          </div>

          <!-- 主图标识 -->
          <div v-if="item.mainImg === 1" class="mainimg-tag">
            <i class="el-icon-check"></i>
          </div>
        </div>

        <!-- 设置主图 -->
        <p v-if="item.mainImg === 0 && item.img" @click.stop="handleSetMainImg(index)">设为主图</p>
      </el-upload>

    </el-col>
      &nbsp;&nbsp;
      <span class="theme-gray">{{ imgsLength }}/5，为了保证用户端显示效果，建议上传尺寸为690*380</span>
  </div>
</template>

<script>
  import { API_PATH } from '@/config/env'
  export default {
    name: 'LhUploads',
    data () {
      return {
        action: API_PATH + '/manage/file/uploadPic',
        headers: {token: sessionStorage.getItem('token')}
      }
    },
    props: {
      imgsArr: {
        type: Array,
        required: true
      },
      imgsLenght: {
        type: Number,
        required: true
      },
      noAllow: {
        type: Boolean,
        required: false
      }
    },
    watch: {
      imgs: function() {
        this.setEmptyUpload()
      },
      noAllow: function(val, oldVal) {
        this.setEmptyUpload()
      }
    },
    computed: {
      imgs() {
        return this.imgsArr
      },
      imgsLength() {
        return this.imgs[this.imgs.length - 1].img !== undefined ? this.imgs.length : this.imgs.length - 1
      }
    },
    mounted() {
      // console.log('test', this.noAllow);
    },
    methods: {
      setEmptyUpload() {
        if ((this.imgs.length < this.imgsLenght) && (this.imgs[this.imgs.length - 1].img !== undefined) && !this.noAllow) {
          this.imgs.push({})
        }
      },
      handleSetMainImg(index) {
        const self = this
        for (let i = 0; i < self.imgs.length; i++) {
          self.imgs[i].mainImg = 0
        }
        let mainImg = self.imgs[index]
        mainImg.mainImg = 1
        self.imgs.splice(index, 1, mainImg)
      },
      handleRemove(index) {
        this.imgs.splice(index, 1)
      },
      handleOnSuccess(res, file) {
        if (res.status === 'true') {
          this.imgs.splice(this.currentUploadIndex, 1, {
            img: res.info,
            mainImg: 0
          })
        }
      },
      // 点击记录上传的索引
      handleNativeClick(index) {
        if (!this.isIndexLock) {
          this.currentUploadIndex = index
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import 'src/styles/config.scss';
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .avatar-uploader {
    float: left;
    min-height: 221px;
    margin-left: 10px;
    background-color: #fff;

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
      border: 1px dashed #c0ccda;
    }

    p {
      color: $theme-blue;
      height: 30px;
    }
    .img-box {
      position: relative;
      border-radius: 6px;
      cursor: pointer;
      overflow: hidden;

      img {
        position: relative;
        z-index: 1;
        border: 1px solid #c0ccda;
        box-sizing: border-box;
        border-radius: 6px;
      }
      .delete-box {
        opacity: 0;
        position: absolute;
        z-index: 2;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        text-align: center;
        color: #fff;
        background-color: rgba(0, 0, 0, .5);
        transition: opacity .3s;
      }
      .el-icon-delete2 {
        position: absolute;
        left: 50%;
        top: 50%;
        display: block;
        font-size: 28px;
        width: 20px;
        height: 20px;
        margin: -10px 0 0 -10px;
        cursor: pointer;
        opacity: .75;
        color: #fff;
        transform: scale(.7);

        &:before {
          content: "\E612";
        }
      }
    }
    .img-box:hover {
      .mainimg-tag {
        display: none;
      }
      .delete-box {
        opacity: 1;
      }
    }
    .el-upload {
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .mainimg-tag {
      opacity: 1;
      display: block;
      position: absolute;
      z-index: 1;
      right: -24px;
      top: -10px;
      width: 60px;
      height: 36px;
      background: #13ce66;
      text-align: center;
      transform: rotate(45deg);
      -webkit-transform: rotate(45deg);

      .el-icon-check {
        color: #fff;
        font-size: 16px;
        position: absolute;
        transform: rotate(-45deg) scale(0.8);
        -webkit-transform: rotate(-45deg) scale(0.8);
        top: 16px;
        right: 23px;

        &:before {
          content: '主';
        }
      }
    }
  }
</style>
