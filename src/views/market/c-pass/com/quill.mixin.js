
export default {
  methods: {
    insertDivider() {
      console.log('insertDivider');
      let range = this.editor.getSelection(true)
      let len = range.index;
      this.editor.insertEmbed(len, 'divider', true, this.quill.sources.USER)
      this.editor.setSelection(len + 1, this.quill.sources.SILENT)
    },
    // 富文本插入图片
    quillHandleAvatarSuccess(res, file) {
      if (res.code === '200' && res.info.path !== null) {
        let range = this.editor.getSelection()
        let length = range.index;
        this.editor.insertEmbed(length, 'image', res.info.path)
        this.editor.setSelection(length + 1)
      }
      this.quillUploadImg = false
    },
    // 富文本框上传图片前
    quillBeforeUploadImg() {
      this.quillUploadImg = true
    },
    // 富文本框上传图片失败
    quillUploadImgError() {
      this.quillUploadImg = false
      this.setMsg('error', '上传图片失败')
    }
  }
}
