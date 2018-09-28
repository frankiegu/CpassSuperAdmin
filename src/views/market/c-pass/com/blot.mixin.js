
import { Quill } from 'vue-quill-editor' // 调用编辑器

let BlockEmbed = Quill.import('blots/block/embed')

// 分割线
class DividerBlot extends BlockEmbed {}
DividerBlot.blotName = 'divider'
DividerBlot.tagName = 'div'
DividerBlot.className = 'hr'

Quill.register(DividerBlot)

// 任意标题
class arbitrarilyTitle extends BlockEmbed {
  static create(data) {
    const node = super.create(data)
    node.innerHTML = data
    return node
  }
}
arbitrarilyTitle.blotName = 'titleArbitrarily'
arbitrarilyTitle.tagName = 'div'
arbitrarilyTitle.className = 'title-arbitrarily'
Quill.register(arbitrarilyTitle)

// 品牌标题
class brandTitle extends BlockEmbed {
  static create(data) {
    return `<div class="title-brand">品牌名</div>`
  }
}
brandTitle.blotName = 'titleBrand'
brandTitle.tagName = 'div'
brandTitle.className = 'title-brand'
Quill.register(brandTitle)

console.log('blot.js');

