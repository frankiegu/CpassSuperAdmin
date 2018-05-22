<template>
  <div class="manual-issue">
    <lh-title />

    <div class="lh-card-main card-padding">
      <el-steps :active="active" align-center>
        <el-step title="选择卡券"></el-step>
        <el-step title="选择会员"></el-step>
        <el-step title="发放结果"></el-step>
      </el-steps>

      <!-- 选择卡券 -->
      <div class="step-cont clearfix coupon-cont" v-if="active === 1">
        <div class="list-cont fl">
          <el-input v-model.trim="filterText" placeholder="请输入优惠券名称" class="fix-input"></el-input>
          <div class="tree-cont">
            <el-tree node-key="nodeKey" :data="treeData"
              :filter-node-method="filterNode" default-expand-all :props="treeProp"
              show-checkbox ref="couponTree" class="coupon-tree"
              @check-change="handleCheckChange">
            </el-tree>
          </div>
        </div>

        <div class="list-cont fl">
          <p class="theme-gray clearfix fix-input">
            已选优惠券
            <span class="theme-blue ml12">{{selectedCoupons.length}}</span>
            <span class="pointer-theme-blue fr" @click="removeSelected()">清空</span>
          </p>
          <el-table :data="selectedCoupons" height="360px" :key="1">
            <el-table-column label="优惠券类型" prop="couponType"></el-table-column>
            <el-table-column label="名称" prop="name"></el-table-column>
            <el-table-column label="剩余数量" prop="amount"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <span class="pointer-theme-gray" @click="removeSelected(scope.row.nodeKey)">删除</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <!-- 选择会员 -->
      <div class="step-cont" v-if="active === 2">
        <lh-item label="已选优惠券" label-width="120px">
          <el-table :data="selectedCoupons">
            <el-table-column label="优惠券类型" prop="couponType"></el-table-column>
            <el-table-column label="名称" prop="name"></el-table-column>
            <el-table-column label="剩余数量" prop="amount"></el-table-column>
          </el-table>
        </lh-item>

        <lh-item label="最大可选会员数" label-width="120px">{{'90'}}
          <span class="ml20">已选 <span class="theme-blue ml20"> {{submitData.userIds.length}}</span></span>
        </lh-item>

        <div class="member-cont">
          <!-- 筛选表单 -->
          <el-form :model="memberSort" :inline="true" @submit.native.prevent class="sort-form-bar clearfix">
            <el-form-item>
              <el-select v-model="memberSort.registerWay" placeholder="请选择注册渠道" @change="getPageData(1)"
                filterable clearable>
                <el-option v-for="item in channels" :key="item.id" :value="item.registerWay"
                  :label="item.registerName"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-date-picker v-model="memberSort.registerDate" @change="getPageData(1)" value-format="yyyy-MM-dd"
              :picker-options="pickerOptions" start-placeholder="开始日期" end-placeholder="结束日期"
              type="daterange" align="right" clearable></el-date-picker>
            </el-form-item>

            <el-form-item>
              <el-input v-model.trim="memberSort.nickname" placeholder="请输入会员名称"
                @keyup.native.enter="getPageData(1)">
                <i slot="suffix" @click="getPageData(1)" class="el-input__icon el-icon-search"></i>
              </el-input>
            </el-form-item>
          </el-form>

          <!-- 会员列表 -->
          <el-table :data="memberList" row-key="id" @selection-change="handleSelectionChange" :key="2">
            <el-table-column type="selection" width="55" reserve-selection></el-table-column>
            <el-table-column label="会员名称" prop="nickname"></el-table-column>
            <el-table-column label="注册渠道" prop="registerName">
              <template slot-scope="scope">
                <span>{{scope.row.registerName ? scope.row.registerName : '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="注册日期">
              <template slot-scope="scope">
                <span>{{scope.row.createDate ? scope.row.createDate.slice(0, 10) : '-'}}</span>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页器 -->
          <el-pagination
            :total="pageTotal"
            :page-size="pageSize"
            :current-page="currentPage"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :layout="layoutArr"
            :page-sizes="pageSizeArr"
            class="pagination-container"
            background>
          </el-pagination>
        </div>
      </div>

      <!-- 发放结果 -->
      <div class="step-cont" v-if="active === 3">
        <div class="success-cont">
          <i v-if="isSuccess" class="el-icon-success theme-green"></i>
          <i v-if="!isSuccess" class="el-icon-error theme-red"></i>
          <h2 class="fz20">{{isSuccess ? '已完成发放' : '发放失败'}}</h2>

          <!-- 发放失败时展示错误原因 -->
          <lh-item label="错误原因" label-width="120px" v-if="!isSuccess" class="mt24">
            <el-table :data="errorList">
              <el-table-column label="优惠券" prop="name"></el-table-column>
              <el-table-column label="原因" prop="reason"></el-table-column>
            </el-table>
          </lh-item>
        </div>
      </div>

      <div class="button-bar">
        <el-button v-if="active === 2" @click="prev">返回上一步</el-button>
        <el-button v-if="active === 1" type="primary" @click="next">下一步</el-button>
        <el-button v-if="active === 2" type="primary" @click="next">确 定</el-button>
        <el-button v-if="active === 3" @click="next">返回列表</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import tableMixins from '@/mixins/table'
  import { CUSTOMER_LIST } from '@/service/member'
  import { channelList } from '@/service/market'
  export default {
    name: 'manual-issue',
    mixins: [tableMixins],
    data() {
      return {
        active: 1,
        // 树形控件数据
        filterText: '',
        treeData: [{
          name: '全部',
          nodeKey: 1,
          children: [{
            name: '小时券',
            nodeKey: 2,
            children: [{
              name: '3小时场地券',
              nodeKey: 3,
              couponId: 1,
              couponType: '小时券',
              amount: 99
            }, {
              name: '6小时场地券',
              nodeKey: 4,
              couponId: 2,
              couponType: '小时券',
              amount: 99
            }]
          }, {
            name: '礼品券',
            nodeKey: 5,
            children: [{
              name: '咖啡兑换券',
              nodeKey: 6,
              couponId: 3,
              couponType: '礼品券',
              amount: 70
            }, {
              name: '甜点兑换券',
              nodeKey: 7,
              couponId: 4,
              couponType: '礼品券',
              amount: 20
            }]
          }]
        }],
        treeProp: { label: 'name' },

        selectedCoupons: [], // 选中的优惠券
        channels: [], // 渠道列表
        memberSort: {
          registerWay: '',
          registerDate: [],
          nickname: ''
        },
        memberList: [],

        // 下发卡券参数
        submitData: {
          userIds: [],
          couponIds: []
        },
        isSuccess: true,
        errorList: [],
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        }
      }
    },
    watch: {
      filterText(val) {
        this.$refs.couponTree.filter(val)
      }
    },
    mounted() {
      channelList().then(res => {
        if (res.status === 'true' && res.info) {
          this.channels = res.info
        }
      })
    },
    methods: {
      // step 1 树形数据过滤
      filterNode(value, data, node) {
        if (!value) return true;
        if (data.name && data.name.indexOf(value) !== -1) {
          return true
        } else if (node.parent.data.name && node.parent.data.name.indexOf(value) !== -1) {
          return true
        } else if (node.parent.parent && node.parent.parent.level > 0 &&
          node.parent.parent.data.name.indexOf(value) !== -1) {
          return true
        }
      },
      // step 1 获取选中的树节点，只返回优惠券节点
      getCheckedNodes() {
        const leafOnly = true
        const checkedNodes = this.$refs.couponTree.getCheckedNodes(leafOnly)
        const storeNodes = []
        for (let i = 0; i < checkedNodes.length; i++) {
          if (checkedNodes[i].couponId && !checkedNodes[i].disabled) {
            storeNodes.push(checkedNodes[i])
          }
        }
        return storeNodes
      },
      // 复选框change时更新节点
      handleCheckChange(data, checked, indeterminate) {
        // console.log(data, checked, indeterminate)
        this.selectedCoupons = this.getCheckedNodes()
        this.submitData.couponIds = []
        for (let i = 0; i < this.selectedCoupons.length; i++) {
          this.submitData.couponIds.push(this.selectedCoupons[i].id)
        }
      },
      // 移除选中的节点
      removeSelected(nodeKey) {
        // 如果没有传nodeKey，则移除所有选中的节点；否则移除当前nodeKey的节点
        let treeName = 'couponTree'
        if (!nodeKey) {
          this.$refs[treeName].setCheckedKeys([])
        } else {
          this.$refs[treeName].setChecked(nodeKey, false, true)
        }
      },

      // step 2 会员列表选择事件
      handleSelectionChange(val) {
        this.submitData.userIds = val
      },
      // 获取会员列表
      getPageData(page) {
        this.currentPage = page || this.currentPage
        let [startDate, endDate] = this.memberSort.registerDate
        let params = {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          nickname: this.memberSort.nickname,
          registerWay: this.memberSort.registerWay,
          startDate: startDate,
          endDate: endDate
        }
        CUSTOMER_LIST(params).then(res => {
          if (res.status === 'true' && res.info) {
            this.memberList = res.info.result
            this.pageTotal = res.info.total
          }
        })
      },

      // 切换步骤事件
      prev() {
        if (this.active-- < 1) this.active = 1
      },
      next() {
        if (this.active++ > 2) this.active = 1
        if (this.active === 2 && this.memberList.length === 0) this.getPageData()
      }
    }
  }
</script>

<style lang="scss">
  .manual-issue {
    .coupon-cont {
      margin: 0 -12px 24px 0;
      .list-cont {
        position: relative;
        margin-right: 12px;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        padding: 60px 12px 12px;
        box-sizing: border-box;
        width: calc(50% - 12px);
        overflow: hidden;
        .tree-cont {
          height: 360px;
          overflow-y: auto;
        }
        .fix-input {
          position: absolute;
          top: 12px;
          left: 12px;
          z-index: 2;
          width: calc(100% - 24px);
        }
      }
    }
    .sort-form-bar .el-form-item__content {
      line-height: 28px;
    }
    .step-cont {
      margin-top: 24px;
    }
    .member-cont {
      margin-bottom: 24px;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      padding: 12px;
    }
    .success-cont {
      padding: 60px 0 32px;
      text-align: center;
    }
    .el-icon-success, .el-icon-error {
      margin-bottom: 32px;
      width: 72px;
      height: 72px;
      font-size: 72px;
      line-height: 1;
      overflow: hidden;
    }
    .button-bar {
      text-align: center;
    }
  }
</style>
