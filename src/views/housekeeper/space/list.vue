<template>
  <div class="housekeeper-space">
    <div class="page-title"> <h1>空间管家</h1> </div>

    <div class="card-padding">
      <div class="mb22 overflow-hidden">
        <el-button
          v-permissions="'/manage/spaceKeeper/add'"
          @click="showDialog('keeper')"
          icon="el-icon-circle-plus"
          type="primary">
          添加管家</el-button>

        <el-button
          @click="showDialog('service')"
          type="primary">
          服务类型管理</el-button>
      </div>

      <el-container>
        <el-aside width="150px">
          <div class="text-center sidebar-style">
            <el-menu
              @select="toggleSidebar"
              :default-active="activeIndex">
              <el-menu-item
                v-for="(item, idx) in sidebarData"
                :key="idx"
                :index="idx + ''">
                <span slot="title">{{item.name}}</span>
              </el-menu-item>
            </el-menu>
          </div>
        </el-aside>

        <div class="overflow-hidden width100 ml20">
          <h3 class="grid-title">
            <span class="">{{ activeName }}</span>

            <div v-if="activeIndex > 0" class="fr">
              <el-tooltip
                v-if="handleHasPermissions('/manage/spaceKeeper/changeStatus')"
                :content="sidebarData[activeIndex].statusCode === 1 ? '点击停用管家' : '点击开启管家'"
                placement="top"
                effect="light"
                class="ml10 fr">

                <el-switch
                  v-model="sidebarData[activeIndex].statusCode"
                  :active-value="1"
                  :inactive-value="0"
                  @change="toogleStatus()"
                  :active-color="switchActiveColor"
                  active-text=""
                  inactive-text="">
                </el-switch>
              </el-tooltip>

              <el-popover
                ref="popover5"
                placement="top"
                width="160"
                v-model="deleteStatus">
                <p>删除管家后该员工账号将无法接取服务工单</p>
                <div style="text-align: right; margin: 0">
                  <el-button
                    @click="deleteStatus = false"
                    size="mini"
                    type="text">取消</el-button>
                  <el-button
                    @click="deleteSpace()"
                    type="primary"
                    size="mini">确定</el-button>
                </div>
              </el-popover>

              <el-button
                v-permissions="'/manage/spaceKeeper/delete'"
                class="fr mt-4 ml10"
                type="danger"
                size="mini"
                v-popover:popover5
                plain>删除管家</el-button>

              <el-button
                v-permissions="'/manage/spaceKeeper/addCompany'"
                @click="showDialog(activeId)"
                class="fr mt-4"
                type="primary"
                size="mini"
                plain>关联企业</el-button>
            </div>
          </h3>

          <keep-alive>
            <statistics
              v-if="activeIndex == '0'"
              :activeIndex="activeIndex"></statistics>
            <name-list
              v-else
              ref="nameList"
              :sidebarData="sidebarData"
              :activeIndex="activeIndex"
              :activeId="activeId"></name-list>
          </keep-alive>

          <space-dialog
            :activeId="activeId"
            @getKeeperList="getKeeperList"
            @refreshCompanyList="refreshCompanyList"></space-dialog>
        </div>
      </el-container>
    </div>
  </div>
</template>

<script>
  import houseSpaceMixis from './com-mixins'
  import nameList from './components/name-list'
  import SpaceDialog from './components/dialog'
  import statistics from './components/statistics'
  import { keeperList, keeperDelete, changeStatus } from '@/service/housekeeper'
  export default {
    mixins: [houseSpaceMixis],
    components: {
      nameList,
      statistics,
      [SpaceDialog.name]: SpaceDialog
    },
    data () {
      return {
        activeIndex: '0',
        activeId: null,
        activeName: null,
        sidebarData: [],
        deleteStatus: false
      }
    },
    mounted() {
      this.getKeeperList()
    },
    methods: {
      refreshCompanyList() {
        /**
         * 同级组件之间调用方法，
         * 在同级组件的父组件内给一个组件添加ref
         * 在另一个组件里通过通过$refs来做中介
         */
        this.$refs.nameList.getPageData()
      },
      // sidebar 显示的管家列表
      getKeeperList() {
        keeperList().then(res => {
          if (res.status === 'true') {
            this.sidebarData = res.info.map(i => ({
              id: i.id + '',
              name: i.name,
              statusCode: i.statusCode
            }))
            this.sidebarData.unshift({id: '0', name: '接单统计'})
            this.toggleSidebar(this.activeIndex)
          }
        })
      },
      toggleSidebar(id) {
        this.activeIndex = id + ''
        this.activeId = this.sidebarData[id].id
        this.activeName = this.sidebarData[id].name
      },
      toogleStatus() {
        changeStatus({
          spaceKeeperId: this.activeId,
          statusCode: this.sidebarData[this.activeIndex].statusCode
        }).then(res => {
          if (res.status === 'true') {
            this.setMsg('success', '修改成功！')
          } else {
            this.setMsg('error', res.msg)
          }
        })
      },
      deleteSpace() {
        keeperDelete({ spaceKeeperId: this.activeId }).then(res => {
          if (res.status === 'true') {
            this.setMsg('success', '删除成功!')
            this.deleteStatus = false
            // 删除管家成功之后，刷新侧边栏，tab切换到接单统计
            this.activeIndex = '0'
            this.activeId = null
            this.activeName = null

            this.getKeeperList()
          } else {
            this.setMsg('error', res.msg)
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "src/styles/config";
  .housekeeper-space {
  }
  .el-menu {
    border-right: 0;
  }
  .sidebar-style {
    max-height: 497px;
    border: 1px solid #eff2fc;
  }
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }
  .el-menu-item {
    height: 45px;
    line-height: 45px;
  }
  .el-aside {
    color: #333;
  }
</style>
