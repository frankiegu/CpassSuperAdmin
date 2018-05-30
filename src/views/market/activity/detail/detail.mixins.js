import { API_PATH } from '@/config/env'
import tableMixins from '@/mixins/table'
import pickerOptions from '@/mixins/pickerOptions'
import { serviceList } from '@/service'
import { setFieldStatus } from '@/service/field'
import { formatTimeString, downloadFile } from '@/config/utils'

export default {
  mixins: [tableMixins, pickerOptions],
  data () {
    return {
      fieldId: this.$route.query.id + '',
      field: '',
      fieldType: '',
      activeTab: 'couponInformation',
      isOpen: 1,
      mainImg: '', // @#注意：主图不重复展示在列表中

      formData: {
        reg_date: ''
      }
    }
  },
  mounted () {
    this.getPageData()
  },
  methods: {
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
