<template>
  <div class="service-list main-content">
    <lh-title></lh-title>
    <!-- tab 切换 -->
    <lh-page-tab
      :activityTab="activityTab"
      :tabList="tabList"
      @tabToggle="toggleTab" />
    <div class="card-padding" v-show="activityTab === 1">
      <!-- 查询筛选 -->
      <el-form v-model="onePartForm" style="width: 350px;">
        <el-form-item label="活动时间">
          <div>
            <el-date-picker
              class="width340px"
              v-model="onePartForm.rangeDate"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
              :clearable="false"
              :picker-options="orderSortDate"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              placeholder="选择日期"
              type="datetimerange"
              :default-time="['00:00:00', '23:59:59']"
              align="left"></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="首页弹窗">
          <div style="width:400px;">
            <el-upload style="width: 100px;display: inline-block;"
                       action="https://jsonplaceholder.typicode.com/posts/"
                       list-type="picture-card">
              <i class="el-icon-plus"></i>
            </el-upload>
            <div style="width: 200px;display: inline-block;vertical-align: top;margin-left: 20px;">
              <p>建议尺寸： 750 * 1206PX</p>
              <p>支持格式： JPG / PNG</p>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div style="margin-bottom: 80px;">
        <el-form :inline="true">

          <router-link :to="{path: '/activityInvite/add', query: {type: 'add'}}">
            <div class="to-bottom-right fl add-btn" style="margin-top: 20px;margin-bottom: 20px;">添加活动</div>
          </router-link>

        </el-form>

        <el-table :data="configData" :empty-text="tableEmptyOne" :slot="tableEmptyOne" border style="width: 100%">

          <el-table-column label="活动阶段ID" prop="code" align="left"></el-table-column>
          <el-table-column label="活动阶段名称" prop="name" align="left"></el-table-column>
          <el-table-column label="活动开始时间" prop="startTime" align="left"></el-table-column>
          <el-table-column label="活动结束时间" prop="endTime" align="left"></el-table-column>
          <el-table-column label="最高奖励金额" prop="topNum" align="left"></el-table-column>
          <el-table-column label="单次奖励" prop="oneNum" align="left"></el-table-column>
          <el-table-column label="新人礼券" prop="newCard" align="left"></el-table-column>
          <el-table-column label="创建时间" prop="createTime" align="left"></el-table-column>
          <el-table-column label="操作" align="left" width="120px">
            <template slot-scope="scope" style="display:block;">
              <router-link :to="{path: '/activityInvite/add', query: {id: scope.row.id, type: 'edit'}}">
                <el-button type="text" class="operate-btn">编辑</el-button>
              </router-link>

              <router-link :to="{path: '/activity/add', query: {id: scope.row.id, type: 'copy'}}">
                <el-button type="text" class="operate-btn">删除</el-button>
              </router-link>
            </template>
          </el-table-column>

        </el-table>

        <div style="text-align: center;margin-top: 30px;">
          <el-pagination background ref="onePages" @size-change="handleSizeChangeOne" @current-change="handleCurrentChangeOne"
                         :current-page.sync="onePages.pageNo" :page-size="onePages.pageSize"
                         :page-sizes="[10,20,50]" layout="total, sizes, prev, pager, next, jumper" :total="onePages.total">
          </el-pagination>
        </div>

      </div>
    </div>
    <div class="card-padding" v-show="activityTab === 2">
      <div>
        <el-form :model="formData" :inline="true" class="text-right mr-10">

          <el-select v-model="formData.type" @change="getDataTwo(1)" filterable placeholder="筛选填写实物奖" class="width150px" clearable>
            <el-option v-for="item in typeList" :label="item.text" :value="item.val" :key="item.val"></el-option>
          </el-select>

          <el-select v-model="formData.type" @change="getDataTwo(1)" filterable placeholder="筛选阶段" class="width150px" clearable>
            <el-option v-for="item in typeList" :label="item.text" :value="item.val" :key="item.val"></el-option>
          </el-select>

          <el-form-item style="margin-right: 0px;">
            <el-input v-model.trim="formData.name" @keyup.native.enter="getDataTwo(1)" placeholder="检索收货人手机号" class="width200px">
              <i slot="suffix" @click="getDataTwo(1)" class="el-input__icon el-icon-search"></i>
            </el-input>
          </el-form-item>

          <el-form-item>
            <el-input v-model.trim="formData.name" @keyup.native.enter="getDataTwo(1)" placeholder="检索收货人" class="width200px">
              <i slot="suffix" @click="getDataTwo(1)" class="el-input__icon el-icon-search"></i>
            </el-input>
          </el-form-item>

        </el-form>

        <el-table :data="countData" :empty-text="tableEmptyTwo" :slot="tableEmptyTwo" border style="width: 100%">

          <el-table-column label="会员ID" prop="memberId" align="left"></el-table-column>
          <el-table-column label="活动阶段ID" prop="code" align="left"></el-table-column>
          <el-table-column label="活动阶段名称" prop="name" align="left"></el-table-column>
          <el-table-column label="成功邀请人数" prop="inviteNum" align="left"></el-table-column>
          <el-table-column label="订单总数" prop="orderNum" align="left"></el-table-column>
          <el-table-column label="已完成订单数" prop="orderNum" align="left"></el-table-column>
          <el-table-column label="订单金额" prop="orderMoney" align="left"></el-table-column>
          <el-table-column label="已完成订单总金额" prop="orderMoneyNum" align="left"></el-table-column>
          <el-table-column label="实物奖励" prop="reward" align="left"></el-table-column>
          <el-table-column label="收货人" prop="consignee" align="left"></el-table-column>
          <el-table-column label="手机号码" prop="phone" align="left"></el-table-column>
          <el-table-column label="收货地址" prop="receiving" align="left"></el-table-column>
          <el-table-column label="操作" align="left" width="120px">
            <template slot-scope="scope" style="display:block;">
              <router-link :to="{path: '/activityInvite/users'}">
                <el-button type="text" class="operate-btn underline">被邀请人名单</el-button>
              </router-link>

              <router-link :to="{path: '/activity/add', query: {id: scope.row.id, type: 'copy'}}">
                <el-button type="text" class="operate-btn underline">订单列表</el-button>
              </router-link>
            </template>
          </el-table-column>

        </el-table>
        <div style="text-align: center;margin-top: 30px;">
          <el-pagination background ref="twoPages" @size-change="handleSizeChangeTwo" @current-change="handleCurrentChangeTwo"
                         :current-page.sync="twoPages.pageNo" :page-size="twoPages.pageSize"
                         :page-sizes="[10,20,50]" layout="total, sizes, prev, pager, next, jumper" :total="twoPages.total">
          </el-pagination>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  // import { platformActivityList } from '@/service/market'
  import pageTab from '../components/page-tab.vue'

  export default {
    mixins: [],
    components: {
      [pageTab.name]: pageTab
    },
    data() {
      return {
        tabList: ['活动配置', '活动数据统计'], // tab页显示文字
        activityTab: 1, // 当前展示tab页
        onePartForm: {
          rangeDate: '',
          bannerPic: ''
        },
        orderSortDate: { // 日期选择范围
          disabledDate(time) {
            return time.getTime() < Date.now() - 3600 * 1000 * 24
          }
        },
        configData: [{ 'code': '001', 'name': '活动配置1', 'startTime': '2018-12-03 13:30:00', 'endTime': '2018-12-30 23:59:59', 'topNum': '2000', 'oneNum': '100', 'newCard': '礼券1', 'createTime': '2018-12-03 13:00:00' },
          { 'code': '002', 'name': '活动配置2', 'startTime': '2018-12-03 13:30:00', 'endTime': '2018-12-30 23:59:59', 'topNum': '2000', 'oneNum': '100', 'newCard': '礼券1', 'createTime': '2018-12-03 13:00:00' },
          { 'code': '003', 'name': '活动配置3', 'startTime': '2018-12-03 13:30:00', 'endTime': '2018-12-30 23:59:59', 'topNum': '2000', 'oneNum': '100', 'newCard': '礼券1', 'createTime': '2018-12-03 13:00:00' },
          { 'code': '004', 'name': '活动配置4', 'startTime': '2018-12-03 13:30:00', 'endTime': '2018-12-30 23:59:59', 'topNum': '2000', 'oneNum': '100', 'newCard': '礼券1', 'createTime': '2018-12-03 13:00:00' }], // 活动配置表格展示数据
        onePages: {
          pageSize: 10,
          pageNo: 1,
          total: 4
        }, // 活动配置的分页
        twoPages: {
          pageSize: 10,
          pageNo: 1,
          total: 4
        }, // 活动数据统计的分页
        typeList: [ // 筛选阶段下拉展示数据
          { val: 5, text: '全部' },
          { val: 1, text: '普通活动' },
          { val: 2, text: '互动游戏' }
        ],
        formData: { // 活动数据统计搜索
          name: '',
          type: '',
          status: ''
        },
        countData: [{ 'code': '001', 'name': '统计1', 'memberId': '001', 'inviteNum': '', 'orderNum': '', 'orderMoney': '', 'orderMoneyNum': '', 'reward': '', 'consignee': '', 'phone': '', 'receiving': '' },
          { 'code': '002', 'name': '统计2', 'memberId': '002', 'inviteNum': '', 'orderNum': '', 'orderMoney': '', 'orderMoneyNum': '', 'reward': '', 'consignee': '', 'phone': '', 'receiving': '' },
          { 'code': '003', 'name': '统计3', 'memberId': '003', 'inviteNum': '', 'orderNum': '', 'orderMoney': '', 'orderMoneyNum': '', 'reward': '', 'consignee': '', 'phone': '', 'receiving': '' },
          { 'code': '004', 'name': '统计4', 'memberId': '004', 'inviteNum': '', 'orderNum': '', 'orderMoney': '', 'orderMoneyNum': '', 'reward': '', 'consignee': '', 'phone': '', 'receiving': '' },
          { 'code': '005', 'name': '统计5', 'memberId': '005', 'inviteNum': '', 'orderNum': '', 'orderMoney': '', 'orderMoneyNum': '', 'reward': '', 'consignee': '', 'phone': '', 'receiving': '' },
          { 'code': '006', 'name': '统计6', 'memberId': '006', 'inviteNum': '', 'orderNum': '', 'orderMoney': '', 'orderMoneyNum': '', 'reward': '', 'consignee': '', 'phone': '', 'receiving': '' }], // 活动数据统计展示数据
        tableEmptyOne: '', // 活动配置数据为空的提示信息
        tableEmptyTwo: '' // 活动数据统计数据为空的提示信息
      }
    },
    methods: {
      /**
       * 点击tab页，切换
       */
      toggleTab(val) {
        this.activityTab = val
      },
      /**
       * 活动配置的size-change
       * @param page
       */
      handleSizeChangeOne(val) {
        this.onePages.pageSize = val
        this.getDataOne(1)
      },
      /**
       * 活动配置的current-change
       * @param page
       */
      handleCurrentChangeOne(val) {
        this.onePages.pageNo = val
        this.getDataOne(1)
      },
      /**
       * 活动配置的数据显示
       * @param page
       */
      getDataOne(page) {
        console.log('获取活动配置的数据')
        if (this.configData.length === 0) {
          this.tableEmptyOne = '暂时无数据'
        }
      },
      /**
       * 活动数据统计的size-change
       * @param page
       */
      handleSizeChangeTwo(val) {
        this.twoPages.pageSize = val
        this.getDataTwo(1)
      },
      /**
       * 活动数据统计的current-change
       * @param page
       */
      handleCurrentChangeTwo(val) {
        this.twoPages.pageNo = val
        this.getDataTwo(1)
      },
      /**
       * 活动数据统计的数据显示
       * @param page
       */
      getDataTwo(page) {
        console.log('活动数据统计的数据')
        if (this.countData.length === 0) {
          this.tableEmptyTwo = '暂时无数据'
        }
      }
    }
  }
</script>
<style lang="scss">
  .card-padding {
    .el-upload--picture-card {
      background-color: #fbfdff;
      border-radius: 6px;
      box-sizing: border-box;
      width: 100px;
      height: 80px;
      cursor: pointer;
      line-height: 90px;
      vertical-align: top;
    }
    text-align: left;
  }
</style>
<style lang="scss" scoped>
  /*@import "src/styles/config";*/
  .service-list {
    .add-btn{
      padding: 0px 20px;
      line-height: 32px;
      color: #fff;
      cursor: pointer;
    }
    .operate-btn {
      padding: 6px;
    }
    .underline {
      text-decoration: underline;
    }
    .ml45{
      margin-left: 45px;
    }
  }
</style>
