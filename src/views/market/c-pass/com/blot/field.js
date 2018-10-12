import { typeList } from '@/mixins/data/index'

export function renderFieldArrBlot(fieldData) {
  // console.log('renderFieldArrBlot');

  if (!fieldData.length) return ''
  let fieldArrDom = ''
  let fieldTypeDom
  // console.log('fieldData', fieldData);

  if (fieldData.length > 1) {
    fieldArrDom = `<div class="field-list">`
    for (const item of fieldData) {
      for (const itm of typeList) {
        if (item.fieldItm.fieldType === itm.key) {
          fieldTypeDom = `<span class="field-type ` + `type-${itm.key}"><span>${itm.label}</span></span>`
        }
      }

      fieldArrDom += `<div class="field-list-item field-flag" data-id="${item.fieldItm.id}">
        <div class="quill-field-img-wrapper">
          <img class="quill-field-img-wrapper" src="${item.fieldItm.mainImgUrl  + '?x-oss-process=image/resize,l_640'}">
        </div>
        <div class="quill-field-name">${item.fieldItm.fieldName}</div>
        ${fieldTypeDom}
        <div class="quill-field-price">
          <span class="quill-field-price-num">¥${item.fieldItm.minPrice === item.fieldItm.maxPrice ? item.fieldItm.minPrice : item.fieldItm.minPrice + '-'  + item.fieldItm.maxPrice}</span>
          <span class="quill-field-price-unit">${item.fieldItm.fieldType === 5 ? '元/月' : (item.fieldItm.fieldType === 3 ? '元/天' : '元/小时')}</span>
        </div>
      </div>`
    }

    fieldArrDom += `</div>`
    // console.log('fieldArrDom', fieldArrDom);
  } else {
    const fieldItm = fieldData[0].fieldItm
    for (const itm of typeList) {
      if (fieldItm.fieldType === itm.key) {
        fieldTypeDom = `<span class="field-type ` + `type-${itm.key}"><span>${itm.label}</span></span>`
      }
    }
    // 单个
    fieldArrDom = `<div class="field-one">
      <div class="field-one-item field-flag" data-id="${fieldItm.id}">
        <div class="item-pic">
          <img src="${fieldItm.mainImgUrl  + '?x-oss-process=image/resize,l_640'}">
        </div>

        <div class="item-brief">
          <div class="activity-address">
            <span class="distance">
              ${fieldTypeDom}
              <span class="city-name">${fieldItm.cityName}</span>
              <span class="field-distance-unique">·距您${fieldItm.distance ? fieldItm.distance : '-m'}</span>
            </span>
            <span class="price">
              <span class="price-statics">¥${fieldItm.priceRange || 0}</span>
              <span class="text">${fieldItm.fieldType === 5 ? '元/月' : (fieldItm.fieldType === 3 ? '元/天' : '元/小时')}</span>
            </span>
          </div>

          <div class="book-info">
            <h3 class="brief-title">${fieldItm.fieldName}</h3>
            <div class="activity-time">
              ${fieldItm.area}㎡${(fieldItm.maxAdmissibleNum !== null) ? `<span>
                  ${(fieldItm.fieldType === 1 || fieldItm.fieldType === 2 || fieldItm.fieldType === 4) ? `<span>·可容纳${fieldItm.maxAdmissibleNum}人</span>` : ''}
                  ${(fieldItm.fieldType === 3 || fieldItm.fieldType === 6 || fieldItm.fieldType === 5) ? `<span>·${fieldItm.maxAdmissibleNum}个工位</span>` : ''}
                </span>
              ` : ''}
              ${fieldItm.storeName ? `<span>·${fieldItm.storeName}</span>` : ''}
            </div>

            <div class="book-btn" style="display: none">预定</div>
          </div>
        </div>
      </div>
    </div>`
  }

  return fieldArrDom
}
