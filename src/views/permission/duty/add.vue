<template>
  <div class="permission-add-style">
    <div class="page-title"> <h1>{{ title }}</h1> </div>

    <div class="form-box card-padding">
      <el-form :model="ruleForm" ref="ruleForm" label-width="180px" class="demo-ruleForm">
        <el-form-item label="职务名称" prop="roleName" :rules="[ { required: true, message: '请输入职务名称'} ]">

          <el-input class="width300px" v-model.trim="ruleForm.roleName" placeholder="请输入职务名称" :maxlength="10"></el-input>

          <span class="theme-gray">&nbsp;&nbsp;限制字数 10</span>
        </el-form-item>

        <el-form-item class="align-bottom" label="职务描述" prop="roleDesc">
          <el-input
            v-model.trim="ruleForm.roleDesc"
            type="textarea"
            :maxlength="100"
            class="width300px"
            placeholder="请输入职务描述"
            :autosize="{minRows: 6, maxRows: 6}"></el-input>

          <span class="set-bottom theme-gray" v-if="ruleForm.roleDesc">&nbsp;&nbsp;(字数 {{ ruleForm.roleDesc.length }}/100)</span>
        </el-form-item>

        <!-- table 描述 列标题 -->
        <div class="table-header-dec">描述</div>

        <!-- table -->
        <el-table :data="tableData" v-loading="tableLoading" :empty-text="tableEmpty" class="table-box mt60" ref="multipleTable">
          <el-table-column label-class-name="ml70" align="left" label="功能模块" width="250">
            <template slot-scope="scope">
              <el-checkbox class="ml50" @change="handleSelectionChange(scope.row.id, scope.row.allPermisIds, scope.row.checked)" v-model="scope.row.checked">{{ scope.row.moduleName }}</el-checkbox>
            </template>
          </el-table-column>

          <el-table-column label-class-name="ml70" align="left" label="权限">
            <template slot-scope="scope">
              <el-tree
                v-if="scope.row.permis != null"
                @check-change="handleCheckChange"
                :data="scope.row.permis"
                :default-expanded-keys="scope.row.allPermisIds"
                :default-checked-keys="scope.row.checkedPermisIds"
                :props="{ label: 'permisName', children: 'children' }"
                :ref="'tree' + scope.row.id"
                :expand-on-click-node="false"
                :render-content="renderContent"
                show-checkbox
                node-key="id"
                default-expand-all>
              </el-tree>
            </template>
          </el-table-column>
        </el-table>

        <el-form-item label="" class="align-left mt50">
          <el-button class="width120px" type="primary" @click="submitForm('ruleForm')">{{ type === 'add' ? '创建职务' : '保存'}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {addOrUpdate, getRoleDetail} from '../../../service'

  export default {
    data () {
      return {
        id: this.$route.query.id,
        type: this.$route.query.type,
        title: '',

        ruleForm: {
          roleName: '',
          roleDesc: '',
          permisIds: []
        },

        tableData: [],
        tableEmpty: ' ',
        tableLoading: true
      }
    },
    mounted: function () {
      if (this.type === 'add') {
        document.title = '新增职务'
        this.title = '新增职务'
      } else if (this.type === 'edit') {
        document.title = '编辑职务'
        this.title = '编辑职务'
      } else {
        document.title = '复制职务'
        this.title = '复制职务'
      }
      this.$store.commit('NAV_CRUMB', this.title)

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
      getPageData() {
        getRoleDetail({roleId: this.id}).then(res => {
          if (res.status === 'true') {
            let data = res.info

            if (data.role) {
              this.ruleForm.roleName = data.role.roleName
              this.ruleForm.roleDesc = data.role.roleDesc
            }

            this.tableData = data.modulePermis
            this.tableLoading = false
            this.tableEmpty = '暂时无数据'
          } else {
            this.$message({ showClose: true, message: res.msg, type: 'error' });
          }
        })
      },
      submitForm(formName) {
        let treeData

        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 赋值前，先初始化一下数据
            this.ruleForm.permisIds = []
            // 拿到权限id数组
            for (var list of this.tableData) {
              treeData = this.$refs['tree' + list.id]

              if (treeData) {
                for (var item of treeData.getCheckedKeys()) {
                  this.ruleForm.permisIds.push(item)
                }
              }
            }

            let ajaxParameters = {
              roleName: this.ruleForm.roleName,
              roleDesc: this.ruleForm.roleDesc,
              permisIds: this.ruleForm.permisIds
            }

            // 实现复制功能，只在编辑的状态下才传id
            if (this.type === 'edit') {
              ajaxParameters.id = this.id
            }
            addOrUpdate(ajaxParameters).then(res => {
              if (res.status === 'true') {
                let tipsText = (this.type === 'edit' ? '保存成功！' : '创建成功！')

                this.$message({ showClose: true, message: tipsText, type: 'success' });
                this.$router.go(-1)
              } else {
                this.$message({ showClose: true, message: res.msg, type: 'error' });
              }
            })
          } else {
            return
          }
        });
      },
      renderContent(h, { node, data, store }) {
        let mlPX = (data.lvl !== 2) ? (<span class="fl ml70">{data.permisDesc}</span>) : mlPX = (<span class="fl ml50">{data.permisDesc}</span>);

        return (<span style="width: 100%;">
                  <span class="fl width170px">
                    <span>{node.label}</span>
                  </span>
                  { mlPX }
                </span>);
      }
    }
  }
</script>

<style lang="scss">
  .permission-add-style {
    .el-table--enable-row-hover .el-table__body tr:hover > td {
      background-color: #fff;
    }
    .el-tree-node__content:hover {
      background-color: #fff;
    }
    .el-checkbox__input.is-checked + .el-checkbox__label {
      color: #5a5e66;
    }
  }
</style>
<style lang="scss" scoped>
  .permission-add-style {
    .form-box {
      position: relative;

      .table-header-dec {
        position: absolute;
        z-index: 1;
        top: 303px;
        left: 600px;
        color: #878d99;
      }
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
