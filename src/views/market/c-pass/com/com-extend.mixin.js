export default {
  methods: {
    closeDialog() {
      console.log('closeDialog');

      this.showPreview = false
    },
    showInsertDialog(type) {
      if (this.noAllow) return

      this.showInsert = true
      this.insertType = type
      switch (type) {
        case 'title':
          break
        case 'store':
          break
        case 'field':
          break
      }

      console.log('type', this.insertType);
    },

    closeInsertDialog(insertData) {
      console.log('closeInsertDialog', insertData);
      this.showInsert = false

      switch (this.insertType) {
        case 'title':
          switch (insertData.titleType) {
            case 'brand':
              this.handleInsertBrandTitle(insertData.brandId)
              break
            case 'store':
              break
            case 'field':
              break
            case 'arbitrarily':
              this.handleInsertArbitrarilyTitle(insertData.arbitrarilyName)
              break
          }
          break
        case 'store':
          break
        case 'field':
          break
      }
    },
    handleInsertBrandTitle(brandId) {
      let range = this.editor.getSelection(true)
      let len = range.index
      this.editor.insertEmbed(len, 'titleBrand', brandId, this.quill.sources.USER)
      this.editor.setSelection(len + 1, this.quill.sources.SILENT)
    },
    handleInsertArbitrarilyTitle(arbitrarilyName) {
      let range = this.editor.getSelection(true)
      let len = range.index
      this.editor.insertEmbed(len, 'titleArbitrarily', arbitrarilyName, this.quill.sources.USER)
      this.editor.setSelection(len + 1, this.quill.sources.SILENT)
    }
  }
}
