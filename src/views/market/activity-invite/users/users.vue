<template>
  <div class="service-list main-content">
    <lh-title></lh-title>
    <div class="card-padding">
      <h2 style="margin-bottom: 20px;">邀请人名单列表</h2>
      <div>
        <el-table :data="configData" :empty-text="tableEmpty" :slot="tableEmpty" border style="width: 100%">

          <el-table-column label="用户ID" prop="invitee" align="left"></el-table-column>
          <el-table-column label="手机号" prop="phone" align="left"></el-table-column>
          <el-table-column label="昵称" prop="name" align="left"></el-table-column>
          <el-table-column label="注册时间" prop="updated" align="left"></el-table-column>
          <el-table-column label="注册渠道（邀请人userId）" prop="invitor" align="left"></el-table-column>

        </el-table>

        <div style="text-align: center;margin-top: 30px;">
          <el-pagination background ref="pages" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page.sync="pages.pageNo" :page-size="pages.pageSize"
                         :page-sizes="[20,40,80,100]" layout="total, sizes, prev, pager, next, jumper" :total="pages.total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { platformActivityActInvRecordList } from '@/service/market'
  export default {
    data() {
      return {
        id: this.$route.query.id, // 活动id
        pages: {
          pageSize: 20,
          pageNo: 1,
          total: 0
        }, // 分页
        tableEmpty: '', // 数据为空的提示信息
        configData: [] // 活动配置表格展示数据
      }
    },
    created() {
      this.getData()
    },
    methods: {
      /**
       * 列表的size-change
       * @param page
       */
      handleSizeChange(val) {
        this.pages.pageSize = val
        this.getData(1)
      },
      /**
       * 列表的current-change
       * @param page
       */
      handleCurrentChange(val) {
        this.pages.pageNo = val
        this.getData(1)
      },
      /**
       * 列表的数据显示
       * @param page
       */
      getData() {
        console.log('被邀请人的数据')
        const self = this
        platformActivityActInvRecordList({
          filters: {
            'act_inv_record': {
              'platformActivityId': {
                equalTo: self.id
              }
            }
          },
          includes: {
            customer: {
              includes: ['invitee']
            }
          },
          page_no: self.pages.pageNo,
          page_size: self.pages.pageSize
        }).then(res => {
          if (res.info.length === 0) {
            this.tableEmpty = '暂时无数据'
            this.pages.total = 0
          } else {
            this.pages.total = res.info.length
            self.configData = []
            res.info.forEach((item, index) => {
              self.configData.push({ 'invitee': item.superior.invitee,
                'phone': item.includes.customer.telephone,
                'name': item.includes.customer.nickname,
                'updated': item.superior.updated,
                'invitor': item.superior.invitor })
            })
            console.log('this.countData', this.countData)
          }
        })
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
