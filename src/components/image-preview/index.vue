<template>
  <div class="image-preview-page">
    <el-dialog
      width="100%"
      :show-close="false"
      top="0"
      :lock-scroll="true"
      :close-on-click-modal="false"
      :visible.sync="imageDialog">
      <div class="img-indicator-wrapper">
        <img class="preview-big-img" :src="previewImgSrc" alt="">
        <div class="indicators-wrapper">
          <span class="indicator-span" v-for="(item, indicationI) in imageList" :key="indicationI" :class="{'indicator-span-active': previewActiveIndex === indicationI}"></span>
        </div>
      </div>
      <img alt="" class="close-btn" src="/static/images/pic-icon-close.png" @click="closePreview">
      <img src="/static/images/pic-icon-arrow-left.png" alt="" class="last-img-btn" v-if="previewActiveIndex" @click="lastImg">
      <img src="/static/images/pic-icon-arrow-right.png" alt="" class="next-img-btn" v-if="previewActiveIndex !== imageList.length - 1" @click="nextImg">
    </el-dialog>
  </div>
</template>
<script>
  export default {
    props: {
      imageDialog: {
        type: Boolean,
        default: false
      },
      imageList: {
        type: Array,
        default: []
      },
      previewActiveIndex: {
        type: Number,
        default: ''
      },
      previewImgSrc: {
        type: String,
        default: ''
      }
    },
    methods: {
      closePreview () {
        this.$emit('closePreview')
      },
      lastImg () {
        this.$emit('lastImg')
      },
      nextImg () {
        this.$emit('nextImg')
      }
    }
  }
</script>
<style lang="scss">
  .image-preview-page {
    .el-dialog {
      background-color: transparent;
      position: static;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0);
      margin-bottom: 0;
      .el-carousel {
        position: absolute;
        min-height: 300px;
        top: 50%;
        left: 50%;
        width: 100%;
        -webkit-transform: translate(-50%, -50%);
        -moz-transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        -o-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
      }
      .img-indicator-wrapper {
        position: fixed;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
      }
      .preview-big-img {
        display: block;
        max-width: 70%;
        max-height: 70%;
        position: relative;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%, -60%);
        -moz-transform: translate(-50%, -60%);
        -ms-transform: translate(-50%, -60%);
        -o-transform: translate(-50%, -60%);
        transform: translate(-50%, -60%);
      }
      .close-btn {
        display: block;
        width: 54px;
        height: 54px;
        position: absolute;
        top: 64px;
        right: 32px;
        cursor: pointer;
      }
      .last-img-btn {
        cursor: pointer;
        display: block;
        width: 56px;
        height: 56px;
        position: absolute;
        top: 50%;
        left: 5%;
        -webkit-transform: translte(0, -50%);
        -moz-transform: translte(0, -50%);
        -ms-transform: translte(0, -50%);
        -o-transform: translte(0, -50%);
        transform: translte(0, -50%);
      }
      .next-img-btn {
        cursor: pointer;
        display: block;
        width: 56px;
        height: 56px;
        position: absolute;
        top: 50%;
        right: 5%;
        -webkit-transform: translte(0, -50%);
        -moz-transform: translte(0, -50%);
        -ms-transform: translte(0, -50%);
        -o-transform: translte(0, -50%);
        transform: translte(0, -50%);
      }
      .indicators-wrapper {
        height: 10px;
        position: absolute;
        left: 50%;
        bottom: 20%;
        -webkit-transform: translate(-50%, 0);
        -moz-transform: translate(-50%, 0);
        -ms-transform: translate(-50%, 0);
        -o-transform: translate(-50%, 0);
        transform: translate(-50%, 0);
        text-align: center;
        .indicator-span {
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background:rgba(255,255,255,0.4);
        }
        .indicator-span + .indicator-span {
          margin-left: 10px;
        }
        .indicator-span-active {
          background:rgba(255,255,255,1);
        }
      }
    }
  }
</style>
