
export default {
  methods: {
    handleQuillImage() {
      this.$nextTick(_ => {
        let toolbar = this.$refs.myQuillEditor.quill.getModule('toolbar')
        toolbar.addHandler('image', (value) => {
          if (value) {
            document.querySelector('.quill-upload input').click()
          } else {
            this.quill.format('image', false)
          }
        })
      })
    },
    // 富文本框上传图片前
    quillBeforeUploadImg() {
      this.quillUploadImg = true
    },
    // 富文本框上传图片失败
    quillUploadImgError() {
      this.quillUploadImg = false
      this.setMsg('error', '上传图片失败')
    },
    // 富文本插入图片
    quillHandleAvatarSuccess(res, file) {
      // console.log('res, file', res, file);

      if (res.code === '200' && res.info.path !== null) {
        let range = this.editor.getSelection()
        let length = range.index;
        this.editor.insertEmbed(length, 'image', res.info.path)
        this.editor.setSelection(length + 1)
      }

      this.quillUploadImg = false
    },

    uploadImg(val) {
      this.formData.bannerPath = val
      this.verifyImage()
    },
    verifyImage() {
      this.verifyImg = !this.formData.bannerPath ? '请上传活动banner' : ''
    },
    onTextChange({ editor, html, text }) {
      // console.log('test', editor, html, text);
      text = text.trim()
      this.quillLength = text.length
      this.verifyContent()
    },
    verifyContent() {
      this.verifyCon = !this.formData.content ? '精选内容不能为空' : (this.quillLength > this.quillMaxLength) ? '字数超限，无法提交' : ''
    },

    /* 插入blot */
    insertDivider() {
      // console.log('insertDivider');
      let range = this.editor.getSelection(true)
      let len = range.index;
      this.editor.insertEmbed(len, 'divider', true)
      this.editor.setSelection(len + 1)
    },

    handleInsertFields(fieldArr) {
      let range = this.editor.getSelection(true)
      let len = range.index
      this.editor.insertEmbed(len, 'fieldArr', fieldArr)
      this.editor.setSelection(len + 1)
    },

    handleInsertStores(storeArr) {
      let range = this.editor.getSelection(true)
      let len = range.index
      this.editor.insertEmbed(len, 'storeArr', storeArr)
      this.editor.setSelection(len + 1)
    },

    handleInsertFieldTitle(fieldItm) {
      let range = this.editor.getSelection(true)
      let len = range.index
      this.editor.insertEmbed(len, 'titleField', fieldItm)
      this.editor.setSelection(len + 1)
    },

    handleInsertStoreTitle(storeItm) {
      let range = this.editor.getSelection(true)
      let len = range.index
      this.editor.insertEmbed(len, 'titleStore', storeItm)
      this.editor.setSelection(len + 1)
    },

    handleInsertBrandTitle(brandItm) {
      let range = this.editor.getSelection(true)
      let len = range.index
      this.editor.insertEmbed(len, 'titleBrand', brandItm)
      this.editor.setSelection(len + 1)
    },

    handleInsertArbitrarilyTitle(arbitrarilyName) {
      let range = this.editor.getSelection(true)
      let len = range.index
      this.editor.insertEmbed(len, 'titleArbitrarily', arbitrarilyName)
      this.editor.setSelection(len + 1)
    }
  }
}
