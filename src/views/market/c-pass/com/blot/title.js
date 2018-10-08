
export function renderBrandTitle(brandItm) {
  if (typeof brandItm === 'boolean') return

  return `<img src="${brandItm.spaceLogo}">
          <div class="title-name">
            <span class="name">${brandItm.spaceName}</span>
            <p class="num">共${brandItm.storeCount || 0}个门店</p>
          </div>`
}

export function renderStoreTitle(storeItm) {
  if (typeof storeItm === 'boolean') return

  return `<img src="${storeItm.imgUrl}">
          <div class="title-name">
            <div class="name">${storeItm.storeName}</div>
          </div>`
}

export function renderFieldTitle(fieldItm) {
  if (typeof fieldItm === 'boolean') return

  return `<img src="${fieldItm.mainImgUrl}">
          <div class="title-name">
            <div class="name">${fieldItm.fieldName}</div>
          </div>`
}
