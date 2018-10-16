<template>
  <div class="product-lib-detail">
    <lh-title class="mb24" :title="title"/>

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
            <el-table :data="tableData" v-loading="tableLoading" :empty-text="tableEmpty" class="table-box"
              ref="multipleTable">
              <el-table-column label-class-name="ml70" align="left" label="功能模块" width="250">
                <template slot-scope="scope">
                  <el-checkbox class="ml50" @change="handleSelectionChange(scope.row.id, scope.row.allPermisIds,
                   scope.row.checked)" v-model="scope.row.checked">{{ scope.row.moduleName }}</el-checkbox>
                </template>
              </el-table-column>

              <el-table-column label-class-name="ml70" align="left" label="模块内容">
                <template slot-scope="scope">
                  <!-- :default-expanded-keys="scope.row.allPermisIds" -->
                  <el-tree
                    v-if="scope.row.permis != null"
                    @check-change="handleCheckChange"
                    :data="scope.row.permis"
                    :default-checked-keys="scope.row.checkedPermisIds"
                    :props="{ label: 'permisName', children: 'children' }"
                    :ref="'tree' + scope.row.id"
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
          <el-button
            :class="{'ml272': sidebar.opened, 'ml116': !sidebar.opened}"
            class="width80px">取消
          </el-button>

          <el-button
            @click="submitForm('ruleForm')"
            :class="{'ml272': sidebar.opened, 'ml116': !sidebar.opened}"
            class="width80px mr30"
            type="primary">
            {{ type === 'add' ? '创建版本' : '保 存'}}
          </el-button>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  // import { roleAdd, roleUpdate } from '@/service/product'
  import dataMixins from './data.mixins'

  export default {
    mixins: [dataMixins],
    data () {
      return {
        id: this.$route.query.id,
        type: this.$route.query.type,
        title: this.$route.query.id ? '编辑产品版本' : '新增产品版本',
        checkList: [],

        ruleForm: {
          versionName: '',
          price: 0,
          description: '',
          status: 1,
          permisIds: [],
          pushList: [],
          checkList: []
        },

        tableData: [],
        tableEmpty: ' ',
        tableLoading: false
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
      this.getPageData()
    },
    methods: {
      handleCheckChange(data, checked, indeterminate) {
        for (let i = 0, list = this.tableData, listLenght = list.length; i < listLenght; i++) {
          if (list[i].id === (data.permisModuleId)) {
            list[i].checked = (list[i].allPermisIds.length === this.$refs['tree' + data.permisModuleId].getCheckedKeys().length)
          }
        }
      },
      handleSelectionChange(val, allPermisIds, checked) {
        if (allPermisIds.length > 0) {
          this.$refs['tree' + val].setCheckedKeys(checked ? allPermisIds : [])
        }
      },
      checkAmount: (rule, value, callback) => {
        if (isNaN(Number(value)) || Number(value) < 0) {
          callback(new Error('请输入不小于0的数值'))
        } else if (value && (value.toString().indexOf('.') !== -1 && value.toString().split('.')[1].length > 2)) {
          callback(new Error('最多允许输入两位小数'))
        }
        callback()
      },
      getPageData() {
        this.tableLoading = false
        this.tableData = this.modulePermis
        // getRoleDetail({ roleId: this.id }).then(res => {
        //   if (res.status === 'true') {
        //     let data = res.info
        //     this.ruleForm.pushList = res.info.pushPermisList
        //     if (data.role) {
        //       if (this.type !== 'copy') {
        //         this.ruleForm.versionName = data.role.versionName
        //         this.ruleForm.description = data.role.description
        //       }
        //     }
        //
        //     this.tableData = data.modulePermis
        //     this.tableLoading = false
        //     this.tableEmpty = '暂无数据'
        //   } else {
        //     this.setMsg('error', res.msg)
        //   }
        // })
      },
      submitForm(formName) {
        let treeData

        if (!this.ruleForm.versionName) {
          this.$refs.versionName.focus()
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 赋值前，先初始化一下数据
            this.ruleForm.permisIds = []
            // 拿到权限id数组
            for (let list of this.tableData) {
              treeData = this.$refs['tree' + list.id]

              if (treeData) {
                for (let item of treeData.getCheckedKeys()) {
                  this.ruleForm.permisIds.push(item)
                }
              }
            }
            // console.log('this.ruleForm.pushList', this.ruleForm.pushList)
            // let pushList = []
            // this.ruleForm.pushList.forEach(v => {
            //   if (v.selected === 1) {
            //     pushList.push(v.id)
            //   }
            // })
            // let ajaxParameters = {
            //   name: this.ruleForm.versionName,
            //   description: this.ruleForm.description,
            //   permisIds: this.ruleForm.permisIds
            // }

            // let requestWay = roleAdd
            // // 实现复制功能，只在编辑的状态下才传id
            // if (this.type === 'edit') {
            //   ajaxParameters.id = this.id
            //   requestWay = roleUpdate
            // }
            // requestWay(ajaxParameters).then(res => {
            //   if (res.status === 'true') {
            //     let tipsText = (this.type === 'edit' ? '保存成功！' : '创建成功！')
            //
            //     this.setMsg('success', tipsText)
            //     this.$router.replace('/job')
            //   } else {
            //     this.setMsg('error', res.msg)
            //   }
            // })
          } else {
            return false
          }
        })
      },
      renderContent(h, { node, data, store }) {
        let mlPX = (data.lvl !== 2) ? (<span class='fl ml70'>{data.permisDesc}</span>) : (<span class='fl ml50'>{data.permisDesc}</span>)

        return (
          <span style='width: 100%;'>
            <span class='fl width170px'>
              <span>{ node.label }</span>
            </span>
            { mlPX }
          </span>
        )
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
