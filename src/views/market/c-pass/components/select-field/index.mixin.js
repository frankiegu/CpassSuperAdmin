import { cPassFindUseStore, cPassFindUseField, cPassFindUseSpace } from '@/service/market'
export default {
  methods: {
    getSpaces() {
      cPassFindUseSpace().then(res => {
        if (res.status === 'true') {
          const resInfo = res.info
          this.spaceList = resInfo

          switch (this.insertType) {
            case 'title':
              break
            case 'store':
              this.dialogData.addStoreList[0].sStoreList = resInfo
              this.getStores()
              break
            case 'field':
              break
          }
        } else {
          this.setMsg('error', res.msg)
        }
      })
    },
    getStores(storeIdx) {
      cPassFindUseStore({ spaceId: this.dialogData.spaceId }).then(res => {
        if (res.status === 'true') {
          const resInfo = res.info
          if (storeIdx) {
            this.addStoreList[storeIdx - 1].storeList = resInfo
          } else {
            this.storeList = resInfo
          }

          if (this.dialogData.storeId) {
            this.getFields()
          }
        } else {
          this.setMsg('error', res.msg)
        }
      })
    },
    getFields() {
      cPassFindUseField({ storeId: this.dialogData.storeId }).then(res => {
        if (res.status === 'true') {
          this.fieldList = res.info
        } else {
          this.setMsg('error', res.msg)
        }
      })
    }
  }
}
