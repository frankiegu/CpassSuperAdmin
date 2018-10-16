<template>
  <div class="user-list main-content">
    <lh-title title="用户列表"></lh-title>

    <div class="lh-form-box">
      <el-form :model="formData" :inline="true" class="text-right mr-10" @submit.native.prevent>
        <el-button
          class="fl add-account"
          type="primary"
          @click="setUser()"
          icon="el-icon-circle-plus">
          新增用户
        </el-button>

        <el-form-item>
          <el-input
            v-model.trim="formData.userName"
            @keyup.native.enter="getPageData(1)"
            placeholder="请输入用户名/手机号"
            class="lh-form-input">

            <i slot="suffix" @click="getPageData(1)" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-input
            v-model.trim="formData.realName"
            @keyup.native.enter="getPageData(1)"
            placeholder="请输入真实姓名"
            class="lh-form-input">

            <i slot="suffix" @click="getPageData(1)" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-select
            v-model="formData.rolaName"
            @change="getPageData(1)"
            placeholder="请选择角色"
            class="width150px"
            clearable>
            <el-option
              v-for="item in roles"
              :label="item.role"
              :value="item.id"
              :key="item.id"></el-option>
          </el-select>
        </el-form-item>

      </el-form>

      <!-- 新增编辑用户 -->
      <transition name="slide-fade">
        <el-form
          :model="userForm"
          ref="userForm"
          :rules="rules"
          label-width="120px"
          class="set-table-dialog"
          label-position="right"
          v-show="isShowUserForm">

          <div class="panel scroll-panel">
            <i @click="cancelSet('userForm')" class="el-icon-close mt10"></i>
            <h1 class="align-left">基本信息</h1>

            <el-form-item class="mt20" label="用户名/手机号:" prop="userName">
              <el-input
                v-model.trim="userForm.userName"
                placeholder="请输入"></el-input>
            </el-form-item>

            <el-form-item class="mt20" label="真实姓名:" prop="realName">
              <el-input
                v-model.trim="userForm.realName"
                placeholder="请输入"></el-input>
            </el-form-item>

            <el-form-item class="mt20" label="邮箱:" prop="email">
              <el-input
                v-model.trim="userForm.email"
                placeholder="请输入公司邮箱"></el-input>
            </el-form-item>

            <el-form-item label="描述:" prop="description">
              <el-input
                type="textarea"
                v-model.trim="userForm.description"></el-input>
            </el-form-item>

            <el-form-item label="可用状态" prop="useState">
              <el-switch
                v-model.trim="userForm.useState"
                active-color="#13ce66"
                inactive-text="禁用"
                active-text="可用"
                active-value="可用"
                inactive-value="禁用"></el-switch>
            </el-form-item>

            <h1 class="align-left">权限信息</h1>

            <el-form-item class="mt20" label="角色:" prop="role">
              <el-select
                clearable
                v-model.trim="userForm.role"
                placeholder="请选择">

                <el-option
                  v-for="(item, index) in userForm.roles"
                  :key="index"
                  :label="item.role"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>

            <el-button
              class="mt20"
              type="primary"
              @click="postSave('userForm')">{{ this.userForm.id?'提交':'新增用户' }}</el-button>
          </div>

          <div @touchmove.prevent @click="cancelSet('userForm')" class="v-modal"></div>
        </el-form>
      </transition>
    </div>

    <div class="card-padding">
      <el-table
        :data="tableData"
        :empty-text="tableEmpty"
        :slot="tableEmpty"
        v-loading="tableLoading"
        class="width100" border>

        <el-table-column label="用户名/手机号" prop="userName" align="center"></el-table-column>
        <el-table-column label="真实姓名" prop="realName" align="center" width="150"></el-table-column>
        <el-table-column label="邮箱地址" prop="email" align="center"></el-table-column>
        <el-table-column label="角色" prop="role" align="center"></el-table-column>
        <el-table-column label="可用状态" prop="useState" align="center" width="100"></el-table-column>
        <el-table-column label="描述" prop="descript" align="center"></el-table-column>
        <el-table-column label="操作" prop="contact" align="center" width="150">
          <template v-if="scope.row.role !== 'root'" slot-scope="scope">
            <el-button @click="setUser(scope.row)" type="text">编辑</el-button>
            <el-button v-if="scope.row.useState === '可用'" @click="handleChangeUseState(scope.$index, '禁用')" type="text">禁用</el-button>
            <el-button v-else @click="handleChangeUseState(scope.$index, '恢复')" type="text">恢复</el-button>
            <el-button @click="handleDeleteUser(scope.$index, scope.row)" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import tableMixins from '@/mixins/table'
  import indexMixins from './index.mixins'

  export default {
    mixins: [tableMixins, indexMixins],
    data () {
      return {

      }
    }
  }
</script>

<style lang="scss" scoped>
  @import 'src/styles/variables.scss';
  @import 'src/styles/common.scss';
</style>
