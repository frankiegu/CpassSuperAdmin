import { cPassFindUseStore, cPassFindUseField, cPassFindUseSpace } from '@/service/market'
export default {
  methods: {
    getSpaces() {
      // console.log('getSpaces', this.dialogData.titleType, this.insertType);

      cPassFindUseSpace().then(res => {
        if (res.status === 'true') {
          const resInfo = res.info
          switch (this.insertType) {
            case 'title':
              // 标题类型，已经在change时区分了
              this.brandList = resInfo
              // console.log(1);
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
              // console.log('getStores', this.storeList)
              break
            case 'store':
            case 'field':
              if (brandIdx) {
                if (this.insertType === 'field') {
                  this.dialogData.addArr[brandIdx - 1].storeList = resInfo
                } else {
                  // 需要排除前面寻找的空间名
                  this.dialogData.addArr[brandIdx - 1].storeList = []
                  let allIdArr = resInfo.map((list) => { return list.id })
                  let selecetedArr = this.dialogData.addArr.map((list) => { return list.storeId })

                  // console.log('allIdArr', allIdArr, 'selecetedArr', selecetedArr, this.dialogData.addArr)

                  allIdArr.filter((itm) => {
                    return !selecetedArr.includes(itm)
                  }).forEach((itm, idx) => {
                    resInfo.forEach((list) => {
                      if (itm === list.id) {
                        // console.log('可添加的项：', list);

                        this.dialogData.addArr[brandIdx - 1].storeList.push(list)
                      }
                    })
                  })
                }
              } else {
                this.dialogData.addArr[0].storeList = resInfo
              }

              for (let itm of resInfo) {
                if (this.dialogData.addArr[brandIdx - 1].storeId === itm.id) {
                  this.dialogData.addArr[brandIdx - 1].storeItm = itm
                }
              }

              if (this.insertType === 'field') {
                if (this.dialogData.addArr[brandIdx - 1].fieldId) {
                  this.dialogData.addArr[brandIdx - 1].fieldId = null
                  this.dialogData.addArr[brandIdx - 1].fieldItm = null
                }
              }
              // console.log('storeItm', this.dialogData.addArr[brandIdx - 1].storeItm, this.dialogData.addArr[brandIdx - 1]);
              break
          }

          // console.log('getStores', brandIdx);
        } else {
          this.setMsg('error', res.msg)
        }
      })
    },

    getFields(storeIdx) {
      var addArr = this.dialogData.addArr
      // console.log('getFields', addArr, storeIdx, addArr[storeIdx - 1]);

      cPassFindUseField({
        storeId: (this.insertType === 'title') ? this.dialogData.storeId : addArr[storeIdx - 1].storeId
      }).then(res => {
        if (res.status === 'true') {
          let resInfo = res.info
          switch (this.insertType) {
            case 'title':
              this.fieldList = resInfo
              break
            case 'field':
              if (storeIdx) {
                if (this.dialogData.addArr[storeIdx - 1].fieldId) {
                  this.dialogData.addArr[storeIdx - 1].fieldId = null
                }

                // 需要排除前面寻找的空间名
                this.dialogData.addArr[storeIdx - 1].fieldList = []
                let allIdArr = resInfo.map((list) => { return list.id })
                let selecetedArr = this.dialogData.addArr.map((list) => { return list.fieldId })

                console.log('allIdArr', allIdArr, 'selecetedArr', selecetedArr, this.dialogData.addArr)

                allIdArr.filter((itm) => {
                  return !selecetedArr.includes(itm)
                }).forEach((itm, idx) => {
                  resInfo.forEach((list) => {
                    if (itm === list.id) {
                      console.log('可添加的项：', list);

                      this.dialogData.addArr[storeIdx - 1].fieldList.push(list)
                    }
                  })
                })
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
