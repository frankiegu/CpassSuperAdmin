<template>
  <div class="product-lib-detail">
    <lh-title :title="title"/>

    <div class="card-padding card-padding-vertical">
      <el-form :model="ruleForm" ref="ruleForm" label-width="80px">
        <h3 class="grid-title">基础信息</h3>
        <el-form-item label="版本名称" prop="versionName" :rules="[{ required: true, message: '请输入版本名称'}]">
          <el-input
            v-model.trim="ruleForm.versionName"
            ref="versionName"
            :maxlength="30"
            class="width420px"
            placeholder="请输入版本名称"></el-input>
        </el-form-item>

        <el-form-item label="售价" prop="price" :rules="[{ validator: checkAmount, trigger: ['blur', 'change'] }]">
          <el-input
            v-model.trim="ruleForm.price"
            ref="price"
            class="width420px"
            placeholder="请输入价格">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>

        <el-form-item class="align-bottom" label="描述" prop="description">
          <lh-textarea
            class="width420px"
            :textData="ruleForm.description"
            :maxlength="100"
            placeholder="请输入描述内容"
            :minRows="3"
            :maxRows="3"
            @input="val => ruleForm.description = val" />
        </el-form-item>

        <el-form-item class="align-bottom" label="可用状态" prop="status">
          <el-switch
            v-model="ruleForm.status"
            :active-value="1"
            :inactive-value="0"
            :active-color="switchActiveColor"
            active-text=""
            inactive-text=""></el-switch>
        </el-form-item>

        <!--功能模块-->
        <div class="access-information">
          <template>
            <h3 class="grid-title">功能模块</h3>
            <!-- table 描述 列标题 -->
            <div class="table-header-dec">功能描述</div>

            <!-- table -->
            <el-table :data="tableData" v-loading="tableLoading" class="table-box"
              ref="multipleTable">
              <el-table-column label-class-name="ml70" align="left" label="功能模块" width="250">
                <template slot-scope="scope">
                  <el-checkbox class="ml50"
                    @change="handleSelectionChange(scope.row.moduleId, scope.row.allPermisIds,
                     scope.row.checked, scope.row.requiredList)"
                    v-model="scope.row.checked" :indeterminate="scope.row.isIndeterminate">
                    {{ scope.row.moduleName }}
                  </el-checkbox>
                </template>
              </el-table-column>

              <el-table-column label-class-name="ml70" align="left" label="模块内容">
                <template slot-scope="scope">
                  <!-- :default-expanded-keys="scope.row.allPermisIds" -->
                  <el-tree
                    v-if="scope.row.permission != null"
                    @check-change="handleCheckChange"
                    :data="scope.row.permission"
                    :default-checked-keys="scope.row.checkIdList"
                    :props="{ label: 'name', children: 'children', disabled: 'mustCheck' }"
                    :ref="'tree' + scope.row.moduleId"
                    :expand-on-click-node="false"
                    :render-content="renderContent"
                    show-checkbox
                    node-key="id">
                  </el-tree>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </div>

        <el-form-item label-width="0" class="mt60">
          <el-button :class="{'ml272': sidebar.opened, 'ml116': !sidebar.opened}"
            class="width80px" @click="handleCancel">取消
          </el-button>

          <el-button
            @click="submitForm('ruleForm')"
            :loading="requestLoading"
            :class="{'ml272': sidebar.opened, 'ml116': !sidebar.opened}"
            class="width80px mr30"
            type="primary">保 存</el-button>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { permissionList, productAdd, productUpdate, productDetail } from '@/service/product'

  export default {
    data () {
      return {
        id: this.$route.query.id,
        type: this.$route.query.type,
        title: this.$route.query.id ? '编辑产品版本' : '新增产品版本',

        ruleForm: {
          versionName: '',
          price: 0,
          description: '',
          status: 1,
          permisIdList: []
        },

        tableData: [],
        tableLoading: false,
        requestLoading: false
      }
    },

    computed: {
      ...mapGetters([
        'sidebar'
      ])
    },

    mounted: function () {
      document.title = this.title
      this.$store.commit('NAV_CRUMB', this.title)
      this.$route.meta.title = this.title
      if (!this.$route.name) {
        this.$store.dispatch('addVisitedViews', this.$route)
      }

      this.tableLoading = true
      this.id ? this.getProductDetail() : this.getPermissionList()
    },

    methods: {
      // 切换权限选中事件
      handleCheckChange(data, checked, indeterminate) {
        // console.log(indeterminate)
        for (let i = 0, list = this.tableData, listLen = list.length; i < listLen; i++) {
          // console.log(list[i].allPermisIds.length, this.$refs['tree' + list[i].moduleId].getCheckedKeys().length)
          if (list[i].permission.includes(data)) {
            list[i].checked = false
            if (list[i].allPermisIds.length === this.$refs['tree' + list[i].moduleId].getCheckedKeys().length) {
              list[i].checked = true
              list[i].isIndeterminate = false
            } else {
              list[i].checked = false
              list[i].isIndeterminate = true
            }
          }
        }
      },

      // 全选功能模块
      handleSelectionChange(val, allPermisIds, checked, requiredList) {
        if (allPermisIds.length > 0) {
          this.$refs['tree' + val].setCheckedKeys(checked ? allPermisIds : requiredList)
        }
      },

      // 获取权限列表
      getPermissionList() {
        permissionList().then(res => {
          if (res.status === 'true') {
            this.tableData = res.info
            // this.tableData = this.tableData.concat(this.modulePermis)
            this.dealPermissionList()
            this.tableLoading = false
          } else {
            this.tableLoading = false
            this.setMsg('error', res.msg)
          }
        })
      },

      // 权限列表处理
      dealPermissionList() {
        let allPermisIds = [] // 全部权限的id数组（包含顶级权限）
        let requiredList = [] // 必选权限的id数组
        let diffLen = 0 // 长度差（allPermisIds的长度 - 实际权限的长度）为顶级权限的长度

        let traverse = (tree) => {
          const childNode = tree.permission || tree.children || tree
          // console.log(childNode, 'node')
          if (childNode.length) {
            childNode.forEach((child) => {
              allPermisIds.push(child.id)
              if (child.mustCheck) {
                requiredList.push(child.id)
              }
              // console.log(child.id, allPermisIds)
              traverse(child)
            })
          }
        }

        if (this.tableData.length > 0) {
          this.tableData.forEach((child) => {
            let topPermis = child.permission
            this.$set(child, 'checked', false) // 设置响应的顶级权限的checked属性，默认为不勾选
            this.$set(child, 'isIndeterminate', false) // 设置响应的isIndeterminate属性，默认为确定状态
            this.$set(child, 'allPermisIds', []) // 设置响应的allPermisIds属性，存储全部权限ID的数组，默认为空
            this.$set(child, 'requiredList', []) // 设置响应的requiredList属性，存储全部必选权限ID的数组，默认为空
            allPermisIds = []
            requiredList = []
            diffLen = topPermis.length
            // 当顶级权限下面的权限全部为必选时，禁用该顶级权限
            if (topPermis && topPermis.length > 0) {
              topPermis.forEach(item1 => {
                this.$set(item1, 'mustCheck', false)
                if (item1.children.length) {
                  let permisList = item1.children
                  let checkLen = 0
                  permisList.forEach(item2 => {
                    if (item2.mustCheck) {
                      ++checkLen
                      if (checkLen === permisList.length) {
                        this.$set(item1, 'mustCheck', true)
                      }
                    }
                  })
                }
              })
            }
            traverse(child)
            child.allPermisIds = allPermisIds
            child.requiredList = requiredList
            child.checked = child.allPermisIds.length === child.checkIdList.length + diffLen
            child.isIndeterminate = child.allPermisIds.length !== child.checkIdList.length + diffLen
          })
        }
      },

      // 获取产品版本详情
      getProductDetail() {
        productDetail({
          id: +this.id
        }).then(res => {
          if (res.status === 'true' && res.info) {
            this.ruleForm.versionName = res.info.name
            this.ruleForm.description = res.info.description
            this.ruleForm.status = res.info.status
            this.ruleForm.price = (res.info.price / 100) || 0
            this.tableData = res.info.permission
            this.dealPermissionList()
            this.tableLoading = false
          } else {
            this.tableLoading = false
            this.setMsg('error', res.msg || '请求失败')
          }
        })
      },

      // 保存
      submitForm(formName) {
        this.requestLoading = true
        let treeData

        if (!this.ruleForm.versionName) {
          this.requestLoading = false
          this.$refs.versionName.focus()
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 赋值前，先初始化一下数据
            this.ruleForm.permisIdList = []
            // 拿到权限id数组
            for (let list of this.tableData) {
              treeData = this.$refs['tree' + list.moduleId]

              if (treeData) {
                let leafOnly = true
                for (let item of treeData.getCheckedKeys(leafOnly)) {
                  this.ruleForm.permisIdList.push(item)
                }
              }
            }
            let ajaxParameters = {
              name: this.ruleForm.versionName,
              price: +this.ruleForm.price * 100,
              description: this.ruleForm.description,
              permisIdList: this.ruleForm.permisIdList,
              status: this.ruleForm.status
            }

            let requestWay = productAdd
            // 只在编辑的状态下才传id
            if (this.type === 'edit') {
              ajaxParameters.id = this.id
              requestWay = productUpdate
            }
            requestWay(ajaxParameters).then(res => {
              if (res.status === 'true') {
                let tipsText = (this.type === 'edit' ? '保存成功！' : '创建成功！')

                this.requestLoading = false
                this.setMsg('success', tipsText)
                this.$router.replace('/product/list')
              } else {
                this.requestLoading = false
                this.setMsg('error', res.msg)
              }
            })
          } else {
            this.requestLoading = false
          }
        })
      },

      // Tree组件自定义渲染权限描述
      renderContent(h, { node, data, store }) {
        let mlPX = (data.lvl !== 2) ? (<span class='fl ml70'>{data.permisDesc}</span>)
          : (<span class='fl ml50'>{data.permisDesc}</span>)
        return (
          <span style='width: 100%;'>
            <span class='fl width170px'>
              <span>{ node.label }</span>
            </span>
            { mlPX }
          </span>
        )
      },

      // 自定义校验-售价
      checkAmount: (rule, value, callback) => {
        if (isNaN(Number(value)) || Number(value) < 0 || Number(value) > 999999.99) {
          callback(new Error('请输入0-999999.99之间的数值'))
        } else if (value && (value.toString().indexOf('.') !== -1 && value.toString().split('.')[1].length > 2)) {
          callback(new Error('最多允许输入两位小数'))
        }
        callback()
      },

      // 取消
      handleCancel() {
        this.$confirm('此操作将不保存任何修改，是否确认取消？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.replace('/product/list')
        }).catch(() => {})
      }
    }
  }
</script>

<style lang="scss">
  @import "src/styles/variables";
  .product-lib-detail {
    .el-table__row:nth-child(2n) {
      background-color: #fff !important;
    }
    .el-table tr {
      box-shadow: none !important;
    }

    .el-checkbox {
      display: block;
      margin-left: 30px;
    }
    .el-table--enable-row-hover .el-table__body tr:hover > td {
      background-color: #fff;
    }
    .el-tree-node:focus > .el-tree-node__content {
      background-color: #fff;
    }
    .el-tree-node__content:hover {
      background-color: #fff;
    }
    .el-checkbox__input.is-checked + .el-checkbox__label {
      color: #5a5e66;
    }
    .text-box {
      width: 600px;
    }
    .access-information {
      position: relative;
    }
    .table-header-dec {
      position: absolute;
      z-index: 1;
      top: 88px;
      left: 600px;
      color: #909399;
    }
    .table-box {
      width: 100%;
    }
    .button-row {
      button {
        width: 120px;
      }
    }
  }
</style>
