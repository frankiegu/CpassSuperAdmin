export default {
  methods: {
    selectTitleType() {
      console.log('selectTitleType');
    },
    selectSpaceId() {
      if (this.dialogData.storeId) {
        this.dialogData.storeId = null
      }
      if (this.dialogData.fieldId) {
        this.dialogData.fieldId = null
      }
      this.getStores()
    },
    selectStoreId(data) {
      if (this.dialogData.fieldId) {
        this.dialogData.fieldId = null
      }
      this.getFields()
    }
  }
}
