<template>
  <div class="page-system-personal-add">
    <lh-title/>
    <div class="lh-form-box">
      <el-row>
        <div class="user-img">
          <img v-if="headImgUrl" :src="headImgUrl + zoomImgSize(70)" class="title-img">
          <!-- @#注意：没有设置头像的时候，默认头像 -->
          <img v-else src="/static/images/default-avatar.png">
        </div>
        <div class="user-info">
          <div class="info-up">
            <span class="user-name">{{ name }}</span>
            <el-tag v-if="roleName">{{ roleName }}</el-tag>

            <router-link to="/system/profile/edit">
              <el-button type="primary">编辑信息</el-button>
            </router-link>
            <el-button @click="dialogVisible = true">修改密码</el-button>
          </div>
          <div class="info-down">
            <div class="info-site">
              <span class="site-title">联系电话：</span>
              <span class="site-desc">{{ contactTel || '未填写' }}</span>
            </div>
            <div class="info-site">
              <span class="site-title">电子邮箱：</span>
              <span class="site-desc">{{ email || '未填写'}}</span>
            </div>
          </div>
        </div>
      </el-row>
    </div>

    <!--<div class="lh-card-box">-->
      <!--<h3 class="desc-title">我的推送</h3>-->

      <!--<div class="lh-card-body pb0">-->

        <!--&lt;!&ndash;<el-row>&ndash;&gt;-->
          <!--&lt;!&ndash;<el-col :span="6">&ndash;&gt;-->
            <!--&lt;!&ndash;<div class="detail-info">&ndash;&gt;-->
              <!--&lt;!&ndash;<div class="label">消息推送</div>&ndash;&gt;-->
              <!--&lt;!&ndash;<div class="label-con ml0">&ndash;&gt;-->
                <!--&lt;!&ndash;<el-tag type="success">开启</el-tag>&ndash;&gt;-->
              <!--&lt;!&ndash;</div>&ndash;&gt;-->
            <!--&lt;!&ndash;</div>&ndash;&gt;-->
          <!--&lt;!&ndash;</el-col>&ndash;&gt;-->
        <!--&lt;!&ndash;</el-row>&ndash;&gt;-->

        <!--<el-row class="mb10">-->
          <!--<el-col :span="20">-->
            <!--<lh-item label="绑定微信：" label-width="auto" pb="24">-->
              <!--<el-tag type="success" v-if="outh2AdminUser">{{ outh2AdminUser.nickName || '已绑定' }}</el-tag>-->
              <!--<el-tag type="info" v-else>未绑定</el-tag>-->
            <!--</lh-item>-->
          <!--</el-col>-->
        <!--</el-row>-->

        <!--&lt;!&ndash;<el-row class="mb6">&ndash;&gt;-->
          <!--&lt;!&ndash;<el-col :span="6">&ndash;&gt;-->
            <!--&lt;!&ndash;<div class="detail-info">&ndash;&gt;-->
              <!--&lt;!&ndash;<div class="label">推送时段</div>&ndash;&gt;-->
              <!--&lt;!&ndash;<div class="label-con ml0">&ndash;&gt;-->
                <!--&lt;!&ndash;09:30-18:30&ndash;&gt;-->
              <!--&lt;!&ndash;</div>&ndash;&gt;-->
            <!--&lt;!&ndash;</div>&ndash;&gt;-->
          <!--&lt;!&ndash;</el-col>&ndash;&gt;-->
        <!--&lt;!&ndash;</el-row>&ndash;&gt;-->

        <!--<el-row>-->
          <!--<el-col :span="24">-->
            <!--<lh-item label="推送范围：" label-width="auto" pb="24">-->
              <!--<el-table-->
                <!--border-->
                <!--v-if="pushPermis.length > 0"-->
                <!--:data="statusList"-->
                <!--style="width: 90%;">-->
                <!--&lt;!&ndash; 不同类型，都显示场地预约 &ndash;&gt;-->
                <!--<el-table-column :label="item.name" v-for="(item, index) in pushPermis" :key="index">-->
                  <!--<template slot-scope="scope">-->
                    <!--<el-checkbox :checked="item.status === 1" disabled></el-checkbox>-->
                  <!--</template>-->
                <!--</el-table-column>-->
              <!--</el-table>-->
              <!--<span v-else>暂无推送</span>-->
            <!--</lh-item>-->
          <!--</el-col>-->
        <!--</el-row>-->

      <!--</div>-->

    <!--</div>-->

    <!-- 修改手机号码 -->
    <el-dialog
      :visible.sync="dialogVisible"
      @close="resetForm('replacePwd')"
      title="修改密码"
      width="526px">

      <el-form
        :model="replacePwd"
        ref="replacePwd"
        :rules="rules2"
        label-width="180px"
        class="demo-ruleForm">

        <el-form-item label="旧密码" prop="oldPwd">
          <el-input
            type="password"
            style="width: 200px;"
            v-model.trim="replacePwd.oldPwd"
            :maxlength="10"
            placeholder="请输入旧的密码"></el-input>
          <!-- &nbsp;&nbsp;
          <span class="theme-gray">初始密码：123456a</span> -->
        </el-form-item>

        <el-form-item label="新密码" prop="newPwd">
          <el-input
            type="password"
            style="width: 200px;"
            v-model.trim="replacePwd.newPwd"
            :maxlength="10"
            placeholder="6-10位字母数字组合密码"></el-input></el-form-item>

        <el-form-item label="再次输入" prop="secondNewPwd">
          <el-input
            type="password"
            :maxlength="10"
            style="width: 200px;"
            v-model.trim="replacePwd.secondNewPwd"
            placeholder="6-10位字母数字组合密码"></el-input></el-form-item>

        <el-form-item class="align-left">
          <el-button
            @click="submitForm('replacePwd')"
            class="width80px mt30"
            type="primary">保 存</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>

  </div>
</template>

<script>
  import { adminUserInfo, resetByPassword } from '@/service'
  import Cookies from 'js-cookie'
  import personalMixins from './personal.mixins'
  export default {
    mixins: [personalMixins],
    components: {},
    data() {
      return {
        // 用户信息相关
        userInfo: '', // 用户个人信息
        name: '', // 用户名称
        contactTel: '', // 联系方式
        email: '', // 电子邮箱
        roleName: '', // 职务
        headImgUrl: '', // 用户头像
        statusList: [],

        // 绑定微信模块
        isEmpty: 0, // 不变
        isEmptyJudge: 0, // 不变
        billOrderList: [{
          one: false,
          two: true,
          three: true,
          four: true,
          five: true,
          six: true
        }],

        // outh2AdminUser: '', // 绑定微信相关
        // pushPermis: [], // 推送消息相关
        // 修改密码dialog
        dialogVisible: false
      }
    },
    mounted () {
      this.getUserInfo()
    },
    methods: {
      // 重置表单
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      getUserInfo () {
        adminUserInfo().then(res => {
          if (res.status === 'true') {
            if (res.info) {
              this.userInfo = res.info || ''
              if (this.userInfo) {
                this.name = this.userInfo.name || ''
                this.contactTel = this.userInfo.contactTel || ''
                this.roleName = this.userInfo.roleName || ''
                this.headImgUrl = this.userInfo.headImgUrl || ''
                this.email = this.userInfo.email || ''
              }
              // this.pushPermis = res.info.pushPermis || []
              // this.outh2AdminUser = res.info.outh2AdminUser || null
              this.statusList = [{}]
            }
          } else this.setMsg('error', res.msg)
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            resetByPassword({
              oldPassword: this.replacePwd.oldPwd,
              newPassword: this.replacePwd.secondNewPwd
            }).then(res => {
              if (res.status === 'true') {
              //                this.setMsg('success', '短信验证码已发送至您的手机，请注意查收!')
                this.setMsg('success', '密码修改成功，请重新登录!')
                this.dialogVisible = false
                const self = this
                setTimeout(() => {
                  self.logout()
                }, 2000);
              } else this.setMsg('error', res.msg)
            })
          } else {
            return false;
          }
        });
      },
      logout () {
        this.$store.dispatch('logout').then(res => {
          this.dialogVisible = false
          Cookies.set('telphone', this.replace.newTel)

          this.$router.push({
            path: '/login', query: { redirect: this.$route.path }
          })
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import 'src/styles/common.scss';
  .page-system-personal-add {
    .lh-form-box {
      padding: 22px;
    }

    .user-img{
      display: inline-block;
      width: 74px;
      margin-right: 24px;

      .title-img{
        width: 70px;
        height: 70px;
        border-radius: 50%;
      }
    }

    .user-info{
      display: inline-block;
      width: calc(100% - 98px);
      height: 74px;
      float: right;
      text-align: left;

      .info-up{
        width: 100%;
        height: 36px;
        margin-top: 5px;

        .user-name{
          display: inline-block;
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 20px;
          color: #1F2D3D;
          letter-spacing: 0;
          line-height: 20px;
          vertical-align: middle;
          margin-right: 16px;
        }

        .el-tag{
          margin-right: 16px;
        }
        .el-button{
          margin-left: 16px;
          float: right;
        }
      }
      .info-down{
        width: 100%;
        height: 36px;

        .info-site{
          display: inline-block;
          width: 25%;
          margin-right: 16px;
          font-size: 14px;
          color: #1F2D3D;
          line-height: 35px;
          clear: both;

          .site-title{
            width: 75px;
            color: rgba(0, 0, 0, 0.85);
            float: left;
          }

          .site-desc{
            width: calc(100% - 75px);
            color: rgba(0, 0, 0, 0.65);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            float: left;
          }
        }

      }

    }
    .width120{
      color: #fff;
    }
  }
</style>
