import { API_PATH } from '@/config/env'
import tableMixins from '@/mixins/table'
import pickerOptions from '@/mixins/pickerOptions'
import { platformActivityDetail } from '@/service/market'
import { serviceList } from '@/service'
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
      isOpen: 1,
      mainImg: '', // @#注意：主图不重复展示在列表中

      formData: {
        reg_date: ''
      },

      code: '', // 活动id
      bannerPath: '', // 活动banner地址
      name: '', // 活动名称
      type: '', // 活动类型
      startDate: '', // 活动开始时间
      endDate: '', // 活动结束时间
      created: '', // 活动创建时间
      status: '', // 活动状态  0未发布 1未开始 2进行中 3已结束 4暂停
      is_delete: '', // 活动是否删除  0-未删除 1-已删除
      can_edit: '', // 活动是否允许编辑 0不可编辑 1可编辑
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
    getActivityDetail () {
      const paramsObj = {
        activityId: this.activityId
      }
      platformActivityDetail(paramsObj).then(res => {
        if (res.status === 'true') {
          if (res.info) {
            if (res.info.platformActivity) {
              this.code = res.info.platformActivity.code || ''
              this.bannerPath = res.info.platformActivity.bannerPath || ''
              this.name = res.info.platformActivity.name || ''
              this.type = res.info.platformActivity.type || ''
              this.startDate = res.info.platformActivity.startDate || ''
              this.endDate = res.info.platformActivity.endDate || ''
              this.created = res.info.platformActivity.created || ''
              this.status = res.info.platformActivity.status || ''
              this.regulation = res.info.platformActivity.regulation || ''
              this.is_delete = res.info.platformActivity.is_delete || ''
              this.can_edit = res.info.platformActivity.can_edit || ''
              this.lotteryPlayer = res.info.platformActivity.lotteryPlayer || ''
              this.lotteryExtraTime = res.info.platformActivity.lotteryExtraTime || ''
              this.lotteryInitTime = res.info.platformActivity.lotteryInitTime || ''
              this.winningMaxTime = res.info.platformActivity.winningMaxTime || ''
            }

            if (res.info.activityStatistics) {
              this.lookPlayer = res.info.activityStatistics.lookPlayer || 0
              this.lotteryCount = res.info.activityStatistics.lotteryCount || 0
            }

            if (res.info.platformActivityShowConfigList) {
              this.platformActivityShowConfigList = res.info.platformActivityShowConfigList || []
              this.showDate = res.info.platformActivityShowConfigList[0].showDate || ''
              this.hiddenDate = res.info.platformActivityShowConfigList[0].hiddenDate || ''
              this.notBeginPrompt = res.info.platformActivityShowConfigList[0].notBeginPrompt || ''
              this.endPrompt = res.info.platformActivityShowConfigList[0].endPrompt || ''
              this.showType = res.info.platformActivityShowConfigList[0].showType || ''
            }

            this.platformActivityGiftList = res.info.platformActivityGiftList || []
          }
        } else {
          this.setMsg('error', res.msg)
        }
      })
    },
    getPageData() {
      const paramsObj = {
        pageSize: this.pageSize,
        pageNum: this.currentPage
      }

      serviceList(paramsObj).then(res => {
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
    // 更新会员状态
    handleUpdateStatus() {
      setFieldStatus({
        fieldId: this.fieldId,
        isOpen: this.isOpen
      }).then(res => {
        if (res.status === 'true') {
          // @注意：感叹号只在需要表达强烈情感的情况下使用，弹出信息推荐不使用
          this.setMsg('success', '修改成功')
        } else {
          this.setMsg('error', res.msg)
        }
      })
    },
    exportExcel() {
      if (!this.tableData.length) {
        return this.setMsg('暂无数据')
      }
      const formData = this.formData
      const downParams = {
        content: formData.content,
        startDate: formData.reg_date ? formatTimeString(formData.reg_date[0]) : null,
        endDate: formData.reg_date ? formatTimeString(formData.reg_date[1]) : null
      }
      let url = API_PATH + '/supervisor/feedback/export'
      downloadFile(url, downParams)
    }
  }
}
