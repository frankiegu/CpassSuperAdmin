
export default {
  methods: {
    delThisStore(idx) {
      this.dialogData.addStoreList.splice(idx, 1)
    },
    addStore() {
      if (this.dialogData.addStoreList.length <= 4) {
        // 添加新空间时，品牌名继承上一空间的品牌名
        // （便于快速添加同一品牌下的所有空间）
        const len = this.dialogData.addStoreList.length - 1
        this.dialogData.addStoreList.push({
          bandId: this.dialogData.addStoreList[len].bandId,
          storeId: '',
          sStoreList: this.dialogData.addStoreList[len].sStoreList
        })
      }
    }
  }
}
