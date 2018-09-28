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
      console.log('closeTeamDialog', insertData);
      this.showInsert = false

      switch (this.insertType) {
        case 'title':
          this.handleInsertTitle(insertData)
          break
        case 'store':
          break
        case 'field':
          break
      }
    },
    handleInsertTitle(insertData) {
      let range = this.editor.getSelection(true)
      let len = range.index
      this.editor.insertEmbed(len, 'title', insertData, this.quill.sources.USER)
      this.editor.setSelection(len + 1, this.quill.sources.SILENT)
    }
  }
}
