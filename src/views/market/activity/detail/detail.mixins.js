import { API_PATH } from '@/config/env'
import tableMixins from '@/mixins/table'
import pickerOptions from '@/mixins/pickerOptions'
import { platformActivityDetail, platformActivityChangeStatus, platformActivityStatisticsList } from '@/service/market'
import { setFieldStatus } from '@/service/field'
import { formatTimeString, downloadFile } from '@/config/utils'

export default {
  mixins: [tableMixins, pickerOptions],
  data () {
    return {
      activityId: this.$route.query.activityId || '',
      field: '',
      fieldType: '',
      activeTab: 'couponInformation',
      isOpen: 0,
      oldStatus: 0, // 测试用的 改状态前的status
      mainImg: '', // @#注意：主图不重复展示在列表中

      formData: {
        reg_date: ''
      },
      orderBy: '', // 添加时间的排序 升序10 降序11

      code: '', // 活动id
      bannerPath: '', // 活动banner地址
      name: '', // 活动名称
      type: '', // 活动类型
      startDate: '', // 活动开始时间
      endDate: '', // 活动结束时间
      created: '', // 活动创建时间
      status: '', // 活动状态  0未发布 1未开始 2进行中 3已结束 4暂停
      isDelete: '', // 活动是否删除  0-未删除 1-已删除
      canEdit: '', // 活动是否允许编辑 0不可编辑 1可编辑
      regulation: '', // 活动规则
      lotteryPlayer: '', // 参与人数
      lotteryExtraTime: '', // 分享成功后额外抽奖次数(上限值)
      lotteryInitTime: '', // 初始抽奖次数
      winningMaxTime: '', // 每人最大允许中奖数

      // 活动统计
      lookPlayer: '', // 查看人数
      lotteryCount: '', // 参与次数

      platformActivityGiftList: [], // 奖品
      platformActivityShowConfigList: [], // 展示设置

      // 展示设置
      showDate: '', // 展示开始时间
      hiddenDate: '', // 展示开始时间
      notBeginPrompt: '', // 未开始提示
      endPrompt: '', // 结束提示
      showType: '' // 展示类型 1小程序 2ios端 3 安卓端

    }
  },
  mounted () {
    this.getPageData()
    this.getActivityDetail()
  },
  methods: {
    change (sort) {
      console.log(sort)
      if (sort.order === 'ascending') {
        this.orderBy = 10
      } else if (sort.order === 'descending') {
        this.orderBy = 11
      } else {
        this.orderBy = ''
      }
      this.getPageData()
    },
    // 获取活动详情
    getActivityDetail () {
      const paramsObj = {
        activityId: this.activityId
      }
      platformActivityDetail(paramsObj).then(res => {
        if (res.status === 'true') {
          if (res.info) {
            if (res.info.platformActivity) {
              this.code = res.info.platformActivity.code
              this.bannerPath = res.info.platformActivity.bannerPath
              this.name = res.info.platformActivity.name
              this.type = res.info.platformActivity.type
              this.startDate = res.info.platformActivity.startDate
              this.endDate = res.info.platformActivity.endDate
              this.created = res.info.platformActivity.created
              this.status = res.info.platformActivity.status
              this.regulation = res.info.platformActivity.regulation
              this.isDelete = res.info.platformActivity.isDelete
              this.canEdit = res.info.platformActivity.canEdit

              this.lotteryPlayer = res.info.platformActivity.lotteryPlayer
              this.lotteryExtraTime = res.info.platformActivity.lotteryExtraTime
              this.lotteryInitTime = res.info.platformActivity.lotteryInitTime
              this.winningMaxTime = res.info.platformActivity.winningMaxTime

              this.lookPlayer = res.info.platformActivity.activityStatistics.lookPlayer
              this.lotteryCount = res.info.platformActivity.activityStatistics.lotteryCount

              if (this.status === 2) {
                this.isOpen = 1
              } else if (this.status === 0 || this.status === 1 || this.status === 3 || this.status === 4) {
                this.isOpen = 0
              }
              console.log(this.isOpen)
            }

            if (res.info.activityStatistics) {
              this.lookPlayer = res.info.activityStatistics.lookPlayer || 0
              this.lotteryCount = res.info.activityStatistics.lotteryCount || 0
            }

            if (res.info.platformActivityShowConfigList) {
              this.platformActivityShowConfigList = res.info.platformActivityShowConfigList
              this.showDate = res.info.platformActivityShowConfigList[0].showDate
              this.hiddenDate = res.info.platformActivityShowConfigList[0].hiddenDate
              this.notBeginPrompt = res.info.platformActivityShowConfigList[0].notBeginPrompt
              this.endPrompt = res.info.platformActivityShowConfigList[0].endPrompt
              this.showType = res.info.platformActivityShowConfigList[0].showType
            }

            this.platformActivityGiftList = res.info.platformActivityGiftList
          }
        } else {
          this.setMsg('error', res.msg)
        }
      })
    },
    // 获取活动统计列表
    getPageData(page) {
      this.currentPage = page || this.currentPage
      const paramsObj = {
        pageSize: this.pageSize,
        pageNum: this.currentPage,
        activityId: this.activityId,
        startDate: this.formData.reg_date ? formatTimeString(this.formData.reg_date[0]) : null,
        endDate: this.formData.reg_date ? formatTimeString(this.formData.reg_date[1]) : null,
        orderBy: this.orderBy
      }

      platformActivityStatisticsList(paramsObj).then(res => {
        if (res.status === 'true') {
          let data = res.info
          if (data) {
            this.pageTotal = data.total
            this.tableData = data.result
          }

          this.tableLoading = false
          if (this.tableData.length === 0) {
            this.tableEmpty = '暂时无数据'
          }
        } else {
          this.setMsg('error', res.msg)
        }
      })
    },
    // 更改活动状态
    handleUpdateStatus() {
      if (this.isOpen === 0) {
        this.oldStatus = 1
      } else {
        this.oldStatus = 0
      }
      platformActivityChangeStatus({
        activityId: this.activityId,
        status: this.isOpen
      }).then(res => {
        if (res.status === 'true') {
          this.setMsg('success', '修改成功')
          if (res.info) {
            this.status = res.info.status
            this.canEdit = res.info.canEdit
            this.isDelete = res.info.isDelete
          }
        } else {
          this.isOpen = this.oldStatus
          this.setMsg('error', res.msg)
        }
      })
    },
    // 删除活动
    delectActivity () {
      this.$confirm('此操作将永久删除该活动, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        setFieldStatus({ activityId: this.activityId }).then(res => {
          if (res.status === 'true') {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          } else {
            this.$message({
              type: 'info',
              message: res.msg
            });
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    exportExcel() {
      const self = this
      const formData = self.formData
      if (!self.tableData.length) {
        return self.setMsg('暂无数据')
      }
      const downParams = {
        activityId: self.activityId,
        startDate: formData.reg_date ? formatTimeString(self.formData.reg_date[0]) : null,
        endDate: formData.reg_date ? formatTimeString(self.formData.reg_date[1]) : null,
        orderBy: self.orderBy
      }
      let url = API_PATH + '/supervisor/platformActivity/statisticsExport'
      downloadFile(url, downParams)
    }
  }
}
