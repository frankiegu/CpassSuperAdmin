<template>
  <transition name="slide-fade">
    <div class="message-bar" v-if="messageBarOpen">
      <div class="panel">
        <h3 class="title">动态</h3>
        <div class="scroll-container">
          <ul class="message-container" v-if="messageList.length > 0">
            <!-- 遍历消息列表 -->
            <li v-for="item in messageList" :key="item.id" class="clearfix"
              @click="readMsg(item.id, item.type, item.referenceId)"
              v-if="handleHasPermissions(permissionMap[item.type])">
              <!-- 头像 -->
              <div class="avatar-cont fl">
                <img v-if="item.headImgUrl" :src="item.headImgUrl" alt="">
                <span v-else>{{item.username ? item.username.slice(0, 1) : '酷'}}</span>
              </div>

              <!-- 消息内容 -->
              <p class="msg-cont">
                <span v-if="item.type === 1">
                  <span class="username-cont">{{(item.username)}}</span>&nbsp;预约了&nbsp;{{'场地'}}&nbsp;
                </span>
                <span v-else-if="item.type === 3">
                  <span class="username-cont">{{(item.username)}}</span>&nbsp;{{orderTypeList[item.type]}}&nbsp;
                </span>
                <span v-else>
                  <span class="username-cont">{{(item.username)}}</span>&nbsp;提交了&nbsp;{{orderTypeList[item.type]}}&nbsp;
                </span>
                <span class="pointer-theme-blue">
                  {{item.name}}
                </span>
              </p>
              <p class="theme-light-gray">{{item.created}}</p>
            </li>
          </ul>

          <lh-table-empty v-else tableEmpty="暂无消息" />
        </div>

        <!-- 操作栏 -->
        <div class="operate-bar" v-if="messageList.length > 0">
          <el-button plain @click="clearMsg" v-permissions="'/manage/inform/readedAll'">清空通知</el-button>
        </div>
      </div>

      <div @touchmove.prevent class="v-modal" @click="handleToggleMsgBar('close')"></div>
    </div>
  </transition>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { wsUpdater } from '@/config/wsocket'
  // import { loadConstant, readInform, readAllInform } from '@/service/common'
  export default {
    name: 'message-bar',
    data() {
      return {
        orderTypeList: {},
        permissionMap: {
          1: '/manage/order/orderDetail',
          11: '/manage/order/orderDetail',
          2: '/manage/valueAddServiceOrder/detail',
          3: '/manage/visitReservation/getVisitReservationDetail',
          4: '/manage/enter/detail',
          5: '/manage/repair/detail',
          6: '/manage/orderRefund/findById',
          7: '/manage/spaceKeeperOrder/detail'
        },
        linkMap: {
          1: '/order/book/detail?orderFrom=1&id=',
          11: '/order/book/detail?orderFrom=2&id=', // 小程序的场地订单
          2: '/service/order/detail?id=',
          3: '/order/visit/detail?id=',
          4: '/order/settled/detail?id=',
          5: '/order/warning',
          6: '/finance/refund-approval/detail?id=',
          7: '/order/housekeeper/detail?id='
        }
      }
    },
    computed: {
      ...mapGetters([
        'messageBarOpen',
        'messageList',
        'messageNum'
      ])
    },
    mounted() {
      // loadConstant('inform.type').then(res => {
      //   if (res.status === 'true') {
      //     this.orderTypeList = res.info
      //   }
      // })
      this.handleGetMsgList()

      if (wsUpdater.socket == null) wsUpdater.start()
    },

    methods: {
      ...mapActions({
        handleToggleMsgBar: 'toggleMsgBar',
        handleGetMsgNum: 'getMsgNum',
        handleGetMsgList: 'getMsgList'
      }),

      // 用户名最多显示五个字，超出省略号代替
      formatName(name) {
        return name && name.toString().length > 5 ? name.slice(0, 5) + '...' : name
      },

      // 阅读消息跳转对应详情页
      readMsg(id, type, referenceId) {
        // readInform({informId: id}).then(res => {
        //   if (res.status === 'true') {
        //     if (this.messageNum > 0) this.handleGetMsgNum(this.messageNum - 1)
        //     this.handleToggleMsgBar('close')
        //     let targetIndex = this.messageList.findIndex(targetMsg => { return targetMsg.id === id })
        //     if (targetIndex !== -1) this.messageList.splice(targetIndex, 1)
        //   }
        // })
        let nextRoute = this.linkMap[type] + (this.orderTypeList[type] === '故障报修' ? '' : referenceId)
        this.$router.push(nextRoute)
      },

      // 清空消息通知
      clearMsg() {
        // readAllInform().then(res => {
        //   if (res.status === 'true') {
        //     this.handleGetMsgNum(0)
        //     this.handleToggleMsgBar('close')
        //     this.$message.success('清除成功！')
        //   } else {
        //     this.$message.error(res.msg)
        //   }
        // })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "src/styles/variables";
  .message-bar {
    position: fixed;
    top: 60px;
    left: 0;
    width: 100%;
    height: calc(100% - 60px);
    z-index: 2000;
    overflow: hidden;

    .v-modal {
      position: absolute;
      top: 0;
    }

    .panel {
      position: absolute;
      overflow: hidden;
      box-sizing: border-box;
      top: 0;
      right: 0;
      z-index: 2001;
      border-top: 1px solid #E8E8E8;
      padding: 0 24px;
      width: 382px;
      height: 100%;
      background-color: #ffffff;

      .title {
        margin: 0 -24px;
        border-bottom: 1px solid #E8E8E8;
        padding: 16px 24px;
        font-size: 16px;
        line-height: 24px;
        color: #1F2022;
      }
    }

    .scroll-container {
      overflow: hidden;
      box-sizing: border-box;
      width: 334px;
      height: calc(100% - 145px);
    }
    .message-container {
      padding-right: 20px;
      width: 334px;
      height: 100%;
      overflow-y: auto;
      > li {
        position: relative;
        border-bottom: 1px solid #E8E8E8;
        padding: 16px 0 14px;
        width: 334px;
        cursor: pointer;
        transition: all ease .25s;
        &:hover {
          box-shadow: 0 0 12px rgba($theme-black, .1);
        }
      }
      p {
        line-height: 20px;
      }
    }

    .msg-cont {
      margin: 2px 0 6px;
      max-width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-size: 0;
      /*display: flex;*/
      span {
        /*flex: 0 1 auto;*/
        font-size: 14px;
        /*display: inline-block;*/
        vertical-align: middle;
        line-height: 20px;
      }
    }

    .avatar-cont {
      margin-right: 16px;
      border: 1px solid #E8E8E8;
      border-radius: 50%;
      height: 32px;
      width: 32px;
      line-height: 30px;
      text-align: center;
      overflow: hidden;
      box-sizing: border-box;
      //background-color: $theme-black;
      color: $theme-black;

      img {
        width: 100%;
        max-width: 100%;
      }

      span {
        font-size: 18px;
        font-weight: bold;
      }
    }

    .username-cont {
      display: inline-block;
      max-width: 80px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .operate-bar {
      position: fixed;
      bottom: 0;
      padding: 24px 0;
      width: 334px;
      background-color: #ffffff;
      button {
        height: 40px;
        width: 100%;
      }
    }
  }
</style>
