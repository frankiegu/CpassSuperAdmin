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

          <el-form-item label="券数量" prop="amount">
            <el-input v-model="couponForm.amount" class="width340px"></el-input>
          </el-form-item>

          <el-form-item label="使用期限" prop="expireDate">
            <el-date-picker
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 340px"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              v-model="couponForm.expireDate"
              type="datetimerange">
            </el-date-picker>
          </el-form-item>
        </div>
      </div>

      <!-- 卡券内容 -->
      <div class="content-body">
        <h3 class="senior-title">卡券内容</h3>
        <div class="card-body">
          <el-form-item label="卡券类型" required>
            <el-radio-group v-model="couponForm.couponType">
              <el-radio v-if="key !== '2'" v-for="(value, key) in couponTypeList" :label="parseInt(key)" :key="key" @change="changeType">
                {{value}}
              </el-radio>
            </el-radio-group>
          </el-form-item>

          <transition name="slide-fade" mode="out-in">
            <!-- 小时券 -->
            <div v-if="couponForm.couponType === 1" v-bind:key="1">
              <el-form-item label="优惠内容" required>
                减免场地订单
                <el-select v-model="couponForm.subtractHour" class="width60px">
                  <el-option v-for="i in 8" :key="i" :label="i" :value="i" />
                </el-select>
                小时的费用
              </el-form-item>

              <el-form-item label="指定项目" prop="fieldType">
                <el-checkbox-group v-model="couponForm.fieldType">
                  <el-checkbox v-for="(value, key) in fieldTypeList" :key="key" :label="parseInt(key)">
                    {{value}}
                  </el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </div>

            <!-- 礼品券 -->
            <div v-if="couponForm.couponType === 3" v-bind:key="2">
              <el-form-item label="卡券权益" prop="couponRight">
                <el-input v-model.trim="couponForm.couponRight" class="width340px"
                  placeholder="请输入可享受的权益"></el-input>
              </el-form-item>
            </div>
          </transition>

          <el-form-item label="使用范围" required>
            <el-radio-group v-model="couponForm.isAllStore">
              <el-radio :label="1">{{couponForm.couponType === 1 ? '全部门店' : '全部核销点'}}</el-radio>
              <el-radio :label="2">{{couponForm.couponType === 1 ? '部分门店' : '部分核销点'}}</el-radio>
              <el-button v-if="couponForm.couponType === 3" type="text" class="ml30" @click="isWopVisible = true">
                添加
              </el-button>
            </el-radio-group>

            <transition name="slide-fade">
              <el-form-item v-if="couponForm.isAllStore === 2" class="range-cont clearfix">
                <div class="list-cont fl">
                  <el-input v-model.trim="filterText" placeholder="输入关键字进行过滤" class="fix-input"></el-input>
                  <div class="tree-cont">
                    <!-- 部分门店的树形 -->
                    <el-tree v-show="couponForm.couponType === 1" node-key="nodeKey" :data="treeData"
                      :filter-node-method="filterNode" default-expand-all :props="treeProp"
                      show-checkbox ref="rangeTree" class="range-tree"
                      @check-change="handleCheckChange">
                    </el-tree>

                    <!-- 部分核销点的树形 -->
                    <el-tree v-show="couponForm.couponType === 3" node-key="id" :data="stationList"
                      :filter-node-method="filterNode" default-expand-all :props="treeProp"
                      show-checkbox ref="rangeTree1" class="range-tree" @check-change="handleCheckChange">
                    </el-tree>
                  </div>
                </div>

                <div class="list-cont fl">
                  <p class="theme-gray clearfix fix-input">
                    {{couponForm.couponType === 1 ? '已选门店' : '已选核销点'}}
                    <span class="theme-blue ml12">{{selectedRange.length}}</span>
                    <span class="pointer-theme-blue fr" @click="removeSelected()">清空</span>
                  </p>

                  <!-- 选中的部分门店 -->
                  <el-table :data="selectedRange" height="360px" v-if="couponForm.couponType === 1">
                    <el-table-column label="空间" prop="spaceName"></el-table-column>
                    <el-table-column label="门店" prop="name"></el-table-column>
                    <el-table-column label="操作">
                      <template slot-scope="scope">
                        <span class="pointer-theme-gray" @click="removeSelected(scope.row.nodeKey)">删除</span>
                      </template>
                    </el-table-column>
                  </el-table>

                  <!-- 选中的部分核销点 -->
                  <el-table :data="selectedRange" height="360px" v-if="couponForm.couponType === 3">
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
                  {{index + 1 + '. '}}{{item.startTime}}至{{item.endTime}}期间，{{conditionTypeList[item.type]}}
                  <el-button type="text" icon="el-icon-close" class="ml20" @click="removeCondition(item)"></el-button>
                </li>
              </ol>

              <el-checkbox :label="2">支持手动领取</el-checkbox><br>
              <el-checkbox :label="3">支持手动下发</el-checkbox><br>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" class="width120px" @click="submitForm">创 建</el-button>
          </el-form-item>
        </div>
      </div>
    </el-form>

    <!-- 添加领取方式弹窗 -->
    <el-dialog title="添加领取方式" :lock-scroll="false" :visible.sync="isWayVisible" :before-close="closeWayDialog"
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
            :picker-options="pickerOptions"
            v-model="receiveConditions[index]['dateTime']"
            type="datetimerange">
          </el-date-picker>
        </li>
      </ul>
      <div slot="footer">
        <el-button @click="closeWayDialog">取 消</el-button>
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
  import { isUniqueCoupon, loadSpaceStoreTree, loadStation, addCoupon } from '@/service/market'

  export default {
    name: 'add',
    data() {
      const checkInt = (rule, value, callback) => {
        if (value && (value.toString().indexOf('.') !== -1 ||
            isNaN(Number(value)) || Number(value) < 1 || Number(value) > 99999)) {
          callback(new Error('请输入1-99999的正整数'))
        }
        callback()
      }
      const checkNameUnique = (rule, value, callback) => {
        if (value) {
          isUniqueCoupon({ name: value }).then(res => {
            if (res.status === 'false') {
              return callback(new Error(res.msg))
            } else {
              callback()
            }
          })
        }
      }
      return {
        filterText: '',
        // 指定项目列表
        fieldTypeList: {
          1: '会议室',
          2: '路演厅',
          3: '开放式卡座',
          4: '其他场地'
        },
        // 卡券类型列表
        couponTypeList: [],
        // 树形列表
        treeData: [],
        treeProp: { label: 'name' },
        // 核销点列表
        stationList: [],
        selectedRange: [],
        couponForm: {
          name: '',
          desc: '',
          amount: '',
          expireDate: [],
          couponType: 1, // 卡券类型

          // 小时券
          subtractHour: 1, // 减免时长
          fieldType: [],
          isAllStore: 1, // 是否应用全部门店 1-全部门店，2-部分门店
          range: [], // 部分门店的选中门店列表

          // 礼品券
          couponRight: '', // 卡券权益
          receiveWay: [], // 领取方式
          receiveConditionArray: [] // 自动发券触发条件
        },
        couponFormRules: {
          name: [
            { required: true, message: '请输入卡券名称', trigger: ['blur', 'change'] },
            { max: 20, message: '最大允许输入20个字', trigger: ['blur', 'change'] },
            { validator: checkNameUnique, trigger: ['blur'] }
          ],
          desc: [
            { max: 100, message: '最大允许输入100字', trigger: ['blur', 'change'] }
          ],
          amount: [
            { required: true, message: '请输入券数量', trigger: ['blur', 'change'] },
            { validator: checkInt, trigger: ['blur', 'change'] }
          ],
          expireDate: [
            { required: true, message: '请选择使用期限', trigger: ['blur', 'change'] }
          ],
          fieldType: [
            { required: true, message: '至少选择一个项目', trigger: ['blur', 'change'] }
          ],
          couponRight: [
            { required: true, message: '请输入可享受的权益', trigger: ['blur', 'change'] },
            { max: 50, message: '最大允许输入50字', trigger: ['blur', 'change'] }
          ],
          receiveWay: [
            { required: true, message: '至少选择一种领取方式', trigger: ['blur', 'change'], type: 'array' }
          ]
        },
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 3600 * 1000 * 24;
          }
        },
        hasCondition: false, // 是否有选中触发条件
        receiveConditions: [],
        isWayVisible: false, // 添加领取方式弹窗
        conditionTypeList: {}, // 条件触发领取方式列表
        isWopVisible: false // 添加核销点弹窗
      }
    },

    components: { addWopDialog },

    watch: {
      filterText(val) {
        if (this.couponForm.couponType === 1) this.$refs.rangeTree.filter(val)
        if (this.couponForm.couponType === 3) this.$refs.rangeTree1.filter(val)
      }
    },

    mounted() {
      // 获取自动发券领取方式列表
      // this.conditionTypeList = { 1: '新注册用户', 2: '分享后可领取' }
      // for (let i = 0; i < Object.keys(this.conditionTypeList).length; i++) {
      //   this.receiveConditions.push({ type: 0, dateTime: [] })
      // }
      loadConstant('couponReceive.conditionType').then(res => {
        if (res.status === 'true') {
          this.receiveConditions = []
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
    },

    methods: {
      // 切换卡券类型
      changeType(val) {
        this.selectedRange = []
        if (val === 3 && !this.stationList.length) {
          this.handleGetStation()
        }
      },
      // 获取核销点列表
      handleGetStation() {
        loadStation().then(res => {
          if (res.status === 'true') {
            this.stationList = res.info
            this.isWopVisible = false
          }
        })
      },
      // 获取树形数据
      handleGetTreeData() {
        loadSpaceStoreTree({ filterName: '' }).then(res => {
          if (res.status === 'true') {
            this.treeData = res.info
          }
        })
      },
      // 树形数据过滤
      filterNode(value, data) {
        if (!value) return true
        return data.name && data.name.indexOf(value) !== -1
      },
      // 获取选中的树节点，只返回门店节点
      getCheckedNodes() {
        const leafOnly = true
        const checkedNodes = this.couponForm.couponType === 1
          ? this.$refs.rangeTree.getCheckedNodes(leafOnly)
          : this.$refs.rangeTree1.getCheckedNodes(leafOnly)
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
          if (this.couponForm.couponType === 1) {
            this.couponForm.range.push(
              { 'spaceId': this.selectedRange[i].spaceId, 'storeId': this.selectedRange[i].storeId }
            )
          }
          if (this.couponForm.couponType === 3) {
            this.couponForm.range.push(this.selectedRange[i].id)
          }
        }
      },
      // 移除选中的节点
      removeSelected(nodeKey) {
        // 如果没有传nodeKey，则移除所有选中的节点；否则移除当前nodeKey的节点
        let treeName = this.couponForm.couponType === 1 ? 'rangeTree' : 'rangeTree1'
        console.log(treeName, this.$refs[treeName])
        if (!nodeKey) {
          this.$refs[treeName].setCheckedKeys([])
        } else {
          this.$refs[treeName].setChecked(nodeKey, false, true)
        }
      },

      // 添加领取方式
      showReceiveDialog() {
        let conditions = this.receiveConditions
        conditions.forEach(item => {
          item.type = 0
          item.dateTime = []
        })
        if (this.couponForm.receiveConditionArray) {
          this.couponForm.receiveConditionArray.forEach((item) => {
            let conditionIndex = Object.keys(this.conditionTypeList).indexOf(item.type += '')
            this.receiveConditions[conditionIndex].type = item.type
            this.receiveConditions[conditionIndex].dateTime = [item.startTime, item.endTime]
          })
        }
        this.isWayVisible = true
      },
      receiveChange() {
        this.receiveConditions.forEach(item => {
          if (item.type === 0) {
            item.dateTime = []
          }
        })
      },
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
            valid = true
          } else {
            this.$message.error('请选择有效期限')
            valid = false
          }
        })
        if (!valid) return
        this.hasCondition = true
        this.isWayVisible = false
      },
      closeWayDialog() {
        this.isWayVisible = false
      },
      // 移除触发条件
      removeCondition(data) {
        let target = this.couponForm.receiveConditionArray
        target.splice(target.findIndex(item => item.type === data.type), 1)
        this.receiveConditions.find(item => item.type === data.type).type = 0
        // this.receiveConditions.find(item => item.type === data.type).dateTime = []
      },

      // 提交表单
      submitForm() {
        this.$refs['couponForm'].validate(valid => {
          if (valid) {
            let form = this.couponForm
            let receiveCondition = form.receiveWay.includes(1) ? 1 : 0
            let receiveManual = form.receiveWay.includes(2) ? 1 : 0
            let receiveManpower = form.receiveWay.includes(3) ? 1 : 0
            let params = {
              name: form.name,
              description: form.desc,
              quantity: form.amount,
              startDate: form.expireDate && form.expireDate[0] ? form.expireDate[0] : '',
              endDate: form.expireDate && form.expireDate[1] ? form.expireDate[1] : '',
              type: form.couponType,
              receiveCondition: receiveCondition,
              receiveManual: receiveManual,
              receiveManpower: receiveManpower
            }
            if (form.couponType === 1) { // 小时券的特定参数
              params.subtractHour = form.subtractHour
              params.fieldType = form.fieldType
              params.storeType = form.isAllStore
              if (form.isAllStore === 2) {
                params.storeArray = form.range
              }
            }
            if (form.couponType === 3) { // 礼品券的特定参数
              params.benefit = form.couponRight
              params.verifyStationType = form.isAllStore
              if (form.isAllStore === 2) {
                params.verifyStationIds = form.range
              }
            }
            if (receiveCondition === 1) { // 条件触发勾选时传参
              if (form.receiveConditionArray.length === 0) {
                this.$message.error('条件触发至少添加一个触发方式')
                return
              }
              params.receiveConditionArray = form.receiveConditionArray
            }
            addCoupon(params).then(res => {
              if (res.status === 'true') {
                this.$message.success('创建成功！')
                this.$router.replace('/market/coupon')
              } else {
                this.$message.error(res.msg)
              }
            })
          } else {
            console.log('表单填写错误。')
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
