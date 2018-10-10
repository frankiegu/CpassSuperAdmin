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

    // 更新品牌 标题
    async updateTitleBrand() {
      const titleBrandDom = $('.copy-quill-con .title-brand')
      if (titleBrandDom.length) {
        let res = await cPassFindUseSpace()
        if (res.status === 'true') {
          this.updateSpaces = res.info

          // 请求接口的数据，已下架或已删除，请求则不返回，数量就会减少，所以以详情返回内容为大条件
          titleBrandDom.forEach((list, i) => {
            this.updateSpaces.forEach((brandItm, idx) => {
              // console.log('未关闭的项 brandItm---brand', titleBrandDom.length, titleBrandDom, brandItm);
              if (list.dataset.id == brandItm.id) {
                $('.copy-quill-con .title-brand')[idx].innerHTML = `<img src="${brandItm.spaceLogo}">
                <div class="title-name">
                  <span class="name">${brandItm.spaceName}</span>
                  <div class="num">共${brandItm.storeCount || 0}个门店</div>
                </div>`
              }
            })
          })

          // 关闭的项
          if (titleBrandDom.length != this.updateSpaces.length) {
            let brandArr = titleBrandDom.map((list) => { return Number(list.dataset.id) })
            let updateArr = this.updateSpaces.map((list) => { return list.id })

            brandArr.filter((x) => {
              return !updateArr.includes(x)
            }).forEach((itm, i) => {
              titleBrandDom.forEach((list, i) => {
                if (itm == list.dataset.id) {
                  list.innerHTML = list.innerHTML + `<div class="quill-close">已关闭</div>`
                  // console.log('已关闭的品牌标题', list);
                }
              })
            })
          }
        } else {
          this.setMsg('error', res.msg)
        }
      }
    },

    // 更新空间 标题
    async updateTitleStore() {
      const titleStore = $('.copy-quill-con .title-store')
      if (titleStore.length) {
        let storeArr = titleStore.map((list) => { return list.dataset.id })

        let storesData = await this.getStore(storeArr)
        // console.log('storesData', storeArr, storesData);
        storeArr.forEach((list, i) => {
          storesData.forEach((storeItm, idx) => {
            // 未关闭的项
            if (list == storeItm.id) {
              $('.copy-quill-con .title-store')[idx].innerHTML = `<img src="${storeItm.imgUrl}">
              <div class="title-name">
                <div class="name">${storeItm.storeName}</div>
              </div>`
            }
          })
        })

        if (titleStore.length != storesData.length) {
          let storeArr = titleStore.map((list) => { return Number(list.dataset.id) })
          let updateArr = storesData.map((list) => { return list.id })

          storeArr.filter((x) => {
            return !updateArr.includes(x)
          }).forEach((itm, idx) => {
            titleStore.forEach((list, i) => {
              if (itm == list.dataset.id) {
                list.innerHTML = list.innerHTML + `<div class="quill-close">已关闭的空间标题</div>`
                // console.log('已关闭的空间标题', list.dataset.id, list);
              }
            })
          })
        }
      }
    },

    // 更新场地 标题
    async updateTitleField() {
      const titleField = $('.copy-quill-con .title-field')
      if (titleField.length) {
        let fieldArr = titleField.map((list) => { return Number(list.dataset.id) })

        let filedData = await this.getFields(fieldArr)
        // console.log('filedData', fieldArr, filedData);

        filedData.forEach((fieldItm, idx) => {
          if (fieldArr[idx] == fieldItm.id) {
            $('.copy-quill-con .title-field')[idx].innerHTML = `<img src="${fieldItm.mainImgUrl}">
            <div class="title-name">
              <div class="name">${fieldItm.fieldName}</div>
            </div>`
          }
        })

        if (titleField.length != filedData.length) {
          let updateArr = filedData.map((list) => { return list.id })
          fieldArr.filter((x) => {
            return !updateArr.includes(x)
          }).forEach((itm, idx) => {
            titleField.forEach((list, i) => {
              if (itm == list.dataset.id) {
                list.innerHTML = list.innerHTML + `<div class="quill-close">已关闭的场地标题</div>`
                // console.log('已关闭的场地标题', list.dataset.id, list);
              }
            })
          })
        }
      }
    },

    // 更新空间链接
    async updateStore() {
      const storeItemDom = $('.copy-quill-con .store-item')

      if (storeItemDom.length) {
        let storeArr = storeItemDom.map((list) => { return Number(list.dataset.id) })
        let storesData = await this.getStore(storeArr)
        storesData.forEach((item, idx) => {
          // console.log('未关闭空间', storeItemDom.length, storesData[idx].id, storeItemDom[idx], storeArr);

          if (item.id == storeArr[idx]) {
            let storeArrDom = ''
            let imgDom
            let distanceDom

            // 空态图
            imgDom = ''
            if (storesData[idx].imgUrl) {
              imgDom = `<img class="store-img" src="${storesData[idx].imgUrl + '?x-oss-process=image/resize,l_640'}" />`
            } else {
              imgDom = `<img class="store-img" src="${imgEmpty}" />`
            }

            // 静态icon
            distanceDom = `<div class="distance">距您${storesData[idx].distance ? storesData[idx].distance : '-m'}</div>`

            storeArrDom += (`<div class="img-wrapper">${imgDom}</div>
              <div class="name">${storesData[idx].storeName}</div>
              <div class="addr">${storesData[idx].cityName}${storesData[idx].districtName}${storesData[idx].address}</div>

              <div class="device">
                <div class="field-num">
                  <div class="meeting">
                    <img class="meeting-icon" src="${meeting}">
                    <span>${storesData[idx].meetingCount || 0}</span>
                  </div>
                  <div class="station">
                    <img class="station-icon" src="${station}">
                    <span>${storesData[idx].stationCount || 0}</span>
                  </div>
                </div>
                ${distanceDom}
              </div>`)

            // console.log('idx', idx);

            $('.copy-quill-con .store-item')[idx].innerHTML = storeArrDom
          }
        })

        if (storeItemDom.length != storesData.length) {
          let updateArr = storesData.map((list) => { return list.id })

          storeArr.filter((x) => {
            return !updateArr.includes(x)
          }).forEach((itm, idx) => {
            storeItemDom.forEach((list, i) => {
              if (itm == list.dataset.id) {
                list.innerHTML = list.innerHTML + `<div class="quill-close">已关闭</div>`
                // console.log('已关闭的空间链接', list.dataset.id, isClose, updateArr, storeArr, list);
              }
            })
          })
        }
      }
    },

    async updateFieldOne() {
      const fieldOneDom = $('.copy-quill-con .field-one-item')
      if (fieldOneDom.length) {
        var fieldArr = fieldOneDom.map((list) => { return Number(list.dataset.id) })
        let fieldData = await this.getFields(fieldArr)
        // console.log('fieldData', fieldArr, fieldData);

        fieldData.forEach((fieldItm, idx) => {
          if (fieldArr[idx] == fieldItm.id) {
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
          }
        })

        if (fieldOneDom.length != fieldData.length) {
          let updateArr = fieldData.map((list) => { return list.id })

          fieldArr.filter((x) => {
            return !updateArr.includes(x)
          }).forEach((itm, idx) => {
            fieldOneDom.forEach((list, i) => {
              if (itm == list.dataset.id) {
                list.innerHTML = list.innerHTML + `<div class="quill-close">已关闭</div>`
                // console.log('已关闭的单个场地链接', list.dataset.id);
              }
            })
          })
        }
      }
    },

    async updateFieldList() {
      const fieldListDom = $('.copy-quill-con .field-list-item')
      if (fieldListDom.length) {
        let fieldArr = fieldListDom.map((list) => { return Number(list.dataset.id) })

        let fieldData = await this.getFields(fieldArr)
        // console.log('updateFieldList', fieldArr, fieldData);

        let fieldTypeDom = ''
        let fieldArrDom = ''
        fieldData.forEach((fieldItm, idx) => {
          if (fieldArr[idx] != fieldItm.id) {
            // $('.copy-quill-con .field-list-item')[idx].insertAfter(``)
          } else {
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
          }
        })

        if (fieldListDom.length != fieldData.length) {
          let updateArr = fieldData.map((list) => { return list.id })

          fieldArr.filter((x) => {
            return !updateArr.includes(x)
          }).forEach((itm, idx) => {
            fieldListDom.forEach((list, i) => {
              if (itm == list.dataset.id) {
                list.innerHTML = list.innerHTML + `<div class="quill-close">已关闭</div>`
                // console.log('已关闭的场地链接', list.dataset.id);
              }
            })
          })
        }
      }
    },

    updateData() {
      // 更新标题
      this.updateTitleBrand()
      this.updateTitleField()
      this.updateTitleStore()

      this.updateStore()
      this.updateFieldOne()
      this.updateFieldList()

      // 替换dom
      setTimeout(_ => {
        this.replaceDom()
      }, 1500)
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
