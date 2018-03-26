import tableMixins from '@/mixins/table'
import { serviceList, serviceToggle, serviceSetOnTop } from '@/service'

export default {
  mixins: [tableMixins],
  data () {
    return {
      id: '',
      isPermitOpen: '',
      isOpen: ''
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
    handleSetTop(id) {
      this.id = id
      const paramsObj = {
        id: this.id
      }
      serviceSetOnTop(paramsObj).then(res => {
        if (res.status === 'true') {
          this.setMsg('success', res.msg)
          this.getPageData()
        } else {
          this.setMsg('error', res.msg)
        }
      })
    },
    handleUpdateStatus(id, isPermitOpen) {
      this.id = id
      this.isPermitOpen = isPermitOpen
      // if (this.isPermitOpen === 1) {
      //   this.isPermitOpen = 0
      //   console.log('isPermitOpen' + this.isPermitOpen)
      // } else if (this.isPermitOpen === 0) {
      //   this.isPermitOpen = 1
      //   console.log('isPermitOpen' + this.isPermitOpen)
      // }
      console.log('id' + this.id)
      console.log('isPermitOpen' + this.isPermitOpen)
      const paramsObj = {
        id: this.id,
        permitOpen: this.isPermitOpen
      }
      serviceToggle(paramsObj).then(res => {
        if (res.status === 'true') {
          this.setMsg('success', res.msg)
          this.getPageData()
        } else {
          this.setMsg('error', res.msg)
        }
      })
    }
  }
}
