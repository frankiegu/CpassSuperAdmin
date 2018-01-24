// 门店列表
// 比特币原理：拆分成最小单位，打散组合
import { findAllStore } from '@/service/admin'
export default {
  data () {
    return {
      storeList: []
    }
  },
  created() {
    findAllStore().then(res => {
      if (res.status === 'true') {
        this.storeList = res.info
        this.storeList.unshift({'id': ' ', 'storeName': '全部门店'})
      }
    })
  }
}
