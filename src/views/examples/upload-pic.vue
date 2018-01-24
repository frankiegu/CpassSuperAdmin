<template>
  <div class="space-add">
    <div class="tab-header">
      <el-col :span="24">
        <el-upload v-for="(item, index) in onePartForm.imgs"
                    :headers="headers"
                    name="img"
                    class="avatar-uploader"
                    :action="onePartForm.action"
                    :show-file-list="false"
                    :on-success="handleOnSuccess"
                    @click.native="handleNativeClick(index)"
                    :key="item.id">

          <div class="img-box">
            <!-- 主图 -->
            <img v-if="item.img" :src="item.img" :class="{'avatar': true, 'mainimg-border': item.mainImg === 1}">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>

            <!-- 主图删除 -->
            <div v-if="item.img" class="delete-box">
              <i @click.stop="handleRemove(index)" class="el-icon-delete2"></i>
            </div>

            <!-- 主图标识 -->
            <div v-if="item.mainImg === 1" class="mainimg-tag">
              <i class="el-icon-check"></i>
            </div>
          </div>

          <!-- 设置主图 -->
          <p v-show="item.mainImg === 0 && item.img" @click.stop="handleSetMainImg(index)">设为主图</p>
        </el-upload>

        <el-dialog v-show="dialogVisible" size="tiny">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-col>

      <span class="theme-gray">{{ imgsLength }}/5，为了保证用户端显示效果，建议上传尺寸为690*380</span>
    </div>
  </div>
</template>

<script>
  import { API_PATH } from '@/config/env'

  export default {
    data () {
      return {
        headers: {
          token: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ7XCJpZFwiOjIsXCJ1c2VybmFtZVwiOlwiMTM4MjYwMTc4NjBcIixcImNoYW5uZWxcIjpcInBjXCIsXCJjbGllbnRPck1hbmFnZVwiOjEsXCJjcmVhdGVEYXRlXCI6XCIyMDE3LTEwLTA5IDIwOjMzOjE5XCJ9IiwibmJmIjoxNTA3NTUyMzk5LCJpc3MiOiJsZWlob3V6aGl6aG9uZyIsImV4cCI6MTUwOTYyNTk5OSwiaWF0IjoxNTA3NTUyMzk5LCJqdGkiOiI0Zjc4YzU0OC1mOTM5LTQ5MjktODE5OC03MDQ1ODRiNjcyODQifQ.Fe2AadVYjgBNR_plyQRIZZ6f_zct9Sns9GPy-tfeEKI'
        },
        dialogVisible: false,
        dialogImageUrl: '',
        onePartForm: {
          currentUploadIndex: '',
          imgs: [
            {
              'img': 'http://shared-office.oss-cn-shenzhen.aliyuncs.com/shared-office/img/20170921/20170921202804135Sd7.jpg',
              'mainImg': 1
            },
            {
              'img': 'http://shared-office.oss-cn-shenzhen.aliyuncs.com/shared-office/img/20170923/20170923145014646rpW.jpg',
              'mainImg': 0
            }
          ],
          action: API_PATH + '/manage/file/uploadPic'
        }
      }
    },
    mounted: function () {
      this.setEmptyUpload()
    },
    methods: {
      handleSetMainImg (index) {
        for (let i in this.onePartForm.imgs) {
          this.onePartForm.imgs[i].mainImg = 0
        }
        let mainImg = this.onePartForm.imgs[index]
        mainImg.mainImg = 1
        this.onePartForm.imgs.splice(index, 1, mainImg)
      },
      handleOnError () {
      },
      // 上传成功
      handleOnSuccess(res, file) {
        if (res.status === 'true') {
          console.log(this.onePartForm.imgs)
          this.onePartForm.imgs.splice(this.currentUploadIndex, 1, {
            img: res.info,
            mainImg: 0
          })
        }
      },
      // 删除
      handleRemove (index) {
        this.onePartForm.imgs.splice(index, 1)
        // console.log('handleRemove')
      },
      // 点击记录上传的索引
      handleNativeClick (index) {
        if (!this.isIndexLock) {
          this.currentUploadIndex = index
        }
        console.log('handleNativeClick index -> ' + index)
      },
      // 设置空的上传位置
      setEmptyUpload () {
        if (this.onePartForm.imgs.length < 5 && this.onePartForm.imgs[this.onePartForm.imgs.length - 1].img !== undefined) {
          this.onePartForm.imgs.push({})
        }
        console.log('this.onePartForm.imgs.length ====>' + this.onePartForm.imgs.length)
      }
    },
    watch: {
      'onePartForm.imgs': function() {
        this.setEmptyUpload()
        console.log(this.onePartForm.imgs)
      }
    },
    computed: {
      imgsLength () {
        return this.onePartForm.imgs[this.onePartForm.imgs.length - 1].img !== undefined ? this.onePartForm.imgs.length : this.onePartForm.imgs.length - 1
      }
    }
  }
</script>



<style lang="scss">
  @import '../../styles/config.scss';
  .tab-header {
    background-color: #fff;
  }
  .avatar-uploader {
    background-color: #fff;
    overflow: hidden;

    p {
      color: $theme-blue;
      height: 20px;
      padding: 5px 0;
    }
    .img-box {
      position: relative;

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
          content: "\E624";
        }
      }
    }
    .el-upload:hover {
      .mainimg-tag {
        display: none;
      }
      .delete-box {
        opacity: 1;
      }
    }
    .el-upload, .el-upload:hover {
      border: none !important;
    }
    .avatar-uploader-icon {
      border: 1px dashed #c0ccda;
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



<style lang="scss">
  .qr-box-more {
    .qr-box {
      width: 344px;
      margin: 0 auto;

      img {
        width: 100%;
      }
      p {
        height: 36px;
        line-height: 36px;
        text-align: center;
        color: #fff;
        background-color: #5E80E5;
      }
    }
    .call-back {
      text-align: center;
    }
  }
</style>
<style lang="scss" scoped>
  @import '../../styles/config.scss';

  .space-add {
    .set-main-img {
      clear: both;
      overflow: hidden;

      li {
        float: left;
        width: 148px;
        margin: 0 8px 8px 0;
        text-align: center;
      }
    }
    .quill-editor-box {
      .quill-editor {
        height: 300px;
      }
    }
    .tab-header {
      padding-top: 30px;

      .tab {
        padding: 0 35px;
        background-color: #fff;
        cursor: pointer;

        .tab-in {
          padding: 20px 0;
          border-bottom: 3px solid #fff;
        }
        .circle {
          display: inline-block;
          width: 36px;
          height: 36px;
          line-height: 36px;
          margin-right: 35px;
          text-align: center;
          color: $theme-gray;
          border: 1px solid $theme-gray;
          border-radius: 50%;
        }
      }
      .tab-activity {
        color: $theme-blue;

        .circle {
          color: $theme-blue;
          border: 1px solid $theme-blue;
        }
        .tab-in {
          border-color: $theme-blue;
        }
      }
    }
  }
  .upload-pic {
    li {
      border: 2px solid #f00;
    }
  }
</style>

<style lang="scss" scoped>
  .avatar-uploader {
    float: left;
    margin-left: 10px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
