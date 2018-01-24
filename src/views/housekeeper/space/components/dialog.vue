<template>
  <el-dialog
    :title="getDialogTitle"
    :visible="!!getDialogVisible"
    :before-close="closeDialog"
    class="set-dialog"
    :width="(getDialogTitle === '管家服务类型') ? '35%': '420px'">

    <el-form
      v-on:submit.native.prevent
      label-width="100px"
      label-position="right">
      <div v-if="getDialogTitle === '添加管家'">
        <el-form-item label="选择账号">
          <el-select
            v-model="keeper"
            placeholder="请选择账号"
            clearable>

            <el-option
              v-for="i in keepers"
              :label="i.name"
              :value="i.adminUserId"
              :key="i.adminUserId"></el-option>
          </el-select>
        </el-form-item>

        <p class="theme-gray text-center">添加后该账号将自动添加处理管家工单的权限</p>
      </div>

      <div v-else-if="getDialogTitle === '管家服务类型'">
        <el-form-item label-width="7px">
          <el-tag
            v-for="(tag, index) in types"
            :key="index"
            @close="handleClose(tag)"
            :disable-transitions="false"
            closable>{{tag.typeName}}</el-tag>

          <el-input
            v-if="inputVisible"
            v-model="inputValue"
            @blur="handleInputConfirm"
            @keyup.enter.native="handleInputConfirm"
            class="input-new-tag"
            ref="saveTagInput"
            size="small"></el-input>

          <el-button
            v-permissions="'/manage/spaceServiceType/add'"
            v-else
            @click="showInput"
            class="button-new-tag"
            icon="el-icon-plus"
            type="primary"
            size="small">新增</el-button>
        </el-form-item>
      </div>

      <el-form-item v-else label="选择企业">
        <el-select
          v-model="company"
          placeholder="请选择企业"
          clearable>

          <el-option
            v-for="i in companys"
            :label="i.companyName"
            :value="i.companyId"
            :key="i.companyId"></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <div
      :class="[{'dn': (getDialogTitle === '管家服务类型')}]"
      slot="footer"
      class="dialog-footer text-center">
      <el-button @click="submitForm" type="primary" class="width100px">确认</el-button>
      <el-button @click="closeDialog" class="width100px">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import store from '@/store'
  import {mapGetters} from 'vuex'
  import { keeperListOption, keeperAdd, serviceTypeList, listCompany, addCompany, serviceTypeAdd, serviceTypeDelete } from '@/service/housekeeper'
  export default {
    name: 'SpaceDialog',
    props: ['activeId'],
    data() {
      return {
        type: '',
        types: [],
        keeper: '',
        keepers: [],
        company: '',
        companys: [],

        inputVisible: false,
        inputValue: ''
      }
    },
    computed: {
      ...mapGetters([
        'getMonitorClick',
        'getDialogVisible',
        'getDialogTitle'
      ])
    },
    watch: {
      getMonitorClick: {
        handler: function (val, oldVal) {
          if (this.getDialogTitle === '添加管家') {
            this.getKeeperList()
          } else if (this.getDialogTitle === '管家服务类型') {
            this.getTypes()
          } else {
            this.getListCompany()
          }
        },
        immediate: true
      }
    },
    mounted() {
    },
    methods: {
      submitForm() {
        if (this.getDialogTitle === '添加管家') {
          if (this.keeper) {
            keeperAdd({ adminUserId: this.keeper }).then(res => {
              if (res.status === 'true') {
                this.setMsg('success', '添加管家成功!')

                this.closeDialog()
                this.$emit('getKeeperList')
              } else this.setMsg('error', res.msg)
            })
          }
        } else if (this.getDialogTitle === '管家服务类型') {
        } else {
          if (this.company) {
            addCompany({
              spaceKeeperId: this.activeId,
              companyId: this.company
            }).then(res => {
              if (res.status === 'true') {
                this.setMsg('success', '关联企业成功!')

                this.closeDialog()
                this.$emit('refreshCompanyList')
              } else this.setMsg('error', res.msg)
            })
          }
        }
      },
      closeDialog() {
        this.keeper = ''
        this.company = ''
        store.commit('SET_DIALOGVISIBLE', false)
      },
      getTypes() {
        serviceTypeList().then(res => {
          if (res.status === 'true') {
            this.types = res.info
          }
        })
      },
      getListCompany() {
        listCompany({spaceKeeperId: this.activeId}).then(res => {
          if (res.status === 'true') {
            this.companys = res.info
          }
        })
      },
      getKeeperList() {
        keeperListOption().then(res => {
          if (res.status === 'true') {
            this.keepers = res.info
          }
        })
      },
      handleClose(tag) {
        serviceTypeDelete({ id: tag.id }).then(res => {
          if (res.status === 'true') {
            this.types.splice(this.types.indexOf(tag), 1)
            this.setMsg('success', '删除成功!')
          } else this.setMsg('error', res.msg)
        })
      },
      showInput() {
        this.inputVisible = true
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus()
        });
      },
      handleInputConfirm() {
        let inputValue = this.inputValue
        if (inputValue) {
          serviceTypeAdd({ typeName: inputValue }).then(res => {
            if (res.status === 'true') {
              let data = res.info
              this.types.push({
                id: data.id,
                typeName: inputValue
              })
              this.setMsg('success', '添加成功!')
            } else this.setMsg('error', res.msg)
          })
        }
        this.inputVisible = false;
        this.inputValue = ''
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-tag + .button-new-tag {
    width: 67px;
    height: 32px;
    line-height: 32px;
    padding: 0;
    vertical-align: middle;
  }
  .el-tag {
    margin-right: 10px;
    margin-bottom: 10px;
  }
  .input-new-tag {
    width: 90px;
    vertical-align: middle;
  }
</style>
