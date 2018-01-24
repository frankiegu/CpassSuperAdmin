<template>
  <div class="lh-dialog">
    <el-dialog
      title="适用范围"
      :visible="dialogVisible"
      :before-close="handleCloseTree"
        :lock-scroll="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        custom-class="role-dialog"
        class="role-tree"
        width="820">

        <el-form :model="dialogData" ref="dialogData">
          <!-- top -->
          <el-row :gutter="10" class="filter-bar">
            <el-col :span="10">
              <el-input
                v-model.trim="filterText"
                @input="searchName"
                clearable
                placeholder="输入姓名/企业名字"></el-input></el-col>

            <el-col :span="14">
              <div class="summary fl">
                已选
                <span class="selectedNum ml30">{{ selectedMembers.length }}</span></div>
              <div class="btn-reset fr" @click="removeSelected()">清空</div></el-col></el-row>

          <!-- middle -->
          <el-row :gutter="10">
            <el-col :span="10">
              <el-tree
                ref="tree"
                :data="treeData"
                :empty-text="treeEmpty"
                @check-change="handleCheckChange"
                :filter-node-method="filterNode"
                  :props="{ label: 'name', children: 'children' }"
                  :default-expand-all="true"
                  v-loading="loadingTree"
                  node-key="nodeKey"
                  show-checkbox
                  accordion
                  class="filter-tree"></el-tree></el-col>

            <el-col :span="14">
              <el-table
                :data="selectedMembers"
                class="width100"
                height="360px"
                border>

                <el-table-column prop="companyName" label="企业名称"></el-table-column>
                <el-table-column prop="name" label="会员姓名"></el-table-column>

                <el-table-column prop="role" label="会员角色">
                  <template slot-scope="scope">
                    <span v-if="scope.row.role === 1">企业负责人</span>
                    <span v-else>员工</span></template></el-table-column>

                <el-table-column prop="nodeKey" label="操作" width="50">
                  <template slot-scope="scope">
                    <span class="btn-delete" @click="removeSelected(scope.row.nodeKey)">
                      <i class="el-icon-close"></i></span></template></el-table-column>
              </el-table></el-col></el-row>

          <!-- bottom -->
          <el-row :gutter="10">
            <el-col :span="10" class="mt20">
              <el-form-item
                label="下发设备"
                label-width="80px"
                prop="snIds"
                :rules="[{required: true, type: 'array', message: '请选择下发设备', trigger: 'change'}]">
                <div class="ml80px">
                  <el-select
                    v-model="dialogData.snIds"
                    placeholder="请选择下发设备"
                    multiple>
                    <el-option
                      v-for="i in equipmentList"
                      :label="i.storeName"
                      :value="i.lockSnId"
                      :key="i.lockSnId"></el-option></el-select>
                </div>
              </el-form-item></el-col></el-row>
          <div class="dialog-footer">
            <el-button
              @click="handleAddPublishUser('dialogData')"
              class="width120px"
              type="primary">保存</el-button>
          </div>
        </el-form>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'LhDialog',
    props: ['dialogVisible', 'loadingTree', 'treeData', 'treeEmpty', 'equipmentList'],
    data () {
      return {
        filterText: '',
        selectedMembers: [],
        dialogData: {
          snIds: [],
          userIds: []     // 选中的会员id数组
        }
      }
    },
    methods: {
      // 每次触发1次change，调用了4次
      handleCheckChange(data) {
        const self = this
        self.selectedMembers = self.$refs.tree.getCheckedNodes(true)
      },
      filterNode(value, data, node) {
        if (!value) return true

        if (data.name.includes(value)) {
          return true
        } else if (node.parent.data.name && node.parent.data.name.includes(value)) {
          return true
        } else if (node.parent.parent && node.parent.parent.level > 0 && node.parent.parent.data.name.includes(value)) {
          return true
        }
      },
      handleCloseTree(done) {
        const self = this
        if (self.selectedMembers.length) {
          self.$confirm('未保存添加，是否确认关闭？', { type: 'warning', lockScroll: false })
            .then(_ => {
              self.resetDialog()
              self.$emit('updateDialogStatus', false)
              done()
            })
            .catch(_ => {
              return
            })
        } else {
          self.$emit('updateDialogStatus', false)
          done()
        }
      },
      handleAddPublishUser(formName) {
        const self = this
        self.$refs[formName].validate((valid) => {
          if (valid) {
            self.$confirm('确认保存？', { type: 'warning', lockScroll: false })
            .then(_ => {
              if (self.selectedMembers.length > 0) {
                self.dialogData.userIds = self.selectedMembers.map(i => i.userId)
                // 添加下发设备
                self.$emit('submitLHDialog', {...self.dialogData})
                // 保存成功后清空选中的会员列表、重新请求积分规则发放情况
                self.resetDialog()

                self.$emit('updateDialogStatus', false)
              } else self.setMsg('未添加任何会员')
            })
            .catch(_ => {
              return
            })
          } else return
        })
      },
      resetDialog() {
        const self = this
        self.dialogData.userIds = []
        self.dialogData.snIds = []
        self.selectedMembers = []
        self.filterText = ''
      },

      searchName() {
        const self = this
        self.$refs.tree.filter(self.filterText);
      },
      removeSelected(nodeKey) {
        // 如果没有传nodeKey，则移除所有选中的会员；否则移除当前nodeKey的会员
        if (!nodeKey) {
          this.$refs.tree.setCheckedKeys([])
        } else {
          this.$refs.tree.setChecked(nodeKey, false, true)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .lh-dialog {
  }
  .el-form-item__label {
    float: left;
  }
  .el-select {
    width: 100%;
  }
</style>
