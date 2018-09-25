<template>
  <transition name="fade">
    <div class="component-cpass-preview" v-show="dialogStatus">
      <div class="preview-box">
        <div class="lh-phone">
          <div class="p-con">
            <section class="space-template">
              <!--精选描述-->
              <div class="quill-featured-description-wrapper">
                <div class="featured-description">
                  <p class="content">
                    从即日起至9月14日，我们将邀请100个追求自由、品质和个性的年轻人，成为第一批「CPASS空间体验官」！马上报名，即可解锁三大专属特权，come on！
                  </p>
                </div>
              </div>
              <!--正文-->
              <div class="quill-featured-subhead">这是一则寻人启事</div>
              <div class="quill-featured-main-text">如果你恰好是一个自由撰稿人，不想24小时宅在家里陷入神秘的贤者时间，望着窗台外的太阳，发现灵感溜得比日落还快。</div>
              <div class="quill-featured-main-text">如果你恰好是一个准备大型presentation的项目负责人，不想放弃对项目baby怀着的「优质学区追求」母性，随意将就于条件简易的演播场地。</div>
              <div class="quill-featured-main-text">如果你恰好是一个创业团队CEO，不想每次开会都要集体从咖啡厅A辗转到B再辗转到C，比过冬候鸟更懂迁徙的奥义。</div>
              <div class="quill-featured-main-text">……</div>
              <div class="quill-featured-main-text">恭喜你，或许你就是我们要找的百分之一！</div>
              <div class="quill-featured-main-text font-bold-style">从即日起至9月14日，我们正在找100个追求自由、品质和个性的年轻人，成为第一批「CPASS空间体验官」！</div>
              <div class="quill-featured-main-text font-bold-style">点击图片立即报名↓</div>
              <img src="../images/v912/banner.png" class="quill-featured-images" alt="">
              <div class="quill-featured-main-text font-bold-style">具体名单将于9月15日公布</div>
              <div class="quill-featured-main-text">成为空间体验官，你将马上拥有以下特权！</div>

              <!--介绍-->
              <div class="quill-featured-subhead">12个优质场地 免费享</div>
              <div class="quill-featured-main-text">覆盖广州、深圳、上海3大核心商务城市，拥有工位、会议室、路演厅和多功能场地等各类资源，让你跟沉闷枯燥的格子间say goodbye，自在体验安静舒适的办公场所！</div>
              <div class="quill-featured-subhead" v-for="(item, index) in storeList">
                <div class="sub-title-wrapper clearfix">
                  <img :src="item.logo" alt="" class="quill-featured-store-logo">
                  <h3 class="quill-featured-store-name">
                    <p>{{item.storeName}}</p>
                  </h3>
                </div>

                <div class="quill-store-list">
                  <div class="quill-store-item store-flag" v-for="item in storeCardsList" :data-storeid="item.storeId">
                    <div class="quill-store-img-wrapper">
                      <img :src="item.showImg + '?x-oss-process=image/resize,l_750'" alt="" class="quill-store-img" v-if="item.showImg">
                      <img src="../images/store-img-empty.png" alt="" class="quill-store-img" v-else>
                    </div>
                    <div class="quill-store-name">{{item.storeName}}</div>
                    <div class="quill-store-address">{{item.cityName}}{{item.districtName}}{{item.address}}</div>
                    <div class="quill-store-device">
                      <div class="quill-store-fieldNum">
                        <div class="quill-meeting">
                          <img src="../images/icon/found-meeting.png" alt="" class="quill-meeting-icon">
                          <span>{{item.meetingCount || 0}}</span>
                        </div>
                        <div class="quill-station">
                          <img src="../images/icon/found-station.png" alt="" class="quill-meeting-icon">
                          <span>{{item.stationCount || 0}}</span>
                        </div>
                      </div>
                      <div class="quill-store-distance" v-if="item.distance">距您{{item.distance}}</div>
                    </div>
                  </div>
                </div>

                <div class="sub-title-description">
                  {{item.description1}}
                </div>

                <a href="http://www.baidu.com">外链跳转</a>

                <div class="field-wrapper">
                  <ul class="activities-list">
                    <!-- @click="toDetail(field.fieldId)"-->
                    <li class="activities-item field-flag" v-for="field in item.fieldList" :data-fieldid="item.fieldId">
                      <!--图片-->
                      <div class="item-pic">
                        <img :src="field.mainImgUrl  + '?x-oss-process=image/resize,l_750'" alt="">
                      </div>
                      <!--描述-->
                      <div class="item-brief">
                        <p class="activity-address clearfix">
                        <span class="distance fl">
                          <!--1=会议室, 2=路演厅,3=工位,4=其他/多功能.5=办公室6=时租工位-->
                          <span class="field-type"
                                :class="{'field-meeting': field.fieldType === 1,
                          'field-office': field.fieldType === 5,
                          'field-station': field.fieldType === 3 || field.fieldType === 6,
                          'field-roadshow': field.fieldType === 2,
                          'field-functional': field.fieldType === 4}">
                            <span v-if="field.fieldType === 3">日租工位</span>
                            <span v-if="field.fieldType === 6">时租工位</span>
                            <span v-if="field.fieldType === 1">会议室</span>
                            <span v-if="field.fieldType === 2">路演厅</span>
                            <span v-if="field.fieldType === 4">多功能</span>
                            <span v-if="field.fieldType === 5">办公室</span>
                          </span>
                          <span class="field-city-name">{{field.cityName}}</span><span v-if="field.distance">·距您{{field.distance}}</span>
                        </span>
                          <span class="price fr">
                          <span class="price-statics">¥{{field.priceRange}}</span><span class="text" v-if="field.fieldType === 3">/天</span><span class="text" v-else-if="field.fieldType === 5">/月</span><span class="text" v-if="field.fieldType !== 3 && field.fieldType !== 5">/小时</span>
                        </span>
                        </p>
                        <div class="book-info">
                          <h3 class="brief-title" :class="{'width78': !isShowDownLoad && !wxOpen && !isBook}">{{field.fieldName}}</h3>
                          <p class="activity-time" :class="{'max-width72': !isShowDownLoad && !wxOpen && !isBook}">{{field.area}}㎡<span v-if="field.maxAdmissibleNum !== null"><span v-if="field.fieldType === 1 || field.fieldType === 2 || field.fieldType === 4">·可容纳{{field.maxAdmissibleNum}}人</span><span v-if="field.fieldType === 3 || field.fieldType === 6 || field.fieldType === 5">·{{field.maxAdmissibleNum}}个工位</span>
                            </span><span v-if="field.storeName">·{{field.storeName}}</span></p>
                          <p class="book-btn" v-if="!isShowDownLoad && !wxOpen && !isBook">预定</p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <!--更多场地-->
              <div>
                <div class="quill-featured-subhead">更多优质场地浏览</div>
                <div class="quill-scroll-fields" v-if="fieldCardList.length > 0">
                  <div class="quill-field-item field-flag" v-for="item in fieldCardList" :data-fieldid="item.fieldId" @click="toDetail(item.fieldId)">
                    <div class="quill-field-img-wrapper">
                      <img :src="item.mainImgUrl  + '?x-oss-process=image/resize,l_750'" alt="" class="quill-field-img">
                    </div>
                    <p class="quill-field-name">{{item.fieldName}}</p>
                    <!--1=会议室, 2=路演厅,3=工位,4=其他.5=办公室6=时租工位-->
                    <p class="quill-field-type"
                      :class="{'quill-field-type-station': item.fieldType === 3 || item.fieldType === 6,
                  'quill-field-type-meeting':item.fieldType === 1,
                  'quill-field-type-office': item.fieldType === 5,
                  'quill-field-type-hallShow': item.fieldType === 2,
                  'quill-field-type-functional': item.fieldType === 4}">
                      <span v-if="item.fieldType === 3">日租工位</span>
                      <span v-if="item.fieldType === 6">时租工位</span>
                      <span v-if="item.fieldType === 1">会议室</span>
                      <span v-if="item.fieldType === 2">路演厅</span>
                      <span v-if="item.fieldType === 4">多功能</span>
                      <span v-if="item.fieldType === 5">办公室</span>
                    </p>
                    <p class="quill-field-price">
                      <span class="quill-field-price-num">¥{{item.priceRange}}</span><span class="quill-field-price-unit" v-if="item.fieldType === 3">/天</span><span class="quill-field-price-unit" v-else-if="item.fieldType === 5">/月</span><span class="quill-field-price-unit" v-if="item.fieldType !== 3 && item.fieldType !== 5">/小时</span>
                    </p>
                  </div>
                </div>
              </div>

              <div class="quill-featured-subhead">6个月专享礼包券 随心领</div>
              <div class="quill-featured-main-text">可连续6个月领取CPASS赠送的专享礼包券，下单抵扣现金，即订即用，让你畅享半年高性价比的商务之旅！</div>

              <div class="quill-featured-subhead">精选推荐位置 抢先选</div>
              <div class="quill-featured-main-text">优质体验分享将有机会获得CPASS精选推荐，1v1贴心访谈，了解你对空间的真实所需，为你全力打造个性化体验头条！</div>
              <div class="quill-featured-main-text mt66">爱上一座城市最快的方式，可能是用脚步丈量它。而爱上一座城市并交到一群新朋友最快的方式，可能正是加入「CPASS空间体验官小分队」，快和我们一起开启城市空间探索之旅吧！</div>
              <div class="quill-featured-main-text font-bold-style">反馈优质体验报告的小伙伴，还有机会获得CPASS赠送的限量10个「商务旅行电脑包」！</div>
              <img src="../images/v912/bag1.png" alt="" class="quill-featured-images">
              <img src="../images/v912/bag2.png" alt="" class="quill-featured-images">
            </section>
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
  import logo1 from '../images/v912/wedo.png'
  import logo2 from '../images/v912/tianan.png'
  import logo3 from '../images/v912/weigu.png'
  import logo4 from '../images/v912/JIC-OFFICE.png'
  import logo5 from '../images/v912/dowork.png'

  export default {
    name: 'CpassPreview',
    props: {
      dialogStatus: Boolean
    },
    data() {
      return {
        wxOpen: '',
        isShowDownLoad: true,
        storeList: [
          {
            storeName: '深圳·Wedo联合创业社(福保国际社区)',
            description1: '400㎡超大空间，拒绝拥挤，舒适办公。',
            logo: logo1,
            // fieldId: 3286, // 正式
            fieldId: 3271, // 假数据
            fieldList: [],
            store: []
          },
          {
            storeName: '深圳·天安孵化器',
            description1: '灵活租期，随时办公，配套完善，创业者之家。',
            logo: logo2,
            // fieldId: 3317, // 正式
            fieldId: 3164, // 假数据
            fieldList: [],
            store: []
          },
          {
            storeName: '广州·微谷众创空间(方圆e时光店)',
            description1: '临近BRT，设施齐全，寓娱乐于工作。 ',
            logo: logo3,
            // fieldId: 3253, // 正式
            fieldId: 3112, // 假数据
            fieldList: [],
            store: []
          },
          {
            storeName: '广州·JIC OFFICE(东站店)',
            description1: '核心地段，交通便捷，良好隔音，会议首选。',
            logo: logo4,
            // fieldId: 3152, // 正式
            fieldId: 3283, // 假数据
            fieldList: [],
            store: []
          },
          {
            storeName: '上海·渡work空间',
            description1: '开放式办公环境，实现办公无边界，提高沟通体验。',
            logo: logo5,
            // fieldId: 3503, // 正式
            fieldId: 3272, // 假数据
            fieldList: [],
            store: []
          }
        ],
        storeCardList: [], // 接口获取到的门店列表
        fieldCardList: [], // 接口获取到的场地列表
        // fieldCardIds: [3286, 3317, 3253, 3152, 3503], // 单个场地卡片的id集合, 正式
        fieldCardIds: [3271, 3164, 3112, 3283, 3272], // 单个场地卡片的id集合, 假数据
        // fieldIds: [3119, 3190, 3287, 3496, 3302, 3389, 3504] // 正式
        fieldIds: [3262, 3212, 3075, 3070, 3238, 3106, 3054], // 假数据
        storeCardsList: [],
        storeIds: [70]
      }
    },
    mounted() {
      console.log('dialog');
    },
    methods: {
      closeDialog() {
        this.$emit('closeDialog')
      }
    }
  }
</script>

<style lang="scss" scoped src='./main.scss'></style>
