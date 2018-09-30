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
            case 'field':
              if (brandIdx) {
                this.dialogData.addArr[brandIdx - 1].storeList = resInfo
              } else {
                this.dialogData.addArr[0].storeList = resInfo
              }

              for (const itm of resInfo) {
                if (this.dialogData.addArr[brandIdx - 1].storeId === itm.id) {
                  this.dialogData.addArr[brandIdx - 1].storeItm = itm
                }
              }
              console.log('storeItm', this.dialogData.addArr[brandIdx - 1].storeItm);
              break
          }

          console.log('getStores', brandIdx);
        } else {
          this.setMsg('error', res.msg)
        }
      })
    },

    getFields(storeIdx) {
      var addArr = this.dialogData.addArr
      console.log('getFields', addArr, storeIdx, addArr[storeIdx - 1]);

      cPassFindUseField({
        storeId: (this.insertType === 'title') ? this.dialogData.storeId : addArr[storeIdx - 1].storeId
      }).then(res => {
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
        } else {
          this.setMsg('error', res.msg)
        }
      })
    }
  }
}
