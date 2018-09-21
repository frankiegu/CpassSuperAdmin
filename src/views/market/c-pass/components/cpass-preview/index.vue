<template>
  <transition name="fade">
    <div class="component-cpass-preview" v-show="dialogStatus">
      <div class="preview-box">
        <div class="lh-phone">
          <div class="p-con">
            <div class="featured-content clearfix">
              <h3 class="featured-title">标题标题标题标题标题标题</h3>
              <p class="sub-title fl">
                <img src="../images/cpass-logo-featured.png" alt="" class="cpass-logo">
                <span class="cpass-name">CPASS</span>
                <span class="publish-date">2018-08-07</span>
              </p>
              <p class="read-times fr">阅读数 200</p>
            </div>

            <!--精选uat环境id=3, 正式环境是1-->
            <section class="space-template">
              <!--精选描述-->
              <div class="featured-description-wrapper">
                <div class="featured-description">
                  <!--id=3-->
                  <!--<p class="first-heading">发现优质空间，广州这6家颜值与特色并存的空间不容错过</p>-->
                  <!--<p class="second-heading">在森林里办公，边上班边度假</p>-->
                  <!--id=3-->
                  <p class="content">
                    996太乏味，凌晨赶项目太累，交际圈变窄，上班时无精打采……日复一日的疲惫工作生活似乎是都市人群的常态。
                  </p>
                  <p class="content">实地走访了广州多处众创空间之后，CPASS 精选出这6家颜值和个性并存的空间，带你Duang掉“办公疲劳”！</p>
                </div>
              </div>
              <div class="featured-sub-title">
                <div class="sub-title-wrapper clearfix">
                  <span class="logo-wrapper">
                  <img src="../images/selectionId3pic3.jpg" alt="" class="title-icon">
                  </span>
                  <h3 class="sub-title-name">
                    <p>空间名称</p>
                    <!--<p class="store-num">共13个门店</p>-->
                  </h3>
                </div>

                <div class="sub-title-description">
                  item.description1
                </div>
                <!-- <storeCard class="mt26" :storeList="item.store"></storeCard> -->
                <div class="image-description">
                  <div class="featured-item-img-wrapper">
                    <img src="../images/selectionId5pic3.jpg" alt="" class="sub-title-img">
                  </div>
                  <p class="image-description-text">亮点: 为</p>
                  <!-- <div class="sub-title-description" v-for="des in item.description">{{des}}</div> -->
                </div>
                <div class="attention">item.attention</div>
                <div class="field-wrapper mt26">
                  <!-- <fieldCard :isWx="isWx" :list="item.fieldList"></fieldCard> -->
                </div>
              </div>
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
  export default {
    name: 'CpassPreview',
    props: {
      dialogStatus: Boolean
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
