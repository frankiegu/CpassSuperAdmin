<template>
  <div class="resource">
    <lh-title title="权限资源列表"></lh-title>
    <div :gutter="20" class="card-padding">
      <el-form class="resource-form clearfix" :model="permisResourceForm" :inline="true">
        <el-form-item label="权限">
          <div class="add-bar">
            <el-button type="primary" @click="dialogVisible1 = true">功能模块管理</el-button>
            <el-button type="primary" @click="dialogVisible2 = true" icon="el-icon-circle-plus">新增顶级权限</el-button>
          </div>
          <div class="scroll-bar scroll-permis-bar">
            <el-button type="primary" class="ml6 mb10" @click="toggleExpand" size="mini">
              {{isExpand ? '全部收起' : '全部展开'}}
            </el-button>
            <el-tree
              :data="permissionData"
              :props="permissionProp"
              node-key="id"
              show-checkbox
              default-expand-all
              check-strictly
              :indent="10"
              ref="permissionTree"
              :expand-on-click-node="false"
              :render-content="renderInsert"
              @check-change="handlePermisChange">
            </el-tree>
          </div>
        </el-form-item>

        <el-form-item label="资源">
          <el-input placeholder="输入关键字进行过滤" v-model.trim="filterText" :disabled="!isAllowSelect"></el-input>
          <div :class="[ 'scroll-bar', {'hide-scroll' : !isAllowSelect} ]">
            <div class="scroll-mask">
              <div class="disabled-tree" v-if="!isAllowSelect"></div>
              <el-tree
                :data="resourceData"
                :props="resourceProp"
                node-key="id"
                show-checkbox
                default-expand-all
                :indent="10"
                :default-expanded-keys="[firstNodeKey]"
                ref="resourceTree"
                :filter-node-method="filterNode"
                :render-content="renderName"
                @check-change="handleCheckChange">
              </el-tree>
            </div>
          </div>
        </el-form-item>

        <el-form-item class="selected-item">
          <div class="clearfix">
            <div class="selected-resource-bar">
              <div class="disabled-tree" v-if="!isAllowSelect"></div>
              <div v-for="item in permisResourceForm.selectedResource">
                <el-tag
                  class="resource-tag"
                  size="small"
                  :key="item.id"
                  :disable-transitions="true"
                  @close="removeSelected(item.id)"
                  closable>{{item.url}}<span class="theme-blue">{{item.name}}</span>
                </el-tag>
              </div>
            </div>
            <el-button class="width80px save-btn fr" type="primary" :disabled="!isAllowSave" @click="handleUpdate">保 存</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>

    <!-- 功能模块管理弹窗 -->
    <transition name="fade-in">
      <el-dialog :lock-scroll="false" title="功能模块管理" :visible.sync="dialogVisible1" width="30%" class="module-form">
        <el-form :model="moduleForm" label-width="100px" ref="moduleForm" @submit.native.prevent>
          <ul class="module-list">
            <li v-for="item in moduleList" :label="item.id" :key="item.id" class="module-item">
              <el-input
                v-if="inputVisible && targetModuleId === item.id"
                v-model.trim="moduleForm.moduleName"
                class="width300px"
                :ref="'saveTagInput' + item.id"
                size="small"
                @keyup.enter.native="handleInputConfirm"
                @blur="cancelAddOrUpdate"></el-input>

              <span v-else>{{item.moduleName}}</span>

              <span class="fr">
                  <el-tooltip :content="'修改 ' + item.moduleName" placement="left">
                    <el-button icon="el-icon-edit" type="text" @click="handleShowInput(item.id)"></el-button>
                  </el-tooltip>
                  <el-tooltip :content="'删除 ' + item.moduleName" placement="right">
                    <el-button icon="el-icon-delete" type="text" @click="handleDeleteModule(item.id)"></el-button>
                  </el-tooltip>
                </span>
            </li>

            <li class="module-item">
              <el-input
                v-if="inputVisible && !targetModuleId"
                v-model.trim="moduleForm.moduleName"
                class="width300px"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleAddModule"
                @blur="cancelAddOrUpdate"></el-input>
              <el-button v-else icon="el-icon-plus" size="small" type="primary" @click="handleShowInput('')">新增模块</el-button>
            </li>
          </ul>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <!--<el-button @click="handleCancel('moduleForm')">取 消</el-button>-->
          <el-button type="primary" @click="handleCancel('moduleForm')">确 定</el-button>
        </div>
      </el-dialog>
    </transition>

    <!-- 新增顶级权限弹窗 -->
    <transition>
      <el-dialog :lock-scroll="false" title="新增顶级权限" :visible.sync="dialogVisible2" width="30%">
        <el-form :model="permisTopForm" label-width="80px" ref="permisTopForm">
          <el-form-item label="权限模块">
            <el-select v-model.trim="permisTopForm.permisModuleId">
              <el-option v-for="item in moduleList" :value="item.id" :key="item.id" :label="item.moduleName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="权限名称">
            <el-input v-model.trim="permisTopForm.permisName"></el-input>
          </el-form-item>
          <el-form-item label="权限描述">
            <el-input v-model.trim="permisTopForm.permisDesc"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleCancel('permisTopForm')">取 消</el-button>
          <el-button type="primary" @click="handleAddTopPermis">确 定</el-button>
        </div>
      </el-dialog>
    </transition>

    <!-- 新增/编辑权限弹窗 -->
    <transition>
      <el-dialog :lock-scroll="false" :title="permisDialogTitle" :visible.sync="dialogVisible3" width="30%">
        <el-form :model="permissionForm" label-width="80px" ref="permissionForm">
          <el-form-item label="权限名称">
            <el-input v-model.trim="permissionForm.permisName"></el-input>
          </el-form-item>
          <el-form-item label="权限描述">
            <el-input v-model.trim="permissionForm.permisDesc"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleCancel('permissionForm')">取 消</el-button>
          <el-button v-if="permisDialogType === 'add'" type="primary" @click="handleAppendPermis">确 定</el-button>
          <el-button v-if="permisDialogType === 'edit'" type="primary" @click="handleEditComfirm">确 定</el-button>
        </div>
      </el-dialog>
    </transition>
  </div>
</template>

<script>
  import { getPermisList, getResourceList, updatePermisResource,
    listPermisModule, addPermisModule, updatePermisModule, deletePermisModule,
    addTopLevelPermis, addPermis, deletePermis, updatePermis } from '@/service'
  export default {
    name: 'resource',
    data () {
      return {
        moduleList: [],

        // 权限模块对话框
        dialogVisible1: false,
        inputVisible: false,
        targetModuleId: '',
        moduleForm: { moduleName: '' },

        // 顶级权限对话框
        dialogVisible2: false,
        permisTopForm: { permisName: '', permisDesc: '', permisModuleId: '' },

        // 具体权限对话框
        dialogVisible3: false,
        permisDialogTitle: '新增权限',
        permisDialogType: 'add',
        permissionForm: { permisName: '', permisDesc: '', parentId: '' },
        permisResourceForm: {
          selectedPermis: [], // 选中的权限id
          selectedResource: [], // 选择的资源
          selectedResourceIds: [] // 选择的资源id
        },

        isAllowSave: true, // 是否允许保存
        isAllowSelect: false, // 是否允许选择资源
        currId: 0,

        // 权限列表
        isExpand: true,
        permissionData: [],
        permissionProp: { label: 'permisName', children: 'children' },
        // 资源列表
        firstNodeKey: '',
        filterText: '',
        resourceData: [],
        resourceProp: { label: 'url', children: 'children' }
      }
    },
    props: {},
    components: {},
    mounted () {
      // 获取权限模块列表
      this.handleGetModuleList()
      // 获取权限列表
      this.handleGetPermisList()
      // 获取资源列表
      getResourceList().then(res => {
        if (res.status === 'true' && res.info) {
          this.firstNodeKey = res.info.id
          this.resourceData.push(res.info)
        } else {
          return false
        }
      })
    },
    watch: {
      filterText(val) {
        this.$refs.resourceTree.filter(val)
      }
    },
    computed: {},
    filters: {},
    methods: {
      // 全部收起或展开
      toggleExpand() {
        this.isExpand = !this.isExpand
        for (let i = 0; i < this.$refs.permissionTree.store._getAllNodes().length; i++) {
          this.$refs.permissionTree.store._getAllNodes()[i].expanded = this.isExpand
        }
      },
      // 获取权限模块列表
      handleGetModuleList() {
        listPermisModule().then(res => {
          if (res.status === 'true' && res.info) {
            this.moduleList = res.info
          } else {
            console.log(res.msg, '获取权限模块列表')
          }
        })
      },
      // 展示编辑模块输入框
      handleShowInput(id) {
        this.inputVisible = true
        this.targetModuleId = id
        this.$nextTick(_ => {
          if (id) {
            // 不知道为什么 this.$refs['saveTagInput' + id]居然是个数组= =
            this.$refs['saveTagInput' + id][0].$refs.input.focus()
          } else {
            this.$refs['saveTagInput'].$refs.input.focus()
          }
        })
      },
      // 更新权限模块
      handleInputConfirm() {
        let obj = {
          permisModuleId: this.targetModuleId,
          moduleName: this.moduleForm.moduleName
        }
        updatePermisModule(obj).then(res => {
          if (res.status === 'true') {
            this.inputVisible = false
            this.$message.success('修改成功！')
            this.handleGetModuleList()
            this.moduleForm.moduleName = ''
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      // 删除权限模块
      handleDeleteModule(id) {
        deletePermisModule({
          permisModuleId: id
        }).then(res => {
          if (res.status === 'true') {
            this.$message.success('删除成功！')
            this.handleGetModuleList()
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      // 取消添加或更新模块
      cancelAddOrUpdate() {
        this.inputVisible = false
        this.moduleForm.moduleName = ''
      },

      // 获取权限列表
      handleGetPermisList() {
        getPermisList().then(res => {
          if (res.status === 'true' && res.info) {
            this.permissionData = res.info
          } else {
            return false
          }
        })
      },
      // 切换权限选中事件
      handlePermisChange(data, checked) {
        if (!data) {
          this.isAllowSelect = false
          this.setCheckedKeys([])
          // console.log('1')
          this.permisResourceForm.selectedResource = []
          this.permisResourceForm.selectedResourceIds = []
        } else {
          this.getCheckedKeys('permissionTree')
          this.isAllowSelect = this.permisResourceForm.selectedPermis.length !== 0
          if (checked && data.resourceIds) {
            this.$refs.permissionTree.setCheckedNodes([data])
            this.setCheckedKeys(data.resourceIds)
            // console.log(data.resourceIds, '2')
          }
        }
      },
      // 资源列表过滤
      filterNode(value, data) {
        if (!value) return true
        return data.url.indexOf(value) !== -1
      },
      // 设置选中资源
      setCheckedKeys(nodeKeys) {
        // console.log(nodeKeys, 'set')
        this.$refs.resourceTree.setCheckedKeys(nodeKeys)
      },
      // 获取选中节点的id
      getCheckedKeys(treeName) {
        const leafOnly = true // 只取叶子节点
        if (treeName === 'resourceTree') {
          this.permisResourceForm.selectedResourceIds = this.$refs.resourceTree.getCheckedKeys(leafOnly)
          this.permisResourceForm.selectedResource = this.$refs.resourceTree.getCheckedNodes(leafOnly)
        }
        if (treeName === 'permissionTree') {
          this.permisResourceForm.selectedPermis = this.$refs.permissionTree.getCheckedKeys(leafOnly)
        }
      },
      // 切换资源选中事件（节点未展开，即不确定是否存在子节点的情况下，可能不会触发此事件）
      handleCheckChange(data, checked, indeterminate) {
        // console.log(data, checked, indeterminate)
        this.getCheckedKeys('resourceTree')
      },
      // 移除
      removeSelected(nodeKey) {
        this.$refs.resourceTree.setChecked(nodeKey, false, true)
      },
      // 更新权限资源对应关系
      handleUpdate() {
        const selectedPermis = this.permisResourceForm.selectedPermis
        const selectedResourceIds = this.permisResourceForm.selectedResourceIds
        const params = {
          permisId: selectedPermis && selectedPermis.length ? selectedPermis[0] : '',
          resourceIds: selectedResourceIds
        }
        updatePermisResource(params).then(res => {
          if (res.status === 'true') {
            this.handleGetPermisList()
            this.setCheckedKeys([])
            this.$message.success('保存成功！')
          } else {
            this.$message.error(res.msg)
          }
        })
      },

      // 自定义渲染资源中文名
      renderName(h, { node, data, store }) {
        let resouceName = node.level === 3 ? data.name || '' : ''
        return (
          <span style='font-size: 14px; padding-right: 8px; width: 100%'>
            <span>
              <span>{node.label}</span>
            </span>
            <span style='color: #5E80E5; font-size: 12px; float: right;'>{resouceName}</span>
          </span>)
      },

      // 自定义渲染插入节点
      renderInsert(h, { node, data, store }) {
        let isLevel2 = node.level === 2
        return (
          <span style='flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;'>
            <span>
              <span>{node.label}</span>
            </span>
            <span class='operate-bar'>
              <el-button v-show={!isLevel2} icon='el-icon-plus' style='font-size: 12px; padding: 10px 6px;' type='text' on-click={ () => this.handleAddPermis(data) }></el-button>
              <el-button icon='el-icon-edit' style='font-size: 14px; padding: 10px 6px;' type='text' on-click={ () => this.showEditDialog(data) }></el-button>
              <el-button icon='el-icon-delete' style='font-size: 14px; padding: 10px 6px;' type='text' on-click={ () => this.remove(node, data) }></el-button>
            </span>
          </span>
        )
      },

      // 弹窗取消操作
      handleCancel() {
        this.dialogVisible1 = false
        this.dialogVisible2 = false
        this.dialogVisible3 = false
      },
      // 新增权限模块
      handleAddModule() {
        let params = {
          moduleName: this.moduleForm.moduleName
        }
        addPermisModule(params).then(res => {
          if (res.status === 'true') {
            this.inputVisible = false
            this.moduleForm.moduleName = ''
            this.handleGetModuleList()
            this.$message.success('成功添加权限模块！')
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      // 新增顶级权限
      handleAddTopPermis() {
        let params = {
          permisName: this.permisTopForm.permisName,
          permisDesc: this.permisTopForm.permisDesc,
          permisModuleId: this.permisTopForm.permisModuleId
        }
        addTopLevelPermis(params).then(res => {
          if (res.status === 'true') {
            this.dialogVisible2 = false
            this.handleGetPermisList()
            this.$message.success('成功添加顶级权限！')
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      // 增加权限弹窗
      handleAddPermis(data) {
        this.dialogVisible3 = true
        this.permisDialogTitle = '新增权限'
        this.permisDialogType = 'add'
        this.permissionForm.permisName = ''
        this.permissionForm.permisDesc = ''
        this.permissionForm.parentId = data.id
      },
      // 新增权限
      handleAppendPermis() {
        let params = {
          permisName: this.permissionForm.permisName,
          permisDesc: this.permissionForm.permisDesc,
          parentId: this.permissionForm.parentId
        }
        addPermis(params).then(res => {
          if (res.status === 'true') {
            this.dialogVisible3 = false
            this.$message.success('成功添加权限！')
            this.handleGetPermisList()
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      // 编辑权限
      showEditDialog(data) {
        this.currId = data.id
        this.permissionForm.permisName = data.permisName
        this.permissionForm.permisDesc = data.permisDesc
        this.permisDialogType = 'edit'
        this.dialogVisible3 = true
        this.permisDialogTitle = '编辑权限'
        // console.log(data, data.permisName, data.permisDesc, 'edit')
      },
      handleEditComfirm() {
        let params = {
          permisName: this.permissionForm.permisName,
          permisDesc: this.permissionForm.permisDesc,
          permisId: this.currId
        }
        updatePermis(params).then(res => {
          if (res.status === 'true') {
            this.dialogVisible3 = false
            this.$message.success('修改成功！')
            this.handleGetPermisList()
          } else {
            this.$message.error(res.code)
          }
        })
      },
      // 删除权限
      remove(node, data) {
        const parent = node.parent
        const children = parent.data.children || parent.data
        const index = children.findIndex(d => d.id === data.id)
        const h = this.$createElement
        this.$msgbox({
          message: h('p', null, [
            h('span', null, '确认删除 ' + data.permisName + ' 吗？')
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          lockScroll: false })
          .then(_ => {
            children.splice(index, 1)
            const permisIds = []
            permisIds.push(data.id)
            let traverse = function (nodeDel) {
              const childNode = nodeDel.children ? nodeDel.children : nodeDel
              if (childNode.length) {
                childNode.forEach((child) => {
                  permisIds.push(child.id)
                  traverse(child)
                })
              }
            }
            traverse(data)
            let params = {
              permisIds: permisIds
            }
            deletePermis(params).then(res => {
              if (res.status === 'true') {
                this.$message.success('删除成功')
              }
            })
          }).catch(_ => {
            this.$message.info('已取消删除')
          })
      }
    }
  }
</script>

<style lang="scss">
  .resource {
    .el-button {
      min-width: auto;
      height: auto;
    }
    .module-form {
      .el-dialog__body {
        padding: 10px 20px;
      }
    }
    .el-form-item__label {
      // line-height: 32px;
    }
    .el-form-item__content {
      // line-height: 32px;
    }
    .selected-item {
      .el-form-item__content {
        width: 100%;
      }
      .theme-blue {
        vertical-align: initial;
        margin-left: 10px;
      }
    }

    .operate-bar {
      /*visibility: hidden;*/
    }
    .el-tree-node__content:hover {
      .operate-bar {
        visibility: visible;
      }
    }
  }
</style>
<style lang="scss" scoped>
  @import 'src/styles/common/var';
  .resource {
    .module-list {
      border: 1px solid $border-ele;
      border-radius: 4px;
      height: 400px;
      overflow-y: auto;

      .module-item {
        margin: 6px 10px;
        &:before {
          display: inline-block;
          content: '';
          margin-right: 6px;
          border-radius: 50%;
          width: 8px;
          height: 8px;
          background-color: $theme-blue;
          vertical-align: middle;
        }
        .el-button {
          padding: 4px;
        }
      }
    }
  }
  .resource-form {
    font-size: 0;
    .add-bar {
      /*text-align: right;*/
      font-size: 0;
      line-height: 1;
      margin-bottom: 18px;
    }
    .el-form-item {
      float: left;
      margin-bottom: 10px;
    }
    .selected-item {
      margin-right: 0;
      width: calc(100% - 1085px);
      @media screen and (max-width: 1440px) {
        display: block;
        float: none;
        width: 100%;

        .selected-resource-bar {
          width: 951px;
          margin-left: 40px;
          float: left;
        }

        .save-btn {
          width: auto;
        }
      }
    }
  }
  .selected-resource-bar {
    position: relative;
    // height: 32px;
    margin-bottom: 17px;
    padding: 0 6px;
    border: 1px solid $border-ele;
    border-radius: 4px;
    min-height: 30px;
    max-height: calc(100vh - 257px);
    overflow-y: auto;
    overflow-x: hidden;
  }
  .resource-tag {
    background-color: transparent;
    color: $theme-black;
    margin: 4px 0;
    height: 24px;
    line-height: 22px;
  }
  .scroll-bar {
    position: relative;
    margin-top: 17px;
    border: 1px solid $border-ele;
    border-radius: 4px;
    overflow: auto;
    width: 650px;
    height: calc(100vh - 257px);
    &.hide-scroll {
      overflow: hidden;
    }
  }
  .scroll-permis-bar {
    margin-top: 0;
    padding: 10px 0;
    width: 330px;
    height: calc(100vh - 277px);
  }
  .block-radio {
    width: 100%;
    margin-left: 0;
    margin-bottom: 10px;
  }
  .scroll-mask {
    position: relative;
  }
  .disabled-tree {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 99;
    background-color: rgba(255, 255, 255, .6);
    cursor: not-allowed;
  }
</style>
