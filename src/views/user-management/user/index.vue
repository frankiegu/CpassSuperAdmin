<template>
  <div class="user-list main-content">
    <lh-title title="用户列表"></lh-title>

    <div class="lh-form-box">
      <el-form :model="formData" :inline="true" class="text-right mr-10" @submit.native.prevent>
        <el-button
          v-if="handleHasPermissions('/supervisor/supervisor/add')"
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
            clearable
            class="lh-form-input">

            <i slot="suffix" @click="getPageData(1)" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-form-item>

        <!-- 根据现阶段产品需求，暂不放出 -->
        <!-- <el-form-item>
          <el-input
            v-model.trim="formData.realName"
            @keyup.native.enter="getPageData(1)"
            placeholder="请输入真实姓名"
            clearable
            class="lh-form-input">

            <i slot="suffix" @click="getPageData(1)" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-form-item> -->

        <!-- 根据现阶段产品需求，暂不放出 -->
        <!-- <el-form-item>
          <el-select
            v-model="formData.roleId"
            @change="getPageData(1)"
            placeholder="请选择角色"
            class="width150px"
            clearable>
            <el-option
              v-for="item in roles"
              :label="item.roleName"
              :value="item.role"
              :key="item.role"></el-option>
          </el-select>
        </el-form-item> -->

      </el-form>
    </div>

    <!-- 新增编辑用户 -->
    <transition v-if="handleHasPermissions(['/supervisor/supervisor/update', '/supervisor/supervisor/add'])" name="slide-fade">
      <el-form
        :model="userForm"
        ref="userForm"
        :rules="rules"
        label-width="110px"
        class="set-table-dialog"
        v-show="isShowUserForm">

        <div class="panel scroll-panel">
          <h1 class=""><i @click="cancelSet('userForm')" class="el-icon-arrow-right fl callback theme-gray"></i>{{ userFormTitle }}</h1>

          <div class="content mt22">
            <div class="content-form clearfix">

              <el-form-item class="mt22" label="用户ID">
                <span style="line-height: 31px;" v-if="userForm.id">{{ userForm.id }}</span>
                <span style="line-height: 31px;" v-else>新增账号后由系统生成</span>
              </el-form-item>

              <el-form-item class="mt22" label="用户名/手机号" prop="userName">
                <el-input
                  v-model.trim="userForm.userName"
                  maxlength="11"
                  placeholder="请输入手机号"></el-input>
              </el-form-item>

              <el-form-item class="mt22" label="真实姓名" prop="realName">
                <el-input
                  v-model.trim="userForm.realName"
                  maxlength="10"
                  placeholder="请输入真实姓名"></el-input>
              </el-form-item>

              <el-form-item class="mt22" label="邮箱" prop="email">
                <el-input
                  v-model.trim="userForm.email"
                  placeholder="请输入公司邮箱"></el-input>
              </el-form-item>

              <el-form-item class="mt22" label="描述" prop="description">
                <el-input
                  type="textarea"
                  maxlength="100"
                  v-model.trim="userForm.description"></el-input>
              </el-form-item>

              <el-form-item class="mt22" label="可用状态" prop="userStateCode">
                <el-switch
                  v-model.trim="userForm.userStateCode"
                  active-color="#13ce66"
                  :active-value="1"
                  :inactive-value="0"></el-switch>
              </el-form-item>

              <el-form-item class="mt22" label="角色" prop="role">
                <el-select
                  clearable
                  v-model.trim="userForm.role"
                  class="fl width100"
                  placeholder="请选择">

                  <el-option
                    v-for="(item, index) in roles"
                    :key="index"
                    :label="item.roleName"
                    :value="item.role">
                  </el-option>
                </el-select>
              </el-form-item>

            </div>
          </div>

          <div class="footer">
            <p class="theme-gray mb22" v-if="!userForm.hasOwnProperty('id')">新增账号初始密码为手机号后6位</p>
              <el-button
                v-if="handleHasPermissions([
                '/supervisor/supervisor/update',
                '/supervisor/supervisor/add'])"
                class="btn-save width80px"
                type="primary"
                @click="postSave('userForm')">{{ this.userForm.id?'提交':'新增用户' }}</el-button>
              <el-button  @click="cancelSet('userForm')" class="btn-clear width80px">取消</el-button>
          </div>
        </div>

        <div @touchmove.prevent @click="cancelSet('userForm')" class="v-modal"></div>
      </el-form>
    </transition>

    <div class="card-padding">
      <el-table
        :data="tableData"
        :empty-text="tableEmpty"
        :slot="tableEmpty"
        v-loading="tableLoading"
        class="width100" border>

        <el-table-column label="用户名/手机号" prop="username" align="center"></el-table-column>
        <el-table-column label="真实姓名" prop="name" align="center" width="150"></el-table-column>
        <el-table-column label="邮箱地址" prop="email" align="center"></el-table-column>
        <el-table-column label="角色" prop="roleName" align="center"></el-table-column>
        <el-table-column label="可用状态" prop="statusCode" align="center" width="100">
          <template slot-scope="scope">
            <div class="label-con">
              <el-tag v-if="scope.row.statusCode === 1" type="success">可用</el-tag>
              <el-tag v-else type="danger">禁用</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="描述" align="center">
          <template slot-scope="scope">
              {{ scope.row.supervisorDesc || '-' }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="handleHasPermissions([
          '/supervisor/supervisor/update',
          '/supervisor/supervisor/open',
          '/supervisor/supervisor/close',
          '/supervisor/supervisor/delete'])"
          label="操作"
          prop="contact"
          align="center"
          width="150">
          <template v-if="!scope.row.isSuper" slot-scope="scope">
            <el-button v-if="handleHasPermissions('/supervisor/supervisor/update')" @click="setUser(scope.$index)" type="text">编辑</el-button>
            <el-button v-if="handleHasPermissions('/supervisor/supervisor/close') && scope.row.statusCode === 1" @click="handleChangeUseState(scope.$index, '禁用')" type="text">禁用</el-button>
            <el-button v-else-if="handleHasPermissions('/supervisor/supervisor/open')" @click="handleChangeUseState(scope.$index, '恢复')" type="text">恢复</el-button>
            <el-button v-if="handleHasPermissions('/supervisor/supervisor/delete')" @click="handleChangeUseState(scope.$index, '删除')" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        :total="pageTotal"
        :layout="layoutArr"
        :page-size="pageSize"
        :page-sizes="pageSizeArr"
        :current-page="currentPage"
        class="pagination-container"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        background></el-pagination>
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
  .main-content {
    .set-table-dialog {
      .panel {
        min-height: 100%;
        overflow-y: auto;
        &.scroll-panel {
          width: 410px;
          right: -20px;
        }
        .content {
          .content-form {
            padding-bottom: 100px;
          }
          margin-bottom: 50px;
        }
        .footer {
          position: relative;
          height: 100px;
          margin-top: -100px;
          margin-bottom: 50px;
          clear: both;
        }
        .clearfix:after {
          content: ".";
          display: block;
          height: 0;
          clear: both;
          visibility: hidden;
        }
        .clearfix {
          display: inline-block;
        }
      }
      .callback {
        display: inline-block;
        font-size: 16px;
        line-height: 25px;
        padding: 0 5px;
        cursor: pointer;
        margin-left: -9px;
      }
    }
  }
</style>
