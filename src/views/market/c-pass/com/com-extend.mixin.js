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

      if (!insertData) return

      switch (this.insertType) {
        case 'title':
          switch (insertData.titleType) {
            case 'brand':
              this.handleInsertBrandTitle(insertData.brandItm)
              break
            case 'store':
              this.handleInsertStoreTitle(insertData.storeItm)
              break
            case 'field':
              this.handleInsertFieldTitle(insertData.fieldItm)
              break
            case 'arbitrarily':
              this.handleInsertArbitrarilyTitle(insertData.arbitrarilyName)
              break
          }
          break
        case 'store':
          this.handleInsertStores(insertData.addArr)
          break
        case 'field':
          this.handleInsertFields(insertData.addArr)
          break
      }
    },

    handleInsertFields(fieldArr) {
      let range = this.editor.getSelection(true)
      let len = range.index
      this.editor.insertEmbed(len, 'fieldArr', fieldArr, this.quill.sources.USER)
      this.editor.setSelection(len + 1, this.quill.sources.SILENT)
    },

    handleInsertStores(storeArr) {
      let range = this.editor.getSelection(true)
      let len = range.index
      this.editor.insertEmbed(len, 'storeArr', storeArr, this.quill.sources.USER)
      this.editor.setSelection(len + 1, this.quill.sources.SILENT)
    },

    handleInsertFieldTitle(fieldItm) {
      let range = this.editor.getSelection(true)
      let len = range.index
      this.editor.insertEmbed(len, 'titleField', fieldItm, this.quill.sources.USER)
      this.editor.setSelection(len + 1, this.quill.sources.SILENT)
    },

    handleInsertStoreTitle(storeItm) {
      let range = this.editor.getSelection(true)
      let len = range.index
      this.editor.insertEmbed(len, 'titleStore', storeItm, this.quill.sources.USER)
      this.editor.setSelection(len + 1, this.quill.sources.SILENT)
    },

    handleInsertBrandTitle(brandItm) {
      let range = this.editor.getSelection(true)
      let len = range.index
      this.editor.insertEmbed(len, 'titleBrand', brandItm, this.quill.sources.USER)
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
