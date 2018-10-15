// 最好的去重，就是已选的选项不展示在列表中
export default {
  methods: {
    handleBrandId(brandIdx) {
      // console.log('handleBrandId', this.insertType, brandIdx, this.dialogData.addArr[brandIdx - 1]);

      this.getStores(brandIdx)

      // 切换前置条件，清空后置条件
      if (this.dialogData.addArr[brandIdx - 1].storeId) {
        this.clearSelectedStoreData(brandIdx - 1)
      }
    },

    handleStoreId(storeIdx) {
      const itm = this.dialogData.addArr[storeIdx - 1]
      // console.log('handleStoreId', this.insertType, storeIdx, itm, this.dialogData.addArr[storeIdx - 1]);

      for (const list of itm.storeList) {
        if (itm.storeId === list.id) {
          this.dialogData.addArr[storeIdx - 1].storeItm = list
        }
      }

      // 切换前置条件，清空后置条件
      if (this.insertType === 'field') {
        this.getFields(storeIdx)
      }
    },

    handleFieldId(fieldIdx) {
      const itm = this.dialogData.addArr[fieldIdx - 1]
      // console.log('handleFieldId', this.insertType, fieldIdx, itm);

      for (const list of itm.fieldList) {
        if (itm.fieldId === list.id) {
          this.dialogData.addArr[fieldIdx - 1].fieldItm = list
        }
      }
      // console.log('fieldItm', this.dialogData.addArr[fieldIdx - 1]);
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
          storeItm: null,
          fieldId: null,
          fieldItm: null,
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
    },

    clearSelectedStoreData(idx) {
      this.dialogData.addArr[idx].storeId = null
      this.dialogData.addArr[idx].storeItm = null
    }
  }
}
