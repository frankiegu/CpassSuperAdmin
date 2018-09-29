
import { Quill } from 'vue-quill-editor' // 调用编辑器
import { renderBrandTitle, renderStoreTitle, renderFieldTitle } from './title'

let BlockEmbed = Quill.import('blots/block/embed')

// 分割线
class DividerBlot extends BlockEmbed {}
DividerBlot.blotName = 'divider'
DividerBlot.tagName = 'div'
DividerBlot.className = 'hr'

Quill.register(DividerBlot)

// 任意标题
class ArbitrarilyTitle extends BlockEmbed {
  static create(data) {
    const node = super.create()
    node.innerHTML = data
    return node
  }
}
ArbitrarilyTitle.blotName = 'titleArbitrarily'
ArbitrarilyTitle.tagName = 'div'
ArbitrarilyTitle.className = 'title-arbitrarily'
Quill.register(ArbitrarilyTitle)

// 品牌标题
class BrandTitle extends BlockEmbed {
  static create(brandItm) {
    const node = super.create()
    node.dataset.id = brandItm.id
    node.innerHTML = renderBrandTitle(brandItm)
    console.log('node', node)

    return node
  }
}
BrandTitle.blotName = 'titleBrand'
BrandTitle.tagName = 'div'
BrandTitle.className = 'title-brand'
Quill.register(BrandTitle)

// 空间标题
class StoreTitle extends BlockEmbed {
  static create(storeItm) {
    const node = super.create()
    node.dataset.id = storeItm.id
    node.innerHTML = renderStoreTitle(storeItm)
    console.log('storeTitle-node', node)
    return node
  }
}
StoreTitle.blotName = 'titleStore'
StoreTitle.tagName = 'div'
StoreTitle.className = 'title-store'
Quill.register(StoreTitle)

// 场地标题
class FieldTitle extends BlockEmbed {
  static create(fieldItm) {
    const node = super.create()
    node.dataset.id = fieldItm.id
    node.innerHTML = renderFieldTitle(fieldItm)
    console.log('fieldTitle-node', node)

    return node
  }
}
FieldTitle.blotName = 'titleField'
FieldTitle.tagName = 'div'
FieldTitle.className = 'title-field'
Quill.register(FieldTitle)

