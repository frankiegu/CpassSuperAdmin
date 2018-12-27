<template>
  <div class="service-list main-content">
    <lh-title></lh-title>
    <!-- tab 切换 -->
    <lh-page-tab
      :activityTab="activityTab"
      :tabList="tabList"
      addEditType="1"
      @tabToggle="toggleTab" />
    <div class="card-padding" v-show="activityTab === 1">
      <!-- 查询筛选 -->
      <el-form v-model="onePartForm" style="width: 350px;">
        <el-form-item label="活动时间">
          <p v-if="empty" style="width: 400px;">暂无</p>
          <p v-if="!empty" style="width: 400px;">{{minStartDate}}&nbsp;&nbsp;至&nbsp;&nbsp;{{maxEndDate}}</p>
        </el-form-item>
        <el-form-item label="首页弹窗">
          <div style="width:400px;">
            <lh-upload :accept="'.jpg,png'"
              :imgUrl="onePartForm.topBanner" class="fl"
              @uploadImg="showTopBanner"></lh-upload>
            <i class="el-icon-question fl theme-light-gray date-warnning upload-text-icon ml10 mt6 mr5" @click="isShowTopBanner = true"></i>
            <div v-if="isShowTopBanner">
              <p>建议尺寸： 750 * 1206PX</p>
              <p class="banner-format" style="margin-left: 190px;">支持格式： JPG / PNG</p>
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

          <el-table-column label="活动阶段ID" prop="stageId" align="left"></el-table-column>
          <el-table-column label="活动阶段名称" prop="stageName" align="left"></el-table-column>
          <el-table-column label="活动开始时间" prop="startDate" align="left"></el-table-column>
          <el-table-column label="活动结束时间" prop="endDate" align="left"></el-table-column>
          <el-table-column label="最高奖励金额" prop="properties.max_prize" align="left"></el-table-column>
          <el-table-column label="单次奖励" prop="properties.once_prize" align="left"></el-table-column>
          <el-table-column label="新人礼券" prop="newCard" align="left"></el-table-column>
          <el-table-column label="创建时间" prop="created" align="left"></el-table-column>
          <el-table-column label="操作" align="left" width="120px">
            <template slot-scope="scope" style="display:block;">
              <router-link :to="{path: '/activityInvite/add', query: {id: scope.row.id, type: 'edit', status: scope.row.isDelete}}">
                <el-button type="text" class="operate-btn">编辑</el-button>
              </router-link>
              <el-button v-if="scope.row.isDelete === 'ing' || scope.row.isDelete === 'ed'" type="text" class="operate-btn">删除</el-button>
              <el-button v-if="scope.row.isDelete === 'will'" type="text" class="operate-btn" @click="deleteOne(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>

        </el-table>

        <div style="text-align: center;margin-top: 30px;">
          <el-pagination background ref="onePages" @size-change="handleSizeChangeOne" @current-change="handleCurrentChangeOne"
                         :current-page.sync="onePages.pageNo" :page-size="onePages.pageSize"
                         :page-sizes="[20,40,80,100]" layout="total, sizes, prev, pager, next, jumper" :total="onePages.total">
          </el-pagination>
        </div>

      </div>
    </div>
    <div class="card-padding" v-show="activityTab === 2">
      <div>
        <el-form :model="formData" :inline="true" class="text-right mr-10">

          <el-select v-model="formData.reward" @change="getDataTwo(1)" filterable placeholder="筛选填写实物奖" class="width150px" clearable>
            <el-option v-for="item in rewardList" :label="item.text" :value="item.val" :key="item.val"></el-option>
          </el-select>

          <el-select v-model="formData.name" @change="getDataTwo(1)" filterable placeholder="筛选阶段" class="width150px" clearable>
            <el-option v-for="item in typeList" :label="item.text" :value="item.val" :key="item.val"></el-option>
          </el-select>

          <!--<el-form-item style="margin-right: 0px;">-->
            <!--<el-input v-model.trim="formData.reward" @keyup.native.enter="getDataTwo(1)" placeholder="筛选填写实物奖" class="width200px">-->
              <!--<i slot="suffix" @click="getDataTwo(1)" class="el-input__icon el-icon-search"></i>-->
            <!--</el-input>-->
          <!--</el-form-item>-->

          <el-form-item style="margin-right: 0px;">
            <el-input v-model.trim="formData.phone" @keyup.native.enter="getDataTwo(1)" placeholder="检索收货人手机号" class="width200px">
              <i slot="suffix" @click="getDataTwo(1)" class="el-input__icon el-icon-search"></i>
            </el-input>
          </el-form-item>

          <el-form-item>
            <el-input v-model.trim="formData.consignee" @keyup.native.enter="getDataTwo(1)" placeholder="检索收货人" class="width200px">
              <i slot="suffix" @click="getDataTwo(1)" class="el-input__icon el-icon-search"></i>
            </el-input>
          </el-form-item>

        </el-form>

        <el-table :data="countData" :empty-text="tableEmptyTwo" :slot="tableEmptyTwo" border style="width: 100%">

          <el-table-column label="会员ID" prop="memberid" align="left"></el-table-column>
          <el-table-column label="活动阶段ID" prop="code" align="left"></el-table-column>
          <el-table-column label="活动阶段名称" prop="name" align="left"></el-table-column>
          <el-table-column label="成功邀请人数" prop="invitenum" align="left"></el-table-column>
          <el-table-column label="订单总数" prop="ordernum" align="left"></el-table-column>
          <el-table-column label="已完成订单数" prop="orderednum" align="left"></el-table-column>
          <el-table-column label="订单金额" prop="ordermoney" align="left"></el-table-column>
          <el-table-column label="已完成订单总金额" prop="ordermoneynum" align="left"></el-table-column>
          <el-table-column label="实物奖励" prop="reward" align="left"></el-table-column>
          <el-table-column label="收货人" prop="consignee" align="left"></el-table-column>
          <el-table-column label="手机号码" prop="phone" align="left"></el-table-column>
          <el-table-column label="收货地址" prop="receiving" align="left"></el-table-column>
          <el-table-column label="操作" align="left" width="120px">
            <template slot-scope="scope" style="display:block;">
              <router-link :to="{path: '/activityInvite/users', query: {id: scope.row.platform_activity_id, member: scope.row.memberid}}">
                <el-button type="text" class="operate-btn underline">被邀请人名单</el-button>
              </router-link>

              <router-link :to="{path: '/field/order', query: {id: scope.row.memberid}}">
                <el-button type="text" class="operate-btn underline">订单列表</el-button>
              </router-link>
            </template>
          </el-table-column>

        </el-table>
        <div style="text-align: center;margin-top: 30px;">
          <el-pagination background ref="twoPages" @size-change="handleSizeChangeTwo" @current-change="handleCurrentChangeTwo"
                         :current-page.sync="twoPages.pageNo" :page-size="twoPages.pageSize"
                         :page-sizes="[20,40,80,100]" layout="total, sizes, prev, pager, next, jumper" :total="twoPages.total">
          </el-pagination>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import pageTab from '../components/page-tab.vue'
  import upload from '@/components/upload'
  import { platformActivityInviteList, platformActivityInviteDelete, platformActivityInviteImgNew,
    platformActivityInviteImgList, platformActivityInviteImgEdit, platformActivityInviteCardNewList,
    platformActivityStatistics } from '@/service/market'

  export default {
    mixins: [],
    components: {
      [upload.name]: upload,
      [pageTab.name]: pageTab
    },
    data() {
      return {
        tabList: ['活动配置', '活动数据统计'], // tab页显示文字
        activityTab: 1, // 当前展示tab页
        onePartForm: {
          topBanner: ''
        },
        configData: [], // 活动配置表格展示数据
        onePages: {
          pageSize: 20,
          pageNo: 1,
          total: 0
        }, // 活动配置的分页
        twoPages: {
          pageSize: 20,
          pageNo: 1,
          total: 0
        }, // 活动数据统计的分页
        rewardList: [{ val: 1, text: '全部' }, { val: 2, text: '是' }, { val: 3, text: '否' }], // 筛选实物礼品下拉数据
        typeList: [], // 筛选阶段下拉展示数据
        formData: { // 活动数据统计搜索
          name: '',
          type: '',
          status: ''
        },
        countData: [], // 活动数据统计展示数据
        tableEmptyOne: '', // 活动配置数据为空的提示信息
        tableEmptyTwo: '', // 活动数据统计数据为空的提示信息
        isShowTopBanner: false, // 是否展示顶部banner的提示文字
        minStartDate: '', // 最小开始时间
        maxEndDate: '', // 最大结束时间
        empty: false // 列表数据是否为空
      }
    },
    mounted() {
      // 设置标题之后，里面去填充页面内容
      this.getDataOne(1)
      this.getDataTwo(1)
      this.init()
      this.search()
    },
    methods: {
      /**
       * 处理最小开始时间、最大结束时间、首页弹窗
       */
      init() {
        platformActivityInviteList({
          filters: {
            'platform_activity': {
              'type': {
                equalTo: 3
              }
            }
          },
          sort_item: 'start_date',
          sort_order: 'asc'
        }).then(res => {
          console.log(res.data.info.result[0])
          if (res.data.info.result.length > 0) {
            this.minStartDate = res.data.info.result[0].startDate
          } else {
            this.empty = true
          }
        })
        platformActivityInviteList({
          filters: {
            'platform_activity': {
              'type': {
                equalTo: 3
              }
            }
          },
          sort_item: 'end_date',
          sort_order: 'desc'
        }).then(res => {
          console.log(res.data.info.result[0])
          if (res.data.info.result.length > 0) {
            this.maxEndDate = res.data.info.result[0].endDate
          }
        })
        platformActivityInviteImgList({
          filters: {}
        }).then(res => {
          console.log(res)
          if (res.info.result.length > 0) {
            this.onePartForm.topBanner = res.info.result[0].windowImg
          }
        })
      },
      showTopBanner(val) {
        console.log(this.onePartForm)
        this.$set(this.onePartForm, 'topBanner', val)
        platformActivityInviteImgList({
          filters: {}
        }).then(res => {
          console.log(res)
          if (res.info.result.length > 0) {
            platformActivityInviteImgEdit({
              window_img: val
            }, res.info.result[0].id).then(res => {
              this.init()
            })
          } else {
            platformActivityInviteImgNew({
              window_img: val
            })
          }
        })
      },
      /**
       * 统计页搜索下拉框数据
       */
      search() {
        platformActivityInviteList({
          filters: {
            'platform_activity': {
              'type': {
                equalTo: 3
              }
            }
          },
          page_size: 10000
        }).then(res => {
          console.log(res.data.info.result)
          this.typeList = []
          res.data.info.result.forEach((item, index) => {
            this.typeList.push({ val: JSON.parse(item.properties).stage_id * 1, text: '阶段' + JSON.parse(item.properties).stage_id })
          })
        })
      },
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
        // this.onePages.pageSize = val
        this.$set(this.onePages, 'pageSize', val)
        this.getDataOne(1)
      },
      /**
       * 活动配置的current-change
       * @param page
       */
      handleCurrentChangeOne(val) {
        // this.onePages.pageNo = val
        this.$set(this.onePages, 'pageNo', val)
        this.getDataOne(1)
      },
      /**
       * 活动配置的数据显示
       * @param page
       */
      getDataOne(page) {
        const self = this
        this.configData = []
        console.log('获取活动配置的数据')
        platformActivityInviteList({
          filters: {
            'platform_activity': {
              'type': {
                equalTo: 3
              }
            }
          },
          page_no: page || this.onePages.pageNo,
          page_size: self.onePages.pageSize
        }).then(res => {
          console.log('res', res)
          if (res.data.info.result.length === 0) {
            this.tableEmptyOne = '暂时无数据'
            this.onePages.total = 0
          } else {
            this.onePages.total = res.data.info.result.length
            this.configData = res.data.info.result
            for (let i = 0; i < res.data.info.result.length; i++) {
              if (res.data.info.result[i].startDate <= this.convertDateTime(res.headers.date) && this.convertDateTime(res.headers.date) <= res.data.info.result[i].endDate) {
                console.log(res.data.info.result[i].name, '在活动期内')
                res.data.info.result[i].isDelete = 'ing'
              } else if (this.convertDateTime(res.headers.date) > res.data.info.result[i].endDate) {
                console.log(res.data.info.result[i].name, '已结束')
                res.data.info.result[i].isDelete = 'ed'
              } else {
                console.log(res.data.info.result[i].name, '未开始')
                res.data.info.result[i].isDelete = 'will'
              }
              this.configData[i].properties = JSON.parse(res.data.info.result[i].properties)
              this.configData[i].stageName = '阶段' + this.configData[i].properties.stage_id
              this.configData[i].stageId = this.configData[i].properties.stage_id
              platformActivityInviteCardNewList({
                filters: {
                  act_inv_newuser_coupon: {
                    platformActivityId: {
                      equalTo: res.data.info.result[i].id
                    }
                  }
                },
                includes: {
                  platform_coupon: {
                    includes: ['platCouponId']
                  }
                },
                page_size: 1000
              }).then(resList => {
                console.log(resList)
                if (resList.info.length > 0) {
                  resList.info.forEach((item, index) => {
                    if (index === 0) {
                      res.data.info.result[i].newCard = item.includes.platform_coupon.name
                    } else {
                      res.data.info.result[i].newCard = res.data.info.result[i].newCard + ',' + item.includes.platform_coupon.name
                    }
                  })
                } else {
                  res.data.info.result[i].newCard = '-'
                }
                self.configData.forEach((item, index) => {
                  self.$set(item, 'newCard', res.data.info.result[index].newCard)
                })
              })
            }
          }
        })
      },
      /**
       * 将服务器时间进行转换
       */
      convertDateTime (date) {
        const d = new Date(date)
        return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
      },
      /**
       * 活动配置的单条删除
       */
      deleteOne(id) {
        const self = this
        console.log(id)
        self.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          platformActivityInviteDelete({
            platform_activity_id: id
          }).then(res => {
            this.setMsg('success', '删除成功')
            self.getDataOne(1)
          })
        }).catch(() => {
          self.$message({
            message: '已取消删除',
            type: 'success'
          })
        })
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
        const self = this
        this.countData = []
        console.log('获取活动配置的数据')
        const params = {
          query_params: {},
          page_no: page || this.twoPages.pageNo,
          page_size: self.twoPages.pageSize
        }
        if (self.formData.reward) {
          if (self.formData.reward === 2) {
            params.query_params.delivery_method = 'offline'
          } else if (self.formData.reward === 3) {
            params.query_params.delivery_method = 'online'
          }
        }
        if (self.formData.name) {
          params.query_params.stage = self.formData.name
        }
        if (self.formData.phone) {
          params.query_params.mobile = self.formData.phone
        }
        if (self.formData.consignee) {
          params.query_params.name = self.formData.consignee
        }
        platformActivityStatistics(params).then(res => {
          console.log('res', res)
          if (res.info.result.length === 0) {
            this.tableEmptyTwo = '暂时无数据'
            this.twoPages.total = 0
          } else {
            this.twoPages.total = res.info.result.length
            this.countData = res.info.result
            console.log('this.countData', this.countData)
          }
        })
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
