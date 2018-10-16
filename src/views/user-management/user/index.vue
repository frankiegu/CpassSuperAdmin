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

      <!-- 新增编辑账号 -->
      <transition name="slide-fade">
        <el-form
          :model="userForm"
          ref="userForm"
          label-width="80px"
          class="set-table-dialog"
          v-show="isShowUserForm">

          <div class="panel scroll-panel">
            <h1 class=""><i @click="cancelSet('userForm')" class="el-icon-arrow-right fl callback theme-gray"></i>基本信息</h1>

            <div class="content mt40">
              <div class="content-form clearfix">

                <el-form-item class="mt40" label="用户名/手机号" prop="name">
                  <el-input
                    v-model.trim="userForm.name"
                    :maxlength="20"
                    placeholder="请输入员工名称"></el-input>
                </el-form-item>

                <el-form-item class="mt40" label="手机号码" prop="tel">
                  <el-input
                    v-model.trim="userForm.tel"
                    :maxlength="11"
                    placeholder="请输入员工手机号码"></el-input>
                </el-form-item>

                <el-form-item class="mt40" label="邮箱" prop="email">
                  <el-input
                    v-model.trim="userForm.email"
                    placeholder="请输入邮箱"></el-input>
                </el-form-item>

                <el-form-item class="mt40" label="职务" prop="role" style="margin-bottom: 0">
                  <el-select
                    clearable
                    v-model.trim="userForm.role"
                    class="fl width100"
                    placeholder="请选择">

                    <el-option
                      v-for="(item, index) in userForm.roles"
                      :key="index"
                      :label="item.role"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>

            </div>

            <div class="footer">
              <p class="theme-gray mb22">新增账号默认密码：123456a</p>

              <el-button
                class="btn-save width80px"
                type="primary"
                @click="postSave('userForm')">保 存</el-button>
              <el-button @click="cancelSet('userForm')" class="btn-clear">取消</el-button>
            </div>

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
            <el-button @click="setUser(scope.row.id)" type="text">编辑</el-button>
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
