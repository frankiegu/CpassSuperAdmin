<template>
  <div class="add-coupon">
    <lh-title />

    <el-form :model="couponForm" :rules="couponFormRules" ref="couponForm" label-width="80px">
      <!-- 基础信息 -->
      <div class="content-body">
        <h3 class="senior-title">基础信息</h3>
        <div class="card-body">
          <el-form-item label="卡券名称" prop="name">
            <el-input v-model.trim="couponForm.name" class="width340px"></el-input>
          </el-form-item>

          <el-form-item label="卡券说明" prop="desc">
            <el-input v-model.trim="couponForm.desc" type="textarea" class="width340px"></el-input>
          </el-form-item>

          <el-form-item label="券数量" prop="quantity">
            <el-input v-model="couponForm.quantity" class="width340px"></el-input>
          </el-form-item>

          <el-form-item label="使用期限" prop="expireDate">
            <el-checkbox-group v-model="couponForm.type">
              <el-row>
                <el-checkbox name="type">
                  <el-date-picker
                    format="yyyy-MM-dd HH:mm"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    style="width: 315px"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions"
                    v-model="couponForm.expireDate"
                    :default-time="['00:00:00', '23:59:59']"
                    type="datetimerange">
                  </el-date-picker>
                </el-checkbox>
              </el-row>
              <el-checkbox name="type">
                <span>领取后</span><el-input v-model="couponForm.quantity" style="margin-left: 10px;margin-right: 10px;width: 50px;"></el-input><span>天有效</span>
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="使用限制" prop="useLimit">
            <el-input v-model.trim="couponForm.useLimit" type="textarea" class="width340px"></el-input>
          </el-form-item>

          <el-form-item label="使用方法" prop="couponUsage">
            <el-input v-model.trim="couponForm.couponUsage" type="textarea" class="width340px"></el-input>
          </el-form-item>
        </div>
      </div>

      <!-- 卡券内容 -->
      <div class="content-body">
        <h3 class="senior-title">卡券内容</h3>
        <div class="card-body">
          <el-form-item label="卡券类型" required>
            <el-radio-group v-model="couponForm.couponType" :disabled="!canChangeType">
              <el-radio v-for="(value, key) in couponTypeList" :label="parseInt(key)" :key="key" @change="changeType">
                {{value}}
              </el-radio>
            </el-radio-group>
          </el-form-item>

          <transition name="slide-fade" mode="out-in">
            <!-- 小时券 -->
            <div v-if="couponForm.couponType === 1" v-bind:key="1">
              <el-form-item label="优惠内容" required>
                减免场地订单
                <el-select v-model="couponForm.subtractHour" class="width75px">
                  <el-option v-for="i in 8" :key="i" :label="i" :value="i" />
                </el-select>
                小时的费用
              </el-form-item>

              <el-form-item label="指定项目" prop="fieldType">
                <el-checkbox-group v-model="couponForm.fieldType">
                  <el-checkbox v-for="item in fieldTypeList" :key="item.name"
                    v-if="item.key !== 3" :label="parseInt(item.key)">
                    {{item.name}}
                  </el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </div>

            <!-- 代金券 -->
            <div v-if="couponForm.couponType === 2" v-bind:key="2">
              <el-form-item label="优惠内容" required>
                <el-radio-group v-model="couponForm.voucherType" @change="changeVoucherType">
                  <el-radio :label="0">无门槛</el-radio>
                  <el-radio :label="1">满减</el-radio>
                </el-radio-group>

                <transition name="slide-fade" mode="out-in">
                  <!-- 无门槛 -->
                  <el-form-item prop="voucherAmount" class="discounted-price"
                    v-if="couponForm.voucherType === 0" key="voucher1">
                    优惠金额
                    <el-input v-model="couponForm.voucherAmount" class="width100px"></el-input>
                    元
                  </el-form-item>

                  <!-- 满减 -->
                  <el-form-item class="discounted-price" v-if="couponForm.voucherType === 1" key="voucher2">
                    满
                    <el-form-item prop="voucherFull" class="mb0 dib">
                      <el-input v-model="couponForm.voucherFull" class="width100px"></el-input>
                    </el-form-item>
                    减
                    <el-form-item prop="voucherReduce" class="mb0 dib">
                      <el-input v-model="couponForm.voucherReduce" class="width100px"></el-input>
                    </el-form-item>
                  </el-form-item>
                </transition>
              </el-form-item>

              <el-form-item label="指定项目" prop="fieldType">
                <el-checkbox-group v-model="couponForm.fieldType">
                  <el-checkbox v-for="item in fieldTypeList" :key="item.name" :label="parseInt(item.key)">
                    {{item.name}}
                  </el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </div>

            <!-- 礼品券 -->
            <div v-if="couponForm.couponType === 3" v-bind:key="3">
              <el-form-item label="卡券权益" prop="couponRight">
                <el-input v-model.trim="couponForm.couponRight" class="width340px"
                  placeholder="请输入可享受的权益"></el-input>
              </el-form-item>

              <el-form-item label="卡券价值" prop="worth">
                <el-input v-model="couponForm.worth" class="width340px" placeholder="请输入卡券的价值"></el-input>
              </el-form-item>
            </div>
          </transition>

          <el-form-item label="使用范围" required>
            <el-radio-group v-model="couponForm.isAllStore" @change="changeRange">
              <el-radio :label="1">{{couponForm.couponType !== 3 ? '全部空间' : '全部核销点'}}</el-radio>
              <el-radio :label="2">{{couponForm.couponType !== 3 ? '部分空间' : '部分核销点'}}</el-radio>
              <el-button v-if="couponForm.couponType === 3" type="text" class="ml30" @click="isWopVisible = true">
                添加
              </el-button>
            </el-radio-group>

            <transition name="slide-fade">
              <el-form-item v-if="couponForm.isAllStore === 2" class="range-cont clearfix" prop="range"
                :rules="[{required: true, message: '请选择使用范围', trigger: ['blur', 'change']}]">
                <div class="list-cont fl">
                  <el-input v-model.trim="filterText" placeholder="输入关键字进行过滤" class="fix-input"></el-input>
                  <div class="tree-cont">
                    <!-- 部分空间的树形 -->
                    <el-tree v-if="couponForm.couponType !== 3" node-key="nodeKey" :data="treeData" empty-text="暂无数据"
                      :filter-node-method="filterNode" default-expand-all :props="treeProp" key="storeTree"
                      show-checkbox ref="rangeTree" class="range-tree"
                      @check-change="handleCheckChange">
                    </el-tree>

                    <!-- 部分核销点的树形 -->
                    <el-tree v-if="couponForm.couponType === 3" node-key="id" :data="stationList" empty-text="暂无数据"
                      :filter-node-method="filterNode" default-expand-all :props="treeProp" key="stationTree"
                      show-checkbox ref="rangeTree" class="range-tree" @check-change="handleCheckChange">
                    </el-tree>

                    <p class="theme-light-gray mt60" style="text-align: center" v-if="isFilterNoData">暂无数据</p>
                  </div>
                </div>

                <div class="list-cont fl">
                  <p class="theme-gray clearfix fix-input">
                    {{couponForm.couponType !== 3 ? '已选空间' : '已选核销点'}}
                    <span class="theme-blue ml12">{{selectedRange.length}}</span>
                    <span class="pointer-theme-blue fr" @click="removeSelected()">清空</span>
                  </p>

                  <!-- 选中的部分空间 -->
                  <el-table :data="selectedRange" height="360px" v-if="couponForm.couponType !== 3" key="storeTable">
                    <el-table-column label="品牌" prop="spaceName"></el-table-column>
                    <el-table-column label="空间" prop="name"></el-table-column>
                    <el-table-column label="操作">
                      <template slot-scope="scope">
                        <span class="pointer-theme-gray" @click="removeSelected(scope.row.nodeKey)">删除</span>
                      </template>
                    </el-table-column>
                  </el-table>

                  <!-- 选中的部分核销点 -->
                  <el-table :data="selectedRange" height="360px" v-if="couponForm.couponType === 3" key="stationTable">
                    <el-table-column label="核销点" prop="name"></el-table-column>
                    <el-table-column label="地址">
                      <template slot-scope="scope">
                        {{scope.row.provinceName + scope.row.cityName + scope.row.districtName + scope.row.address}}
                      </template>
                    </el-table-column>
                    <el-table-column label="操作">
                      <template slot-scope="scope">
                        <span class="pointer-theme-gray" @click="removeSelected(scope.row.id)">删除</span>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </el-form-item>
            </transition>
          </el-form-item>
        </div>
      </div>

      <!-- 领取方式 -->
      <div class="content-body">
        <h3 class="senior-title">领取方式</h3>
        <div class="card-body">
          <el-form-item label="领取方式" prop="receiveWay">
            <el-checkbox-group v-model="couponForm.receiveWay">
              <el-checkbox :label="1">条件触发</el-checkbox>
              <el-button v-if="couponForm.receiveWay.includes(1)" @click="showReceiveDialog"
                type="text" class="ml30">添加</el-button><br>

              <!-- 选中的触发条件 -->
              <ol class="condition-list" v-if="hasCondition">
                <li v-for="(item, index) in couponForm.receiveConditionArray" :key="index" v-if="!!item.startTime">
                  {{index + 1 + '. '}}
                  {{item.startTime.substr(0, 16)}}
                  至 {{item.endTime.substr(0, 16)}} 期间，{{conditionTypeList[item.type]}}
                  <el-button type="text" icon="el-icon-close" class="ml20" @click="removeCondition(item)"></el-button>
                </li>
              </ol>

              <el-checkbox :label="2">支持手动领取</el-checkbox><br>
              <el-checkbox :label="3">支持手动下发</el-checkbox><br>
              <el-checkbox :label="5">新人礼包活动发放</el-checkbox><br>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" class="width120px" @click="submitForm">
              {{$route.query.id ? '保 存' : '创 建'}}
            </el-button>
          </el-form-item>
        </div>
      </div>
    </el-form>

    <!-- 添加领取方式弹窗 -->
    <el-dialog title="添加领取方式" :lock-scroll="false" :visible.sync="isWayVisible" :before-close="closeReceiveDialog"
      width="500px">
      <ul class="receive-list">
        <li v-for="(value, key, index) in conditionTypeList" :key="key">
          <el-checkbox :true-label="key" :false-label="0" class="mb10" @change="receiveChange"
            v-if="receiveConditions.length > 0"
            v-model="receiveConditions[index]['type']">
            {{value}}
          </el-checkbox><br>
          <span class="theme-gray input-label">有效期限</span>
          <el-date-picker
            v-if="receiveConditions.length > 0"
            :disabled="receiveConditions[index]['type'] !== key"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 320px"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :picker-options="subPickerOptions"
            v-model="receiveConditions[index]['dateTime']"
            :default-time="['00:00:00', '23:59:59']"
            type="datetimerange">
          </el-date-picker>
        </li>
      </ul>
      <div slot="footer">
        <el-button @click="closeReceiveDialog">取 消</el-button>
        <el-button type="primary" @click="confirmWay">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加核销点弹窗 -->
    <add-wop-dialog v-if="couponForm.couponType === 3" :is-visible="isWopVisible"
      @closeDialog="isWopVisible = false" @refreshData="handleGetStation"></add-wop-dialog>
  </div>
</template>

<script>
  import addWopDialog from '../components/add-wop-dialog'
  import { loadConstant } from '@/service/common'
  import { loadSpaceStoreTree, loadStation, addCoupon, couponDetail, updateCoupon } from '@/service/market'
  import ElRow from 'element-ui/packages/row/src/row'

  export default {
    name: 'add',
    data() {
      const checkInt = (rule, value, callback) => {
        if (value && (value.toString().indexOf('.') !== -1 ||
            isNaN(Number(value)) || Number(value) < 1 || Number(value) > 999999)) {
          callback(new Error('请输入1-999999的正整数'))
        }
        callback()
      }
      const checkAmount = (rule, value, callback) => {
        if (value && (isNaN(Number(value)) || Number(value) <= 0 || Number(value) > 9999)) {
          callback(new Error('请输入0-9999的正数'))
        } else if (value && (value.toString().indexOf('.') !== -1 && value.toString().split('.')[1].length > 2)) {
          callback(new Error('最多允许输入两位小数'))
        }
        callback()
      }
      const checkReduce = (rule, value, callback) => {
        if (value && (Number(value) > Number(this.couponForm.voucherFull))) {
          callback(new Error('优惠金额不得大于满减金额'))
        }
        callback()
      }
      const checkWorth = (rule, value, callback) => {
        if (value && (value.toString().indexOf('.') !== -1 ||
          isNaN(Number(value)) || Number(value) < 0 || Number(value) > 9999)) {
          callback(new Error('请输入0-9999的正整数'))
        }
        callback()
      }
      // const checkNameUnique = (rule, value, callback) => {
      //   if (value) {
      //     let params = {
      //       name: value
      //     }
      //     if (this.$route.query.id) params.couponId = this.$route.query.id
      //     isUniqueCoupon(params).then(res => {
      //       if (res.status === 'false') {
      //         return callback(new Error(res.msg))
      //       } else {
      //         callback()
      //       }
      //     })
      //   }
      // }
      const checkMinDate = (rule, value, callback) => {
        if (value && value.length > 0) {
          if (new Date(value[0]) < new Date()) {
            return callback(new Error('起始时间需大于当前时间'))
          }
          callback()
        }
      }
      return {
        filterText: '',
        // 指定项目列表 前端暂时写死。v-for对象通过Object.keys()遍历，它对于key为数字的会进行大小排序，顺序不符合预想，改用数组
        fieldTypeList: [
          { key: 1, name: '会议室' },
          { key: 2, name: '路演厅' },
          { key: 6, name: '时租工位' },
          { key: 3, name: '日租工位' },
          { key: 4, name: '多功能场地' }
        ],
        // 卡券类型列表
        couponTypeList: [],
        canChangeType: true, // 编辑时不可更改卡券类型
        // 树形列表
        isFilterNoData: false,
        treeData: [],
        treeProp: { label: 'name' },
        // 核销点列表
        stationList: [],
        selectedRange: [],
        couponForm: {
          name: '',
          desc: '',
          quantity: '',
          expireDate: [],
          useLimit: '', // 使用限制
          couponUsage: '', // 使用方法
          couponType: 1, // 卡券类型

          // 小时券
          subtractHour: 1, // 减免时长
          fieldType: [],
          isAllStore: 2, // 是否应用全部空间 1-全部空间，2-部分空间
          range: [], // 部分空间的选中空间列表

          // 代金券
          voucherType: 0, // 0-无门槛，1-满减
          voucherAmount: '', // 优惠金额
          voucherFull: '', // 满金额
          voucherReduce: '', // 减金额

          // 礼品券
          couponRight: '', // 卡券权益
          worth: '', // 卡券价值
          receiveWay: [], // 领取方式
          receiveConditionArray: [] // 自动发券触发条件
        },
        couponFormRules: {
          name: [
            { required: true, message: '请输入卡券名称', trigger: ['blur', 'change'] },
            { max: 20, message: '最大允许输入20个字', trigger: ['blur', 'change'] }
            // { validator: checkNameUnique, trigger: ['blur'] }
          ],
          desc: [
            { max: 100, message: '最大允许输入100字', trigger: ['blur', 'change'] }
          ],
          quantity: [
            { required: true, message: '请输入券数量', trigger: ['blur', 'change'] },
            { validator: checkInt, trigger: ['blur', 'change'] }
          ],
          expireDate: [
            { required: true, message: '请选择使用期限', trigger: ['blur', 'change'] },
            { validator: checkMinDate, trigger: ['blur', 'change'] }
          ],
          useLimit: [
            { required: true, message: '请输入使用限制', trigger: ['blur', 'change'] },
            { max: 500, message: '最大允许输入500字', trigger: ['blur', 'change'] }
          ],
          couponUsage: [
            { required: true, message: '请输入使用方法', trigger: ['blur', 'change'] },
            { max: 500, message: '最大允许输入500字', trigger: ['blur', 'change'] }
          ],
          voucherAmount: [
            { required: true, message: '请输入优惠金额', trigger: ['blur', 'change'] },
            { validator: checkAmount, trigger: ['blur', 'change'] }
          ],
          voucherFull: [
            { required: true, message: '请输入满金额', trigger: ['blur', 'change'] },
            { validator: checkAmount, trigger: ['blur', 'change'] }
          ],
          voucherReduce: [
            { required: true, message: '请输入减金额', trigger: ['blur', 'change'] },
            { validator: checkAmount, trigger: ['blur', 'change'] },
            { validator: checkReduce, trigger: ['blur', 'change'] }
          ],
          fieldType: [
            { required: true, message: '至少选择一个项目', trigger: ['blur', 'change'] }
          ],
          couponRight: [
            { required: true, message: '请输入可享受的权益', trigger: ['blur', 'change'] },
            { max: 50, message: '最大允许输入50字', trigger: ['blur', 'change'] }
          ],
          worth: [
            { required: true, message: '请输入卡券价值', trigger: ['blur', 'change'] },
            { validator: checkWorth, trigger: ['blur', 'change'] }
          ],
          receiveWay: [
            { required: true, message: '至少选择一种领取方式', trigger: ['blur', 'change'], type: 'array' }
          ]
        },
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 3600 * 1000 * 24
          }
        },
        subPickerOptions: {
          disabledDate: (time) => {
            if (this.couponForm.expireDate.length > 1) { // 条件触发的结束时间小于等于使用期限的结束时间
              return time.getTime() > new Date(this.couponForm.expireDate[1]) ||
                time.getTime() < Date.now() - 3600 * 1000 * 24
            } else {
              return time.getTime() < Date.now() - 3600 * 1000 * 24
            }
          }
        },
        hasCondition: false, // 是否有选中触发条件
        receiveConditions: [],
        isWayVisible: false, // 添加领取方式弹窗
        conditionTypeList: {}, // 条件触发领取方式列表
        isWopVisible: false // 添加核销点弹窗
      }
    },

    components: {
      ElRow,
      addWopDialog },

    watch: {
      filterText(val) {
        this.$refs.rangeTree.filter(val)
      }
    },

    mounted() {
      // 获取自动发券领取方式列表
      loadConstant('couponReceive.conditionType').then(res => {
        if (res.status === 'true') {
          this.receiveConditions = []
          // this.conditionTypeList = { 1: 'ddd', 2: 'ooo'}
          this.conditionTypeList = res.info
          for (let i = 0; i < Object.keys(this.conditionTypeList).length; i++) {
            this.receiveConditions.push({ type: 0, dateTime: [] })
          }
        }
      })
      // 获取卡券类型列表
      loadConstant('platformCoupon.couponType').then(res => {
        if (res.status === 'true') {
          this.couponTypeList = res.info
        }
      })
      // 获取树形数据
      this.handleGetTreeData()

      // 获取核销点列表
      this.handleGetStation()
    },

    methods: {
      // 切换卡券类型重置数据
      changeType() {
        this.selectedRange = []
        this.couponForm.range = []
        this.couponForm.fieldType = []
        this.couponForm.couponRight = ''
        this.couponForm.worth = ''
        this.couponForm.voucherType = 0
        this.couponForm.voucherAmount = ''
        this.couponForm.voucherFull = ''
        this.couponForm.voucherReduce = ''
        this.couponForm.isAllStore = 2
        this.removeSelected()
      },
      // 切换代金券类型时重置数据
      changeVoucherType() {
        this.couponForm.voucherAmount = ''
        this.couponForm.voucherFull = ''
        this.couponForm.voucherReduce = ''
      },
      // 切换使用范围时重置数据
      changeRange() {
        this.selectedRange = []
        this.couponForm.range = []
      },

      // 获取核销点列表
      handleGetStation() {
        loadStation({
          status: 1,
          isDelete: 0
        }).then(res => {
          if (res.status === 'true') {
            this.stationList = res.info
            this.isWopVisible = false
            // 获取优惠券详情
            if (this.$route.query.id) this.handleGetCouponDetail()
          }
        })
      },
      // 获取树形数据
      handleGetTreeData() {
        loadSpaceStoreTree({ filterName: '' }).then(res => {
          if (res.status === 'true') {
            this.treeData = res.info
            // 获取优惠券详情
            if (this.$route.query.id) this.handleGetCouponDetail()
          }
        })
      },
      // 树形数据过滤
      filterNode(value, data, node) {
        this.$nextTick(() => {
          this.isFilterNoData = this.$refs['rangeTree'].$el.offsetHeight === 0
        })
        if (!value) return true
        if (data.name && data.name.indexOf(value) !== -1) {
          return true
        } else if (node.parent.data.name && node.parent.data.name.indexOf(value) !== -1) {
          return true
        } else if (node.parent.parent && node.parent.parent.level > 0 &&
          node.parent.parent.data.name.indexOf(value) !== -1) {
          return true
        }
      },
      // 获取选中的树节点，只返回空间节点
      getCheckedNodes() {
        const leafOnly = true
        const checkedNodes = this.$refs.rangeTree.getCheckedNodes(leafOnly)
        const storeNodes = []
        for (let i = 0; i < checkedNodes.length; i++) {
          if (this.couponForm.couponType === 1) {
            if (checkedNodes[i].storeId && !checkedNodes[i].disabled) {
              storeNodes.push(checkedNodes[i])
            }
          } else {
            storeNodes.push(checkedNodes[i])
          }
        }
        return storeNodes
      },
      // 复选框change时更新节点
      handleCheckChange(data, checked, indeterminate) {
        // console.log(data, checked, indeterminate)
        this.selectedRange = this.getCheckedNodes()
        this.couponForm.range = []
        for (let i = 0; i < this.selectedRange.length; i++) {
          if (this.couponForm.couponType !== 3) {
            this.couponForm.range.push(
              { 'spaceId': this.selectedRange[i].spaceId, 'storeId': this.selectedRange[i].storeId }
            )
          }
          if (this.couponForm.couponType === 3) {
            this.couponForm.range.push(this.selectedRange[i].id)
          }
        }
      },

      /**
       * 移除选中的节点
       * @param {string} [nodeKey] - 可选的节点key值
       */
      removeSelected(nodeKey) {
        // 如果没有传nodeKey，则移除所有选中的节点；否则移除当前nodeKey的节点
        if (!nodeKey) {
          this.$refs.rangeTree.setCheckedKeys([])
        } else {
          this.$refs.rangeTree.setChecked(nodeKey, false, true)
        }
      },

      // 添加领取方式映射
      mapReceiveConditions() {
        let conditions = this.receiveConditions
        conditions.forEach(item => {
          item.type = 0
          item.dateTime = []
        })
        if (this.couponForm.receiveConditionArray) {
          this.couponForm.receiveConditionArray.forEach((item) => {
            let conditionIndex = Object.keys(this.conditionTypeList).indexOf(item.type += '')
            this.receiveConditions[conditionIndex].type = item.type
            this.receiveConditions[conditionIndex].dateTime = item.startTime ? [item.startTime, item.endTime] : []
          })
        }
      },
      showReceiveDialog() {
        this.mapReceiveConditions()
        this.isWayVisible = true
      },
      // 触发条件选中状态切换时
      receiveChange() {
        this.receiveConditions.forEach(item => {
          if (item.type === 0) {
            item.dateTime = []
          }
        })
      },
      // 确认添加触发方式
      confirmWay() {
        let conditions = this.receiveConditions
        this.couponForm.receiveConditionArray = []
        conditions.forEach(item => {
          if (item.type !== 0) {
            let temp = Object.assign({}, {
              type: item.type,
              startTime: item.dateTime != null ? item.dateTime[0] : '',
              endTime: item.dateTime != null ? item.dateTime[1] : ''
            })
            this.couponForm.receiveConditionArray.push(temp)
          }
        })
        let target = this.couponForm.receiveConditionArray
        if (!target.length || (target.length > 0 && target[0]['type'] === 0)) {
          this.$message.error('至少选中一个触发条件')
          return
        }
        let valid = false
        target.forEach(item => {
          if (item && item['startTime']) {
            if (new Date(item['startTime']) > new Date()) {
              valid = true
            } else {
              this.$message.error('起始时间需大于当前时间')
              valid = false
              this.hasCondition = false
            }
          } else {
            this.$message.error('请选择有效期限')
            valid = false
            this.hasCondition = false
          }
          if (!valid) return
          if (this.couponForm.expireDate && this.couponForm.expireDate.length > 1) {
            if (item && item['endTime'] && new Date(item['endTime']) <= new Date(this.couponForm.expireDate[1])) {
              valid = true
            } else  {
              this.$message.error('结束时间需小于等于优惠券的使用结束时间')
              valid = false
              this.hasCondition = false
            }
          }
        })
        if (!valid) return
        this.hasCondition = true
        this.isWayVisible = false
      },
      closeReceiveDialog() {
        this.couponForm.receiveConditionArray.forEach((item) => {
          if (!item.startTime || new Date(item.startTime) < Date.now() ||
            new Date(item.endTime) > new Date(this.couponForm.expireDate[1])) {
            this.removeCondition(item)
          }
        })
        this.isWayVisible = false
      },
      // 移除触发条件
      removeCondition(data) {
        let target = this.couponForm.receiveConditionArray
        target.splice(target.findIndex(item => item.type === data.type), 1)
        this.receiveConditions.find(item => item.type === data.type).type = 0
        // this.receiveConditions.find(item => item.type === data.type).dateTime = []
      },

      // 优惠券详情
      handleGetCouponDetail() {
        couponDetail({ id: this.$route.query.id }).then(res => {
          if (res.status === 'true' && res.info) {
            let couponForm = this.couponForm
            let platformCoupon = res.info.platformCoupon
            let couponReceiveDetailList = res.info.couponReceiveDetailList
            couponForm.name = platformCoupon.name
            couponForm.desc = platformCoupon.description
            couponForm.quantity = platformCoupon.quantity
            couponForm.expireDate = [platformCoupon.startDate, platformCoupon.endDate]
            couponForm.couponType = platformCoupon.type
            couponForm.useLimit = platformCoupon.useLimit
            couponForm.couponUsage = platformCoupon.couponUsage
            this.canChangeType = false // 禁止切换卡券类型
            couponReceiveDetailList.forEach(item => {
              couponForm.receiveWay.push(item.receiveType)
              console.log(couponForm.receiveWay)
              if (item.receiveType === 1) {
                this.hasCondition = true
                couponForm.receiveConditionArray = [{
                  type: item.receiveConditionType,
                  startTime: item.receiveConditionStartTime,
                  endTime: item.receiveConditionEndTime
                }]
              }
            })
            this.mapReceiveConditions()

            switch (platformCoupon.type) {
              case 1: // 小时券
              case 2: // 代金券
                let platformCouponContent = res.info.platformHourCoupon || res.info.platformCashCoupon
                let platformCouponFieldTypeList = res.info.fieldTypeList
                let storeList = res.info.storeList || res.info.cashCouponStoreList

                if (platformCoupon.type === 1) couponForm.subtractHour = platformCouponContent.subtractHour
                if (platformCoupon.type === 2) {
                  couponForm.voucherType = platformCouponContent.isConditional
                  if (couponForm.voucherType === 0) {
                    couponForm.voucherAmount = platformCouponContent.amount
                  } else {
                    couponForm.voucherFull = platformCouponContent.applyLowerLimit
                    couponForm.voucherReduce = platformCouponContent.amount
                  }
                }

                couponForm.fieldType = []
                platformCouponFieldTypeList.forEach(item => {
                  couponForm.fieldType.push(item.type)
                })
                couponForm.isAllStore = platformCouponContent.storeType
                // 详情中的空间列表映射回树形空间的选中
                if (storeList.length > 0) {
                  let nodeKeys = []
                  this.treeData.forEach((item) => {
                    if (item.children && item.children.length > 0) {
                      for (let i = 0; i < storeList.length; i++) {
                        let target = item.children.find(child => child.storeId === storeList[i].id)
                        if (target != null) {
                          nodeKeys.push(target.nodeKey)
                        }
                      }
                    }
                  })
                  this.$nextTick(() => {
                    this.$refs.rangeTree.setCheckedKeys(nodeKeys)
                  })
                }
                break
              case 3: // 礼品券
                let platformGiftCoupon = res.info.platformGiftCoupon
                let verifyStationList = res.info.verifyStationList
                couponForm.couponRight = platformGiftCoupon.benefit
                couponForm.worth = platformGiftCoupon.worth
                couponForm.isAllStore = platformGiftCoupon.verifyStationType
                if (verifyStationList.length > 0) {
                  this.$nextTick(() => {
                    this.$refs.rangeTree.setCheckedNodes(verifyStationList)
                  })
                }
                break
              default:
                break
            }
          }
        })
      },

      // 提交表单
      submitForm() {
        this.$refs['couponForm'].validate(valid => {
          if (valid) {
            let form = this.couponForm
            /**
             * 判断领取方式是否支持（1-支持， 0-不支持）
             * receiveCondition 条件触发
             * receiveManual 手动领取
             * receiveManpower 手动下发
             */
            let receiveCondition = form.receiveWay.includes(1) ? 1 : 0
            let receiveManual = form.receiveWay.includes(2) ? 1 : 0
            let receiveManpower = form.receiveWay.includes(3) ? 1 : 0
            let receiveNewcomerActivity = form.receiveWay.includes(5) ? 1 : 0
            let params = {
              name: form.name,
              description: form.desc,
              quantity: form.quantity,
              startDate: form.expireDate && form.expireDate[0] ? form.expireDate[0] : '',
              endDate: form.expireDate && form.expireDate[1] ? form.expireDate[1] : '',
              type: form.couponType,
              useLimit: form.useLimit,
              couponUsage: form.couponUsage,
              receiveCondition: receiveCondition,
              receiveManual: receiveManual,
              receiveManpower: receiveManpower,
              receiveNewcomerActivity: receiveNewcomerActivity
            }
            // 编辑优惠券时传入优惠券ID，添加优惠券时跳过
            if (this.$route.query.id) params.id = this.$route.query.id

            if (form.couponType === 1) { // 小时券的特定参数
              params.subtractHour = form.subtractHour
              params.fieldType = form.fieldType
              params.storeType = form.isAllStore
              if (form.isAllStore === 2) {
                params.storeArray = form.range
              }
            }
            if (form.couponType === 2) { // 代金券的特定参数
              params.isConditional = form.voucherType
              params.amount = form.voucherType === 0 ? form.voucherAmount : form.voucherReduce // 优惠金额
              if (form.voucherType === 1) params.applyLowerLimit = form.voucherFull // 满金额
              params.fieldType = form.fieldType
              params.storeType = form.isAllStore
              if (form.isAllStore === 2) {
                params.storeArray = form.range
              }
            }
            if (form.couponType === 3) { // 礼品券的特定参数
              params.benefit = form.couponRight
              params.worth = form.worth
              params.verifyStationType = form.isAllStore
              if (form.isAllStore === 2) {
                params.verifyStationIds = form.range
              }
            }
            if (receiveCondition === 1) { // 条件触发勾选时传参
              let dateValid = false
              if (form.receiveConditionArray.length === 0) {
                this.$message.error('条件触发至少添加一个触发方式')
                return
              } else {
                form.receiveConditionArray.forEach(item => {
                  if (new Date(item.startTime) > new Date()) {
                    dateValid = true
                  } else {
                    this.$message.error('条件触发的起始时间需大于当前时间')
                    dateValid = false
                    return
                  }
                  if (new Date(item.endTime) <= new Date(this.couponForm.expireDate[1])) {
                    dateValid = true
                  } else {
                    this.$message.error('条件触发的结束时间需小于等于优惠券的使用结束时间')
                    dateValid = false
                  }
                })
                if (!dateValid) return
              }
              params.receiveConditionArray = form.receiveConditionArray
            }
            let promise = this.$route.query.id ? updateCoupon(params) : addCoupon(params)
            promise.then(res => {
              if (res.status === 'true') {
                let tipTxt = this.$route.query.id ? '修改成功！' : '创建成功！'
                this.$message.success(tipTxt)
                if (this.$route.query.id) {
                  this.$router.replace('/market/coupon-detail?id=' + this.$route.query.id)
                } else {
                  this.$router.replace('/market/coupon')
                }
              } else {
                this.$message.error(res.msg)
              }
            })
          } else {
            this.$message.error('请确认表单填写正确！')
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .add-coupon {
    .el-form-item--small .el-form-item__content {
      line-height: 32px;
    }
    .el-button--text {
      padding: 8px 0;
    }

    .card-body {
      transition: all ease .25s;
    }
  }
</style>

<style lang="scss" scoped>
  @import "src/styles/config";
  .add-coupon {
    .discounted-price {
      margin: 18px 0 0;
    }
    .range-cont {
      margin-right: -12px;
      .list-cont {
        position: relative;
        margin-right: 12px;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        padding: 60px 12px 12px;
        box-sizing: border-box;
        width: calc(50% - 12px);
        /*height: 420px;*/
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
    .receive-list {
      >li {
        margin-bottom: 24px;
        .input-label {
          margin-left: 24px;
        }
      }
    }
    .condition-list li {
      font-size: 14px;
    }
  }
</style>
