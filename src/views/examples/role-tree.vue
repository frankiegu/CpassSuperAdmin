<template>
  <div>
    <el-dialog
      title="适用范围"
      :visible.sync="dialogVisible"
      :close-on-click-modal="allow"
      :lock-scroll="allow"
      :close-on-press-escape="allow"
      custom-class="role-dialog"
      class="role-tree">

      <el-row :gutter="10" class="filter-bar">
        <el-col :span="10">
          <el-input
            placeholder="输入姓名/企业名字"
            v-model.trim="filterText">
          </el-input>
        </el-col>
        <el-col :span="14">
          <div class="summary fl">
            已选<span class="selectedNum ml30">{{selectedMembers.length}}</span>
          </div>
          <div class="btn-reset fr" @click="removeSelected()">清空</div>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="10">
          <el-tree
            class="filter-tree"
            :data="roleTreeData"
            :props="treeProps"
            node-key="id"
            show-checkbox
            ref="tree"
            :default-expand-all="true"
            :default-checked-keys="defaultSelectMember"
            :filter-node-method="filterNode"
            @check-change="handleCheckChange">
          </el-tree>
        </el-col>
        <el-col :span="14">
          <el-table :data="selectedMembers" height="360px" style="width: 100%" border>
            <el-table-column prop="companyName" label="企业名称"></el-table-column>
            <el-table-column prop="name" label="会员姓名"></el-table-column>
            <el-table-column prop="role" label="会员角色">
              <template slot-scope="scope">
                <span v-if="scope.row.role === 1">企业负责人</span>
                <span v-else>员工</span>
              </template>
            </el-table-column>
            <el-table-column prop="id" label="操作" width="50">
              <template slot-scope="scope">
                <span class="btn-delete" @click="removeSelected(scope.row.id)">
                  <i class="el-icon-close"></i>
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <!--<el-button type="primary" @click="handleAddPublishUser">保存</el-button>-->
      </div>

    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'role-tree',
    data () {
      return {
        dialogVisible: true,
        allow: false,
        selectedMembers: [], // 选中的会员数组
        defaultSelectMember: ['5', '13'], // 默认选中的会员
        filterText: '', // 过滤文本
        roleTreeData: [
          {
            id: '1',
            name: '全部',
            children: [{
              id: '4',
              name: '天河店',
              // disabled: true,
              children: [{
                id: '9',
                name: '雷猴',
                children: [{
                  id: '11',
                  name: '静香',
                  userId: 1,
                  companyName: '雷猴'
                }, {
                  id: '12',
                  name: '大雄',
                  userId: 2,
                  companyName: '雷猴'
                }]
              }, {
                id: '10',
                name: '网易',
                // disabled: true,
                children: [{
                  id: '13',
                  name: '胖虎',
                  disabled: true,
                  userId: 3,
                  companyName: '网易'
                }, {
                  id: '14',
                  name: '小夫',
                  userId: 4,
                  companyName: '网易'
                }]
              }]
            }, {
              id: '2',
              name: '海珠店',
              children: [{
                id: '5',
                name: '腾讯',
                children: [{
                  id: '15',
                  name: '哆啦A梦',
                  userId: 5,
                  companyName: '腾讯'
                }]
              }, {
                id: '6',
                name: '阿里',
                children: [{
                  id: '16',
                  name: '马云',
                  userId: 6,
                  disabled: true,
                  companyName: '阿里'
                }]
              }]
            }, {
              id: '3',
              name: '越秀店',
              disabled: true,
              children: [{
                id: '7',
                name: '雷电',
                disabled: true
              }, {
                id: '8',
                name: '红风',
                disabled: true
              }]
            }]
          }
        ], // 会员树状数组
        treeProps: {
          label: 'name',
          children: 'children'
          // disabled: 'disabled'
        },
        ruleForm: {
          userIds: []
        }
      }
    },
    props: {},
    components: {},
    mounted () {
      this.$nextTick(() => {
      })
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    computed: {},
    filters: {},
    methods: {
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
          if (checkedNodes[i].userId) {
            staffNodes.push(checkedNodes[i])
          }
        }
        console.log('staffNodes', staffNodes)
        return staffNodes
      },
      // 复选框change时更新会员节点
      handleCheckChange(data, checked, indeterminate) {
        console.log('handleCheckChange')
        this.selectedMembers = this.getCheckedNodes()
        this.ruleForm.userIds = []
        for (let i = 0; i < this.selectedMembers.length; i++) {
          this.ruleForm.userIds.push(this.selectedMembers[i].userId)
        }
      },
      // 移除选中的会员
      removeSelected(nodeKey) {
        console.log('removeSelected')
        // 如果没有传nodeKey，则移除所有选中的会员；否则移除当前nodeKey的会员
        if (!nodeKey) {
          this.$refs.tree.setCheckedKeys([], true)
        } else {
          this.$refs.tree.setChecked(nodeKey, false, true)
        }
      }
    }
  }
</script>

<style lang="scss" scoped></style>
