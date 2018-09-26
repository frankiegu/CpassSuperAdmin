// 最好的去重，就是已选的选项不展示在列表中
export default {
  methods: {
    handleBrandId(brandIdx) {
      console.log('handleBrandId', this.insertType, brandIdx);

      // 切换前置条件，清空后置条件
      if (this.dialogData.addArr[brandIdx - 1].storeId) {
        this.dialogData.addArr[brandIdx - 1] = null
      }

      this.getStores(brandIdx)

      if (this.insertType === 'field' && this.dialogData.addArr[brandIdx - 1].fieldId) {
        this.dialogData.addArr[brandIdx - 1] = null
      }
    },

    handleStoreId(storeIdx) {
      console.log('handleStoreId', this.insertType, storeIdx);

      // 切换前置条件，清空后置条件
      if (this.dialogData.addArr[storeIdx - 1].fieldId) {
        this.dialogData.addArr[storeIdx - 1] = null
      }

      if (this.insertType !== 'title') {
        this.getFields(storeIdx)
      }
    },

    delThisStore(idx) {
      this.dialogData.addArr.splice(idx, 1)
    },

    // 空间 or 场地
    addStoreField() {
      if (this.dialogData.addArr.length <= 4) {
        // 添加新空间时，品牌名继承上一空间的品牌名
        // （便于快速添加同一品牌下的所有空间）
        const addArr = this.dialogData.addArr[this.dialogData.addArr.length - 1]
        let data = {
          brandId: null,
          storeId: null,
          fieldId: null,
          brandList: [],
          storeList: [],
          fieldList: []
        }

        switch (this.insertType) {
          case 'store':
            data.brandId = addArr.brandId
            data.brandList = addArr.brandList

            let storeList = []
            for (const itm of addArr.storeList) {
              // 只要添加的下一个，去除前一个添加的id即可去重
              if (itm.id !== addArr.storeId) {
                storeList.push(itm)
              }
            }
            data.storeList = storeList
            break
          case 'field':
            data.brandId = addArr.brandId
            data.brandList = addArr.brandList

            data.storeId = addArr.storeId
            data.storeList = addArr.storeList

            let fieldList = []
            for (const itm of addArr.fieldList) {
              // 只要添加的下一个，去除前一个添加的id即可去重
              if (itm.id !== addArr.fieldId) {
                fieldList.push(itm)
              }
            }
            data.fieldList = fieldList
            break
          case 'title':
            break
        }
        this.dialogData.addArr.push(data)
      }
    }
  }
}
