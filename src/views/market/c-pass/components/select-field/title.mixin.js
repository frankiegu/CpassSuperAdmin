export default {
  methods: {
    selectTitleType() {
      // console.log('selectTitleType', this.dialogData);
      if (this.dialogData.titleType !== 'arbitrarily') {
        this.getSpaces()
      }

      // 切换为更大条件的时候，需要请求下一个条件列表
      switch (this.dialogData.titleType) {
        case 'store':
          // console.log('0', Boolean(this.dialogData.brandId));
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
      // console.log('selectBrandId', this.dialogData.titleType);

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
      }

      if (this.dialogData.titleType != 'arbitrarily') {
        for (let itm of this.brandList) {
          // console.log('itm', this.dialogData.brandId, itm.id, this.dialogData.brandId == itm.id);

          if (this.dialogData.brandId == itm.id) {
            this.dialogData.brandItm = itm
          }
        }
      }

      // console.log('brandItm', this.dialogData.brandItm, this.dialogData.brandId, this.dialogData);
    },

    selectFieldId() {
      // console.log('selectFieldId');
      switch (this.insertType) {
        case 'title':
          for (let itm of this.fieldList) {
            if (this.dialogData.fieldId === itm.id) {
              this.dialogData.fieldItm = itm
            }
          }
          // console.log('fieldItm', this.dialogData.fieldItm);
          break
      }
    },

    selectStoreId() {
      // console.log('selectStoreid');

      // 切换前置条件，清空后置条件
      if (this.dialogData.fieldId) {
        this.dialogData.fieldId = null
      }

      // 如果有子，就请求
      if (this.dialogData.titleType == 'field') {
        this.getFields()
      }

      switch (this.dialogData.titleType) {
        case 'field':
        case 'store':
          for (let itm of this.storeList) {
            if (this.dialogData.storeId === itm.id) {
              this.dialogData.storeItm = itm
            }
          }
          // console.log('storeItm', this.dialogData.storeItm);
          break
      }
    }
  }
}
