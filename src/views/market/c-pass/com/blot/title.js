
export function renderBrandTitle(brandItm) {
  return `<img src="${brandItm.spaceLogo}">
          <div class="title-name">
            <div class="name">${brandItm.spaceName}</div>
            <div class="num">共${brandItm.storeCount || 0}个门店</div>
          </div>`
}

export function renderStoreTitle(storeItm) {
  return `<img src="${storeItm.imgUrl}">
          <div class="title-name">
            <div class="name">${storeItm.storeName}</div>
          </div>`
}

export function renderFieldTitle(fieldItm) {
  return `<img src="${fieldItm.mainImgUrl}">
          <div class="title-name">
            <div class="name">${fieldItm.fieldName}</div>
          </div>`
}
