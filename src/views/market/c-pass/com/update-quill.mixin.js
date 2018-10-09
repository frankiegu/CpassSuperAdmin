import { $ } from '@/config/utils'
import { cPassFindUseStore, cPassFindUseField, cPassFindUseSpace } from '@/service/market'

import { typeList } from '@/mixins/data/index'
import imgEmpty from './imgs/store-img-empty.png'
import meeting from './imgs/meeting.png'
import station from './imgs/station.png'

export default {
  methods: {
    replaceDom() {
      const quillDom = $('.copy-quill-con')[0].innerHTML
      $('.ql-editor')[0].innerHTML = quillDom
      $('.p-con')[0].innerHTML = quillDom

      this.quillLoading = false
    },

    // 更新二级标题
    updateTitle() {
      // 更新品牌 标题
      const titleBrandDom = $('.copy-quill-con .title-brand')
      if (titleBrandDom.length) {
        cPassFindUseSpace().then(res => {
          if (res.status === 'true') {
            this.updateSpaces = res.info

            for (let list of titleBrandDom) {
              this.updateSpaces.forEach((brandItm, idx) => {
                if (list.dataset.id == brandItm.id) {
                  // console.log('brandItm---brand', brandItm);

                  $('.copy-quill-con .title-brand')[idx].innerHTML = `<img src="${brandItm.spaceLogo}">
                  <div class="title-name">
                    <span class="name">${brandItm.spaceName}</span>
                    <div class="num">共${brandItm.storeCount || 0}个门店</div>
                  </div>`
                }
              })
            }

            // 替换dom
            this.replaceDom()
          } else {
            this.setMsg('error', res.msg)
          }
        })
      }

      // 更新空间 标题
      const titleStore = $('.copy-quill-con .title-store')
      if (titleStore.length) {
        let storeArr = titleStore.map((list) => { return list.dataset.id })

        this.getStore(storeArr).then((storesData) => {
          // console.log('storesData', storeArr, storesData);

          storesData.forEach((storeItm, idx) => {
            $('.copy-quill-con .title-store')[idx].innerHTML = `<img src="${storeItm.imgUrl}">
            <div class="title-name">
              <div class="name">${storeItm.storeName}</div>
            </div>`
          })
        })
      }

      // 更新场地 标题
      const titleField = $('.copy-quill-con .title-field')
      if (titleField.length) {
        let fieldArr = titleField.map((list) => { return list.dataset.id })

        this.getFields(fieldArr).then((filedData) => {
          // console.log('filedData', fieldArr, filedData);

          filedData.forEach((fieldItm, idx) => {
            $('.copy-quill-con .title-field')[idx].innerHTML = `<img src="${fieldItm.mainImgUrl}">
            <div class="title-name">
              <div class="name">${fieldItm.fieldName}</div>
            </div>`
          })
        })
      }
    },

    // 更新空间链接
    updateStore() {
      const storeItemDom = $('.copy-quill-con .store-item')

      if (storeItemDom.length) {
        let storeArr = storeItemDom.map((list) => { return list.dataset.id })

        this.getStore(storeArr).then((storesData) => {
          // console.log('updateStore', storeArr, storesData);

          storesData.forEach((item, idx) => {
            let storeArrDom = ''
            let imgDom
            let distanceDom

            // 空态图
            imgDom = ''
            if (item.imgUrl) {
              imgDom = `<img class="store-img" src="${item.imgUrl + '?x-oss-process=image/resize,l_640'}" />`
            } else {
              imgDom = `<img class="store-img" src="${imgEmpty}" />`
            }

            // 静态icon
            distanceDom = `<div class="distance">距您${item.distance ? item.distance : '-m'}</div>`

            storeArrDom += (`<div class="img-wrapper">${imgDom}</div>
              <div class="name">${item.storeName}</div>
              <div class="addr">${item.cityName}${item.districtName}${item.address}</div>

              <div class="device">
                <div class="field-num">
                  <div class="meeting">
                    <img class="meeting-icon" src="${meeting}">
                    <span>${item.meetingCount || 0}</span>
                  </div>
                  <div class="station">
                    <img class="station-icon" src="${station}">
                    <span>${item.stationCount || 0}</span>
                  </div>
                </div>
                ${distanceDom}
              </div>`)

            // console.log('idx', idx);

            $('.copy-quill-con .store-item')[idx].innerHTML = storeArrDom
          })
        })
      }
    },

    updateFieldOne() {
      const fieldOne = $('.copy-quill-con .field-one-item')
      if (fieldOne.length) {
        let fieldArr = fieldOne.map((list) => { return list.dataset.id })

        this.getFields(fieldArr).then((fieldData) => {
          // console.log('fieldData', fieldArr, fieldData);

          fieldData.forEach((fieldItm, idx) => {
            let fieldArrDom = ''
            let fieldTypeDom = ''

            for (const itm of typeList) {
              if (fieldItm.fieldType === itm.key) {
                fieldTypeDom = `<span class="field-type ` + `type-${itm.key}"><span>${itm.label}</span></span>`
              }
            }
            // 单个
            fieldArrDom = `<div class="item-pic">
                <img src="${fieldItm.mainImgUrl  + '?x-oss-process=image/resize,l_640'}">
              </div>

              <div class="item-brief">
                <div class="activity-address">
                  <span class="distance">
                    ${fieldTypeDom}
                    <span class="city-name">${fieldItm.cityName}</span>
                    <span>·距您${fieldItm.distance ? fieldItm.distance : '-m'}</span>
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
              </div>`

            $('.copy-quill-con .field-one-item')[idx].innerHTML = fieldArrDom
          })
        })
      }
    },

    updateFieldList() {
      const fieldList = $('.copy-quill-con .field-list-item')
      if (fieldList.length) {
        let fieldArr = fieldList.map((list) => { return list.dataset.id })

        this.getFields(fieldArr).then((fieldData) => {
          // console.log('updateFieldList', fieldArr, fieldData);

          let fieldTypeDom = ''
          let fieldArrDom = ''
          fieldData.forEach((fieldItm, idx) => {
            fieldArrDom = ''

            for (const itm of typeList) {
              if (fieldItm.fieldType === itm.key) {
                fieldTypeDom = `<span class="field-type ` + `type-${itm.key}"><span>${itm.label}</span></span>`
              }
            }

            fieldArrDom += `<div class="quill-field-img-wrapper">
                <img class="quill-field-img-wrapper" src="${fieldItm.mainImgUrl  + '?x-oss-process=image/resize,l_640'}">
              </div>
              <div class="quill-field-name">${fieldItm.fieldName}</div>
              ${fieldTypeDom}
              <div class="quill-field-price">
                <span class="quill-field-price-num">¥${fieldItm.minPrice === fieldItm.maxPrice ? fieldItm.minPrice : fieldItm.minPrice + '-'  + fieldItm.maxPrice}</span>
                <span class="quill-field-price-unit">${fieldItm.fieldType === 5 ? '元/月' : (fieldItm.fieldType === 3 ? '元/天' : '元/小时')}</span>
              </div>`

            $('.copy-quill-con .field-list-item')[idx].innerHTML = fieldArrDom
          })
        })
      }
    },

    updateData() {
      this.updateTitle()
      this.updateStore()
      this.updateFieldOne()
      this.updateFieldList()

      // 替换dom
      setTimeout(_ => {
        this.replaceDom()
      }, 1000)
    },

    async getStore(spaceIds) {
      const res = await cPassFindUseStore({ storeIds: spaceIds })
      if (res.status === 'true') {
        return res.info
      } else {
        this.setMsg('error', res.msg)
      }
    },

    async getFields(fieldIds) {
      const res = await cPassFindUseField({ fieldIds: fieldIds })
      if (res.status === 'true') {
        return res.info
      } else {
        this.setMsg('error', res.msg)
      }
    }
  }
}
