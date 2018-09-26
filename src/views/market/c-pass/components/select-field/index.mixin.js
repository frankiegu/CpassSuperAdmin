import { cPassFindUseStore, cPassFindUseField, cPassFindUseSpace } from '@/service/market'
export default {
  methods: {
    getSpaces() {
      console.log('getSpaces', this.dialogData.titleType);

      cPassFindUseSpace().then(res => {
        if (res.status === 'true') {
          const resInfo = res.info
          switch (this.insertType) {
            case 'title':
              // 标题类型，已经在change时区分了
              this.brandList = resInfo
              break
            case 'store':
            case 'field':
              this.dialogData.addArr[0].brandList = resInfo
              break
          }
        } else {
          this.setMsg('error', res.msg)
        }
      })
    },

    getStores(storeIdx) {
      console.log('getStores', storeIdx);

      cPassFindUseStore({ spaceId: this.dialogData.brandId }).then(res => {
        if (res.status === 'true') {
          const resInfo = res.info
          switch (this.insertType) {
            case 'title':
              this.storeList = resInfo
              break
            case 'store':
              if (storeIdx) {
                this.addArr[storeIdx - 1].storeList = resInfo
              } else {
                this.dialogData.addArr[0].storeList = resInfo
              }
              break
            case 'field':
              if (storeIdx) {
                this.addArr[storeIdx - 1].storeList = resInfo
              } else {
                this.dialogData.addArr[0].storeList = resInfo
              }

              this.getFields()
              break
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
