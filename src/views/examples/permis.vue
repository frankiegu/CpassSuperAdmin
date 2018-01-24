<template>
  <div class="card-padding" style="margin-top: 90px">
    <el-table class="table-box" :data="tableData">
      <el-table-column type="selection" width="30"></el-table-column>
      <el-table-column align="left" label="功能模块" prop="moduleName"></el-table-column>

      <el-table-column align="left" label="权限">
        <template slot-scope="scope">
          <!--<el-checkbox v-if="scope.row.permis != null && scope.row.permis[0]">{{scope.row.permis[0].permisName}}</el-checkbox>-->
          <el-tree
            v-if="scope.row.permis != null"
            :data="scope.row.permis"
            :props="customProps"
            show-checkbox
            node-key="id"
            :ref="'tree' + scope.row.id"
            :expand-on-click-node="false"
            @check-change="handleChangePermis"
            @click.native="getTreeId(scope.row.id)"
            default-expand-all>
          </el-tree>
        </template>
      </el-table-column>

      <el-table-column label="描述">
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import { getRoleDetail } from '@/service/index'
  export default {
    name: 'permis',
    data () {
      return {
        tableData: [],
        data2: [{
          id: 1,
          permisName: '查看空间信息'
        }, {
          id: 2,
          permisName: '管理空间信息',
          children: [{
            id: 3,
            permisName: '编辑空间LOGO及名称'
          }, {
            id: 4,
            permisName: '创建门店'
          }, {
            id: 5,
            permisName: '编辑门店'
          }]
        }],
        currTreeId: '',
        customProps: {
          label: 'permisName',
          children: 'children'
        },
        selectedPermis: [],
        checkAll: false
      }
    },
    props: {},
    components: {},
    mounted () {
      this.getRoleList()
    },
    watch: {},
    computed: {},
    filters: {},
    methods: {
      getTreeId(id) {
        this.currTreeId = id
        console.log(this.currTreeId)
      },
      getCheckedNodes() {
        const checkedNodes = this.$refs['tree' + this.currTreeId].getCheckedNodes()
        console.log(checkedNodes, 'checkedNodes')
        const staffNodes = []
        for (let i = 0; i < checkedNodes.length; i++) {
          staffNodes.push(checkedNodes[i])
        }
        return staffNodes
      },
      handleChangePermis(data, checked, indeterminate) {
        // console.log(data, checked, indeterminate)
//        const _this = this
//        _this.selectedPermis = _this.getCheckedNodes()
        // console.log(_this.$refs['tree1'].getCheckedNodes())
      },
      getRoleList(id) {
        const _this = this
        const paramsObj = {
          roleId: id
        }
        getRoleDetail(paramsObj).then(res => {
          if (res.status === 'true') {
            _this.tableData = res.info.modulePermis
          } else {
            _this.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            })
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .el-tree {
    background-color: transparent;
  }
</style>
