<template>
  <div class="service-list main-content">
    <lh-title></lh-title>
    <div class="card-padding">
      <h2 style="margin-bottom: 20px;">邀请人名单列表</h2>
      <div>
        <el-table :data="configData" :empty-text="tableEmpty" :slot="tableEmpty" border style="width: 100%">

          <el-table-column label="用户ID" prop="code" align="left"></el-table-column>
          <el-table-column label="手机号" prop="phone" align="left"></el-table-column>
          <el-table-column label="昵称" prop="name" align="left"></el-table-column>
          <el-table-column label="注册时间" prop="createTime" align="left"></el-table-column>
          <el-table-column label="注册渠道（邀请人userId）" prop="invited" align="left"></el-table-column>

        </el-table>

        <div style="text-align: center;margin-top: 30px;">
          <el-pagination background ref="pages" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page.sync="pages.pageNo" :page-size="pages.pageSize"
                         :page-sizes="[10,20,50]" layout="total, sizes, prev, pager, next, jumper" :total="pages.total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        pages: {
          pageSize: 10,
          pageNo: 1,
          total: 4
        }, // 分页
        tableEmpty: '', // 数据为空的提示信息
        configData: [{ 'code': '001', 'phone': '15711111111', 'name': '昵称1', 'createTime': '2018-12-30 23:59:59', 'invited': '2000' },
          { 'code': '002', 'phone': '15711111111', 'name': '昵称2', 'createTime': '2018-12-30 23:59:59', 'invited': '2000' },
          { 'code': '003', 'phone': '15711111111', 'name': '昵称3', 'createTime': '2018-12-30 23:59:59', 'invited': '2000' },
          { 'code': '004', 'phone': '15711111111', 'name': '昵称4', 'createTime': '2018-12-30 23:59:59', 'invited': '2000' }] // 活动配置表格展示数据
      }
    },
    methods: {
      /**
       * 活动配置的size-change
       * @param page
       */
      handleSizeChange(val) {
        this.pages.pageSize = val
        this.getData(1)
      },
      /**
       * 活动配置的current-change
       * @param page
       */
      handleCurrentChange(val) {
        this.pages.pageNo = val
        this.getData(1)
      },
      /**
       * 活动配置的数据显示
       * @param page
       */
      getData(page) {
        console.log('被邀请人的数据')
        if (this.configData.length === 0) {
          this.tableEmpty = '暂时无数据'
        }
      }
    }
  }
</script>
<style lang="scss">
  .card-padding {
    .el-upload--picture-card {
      background-color: #fbfdff;
      border-radius: 6px;
      box-sizing: border-box;
      width: 100px;
      height: 80px;
      cursor: pointer;
      line-height: 90px;
      vertical-align: top;
    }
  }
</style>
<style lang="scss" scoped>
  /*@import "src/styles/config";*/
  .service-list {
    .add-btn {
      padding: 0px 20px;
      line-height: 32px;
      color: #fff;
      cursor: pointer;
    }
    .operate-btn {
      padding: 6px;
    }
    .underline {
      text-decoration: underline;
    }
    .ml45 {
      margin-left: 45px;
    }
  }
</style>
