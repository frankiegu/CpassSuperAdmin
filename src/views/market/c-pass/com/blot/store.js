import imgEmpty from '../imgs/store-img-empty.png'
import meeting from '../imgs/meeting.png'
import station from '../imgs/station.png'

export function renderStoreArrBlot(storeArr) {
  if (!storeArr.length) return ''
  let storeArrDom = ''
  let imgDom = ''
  let distanceDom = ''

  for (const item of storeArr) {
    console.log('storeArr----item', item.storeItm);

    // 空态图
    imgDom = ''
    if (item.storeItm.imgUrl) {
      imgDom = `<img class="store-img" src="${item.storeItm.imgUrl + '?x-oss-process=image/resize,l_640'}" />`
    } else {
      imgDom = `<img class="store-img" src="${imgEmpty}" />`
    }

    // 静态icon
    distanceDom = `<div class="distance">距您${item.storeItm.distance ? item.storeItm.distance : '-m'}</div>`

    storeArrDom += (`<div class="store-item" data-id="${item.storeItm.id}">
      <div class="img-wrapper">${imgDom}</div>
      <div class="name">${item.storeItm.storeName}</div>
      <div class="addr">${item.storeItm.cityName}${item.storeItm.districtName}${item.storeItm.address}</div>

      <div class="device">
        <div class="field-num">
          <div class="meeting">
            <img class="meeting-icon" src="${meeting}">
            <span>${item.storeItm.meetingCount || 0}</span>
          </div>
          <div class="station">
            <img class="station-icon" src="${station}">
            <span>${item.storeItm.stationCount || 0}</span>
          </div>
        </div>
        ${distanceDom}
      </div>
    </div>`)

    console.log('storeArrDom', storeArrDom);
  }

  return storeArrDom
}
