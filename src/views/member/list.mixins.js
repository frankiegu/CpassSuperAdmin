import { API_PATH } from '@/config/env'
import tableMixins from '@/mixins/table'
import option from '@/components/option'
import pickerOptions from '@/mixins/pickerOptions'
import { formatTimeString, downloadFile } from '@/config/utils'
import { clientList } from '@/service/client'

export default {
  mixins: [tableMixins, pickerOptions],
  components: {
    [option.name]: option
  },
  data () {
    return {
      formData: {
        name: '',
        reg_date: null,
        registerWay: '',
        validaty: '',
        productStatus: ''
      },
      channels: [
        { id: 1, channel: '后台创建' },
        { id: 2, channel: '客户自助注册' }
      ],
      timeValidity: [
        { id: 1, validity: '永久' },
        { id: 2, validity: '一周内到期' },
        { id: 3, validity: '一月内到期' }
      ],
      statusList: [
        { value: ' ', label: '全部' },
        { value: 1, label: '正常', type: 'success' },
        { value: 0, label: '停用', type: 'danger' }
      ]
    }
  },
  mounted () {
    this.getPageData()
  },
  methods: {
    formatTime(time) {
      return !time ? '' : time.replace(/:\d{2}$/, '')
    },
    getPageData() {
      const formData = this.formData
      const paramsObj = {
        pageSize: this.pageSize,
        pageNum: this.currentPage,
        name: formData.name,
        validaty: formData.validaty,
        registerWay: formData.registerWay,
        productStatus: formData.productStatus,
        createStartDate: this.formData.reg_date ? formatTimeString(this.formData.reg_date[0]) : null,
        createEndDate: this.formData.reg_date ? formatTimeString(this.formData.reg_date[1]) : null
      }

      clientList(paramsObj).then(res => {
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
    exportExcel() {
      if (!this.tableData.length) {
        return this.setMsg('暂无数据')
      }
      const formData = this.formData
      const downParams = {
        name: formData.name,
        validaty: formData.validaty,
        registerWay: formData.registerWay,
        productStatus: formData.productStatus,
        createStartDate: formData.reg_date ? formatTimeString(formData.reg_date[0]) : null,
        createEndDate: formData.reg_date ? formatTimeString(formData.reg_date[1]) : null
      }
      let url = API_PATH + '/supervisor/client/exportAll'
      downloadFile(url, downParams)
    }
  }
}
