import { pickerOptions2 } from '@/mixins/head/data-picker'
import { getDateStr } from '@/config/utils'
export default {
  data() {
    return {
      pickerOptions2,
      selectedPeriod: 1,
      canWeekClick: false,
      canMonthClick: true,
      dateRange: null // 选中的时间范围
    }
  },
  mounted() {
    // 前一个月
    this.dateRange = [getDateStr(-30), getDateStr(-1)]
    console.log(this.dateRange)
  },
  methods: {
    dateChange() {
      if (!this.dateRange) return;
      var startDate = this.dateRange[0]
      var endDate = this.dateRange[1]
      var differenceDate = (new Date(endDate).getTime() - new Date(startDate).getTime()) / (3600 * 1000 * 24) + 1
      if (differenceDate <= 7) {
        this.canWeekClick = true
        this.canMonthClick = true
        // 判断原先的radio是否选中的是"日"
        if (this.selectedPeriod > 1) {
          this.selectedPeriod = 1
          // return; // 避免dateChange和radioChange重复请求
        }
      } else if (differenceDate > 7 && differenceDate <= 60) {
        this.canWeekClick = false
        this.canMonthClick = true
        // 判断原先的radio是否选中的是"月"
        if (this.selectedPeriod > 2) {
          this.selectedPeriod = 2
          // return; // 避免dateChange和radioChange重复请求
        }
      } else if (differenceDate > 60) {
        this.canWeekClick = false
        this.canMonthClick = false
      }
      // console.log(differenceDate)
      this.getPageData()
    }
  }
}
