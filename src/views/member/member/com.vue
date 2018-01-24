<template>
  <div class="member-info-com">
    <div class="page-title"> <h1>{{ pageTitle() }}</h1> </div>

    <div class="card-padding card-padding-vertical">
      <el-form :model="formData" ref="formData" label-position="left" label-width="80px">
        <h3 class="grid-title">会员信息</h3>

        <!-- 1 -->
        <el-row :gutter="20">
          <el-col :lg="8">
            <el-form-item label="会员姓名" prop="name">
              <span class="theme-gray">{{ formData.name }}</span></el-form-item>
          </el-col>

          <el-col :lg="8">
            <el-form-item label="联系方式" prop="telephone">
              <span class="theme-gray">{{ formData.telephone }}</span></el-form-item>
          </el-col>

          <el-col :lg="8">
            <el-form-item label="注册日期" prop="created">
              <span class="theme-gray">{{ formData.created }}</span></el-form-item>
          </el-col>
        </el-row>

        <!-- 2 -->
        <el-row :gutter="20">
          <el-col :lg="8">
            <el-form-item label="所属门店" prop="storeName">
              <span class="theme-gray">{{ formData.storeName }}</span></el-form-item>
          </el-col>

          <el-col :lg="8">
            <el-form-item label="所属企业" prop="companyName">
              <span class="theme-gray">{{ formData.companyName }}</span></el-form-item>
          </el-col>

          <el-col :lg="8">
            <el-form-item
              label="会员角色"
              prop="role"
              :rules="{ required: true, message: '请选择会员角色', trigger: 'change' }">

              <el-select
                v-model.trim="formData.role"
                :disabled="noAllow"
                class="width120px"
                placeholder="会员角色">

                <el-option label="公司负责人" :value="1"></el-option>
                <el-option label="员工" :value="2"></el-option></el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 3 -->
        <el-row :gutter="20">
          <el-col :lg="8">
            <el-form-item label="累计消费" prop="consumeAmount">
              <span class="theme-gray">￥{{ formData.consumeAmount }}</span>
              <span class="theme-gray">元</span>
            </el-form-item>
          </el-col>

          <el-col :lg="8">
            <el-form-item label="现有积分" prop="point">
              <span class="theme-gray">{{ formData.point }}</span></el-form-item>
          </el-col>
        </el-row>

        <!-- 4 -->
        <el-row :gutter="20">
          <el-col :lg="8">
            <el-form-item label="信用值" prop="creditPoint">
              <span class="theme-gray">{{ formData.creditPoint }}</span></el-form-item>
          </el-col>

          <el-col :lg="8">
            <el-form-item label="信用等级" prop="creditLevel">
              <el-tag
                v-if="formData.creditLevel"
                :type="formData.creditLevel | statusFilter(filtersStatusList)">
                {{formData.creditLevel}}</el-tag>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 5 -->
        <el-row
          v-permissions="'/manage/user/updateRole'"
          class="text-center">

          <el-button
            @click="submitForm('formData')"
            :loading="editLoading"
            class="width120px"
            type="primary">{{ editTxt }}</el-button>
        </el-row>
      </el-form>

      <!-- tab table -->
      <div class="mt30" v-show="noAllow">
        <el-tabs
          v-model="activeName"
          class="mt15">

          <el-tab-pane
            v-for="item in tabMapOptions"
            :label="item.label"
            :key='item.key'
            :name="item.key">

            <!-- 如果数据没有更新，则查看缓存的数据 -->
            <keep-alive>
              <tab-pane
                v-if='activeName == item.key'
                @create="showCreatedTimes"
                :type='item.key'
                :id="id"
                :noAllow="noAllow"></tab-pane>
            </keep-alive>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
  import { formData, pageData } from './com.data'
  import { comPageData } from './common.data'

  import tabPane from './components/tab-pane'
  import option from '@/components/option'
  import { userDetail, userUpdateRole } from '@/service/member/member'

  export default {
    components: { tabPane, [option.name]: option },
    data () {
      return {
        id: this.$route.query.id,
        noAllow: !!this.$route.query.noAllow, // true 为不可编辑
        editLoading: false,
        editTxt: '', // “编辑”或者“保存”按钮文本

        roleList: [],                  // 会员角色列表
        formData: formData(),

        filtersStatusList: comPageData.statusList,
        tabMapOptions: pageData.tabMapOptions,
        activeName: 'CN',
        createdTimes: 0
      }
    },
    mounted () {
      const self = this
      self.getPageData()
    },
    methods: {
      submitForm() {
        const self = this

        self.editLoading = true

        if (self.noAllow) {
          self.noAllow = !self.noAllow
          self.editLoading = false
        } else {
          userUpdateRole({
            userId: self.id,
            role: self.formData.role
          }).then(res => {
            if (res.status === 'true') {
              self.setMsg('success', '修改成功！')
              self.noAllow = !self.noAllow
            } else {
              self.setMsg('error', res.msg)
            }

            self.editLoading = false
          })
        }
      },
      getPageData() {
        const self = this
        userDetail({userId: self.id}).then(res => {
          if (res.status === 'true') {
            let data = res.info

            self.formData = data
          } else {
            self.setMsg('error', res.msg)
          }
        })
      },
      pageTitle() {
        const self = this
        let titleName
        let btnName

        if (self.noAllow) {
          titleName = '会员详情'
          btnName = '编辑'
        } else {
          titleName = '编辑会员信息'
          btnName = '保存'
        }

        self.editTxt = btnName
        document.title = titleName
        self.$store.commit('NAV_CRUMB', titleName)

        return titleName
      },
      showCreatedTimes() {
        const self = this

        self.createdTimes = self.createdTimes + 1
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "src/styles/config";
  .member-info-com {
  }
</style>
