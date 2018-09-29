import { cPassFindUseStore, cPassFindUseField, cPassFindUseSpace } from '@/service/market'
export default {
  methods: {
    getSpaces() {
      console.log('getSpaces', this.dialogData.titleType, this.insertType);

      cPassFindUseSpace().then(res => {
        if (res.status === 'true') {
          const resInfo = res.info
          switch (this.insertType) {
            case 'title':
              // 标题类型，已经在change时区分了
              this.brandList = resInfo
              console.log(1);
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

    getStores(brandIdx) {
      console.log('getStores', brandIdx);

      const ajaxParam = {
        spaceId: ''
      }
      if (this.insertType === 'title') {
        ajaxParam.spaceId = this.dialogData.brandId
      } else {
        ajaxParam.spaceId = this.dialogData.addArr[brandIdx - 1].brandId
      }

      cPassFindUseStore(ajaxParam).then(res => {
        if (res.status === 'true') {
          const resInfo = res.info
          switch (this.insertType) {
            case 'title':
              this.storeList = resInfo
              console.log('getStores', this.storeList)
              break
            case 'store':
              if (brandIdx) {
                this.dialogData.addArr[brandIdx - 1].storeList = resInfo
              } else {
                this.dialogData.addArr[0].storeList = resInfo
              }
              break
            case 'field':
              if (brandIdx) {
                this.dialogData.addArr[brandIdx - 1].storeList = resInfo
              } else {
                this.dialogData.addArr[0].storeList = resInfo
              }
              break
          }

          console.log('getStores', brandIdx);
        } else {
          this.setMsg('error', res.msg)
        }
      })
    },

    getFields(storeIdx) {
      console.log('getFields', this.dialogData.addArr, storeIdx);

      const ajaxParam = {
        storeId: ''
      }
      if (this.insertType === 'title') {
        ajaxParam.storeId = this.dialogData.storeId
      } else {
        ajaxParam.storeId = this.dialogData.addArr[storeIdx - 1].storeId
      }

      cPassFindUseField(ajaxParam).then(res => {
        if (res.status === 'true') {
          const resInfo = res.info
          switch (this.insertType) {
            case 'title':
              this.fieldList = resInfo
              break
            case 'field':
              if (storeIdx) {
                this.dialogData.addArr[storeIdx - 1].fieldList = resInfo
              } else {
                this.dialogData.addArr[0].fieldList = resInfo
              }
              break
            case 'store':
              break
          }

          console.log('getStores', storeIdx, this.dialogData.addArr[storeIdx - 1]);
        } else {
          this.setMsg('error', res.msg)
        }
      })
    }
  }
}
