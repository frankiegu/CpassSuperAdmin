<template>
  <div class="permission-duty">
    <div class="page-title"> <h1>职务权限</h1> </div>

    <div class="store-setting card-padding">
      <el-form v-on:submit.native.prevent :model="roleSort" :inline="true"  class="sort-form-bar">
        <el-form-item class="mr0">
          <el-input v-model.trim="roleSort.name" @keyup.native.enter="getPageData" class="width220px" placeholder="请输入职务名称">

            <i slot="suffix" @click="getPageData" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-form-item>

        <router-link
          class="fl"
          :to="{path: '/permission/duty/add', query: {type: 'add'}}">
          <el-button type="primary" icon="el-icon-circle-plus">新增职务</el-button>
        </router-link>
      </el-form>

      <el-table :data="tableData" :slot="tableEmpty" :empty-text="tableEmpty" v-loading="tableLoading" border style="width: 100%">
        <el-table-column label="职务名称" prop="roleName"></el-table-column>
        <el-table-column label="职务描述" prop="roleDesc"></el-table-column>
        <el-table-column label="人数" prop="adminUserCount" sortable></el-table-column>
        <el-table-column label="人员" prop="adminUsers"></el-table-column>

        <el-table-column width="290" label="操作">
          <template slot-scope="scope">
            <span @click="showManage(scope.row.id)" class="pointer-theme-blue dib">管理人员</span>

            <router-link class="table-link margin-lr6 dib" :to="{path: '/permission/duty/add', query: {id: scope.row.id, type: 'edit'}}">编辑</router-link>

            <router-link class="table-link margin-lr6 dib" :to="{path: '/permission/duty/add', query: {id: scope.row.id, type: 'copy'}}">复制</router-link>

            <span @click="deletePosition(scope.row.id)" class="theme-gray cursor-pointer margin-lr6 dib">删除</span>

            <el-switch
              class="margin-lr6"
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              active-text=""
              inactive-text=""
              :active-color="switchActiveColor"
              inactive-color="rgb(191, 194, 217)"
              @change="statusToggle(scope.row.status, scope.row.id)">
            </el-switch>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
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

      <!-- 选择账号 -->
      <el-dialog :visible.sync="isShowAccountList" title="选择账号" class="transfer-box" top="10vh" :lock-scroll="false">
        <el-transfer
          v-model="selectedAdmin"
          :data="accountList"
          :filter-method="filterMethod"
          filterable
          filter-placeholder="请输入管理员名字"
          :titles="['管理员列表', '选中的管理员']"
          :props="{key: 'id', label: 'name', disabled: 'disabled'}">
        </el-transfer>

        <div slot="footer" class="dialog-footer">
          <p class="theme-gray mb22 mt20">账号未分配职务时将无法正常使用管理系统，请及时分配新的职务</p>
          <el-button class="width120px" @click="saveSelectAccount" type="primary">保存</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import setMsg from '@/config/com-mixins'
  import {listRole, listHasRole, roleList, manageUser, roleOpen, roleClose, roleDelete, getAdminUserByRole} from '@/service'

  export default {
    mixins: [setMsg], // 组件可复用功能
    data () {
      return {
        // 分页参数
        pageTotal: 0,
        pageSize: 10,
        currentPage: 1,

        // table列表数据
        tableData: [],
        tableLoading: true,
        tableEmpty: ' ',

        roleSort: {
          name: ''
        },

        isShowAccountList: false,
        accountList: [],
        hasRole: [], // 获取已分配职务的用户
        selectedAdmin: [],
        currRoleId: '',
        filterMethod(query, item) {
          return item.name.indexOf(query) > -1
        }
      }
    },
    mounted () {
      this.getPageData()
    },
    methods: {
      showManage (id) {
        this.currRoleId = id
        let totalList = []

        // 获取数据之前，先清空一下数据
        this.hasRole = []
        this.selectedAdmin = []
        this.accountList = []

        listRole({ roleId: id }).then(res => {
          if (res.status === 'true') {
            totalList = res.info

            listHasRole().then(res => {
              if (res.status === 'true') {
                this.hasRole = res.info

                for (let k of totalList) {
                  for (let m of this.hasRole) {
                    if (k.id === m.id) {
                      k.disabled = true
                    }
                  }
                }

                getAdminUserByRole({ roleId: id }).then(res => {
                  if (res.status === 'true') {
                    for (let i of totalList) {
                      for (let j of res.info) {
                        if (i.id === j.id) {
                          i.disabled = false
                        }
                      }
                    }

                    for (let item of res.info) {
                      this.selectedAdmin.push(parseInt(item.id))
                    }
                    this.accountList = totalList
                  } else {
                    this.setMsg('error', res.msg)
                  }
                })
              } else {
                this.setMsg('error', res.msg)
              }
            })
          } else {
            this.setMsg('error', res.msg)
          }
        })

        this.isShowAccountList = true
      },
      saveSelectAccount () {
        let ajaxParameters = {
          roleId: this.currRoleId,
          userIds: this.selectedAdmin
        }

        manageUser(ajaxParameters).then(res => {
          if (res.status === 'true') {
            this.setMsg('success', '设置成功！')
            this.isShowAccountList = false

            this.getPageData()
          } else {
            this.setMsg('error', res.msg)
          }
        })
      },
      deletePosition (id) {
        this.$confirm('该职务中的账号将无法登录管理系统', '确认删除职务？', {type: 'warning'}).then(() => {
          roleDelete({ roleId: id }).then(res => {
            if (res.status === 'true') {
              this.setMsg('success', '删除成功！')
              this.getPageData()
            } else {
              this.setMsg('error', res.msg)
            }
          })
        }).catch(() => {
          this.setMsg('已取消操作')
        })
      },
      statusToggle (currentStatus, id) {
        if (currentStatus === 1) {
          roleOpen({ roleId: id }).then(res => {
            if (res.status === 'true') {
              this.setMsg('success', '成功启用职务')
            } else {
              this.setMsg('error', res.msg)
            }
          })
        } else {
          this.$confirm('该职务中的账号将无法登录管理系统', '确认停用职务？', {}).then(() => {
            roleClose({ roleId: id }).then(res => {
              if (res.status === 'true') {
                this.setMsg('已关闭该职务!')
              } else {
                this.setMsg('error', res.msg)
              }
            })
          }).catch(() => {
            this.getPageData()
            this.setMsg('已取消操作')
          })
        }
      },
      getPageData() {
        let ajaxParameters = {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          name: this.roleSort.name
        }

        roleList(ajaxParameters).then(res => {
          if (res.status === 'true') {
            this.pageTotal = res.info.page.total
            this.tableData = res.info.page.result

            // table的交互
            this.tableLoading = false
            if (this.tableData.length === 0) {
              this.tableEmpty = '暂时无数据'
            }
          } else {
            this.setMsg('error', res.msg)
          }
        })
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.getPageData()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.getPageData()
      }
    }
  }
</script>

<style lang="scss">
  .permission-duty {
    .dialog-visible {
      .el-dialog__footer {
        text-align: center;
      }
    }
    .transfer-box {
      .el-dialog {
        width: 600px;

        .el-transfer {
          width: 496px;
          margin: 0 auto;
        }
        .transfer-footer {
          margin-left: 20px;
        }
      }
      .el-transfer__button {
        padding: 10px;
      }
    }
  }
</style>
<style lang="scss" scoped>
  @import '../../../styles/config.scss';
  @import '../../../styles/common.scss';

  .permission-duty {
    .set-table-dialog {
      .callback {
        display: inline-block;
        font-size: 16px;
        line-height: 25px;
        padding: 0 5px;
        cursor: pointer;
        margin-left: -9px;
      }
      .el-button {
        padding: 0;
      }
    }
    .sort-form-bar {
      text-align: right;
    }
    .dialog-footer {
      text-align: center;
      margin-top: -22px;
    }
  }
</style>
