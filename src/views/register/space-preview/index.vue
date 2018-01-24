<template>
  <div class="preview-space" :style="{width: width + 'px'}">

    <swipe
      :auto="5000"
      :showIndicators="showIndicators"
      class="my-swipe">

      <swipe-item class="slide"
        v-for="(swiperItem, index) in spaceDetail.swiperArr":key="index">

        <img :src="swiperItem.img" :alt="index + 1">
      </swipe-item>
    </swipe>

    <!--设备-->
    <ul class="news-list" v-if="spaceDetail.withpic">
      <li class="news-item" v-for="item in spaceDetail.withpic">
        <!--v-for="newsItem in newsThumbs"-->
        <img :src="item.icon" alt="">
        <p>{{item.name}}</p>
      </li>
    </ul>

    <!--设施描述-->
    <div class="device_description" v-show="spaceDetail.facilitiesAndServices">
      <h3 id="top"><span class="device_service_img"></span>设施和服务</h3>
      <div v-html="spaceDetail.facilitiesAndServices"></div>
    </div>

    <!--地图-->
    <div class="space_map">
      <h4>
        <span class="space_map_img"></span>
        <span class="contact_info">
          <a :href="'tel:' + spaceDetail.fieldContact"></a>
        </span>
        <span class="span-center">
          {{ spaceDetail.fieldAddress }}
        </span>
      </h4>
      <div class="address_map" id="container"></div>
    </div>
  </div>
</template>

<script>
  import areaPic from './images/appointment_area_icon.png'
  import personsPic from './images/appointment_people_icon.png'
  import { fieldPreview } from '@/service'
  import { Swipe, SwipeItem } from 'vue-swipe';

  // 腾讯地图 api 引入
  import tcMap from '@/config/tc-map'

  export default {
    components: {
      Swipe,
      SwipeItem
    },
    data() {
      return {
        title: '预览场地',
        id: this.$route.query.id,
        spaceDetail: {
          facilitiesAndServices: '',
          fieldAddress: '',
          fieldContact: ''
        },
        isused: true,
        withpic: [],
        scrolltop: '',
        // 空间ID
        fieldId: this.$route.params.fieldId,
        token: sessionStorage.getItem('token'),
        deviceSevericeDes: '',
        showIndicators: false, // 是否显示 swiper下标
        orderId: '',
        width: '',
        height: ''
      }
    },
    mounted () {
      const self = this
      require('vue-swipe/dist/vue-swipe.css');

      self.getSpaceDetail()
      self.token = sessionStorage.getItem('token')
      self.width = screen.width
      self.height = parseInt(self.width / 1.875)
      // console.log('self.width: ', self.width, self.height);
    },
    methods: {
      // 地图
      getSpaceAddress () {
        const self = this
        // console.log(this.latitude, this.longitude)
        tcMap().then(qq => {
          var center = new qq.maps.LatLng(self.spaceDetail.latitude, self.spaceDetail.longitude)
          var map = new qq.maps.Map(document.getElementById('container'), {
            center: center,
            // 若为false则禁止拖拽
            draggable: false,
            zoom: 15
          })
          // 创建marker
          var marker = new qq.maps.Marker({
            map: map
          })
          marker.setPosition(center)
        })
      },
      // 场地详情
      getSpaceDetail () {
        const self = this
        fieldPreview({
          fieldId: self.id
        }).then(res => {
          if (res.status === 'true') {
            self.spaceDetail.facilitiesAndServices = res.info.field.facilitiesAndServices
            self.spaceDetail.latitude = res.info.store.latitude
            self.spaceDetail.longitude = res.info.store.longitude
            self.spaceDetail.withpic = res.info.equipmentList

            // 默认展示场地面积和预约人数
            let defaultService = [
              {
                icon: areaPic,
                name: res.info.field.area >= 1000 ? '999+' : res.info.field.area
              }, {
                icon: personsPic,
                name: res.info.field.maxAdmissibleNum >= 1000 ? '999+' : res.info.field.maxAdmissibleNum
              }
            ]
            self.spaceDetail.withpic.unshift(...defaultService)

            self.spaceDetail.swiperArr = res.info.fieldImgList
            // console.log('self.spaceDetail.swiperArr', self.spaceDetail.swiperArr);
            self.showIndicators = (self.spaceDetail.swiperArr.length > 1)
            self.spaceDetail.fieldAddress = res.info.store.provinceName + res.info.store.cityName + res.info.store.districtName + res.info.store.address
            self.spaceDetail.fieldContact = res.info.store.contactTel

            self.getSpaceAddress()
          } else {
            self.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            });
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .preview-space {
    // swipe
    .my-swipe {
      height: 180px;
      color: white;
      text-align: center;
      overflow: hidden;

      .slide {
        img {
          width: 100%;
          vertical-align: top;
        }
      }
      .mint-swipe-indicators .is-active {
        background-color: #fff;
      }
      .mint-swipe-indicator {
        background-color: transparent;
        border:1px solid #fff;
        opacity: 1;
      }
    }
  }
</style>
<style lang="scss" scoped>
  @import "src/styles/common.scss";

  .preview-space {
    min-width: 320px;
    min-height: 100vh;
    margin: 0 auto;
    background-color: #FFF;

    // swipe
    .my-swipe {
      height: 180px;
      color: white;
      text-align: center;
      overflow: hidden;

      .slide {
        img {
          width: 100%;
          vertical-align: top;
        }
      }
    }
    // 设备列表
    .news-list {
      white-space: nowrap;
      padding-left: 10px;
      -webkit-overflow-scrolling: touch; // IOS设备滑动流畅 允许独立的滚动区域和触摸回弹
      overflow-y: hidden;

      .news-item {
        display: inline-block;
        width: 20%;
        height: 78px;
        padding: 15px 15px 0px 15px;
        box-sizing: border-box;

        img {
          width: 60%;
          margin: 0 auto;
          display: block;
        }
        p {
          color: #5E80E5;
          font-size: 13px;
          margin-top: 5px;
          text-align: center;
        }
      }
    }
    // 设施描述
    .device_description {
      /*height: 150px;*/
      border-top: 1px solid #E1E1E1;
      border-bottom: 1px solid #E1E1E1;
      padding:20px 15px;
      background-color: #fff;
      box-sizing: border-box;
      h3 {
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #1C1C2F;
        letter-spacing: 0;
        line-height: 15px;
        margin-bottom: 14px;
      }
      .device_service_img {
        display: inline-block;
        width: 12px;
        height: 12px;
        background: url("./images/appointment_facilities_icon.png") no-repeat;
        background-size:100%;
        margin-right: 8px;
      }
      li {
        position: relative;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #9E9EA8;
        letter-spacing: 0;
        line-height: 20px;
        margin-left: 20px;

        &:before {
          position: absolute;
          top: -4px;
          left: -6px;
          content: '.'
        }
      }
    }
    // 地图
    .space_map {
      height: 243px;
      padding: 20px 15px;
      box-sizing: border-box;
      /*border-bottom: 1px solid #E1E1E1;*/
      background-color: #fff;
      h4 {
        .fieldaddress {
          display: inline-block;
          width: 75%;
          overflow: hidden;
          height: 19px;
        }
        .span-center {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .space_map_img {
          float: left;
          display: inline-block;
          width: 20px;
          height: 20px;
          background: url("./images/appointment_address_red_icon.png") no-repeat;
          background-size: 100%;
          vertical-align: middle;
          margin-right: 8px;

        }
        .contact_info {
          display: block;
          width: 42px;
          height: 17px;
          vertical-align: middle;
          float: right;
          padding-left: 13px;
          box-sizing: border-box;
          /*background-color: red;*/
          border-left:1px solid #E1E1E1;

          a {
            display: block;
            width: 50px;
            height: 50px;
            background: url("./images/appointment_number_icon.png") no-repeat center;
            background-size: 60%;
            margin-left: -10px;
            margin-top: -16px;
          }
        }
      }
      /*地图*/
      .address_map {
        width: 100%;
        height: 170px;
        border:1px solid #E1E1E1;
        margin-top: 15px;
      }
    }
  }
</style>
