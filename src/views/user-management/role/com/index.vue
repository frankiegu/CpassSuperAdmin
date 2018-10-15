<template>
  <div class="permission-add-style">
    <lh-title class="mb24" :title="title"/>

    <div class="card-padding">
      <el-form :model="ruleForm" ref="ruleForm" label-width="180px">
        <el-form-item label="角色名称" prop="roleName" :rules="[ { required: true, message: '请输入角色名称'} ]">
          <el-input
            v-model.trim="ruleForm.roleName"
            ref="jobName"
            :maxlength="10"
            class="width300px"
            placeholder="请输入角色名称" ></el-input>

          <span class="theme-light-gray">&nbsp;&nbsp;限制字数 10</span>
        </el-form-item>

        <el-form-item class="align-bottom" label="角色描述" prop="roleDesc">
          <el-input
            v-model.trim="ruleForm.roleDesc"
            type="textarea"
            :maxlength="100"
            class="text-box"
            placeholder="请输入角色描述"
            :autosize="{ minRows: 3, maxRows: 3 }"></el-input>

          <span class="set-bottom theme-light-gray" v-if="ruleForm.roleDesc">&nbsp;&nbsp;(字数 {{ ruleForm.roleDesc.length }}/100)</span>
        </el-form-item>

        <!--权限和消息提醒-->
        <div class="access-information">
          <template>
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="权限" name="access">
                <!-- table 描述 列标题 -->
                <div class="table-header-dec">描述</div>

                <!-- table -->
                <el-table :data="tableData" v-loading="tableLoading" :empty-text="tableEmpty" class="table-box" ref="multipleTable">
                  <el-table-column label-class-name="ml70" align="left" label="功能模块" width="250">
                    <template slot-scope="scope">
                      <el-checkbox class="ml50" @change="handleSelectionChange(scope.row.id, scope.row.allPermisIds, scope.row.checked)" v-model="scope.row.checked">{{ scope.row.moduleName }}</el-checkbox>
                    </template>
                  </el-table-column>

                  <el-table-column label-class-name="ml70" align="left" label="权限">
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
              </el-tab-pane>
              <el-tab-pane label="消息推送" name="information">
                <template>
                  <el-checkbox-group v-model="ruleForm.checkList" @change="getInfoPush">
                    <el-checkbox :label="item.name" v-for="(item, idx) in ruleForm.pushList" :key="item.code" :checked="item.selected === 1" :class="{'mb16': (idx !== ruleForm.pushList.length - 1)}"></el-checkbox>
                  </el-checkbox-group>
                </template>
              </el-tab-pane>
            </el-tabs>
          </template>
        </div>

      </el-form>

      <div class="align-left submit-fixed-bottom">
        <el-button
          @click="submitForm('ruleForm')"
          :class="{'ml272': sidebar.opened, 'ml116': !sidebar.opened}"
          class="width80px mr30"
          type="primary">
          {{ type === 'add' ? '创建角色' : '保 存'}}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  // import { roleAdd, roleUpdate, getRoleDetail } from '@/service'

  export default {
    data () {
      return {
        id: this.$route.query.id,
        type: this.$route.query.type,
        title: '',
        activeName: 'access',
        checkList: [],

        ruleForm: {
          roleName: '',
          roleDesc: '',
          permisIds: [],
          pushPermisIds: [],
          pushCode: [], // 消息推送选中的选项
          pushList: [],
          checkList: []
        },

        tableData: [],
        tableEmpty: ' ',
        tableLoading: false,
        pushListChange: false
      }
    },
    computed: {
      ...mapGetters([
        'sidebar'
      ])
    },
    mounted: function () {
      if (this.type === 'add') {
        document.title = '添加角色'
        this.title = '添加角色'
      } else if (this.type === 'edit') {
        document.title = '编辑角色'
        this.title = '编辑角色'
      }

      this.tableLoading = true
      // this.getPageData()
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
        // getRoleDetail({ roleId: this.id }).then(res => {
        //   if (res.status === 'true') {
        //     let data = res.info
        //     this.ruleForm.pushList = res.info.pushPermisList
        //     if (data.role) {
        //       if (this.type !== 'copy') {
        //         this.ruleForm.roleName = data.role.roleName
        //         this.ruleForm.roleDesc = data.role.roleDesc
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

        if (!this.ruleForm.roleName) {
          this.$refs.jobName.focus()
        }
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
            console.log('this.ruleForm.pushList', this.ruleForm.pushList)
            let pushList = []
            this.ruleForm.pushList.forEach(v => {
              if (v.selected === 1) {
                pushList.push(v.id)
              }
            })
            // let ajaxParameters = {
            //   roleName: this.ruleForm.roleName,
            //   roleDesc: this.ruleForm.roleDesc,
            //   permisIds: this.ruleForm.permisIds,
            //   pushPermisIds: this.pushListChange ? this.ruleForm.pushPermisIds : pushList
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

          }
        });
      },
      renderContent(h, { node, data, store }) {
        let mlPX
        mlPX = (data.lvl !== 2) ? (<span class='fl ml70'>{data.permisDesc}</span>) : mlPX = (<span class='fl ml50'>{data.permisDesc}</span>);

        return (<span style='width: 100%;'>
          <span class='fl width170px'>
            <span>{node.label}</span>
          </span>
          { mlPX }
        </span>);
      },
      handleClick(tab, event) {
        console.log(tab, event);
      },
      getInfoPush (val) {
        console.log('val', val)
        if (val.length) this.pushListChange = true
        let selArr = []
        for (let i = 0; i < val.length; i++) {
          for (let j = 0; j < this.ruleForm.pushList.length; j++) {
            if (val[i] === this.ruleForm.pushList[j].name) {
              selArr.push(this.ruleForm.pushList[j].id)
              let temp = this.ruleForm.pushList[j]
              temp.selected = temp.selected === 1 ? 0 : 1
              this.ruleForm.pushList.splice(j, temp)
            }
          }
        }
        this.ruleForm.pushCode = selArr
        this.ruleForm.pushPermisIds = selArr
        console.log('selArr', selArr)
      }
    }
  }
</script>
<style lang="scss">
  @import "src/styles/variables";
  .lh-main {
    padding-bottom: 88px !important;
  }
  .lh-footer {
    bottom: 14px !important;
  }

  .permission-add-style {
    .el-table__row:nth-child(2n) {
      background-color: #fff !important;
    }
    .el-table tr {
      box-shadow: none !important;
    }

    .el-checkbox {
      display: block;
      margin-left: 30px;
      /* margin-top: 15px; */
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
    .lh-card-body {
      .table-header-dec {
        position: absolute;
        z-index: 1;
        top: 11px;
        left: 600px;
        color: $tag-gray;
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
