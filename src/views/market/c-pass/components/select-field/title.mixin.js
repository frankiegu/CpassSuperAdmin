export default {
  methods: {
    selectTitleType() {
      console.log('selectTitleType', this.dialogData);

      switch (this.dialogData.titleType) {
        case 'brand':
        case 'store':
        case 'field':
          this.getSpaces()
          break
        case 'arbitrarily':
          break
      }

      // 切换为更大条件的时候，需要请求下一个条件列表
      switch (this.dialogData.titleType) {
        case 'store':
          // 会出现上次切换类型已经保存数据，但是后续切换保留了上次的数据
          if (this.dialogData.brandId) {
            this.getStores()
          }
          break
        case 'field':
          if (this.dialogData.brandId) {
            this.getStores()
          }
          if (this.dialogData.storeId) {
            this.getFields()
          }
          break
        case 'brand':
        case 'arbitrarily':
          break
      }
    },

    selectBrandId() {
      console.log('selectBrandId', this.dialogData.titleType);

      // 切换前置条件，清空后置条件
      if (this.dialogData.storeId) {
        this.dialogData.storeId = null
      }
      if (this.dialogData.fieldId) {
        this.dialogData.fieldId = null
      }

      // 如果有子，就请求
      switch (this.dialogData.titleType) {
        case 'store':
        case 'field':
          this.getStores()
          break
        case 'brand':
        case 'arbitrarily':
          break
      }
    },

    selectStoreId() {
      // 切换前置条件，清空后置条件
      if (this.dialogData.fieldId) {
        this.dialogData.fieldId = null
      }

      // 如果有子，就请求
      switch (this.dialogData.titleType) {
        case 'field':
          this.getFields()
          break
        case 'store':
        case 'brand':
        case 'arbitrarily':
          break
      }
    }
  }
}
