<template>
  <div class="coupon">

    <!-- 有面包屑的时候，就隐藏这个标题 -->
    <div class="page-title">
      <h1>基础信息</h1>
    </div>
    <div class="form-box card-padding">
      <div class="detail-info">
        <div class="label">发布状态</div>
        <div class="label-con">
          <el-tag v-if="couponInfo.publishStatus === 0" type="primary">未发放</el-tag>
          <el-tag v-else-if="couponInfo.publishStatus === 1" type="success">发放中</el-tag>
          <el-tag v-else type="gray">已失效</el-tag>
        </div>
      </div>

      <el-row>
        <el-col :span="7">
          <div class="detail-info">
            <div class="label">优惠券名称</div>
            <div class="label-con">{{ couponInfo.name }}</div>
          </div>
        </el-col>

        <el-col :span="10">
          <div class="detail-info">
            <div class="label">优惠券描述</div>
            <div class="label-con">{{ couponInfo.mark }}</div>
          </div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="7">
          <div class="detail-info">
            <div class="label">优惠设置</div>
            <div class="label-con">
              <span v-if="couponInfo.type === 0">{{ couponInfo.discount / 10 }}折</span>
              <span v-else>满{{ couponInfo.full }}减{{ couponInfo.reduce }}</span>
            </div>
          </div>
        </el-col>

        <el-col :span="7">
          <div class="detail-info">
            <div class="label">投放数量</div>
            <div class="label-con">
              {{ couponInfo.publishCount }}/{{ couponInfo.total }}
            </div>
          </div>
        </el-col>
      </el-row>

      <el-row>
        <div class="detail-info">
          <div class="label">优惠券有效期</div>
          <div class="label-con">
            起：{{ couponInfo.startDate }}
            <div class="width30"></div>
            止：{{ couponInfo.endDate }}
          </div>
        </div>
      </el-row>

      <el-row style="margin-right: 60px">
        <div class="detail-info">
          <div class="label">创建时间</div>
          <div class="label-con">{{ couponInfo.created }}</div>
        </div>
      </el-row>

      <!-- 完成第一次发放后不可删除，按钮隐藏 -->
      <div v-permissions="'/manage/coupon/delete'" v-if="couponInfo.publishStatus === 0" @click="deleteCoupon(couponInfo.id)" class="delete-coupon">删除</div>

      <el-button v-permissions="'/manage/coupon/publish'" v-if="couponInfo.publishStatus !== -1" class="grant" type="primary" @click="grant">发放</el-button>
    </div>

    <!-- 优惠券发放弹窗 -->
    <el-dialog
      title="优惠券投放"
      :visible.sync="dialogVisible"
      :close-on-click-modal="allow"
      :lock-scroll="allow"
      :close-on-press-escape="allow"
      :before-close="handleCloseTree"
      custom-class="role-dialog"
      class="role-tree">

      <el-row :gutter="10" class="filter-bar">
        <el-col :span="10">
          <el-input
            placeholder="输入姓名/企业名字"
            v-model="filterText">
          </el-input>
        </el-col>
        <el-col :span="14">
          <div class="summary fl">
            已选<span class="selectedNum ml30">{{selectedMembers.length}}</span>/{{couponRest}}
          </div>
          <div class="btn-reset fr" @click="removeSelected()">清空</div>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="10">
          <el-tree
            v-loading="loadingTree"
            class="filter-tree"
            :data="roleTreeData"
            :props="treeProps"
            node-key="nodeKey"
            accordion
            show-checkbox
            ref="tree"
            :default-expand-all="true"
            :filter-node-method="filterNode"
            @check-change="handleCheckChange">
          </el-tree>
        </el-col>
        <el-col :span="14">
          <el-table border :data="selectedMembers" height="360px" style="width: 100%">
            <el-table-column prop="companyName" label="企业名称"></el-table-column>
            <el-table-column prop="name" label="会员姓名"></el-table-column>
            <el-table-column prop="role" label="会员角色">
              <template slot-scope="scope">
                <span v-if="scope.row.role === 1">企业负责人</span>
                <span v-else>员工</span>
              </template>
            </el-table-column>
            <el-table-column prop="nodeKey" label="操作" width="80">
              <template slot-scope="scope">
                <span class="btn-delete" @click="removeSelected(scope.row.nodeKey)">
                  <i class="el-icon-close"></i>
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleCouponPublish">马上发放</el-button>
      </div>

    </el-dialog>

    <div class="page-title">
      <h1>发放情况</h1>

      <el-switch
        v-permissions="'/manage/couponUser/freezeAll'"
        class="grant-switch"
        v-model="couponInfo.controlStatus"
        :active-value="1"
        :inactive-value="2"
        active-text=""
        inactive-text=""
        :active-color="switchActiveColor"
        inactive-color="rgb(191, 194, 217)"
        @change="businessToggleAll(couponInfo.controlStatus, couponInfo.id)">
      </el-switch>
    </div>

    <div class="form-box card-padding">
      <el-table
        :data="tableData"
        :empty-text="tableEmpty"
        :slot="tableEmpty"
        v-loading="tableLoading"
        border
        style="width: 100%">

        <!-- 1 -->
        <el-table-column
          label="券号">

          <template slot-scope="scope">
            {{ scope.row.couponUserNo }}
          </template>
        </el-table-column>

        <!-- 2 -->
        <el-table-column
          label="领取账号">

          <template slot-scope="scope">
            <span v-if="scope.row.userId">{{ scope.row.username }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>

        <!-- 3 -->
        <el-table-column
          label="所属企业">
          <template slot-scope="scope">
            <span style="float: left;" v-if="scope.row.companyName">{{ scope.row.companyName }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>

        <!-- 4 -->
        <el-table-column label="获取时间">
          <template slot-scope="scope">
            <span v-if="scope.row.receiveTime">{{ scope.row.receiveTime }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>

        <!-- 5 -->
        <el-table-column
          label="使用情况">

          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0" type="gray">可用</el-tag>
            <el-tag v-else-if="scope.row.status === 1" type="primary">已用</el-tag>
            <el-tag v-else-if="scope.row.status === 2" type="primary">冻结</el-tag>
            <el-tag v-else="scope.row.status === 3" type="success">已过期</el-tag>
          </template>
        </el-table-column>

        <!-- 6 -->
        <el-table-column
          label="使用时间">

          <template slot-scope="scope">
            <span v-if="scope.row.usedime">{{ scope.row.usedime }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>

        <!-- 7 -->
        <el-table-column
          label="发放人">

          <template slot-scope="scope">
            <span>admin</span>
          </template>
        </el-table-column>

        <!-- 8 -->
        <el-table-column v-if="handleHasPermissions('/manage/couponUser/unfreeze')" label="操作">
          <!--
            若投放数量为0，则隐藏
            超过优惠券结束时间，显示  已失效
          -->
          <template slot-scope="scope">
            <el-switch
              v-if="scope.row.status === 0"
              v-model="scope.row.status"
              :active-value="0"
              :inactive-value="2"
              active-text=""
              inactive-text=""
              :active-color="switchActiveColor"
              inactive-color="rgb(191, 194, 217)"
              @change="businessToggle(scope.row.status, scope.row.id)">
            </el-switch>

            <el-switch
              v-if="scope.row.status === 1"
              :disabled="scope.row.status === 1 ? true : false"
              v-model="scope.row.status"
              :active-value="0"
              :inactive-value="1"
              active-text=""
              inactive-text=""
              :active-color="switchActiveColor"
              inactive-color="rgb(191, 194, 217)"
              @change="businessToggle(scope.row.status, scope.row.id)">
            </el-switch>

            <el-switch
              v-if="scope.row.status === 2"
              v-model="scope.row.status"
              :active-value="0"
              :inactive-value="2"
              active-text=""
              inactive-text=""
              :active-color="switchActiveColor"
              inactive-color="rgb(191, 194, 217)"
              @change="businessToggle(scope.row.status, scope.row.id)">
            </el-switch>

            <el-switch
              v-if="scope.row.status === 3"
              :disabled="scope.row.status === 3 ? true : false"
              v-model="scope.row.status"
              :active-value="0"
              :inactive-value="3"
              active-text=""
              inactive-text=""
              :active-color="switchActiveColor"
              inactive-color="rgb(191, 194, 217)"
              @change="businessToggle(scope.row.status, scope.row.id)">
            </el-switch>

          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination background
        class="pagination-container"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageTotal">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import handleHasPermissions from '@/config/com-mixins'
  import {loadCouponStatistics, couponFindById, couponPublish, couponDelete, couponUserFindByCouponId, couponUserUnfreeze, couponUserFreeze, freezeAll, unfreezeAll} from '@/service'

  export default {
    mixins: [handleHasPermissions],
    components: {},
    data () {
      return {
        title: '优惠劵详情',
        couponId: this.$route.query.id, // 优惠券id
        userIds: [],
        currentPage4: 4,
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        formLabelWidth: '120px',
        grantStatus: false,

        // 会员选择相关
        loadingTree: true,
        dialogVisible: false,
        allow: false,
        selectedMembers: [],
        filterText: '',
        roleTreeData: [],
        treeProps: {
          label: 'name',
          children: 'children',
          disabled: 'disabled'
        },
        // 查询用户优惠券
        tableData: [],
        tableLoading: true,
        tableEmpty: ' ',
        // 优惠券详情
        couponInfo: {
          id: this.$route.query.id,
          name: '',
          type: '',
          discount: '',
          full: '',
          reduce: '',
          mark: '',
          created: '',
          startDate: '',
          endDate: '',
          total: 0,
          publishCount: 0,
          publishStatus: null,
          adminUserId: 0
        },
        // 分页器配置
        currentPage: 1,
        pageSize: 10,
        pageTotal: 0
      }
    },
    computed: {
      // 优惠券剩余量
      couponRest: function () {
        return this.couponInfo.total - this.couponInfo.publishCount
      }
    },
    mounted: function () {
      // 查询优惠券详情
      this.findCoupon()
      // 查询用户优惠券，发放列表
      this.couponUserFindByCouponId()

      // 优惠券投放情况
      this.getCouponStatistics()
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    methods: {
      // 查询用户优惠券，发放列表
      couponUserFindByCouponId () {
        const self = this
        couponUserFindByCouponId({
          couponId: self.couponId,
          pageNum: self.currentPage,
          pageSize: self.pageSize
        }).then(res => {
          if (res.status === 'true') {
            self.tableData = res.info.result
            self.tableLoading = false
            if (self.tableData.length === 0) {
              self.tableEmpty = '暂时无数据'
            }

            self.pageTotal = res.info.total
          }
        })
      },
      // 查询优惠券详情
      findCoupon () {
        const self = this
        couponFindById({
          id: self.couponId
        }).then(res => {
          if (res.status === 'true') {
            self.couponInfo.name = res.info.name
            self.couponInfo.type = res.info.type
            self.couponInfo.discount = res.info.discount
            self.couponInfo.full = res.info.full
            self.couponInfo.reduce = res.info.reduce
            self.couponInfo.mark = res.info.mark
            self.couponInfo.created = res.info.created
            self.couponInfo.startDate = res.info.startDate
            self.couponInfo.endDate = res.info.endDate
            self.couponInfo.total = res.info.total
            self.couponInfo.publishCount = res.info.publishCount
            self.couponInfo.publishStatus = res.info.publishStatus
            self.couponInfo.controlStatus = res.info.controlStatus
          }
        })
      },
      // 切换所有发放情况
      businessToggleAll (currentStatus, id) {
        const self = this
        // console.log('currentStatus: ', currentStatus);
        if (currentStatus === 1) {
          unfreezeAll({
            couponId: id
          }).then(res => {
            if (res.status === 'true') {
              self.$message({
                type: 'success',
                message: '成功解冻优惠券!'
              });
            } else {
              self.$message({
                showClose: true,
                message: res.msg,
                type: 'error'
              });
            }

            // 刷新一下发放情况列表
            self.couponUserFindByCouponId()
            self.findCoupon()
          })
        } else if (currentStatus === 2) {
          self.$confirm('冻结后优惠券会从会员账户中移除，请谨慎操作', '确认冻结所有优惠券？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            freezeAll({
              couponId: id
            }).then(res => {
              if (res.status === 'true') {
                self.$message({
                  type: 'success',
                  message: '优惠券已冻结!'
                });
              } else {
                self.$message({
                  showClose: true,
                  message: res.msg,
                  type: 'error'
                });
              }

              // 刷新一下发放情况列表
              self.couponUserFindByCouponId()
              self.findCoupon()
            })
          }).catch(() => {
            self.$message({
              type: 'info',
              message: '已取消'
            });

            // 刷新一下发放情况列表
            self.couponUserFindByCouponId()
            self.findCoupon()
          });
        }
      },
      // 切换门店发放情况
      businessToggle (currentStatus, id) {
        const self = this
        // console.log('currentStatus: ', currentStatus);
        if (currentStatus === 0) {
          couponUserUnfreeze({
            couponUserId: id
          }).then(res => {
            if (res.status === 'true') {
              self.$message({
                type: 'success',
                message: '成功解冻优惠券!'
              });
            } else {
              self.$message({
                showClose: true,
                message: res.msg,
                type: 'error'
              });
            }
          })
        } else if (currentStatus === 2) {
          self.$confirm('冻结后优惠券会从会员账户中移除，请谨慎操作', '确认冻结优惠券？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            couponUserFreeze({
              couponUserId: id
            }).then(res => {
              if (res.status === 'true') {
                self.$message({
                  type: 'success',
                  message: '优惠券已冻结!'
                });
              } else {
                self.$message({
                  showClose: true,
                  message: res.msg,
                  type: 'error'
                });
              }
            })
          }).catch(() => {
            // 刷新一下发放情况列表，展开switch
            this.couponUserFindByCouponId()
            self.$message({
              type: 'info',
              message: '已取消'
            });
          });
        }
      },
      // 分页器事件
      handleSizeChange(val) {
        this.pageSize = val
        this.couponUserFindByCouponId()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.couponUserFindByCouponId()
      },
      // 删除优惠劵
      deleteCoupon (id) {
        const self = this
        self.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          couponDelete({
            id: id
          }).then(res => {
            if (res.status === 'true') {
              self.$message({
                showClose: true,
                message: '删除成功',
                type: 'success'
              });
              // 后退一步记录，等同于 history.back()
              self.$router.go(-1)
            } else {
              self.$message({
                showClose: true,
                message: res.msg,
                type: 'error'
              });
            }
          })
        }).catch(() => {
          self.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      // 获取优惠券投放情况
      getCouponStatistics() {
        this.roleTreeData = []
        loadCouponStatistics({
          couponId: this.couponId
        }).then(res => {
          if (res.status === 'true') {
            // const roleArr = []
            // roleArr.push(res.info)
            // console.log(Object.values(res.info))
            // var index = 0
            // const traverse = function (node) {
            //   const childNodes = node.children ? node.children : node
            //   // console.log('childNodes', childNodes)
            //   if (childNodes.length) {
            //     childNodes.forEach((child) => {
            //       // console.log('child', child)
            //       child.nodeKey = index++
            //       traverse(child)
            //     })
            //   }
            // }
            // traverse(roleArr)
            this.roleTreeData.push(res.info)
            this.loadingTree = false
          } else {
            console.log(res.msg)
          }
        })
      },
      handleCloseTree(done) {
        // if (this.defaultChecked.length) {
        //   this.defaultChecked = []
        // }
        if (this.selectedMembers.length) {
          const self = this
          self.$confirm('未发放优惠券，是否确认关闭？', {
            lockScroll: false
          })
              .then(_ => {
                self.selectedMembers = []
                self.removeSelected()
                done()
              })
              .catch(_ => {
                return
              })
        } else {
          done()
        }
      },
      // 会员选择相关
      grant () {
        this.dialogVisible = true
      },
      // 过滤树节点
      filterNode(value, data, node) {
        if (!value) return true;
        if (data.name.indexOf(value) !== -1) {
          return true
        } else if (node.parent.data.name && node.parent.data.name.indexOf(value) !== -1) {
          return true
        } else if (node.parent.parent && node.parent.parent.level > 0 && node.parent.parent.data.name.indexOf(value) !== -1) {
          return true
        }
      },
      // 获取选中的树节点，只返回会员节点
      getCheckedNodes() {
        const leafOnly = true
        const checkedNodes = this.$refs.tree.getCheckedNodes(leafOnly)
        const staffNodes = []
        for (let i = 0; i < checkedNodes.length; i++) {
          if (checkedNodes[i].userId && !checkedNodes[i].disabled) {
            staffNodes.push(checkedNodes[i])
          }
        }
        return staffNodes
      },
      // 复选框change时更新会员节点
      handleCheckChange(data, checked, indeterminate) {
        this.selectedMembers = this.getCheckedNodes()
        this.userIds = []
        for (let i = 0; i < this.selectedMembers.length; i++) {
          this.userIds.push(this.selectedMembers[i].userId)
        }
      },
      // 移除选中的会员
      removeSelected(nodeKey) {
        // 如果没有传nodeKey，则移除所有选中的会员；否则移除当前nodeKey的会员
        if (!nodeKey) {
          this.$refs.tree.setCheckedKeys([])
        } else {
          this.$refs.tree.setChecked(nodeKey, false, true)
        }
      },
      // 发放优惠券
      handleCouponPublish() {
        const self = this
        if (self.selectedMembers.length > 0) {
          const paramsObj = {
            couponId: self.couponId,
            userIds: self.userIds
          }
          couponPublish(paramsObj).then(res => {
            if (res.status === 'true') {
              self.$message({
                type: 'success',
                message: '发放成功'
              })
              self.dialogVisible = false

              // 发放成功后重新请求优惠券投放情况、优惠券详情、清空选中的会员列表、刷新页面的数据
              self.selectedMembers = []
              self.findCoupon()
              self.getCouponStatistics()
              self.couponUserFindByCouponId()
            } else {
              self.$message({
                type: 'error',
                message: res.msg
              })
            }
          })
        } else {
          self.$message({
            type: 'info',
            message: '未选择任何会员'
          })
        }
      }
    }
  }
</script>

<style lang="scss">
</style>
<style lang="scss" scoped>
  @import "../../../styles/config";
  .coupon {
    .grant-switch {
      float: right;
      margin-top: -2px;
    }
    .delete-coupon {
      position: absolute;
      top: 20px;
      right: 25px;
      cursor: pointer;
    }
    .grant {
      float: right;
      margin-top: -38px;
    }
  }
</style>
