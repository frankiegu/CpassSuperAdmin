<template>
  <div class="spatial-info">
    <div class="page-title"> <h1>空间信息设置</h1> </div>

    <div class="form-box card-padding">
      <el-form
        :model="spatialInfo"
        ref="spatialInfo"
        :rules="ruleSpatialInfo"
        label-width="123px"
        class="demo-ruleForm"
        v-on:submit.native.prevent>
        <el-form-item label="空间名称" prop="spaceName">
          <el-input
            v-model.trim="spatialInfo.spaceName"
            :disabled="hanPermission"
            class="width210px"
            :maxlength="10"
            auto-complete="off"></el-input>
            &nbsp;&nbsp;
            <span class="theme-gray">限制字数 10</span>
        </el-form-item>

        <el-form-item label="空间标语" prop="spaceSlogan">
          <el-input
            v-model.trim="spatialInfo.spaceSlogan"
            :disabled="hanPermission"
            class="width210px"
            :maxlength="30"
            auto-complete="off"></el-input>
            &nbsp;&nbsp;
            <span class="theme-gray">选填，限制字数 30</span>
        </el-form-item>

        <el-form-item label="客服电话" prop="phoneNumber">
          <el-select
            v-model="spatialInfo.phoneType"
            :disabled="hanPermission"
            class="width100px mr20 fl">
            <el-option :value="0" label="手机"></el-option>
            <el-option :value="1" label="固话"></el-option>
          </el-select>

          <el-input
            v-model.trim="spatialInfo.phoneNumber"
            :disabled="hanPermission"
            class="width210px"
            :maxlength="13"
            auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item prop="spaceLogo" label="空间logo">
          <lh-upload
            :imgUrl="spatialInfo.spaceLogo"
            :disabled="hanPermission"
            @uploadImg="val => spatialInfo.spaceLogo = val"
            class="fl"></lh-upload>
            &nbsp;&nbsp;
            <span class="theme-gray">建议上传图片尺寸为80*80，大小不超过1M</span>
        </el-form-item>

        <el-row v-permissions="'/manage/space/updateSpaceInfo'">
          <el-form-item class="align-left">
            <el-button
              @click="updateSpatialInfo('spatialInfo')"
              class="theme-btn-blue width120"
              type="primary">保存</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>

    <el-form
      :model="popupData"
      :rules="rulePopupData"
      ref="popupData"
      label-width="123px"
      class="demo-ruleForm">

      <div class="page-title">
        <h1>门店设置</h1>
        <el-button
          v-permissions="'/manage/store/addStore'"
          @click="resetForm('popupData', 'add')"
          class="theme-btn-blue add-new"
          icon="el-icon-circle-plus"
          type="primary">添加门店</el-button></div>

      <div class="store-setting card-padding">
        <el-table
          :data="tableData"
          :empty-text="tableEmpty"
          :slot="tableEmpty"
          v-loading="tableLoading"
          class="width100" border>

          <el-table-column prop="storeName" label="门店"></el-table-column>
          <el-table-column
            label="地址"
            :formatter="formatter"></el-table-column>

          <el-table-column v-if="handleHasPermissions('/manage/store/addStore')" label="操作">
            <template slot-scope="scope">
              <el-button @click="resetForm('popupData', scope.row.storeCode)" size="small">编辑</el-button>
            </template>
          </el-table-column>

          <el-table-column v-if="handleHasPermissions('/manage/store/updateStoreStatus')" label="营业状态">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                @change="businessToggle(scope.row.status, scope.row.id)"
                :active-value="1"
                :inactive-value="0"
                :active-color="switchActiveColor"
                inactive-color="rgb(191, 194, 217)"
                active-text=""
                inactive-text="">
              </el-switch>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          :total="pageTotal"
          :page-size="pageSize"
          :current-page="currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 20, 30, 40]"
          class="pagination-container"
          background></el-pagination>
      </div>

      <el-dialog
        v-if="handleHasPermissions('/manage/region/listAll')"
        :title="spatialTitle"
        :show-close="false"
        :before-close="handleClose"
        :close-on-click-modal="false"
        :close-on-press-escape="true"
        :visible.sync="dialogFormVisible"
        width="683px">

        <el-row>
          <el-col :gutter="24">
            <el-row>
              <el-col :span="12">
                <el-form-item prop="storeName" label="门店名称" label-width="123px">
                  <el-input v-model.trim="popupData.storeName" auto-complete="off" placeholder="请输入门店名称"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="10">
                <el-form-item label-width="50px">
                  <span class="theme-gray">限制字数 20字</span>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item prop="contactName" label="联系方式">
                  <el-input v-model.trim="popupData.contactName" auto-complete="off" placeholder="输入姓名"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="10">
                <el-form-item prop="contactTel" label="" label-width="50px">
                  <el-input
                    v-model.trim="popupData.contactTel"
                    auto-complete="off"
                    :maxlength="12"
                    placeholder="输入电话"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item prop="joinValueArray" label="门店地址">
                  <el-cascader
                    style="display: block;"
                    :props="replaceCascader"
                    :value="popupData.joinValueArray"
                    placeholder="请选择省市区"
                    :options="popupData.addressList"
                    change-on-select
                    @change="changeAddr"></el-cascader>
                </el-form-item>
              </el-col>

              <el-col :span="10">
                <el-form-item prop="address" label="" label-width="50px">
                  <el-input v-model.trim="popupData.address" auto-complete="off"  placeholder="请输入详细地址"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="地图选点">
              <el-row>
                <el-col :span="22">
                  <!-- 地图选点 -->
                  <div id="map" style="width: 100%; height: 300px;" v-model="popupData.latitude"></div>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>

        <div :class="{'error-info': true, 'theme-red': haveMarker}">
          <div>点击开始地图标记</div>
        </div>

        <div slot="footer" class="dialog-footer text-center">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="sureAdd('popupData', spatialType)">确 定</el-button>
        </div>
      </el-dialog>
    </el-form>
  </div>
</template>

<script>
  import tcMap from '@/config/tc-map'
  import upload from '@/components/upload'
  import { addrList } from '@/service/common'
  import tableMixins from '@/config/mixins/table'
  import { pageData, spatialInfo, locationMap, popupData } from './spatial.data'
  import { defaultSpaceInfo, updateSpaceInfo, updateStoreStatus, findByStoreCode, updateStore, addStore, storeList } from '@/service/admin/spatial'

  export default {
    mixins: [tableMixins],
    components: { [upload.name]: upload },
    data () {
      return {
        startIn: 0,
        tableEmpty: ' ',
        haveMarker: false,
        tableLoading: true,
        locationMap: locationMap(),    // map地图
        spatialInfo: spatialInfo(),    // 空间信息设置模块
        dialogFormVisible: false,      // 门店弹窗的状态
        popupData: popupData(),        // 弹窗数据
        spatialTitle: '',              // 弹窗的标题
        spatialType: 'add',            // 弹窗的类型，默认是多数edit，此外就是add
        rulePopupData: pageData.rulePopupData,
        ruleSpatialInfo: pageData.ruleSpatialInfo,
        replaceCascader: pageData.replaceCascader, // 修改门店级联选择器命名
        hanPermission: !this.handleHasPermissions('/manage/space/updateSpaceInfo')
      }
    },
    created() {
      const self = this
      self.getSpatialInfo()
      if (self.handleHasPermissions('/manage/region/listAll')) {
        addrList().then(res => {
          if (res.status === 'true') {
            self.popupData.addressList = res.info.children
          }
        })
      }
    },
    methods: {
      formatter(row, column) {
        return row.provinceName + row.cityName + row.districtName + row.address;
      },
      getSpatialInfo () {
        const self = this
        defaultSpaceInfo().then(res => {
          if (res.status === 'true') {
            let data = res.info
            self.spatialInfo = {
              id: data.id,
              spaceName: data.spaceName,
              spaceLogo: data.spaceLogo,
              phoneType: data.phoneType,
              phoneNumber: data.phoneNumber,
              spaceSlogan: data.spaceSlogan
            }
            self.getPageData()
          } else {
            self.setMsg('error', res.msg)
          }
        })
      },
      updateSpatialInfo(formName) {
        const self = this
        self.$refs[formName].validate((valid) => {
          if (valid) {
            let spatialInfo = self.spatialInfo
            let ajaxParams = {
              id: spatialInfo.id,
              spaceName: spatialInfo.spaceName,
              spaceSlogan: spatialInfo.spaceSlogan,
              phoneType: spatialInfo.phoneType,
              phoneNumber: spatialInfo.phoneNumber,
              spaceLogo: spatialInfo.spaceLogo
            }
            updateSpaceInfo(ajaxParams).then(res => {
              if (res.status === 'true') {
                // 保存之后，直接更改空间头像名称
                sessionStorage.setItem('spaceLogo', spatialInfo.spaceLogo)
                sessionStorage.setItem('spaceName', spatialInfo.spaceName)
                self.$store.commit('SET_SPACE_LOGO', spatialInfo.spaceLogo)
                self.$store.commit('SET_SPACE_NAEM', spatialInfo.spaceName)
                self.setMsg('success', '修改成功!')
              } else {
                self.setMsg('error', res.msg)
              }
            })
          } else {
            return false;
          }
        });
      },
      getPageData () {
        const self = this
        storeList({
          pageNum: self.currentPage,
          pageSize: self.pageSize
        }).then(res => {
          if (res.status === 'true') {
            let data = res.info
            self.pageTotal = data.total
            self.tableData = data.result

            // table的交互
            self.tableLoading = false
            if (self.tableData.length === 0) {
              self.tableEmpty = '暂时无数据'
            }
          } else {
            self.setMsg('error', res.msg)
          }
        })
      },

      handleClose(done) {
        done();
      },
      resetForm (formName, type) {
        const self = this
        // 重置地图标识
        self.haveMarker = false
        self.$refs[formName].resetFields();
        if (type === 'add') {
          self.addStore(formName)
        } else {
          self.editStore(type)
        }
      },
      // Promise new map
      startPromise (ms = 100) {
        const self = this
        return new Promise((resolve, reject) => {
          // 回调new map
          if (self.startIn === 0) {
            tcMap().then(qq => {
              // 经纬度
              if (self.popupData.latitude) {
                self.popupData.defaultLatLng = new qq.maps.LatLng(self.popupData.latitude, self.popupData.longitude)
              } else {
                // 默认广东广州
                self.popupData.defaultLatLng = new qq.maps.LatLng(23.1417100000, 113.3246500000)
              }

              // 地图视野
              var latlngBounds = new qq.maps.LatLngBounds();

              // 建一个地图
              self.locationMap.map = new qq.maps.Map(document.getElementById('map'), {
                center: self.popupData.defaultLatLng,
                zoom: 1
              });

              // 添加检索服务，调用Poi检索类
              self.locationMap.searchService = new qq.maps.SearchService({
                // 设置搜索范围为全国
                location: '全国',
                // 设置搜索页码为1
                pageIndex: 1,
                // 设置每页的结果数为5
                pageCapacity: 1,
                // 检索成功的回调函数
                complete: function (results) {
                  // 设置回调函数参数
                  var pois = results.detail.pois;
                  // console.log('result: ', results)

                  for (var i = 0, l = pois.length; i < l; i++) {
                    var poi = pois[i];
                    // 扩展边界范围，用来包含搜索到的Poi点
                    latlngBounds.extend(poi.latLng);
                  }

                  // 调整地图视野，去掉这个，就能够实现功能
                  // self.locationMap.map.fitBounds(latlngBounds);
                },
                // 若服务请求失败，则运行以下函数
                error: function() {
                  // self.$message.error('出错了。');
                }
              });

              // 添加标记
              self.locationMap.marker = new qq.maps.Marker({
                map: self.locationMap.map
              });

              // 设置Marker是否可以被拖拽，为true时可拖拽，false时不可拖拽，默认属性为false
              self.locationMap.marker.setDraggable(true);
              // 添加信息窗口
              self.locationMap.info = new qq.maps.InfoWindow({
                // 设置Marker的位置坐标
                map: self.locationMap.map
              });

              // 添加比例尺控件，暂时隐藏
              // self.locationMap.scaleControl = new qq.maps.ScaleControl({
              //   align: qq.maps.ALIGN.BOTTOM_RIGHT, // 放在地图右下角
              //   margin: qq.maps.Size(85, 15), // 表示距离第二个参数指定的位置的横方向和竖方向的偏移量，为正数则向地图中心方向偏移
              //   map: self.locationMap.map
              // });

              // 地址和经纬度之间进行转换服务
              self.locationMap.geocoder = new qq.maps.Geocoder();

              qq.maps.event.addListener(self.locationMap.map, 'click', function(event) {
                self.locationMap.marker.setPosition(event.latLng)

                // 拿到点击的经纬度
                self.popupData.latLng = event.latLng
                self.popupData.latitude = event.latLng.lat
                self.popupData.longitude = event.latLng.lng
                // console.log('click.latitude1: ', self.popupData.latitude, self.popupData.longitude);
              });
              // 设置Marker停止拖动事件
              qq.maps.event.addListener(self.locationMap.marker, 'dragend', function (event) {
                self.locationMap.marker.setPosition(event.latLng)

                // 拿到拖动的经纬度
                self.popupData.latLng = event.latLng
                self.popupData.latitude = event.latLng.lat
                self.popupData.longitude = event.latLng.lng
                // console.log('dragend.latLng2: ', self.popupData.latLng)
              });

              self.startIn = 1
              resolve()
            })
          } else {
            resolve()
          }
        })
      },
      editStore (storeCode) {
        const self = this
        self.dialogFormVisible = true
        self.spatialTitle = '编辑门店'
        self.spatialType = 'edit'
        self.popupData.selecetedStoreCode = storeCode
        // console.log('storeCode: ', storeCode);

        // 回调新建地图
        self.startPromise().then(function(value) {
          // 拿到门店信息
          findByStoreCode({
            storeCode: self.popupData.selecetedStoreCode
          }).then(res => {
            if (res.status === 'true') {
              self.popupData.id = res.info.id
              self.popupData.storeName = res.info.storeName
              self.popupData.contactName = res.info.contactName
              self.popupData.contactTel = res.info.contactTel
              self.popupData.desc = res.info.address
              // 添加门店
              self.popupData.spaceId = res.info.spaceId
              self.popupData.provinceCode = res.info.provinceCode
              self.popupData.cityCode = res.info.cityCode
              self.popupData.districtCode = res.info.districtCode
              self.popupData.latitude = res.info.latitude
              self.popupData.address = res.info.address
              self.popupData.joinValueString = res.info.provinceName + res.info.cityName + res.info.districtName
              self.popupData.joinValueArray = [res.info.provinceCode, res.info.cityCode, res.info.districtCode]
              self.popupData.longitude = res.info.longitude

              // 调用一次，选择地址的方法
              self.popupData.cascaderName = self.getCascaderObj(self.popupData.joinValueArray, self.popupData.addressList)
              self.popupData.joinValueString = ''
              // 用map方法，拿到级联的name
              for (let item of self.popupData.cascaderName) {
                self.popupData.joinValueString += item.name
                // console.log('item.name: ', item.name);
              }
              // console.log('self.popupData.joinValueString: ', self.popupData.cascaderName, self.popupData.joinValueString)

              tcMap().then(qq => {
                // 如果marker不可见，设置marker可见
                // console.log('self.locationMap.marker.getVisible(): ', self.locationMap.marker.getVisible())
                if (!self.locationMap.marker.getVisible()) {
                  self.locationMap.marker.setVisible(true)
                }
                // console.log('self.locationMap.marker.getVisible(): ', self.locationMap.marker.getVisible())

                // 设置经纬度
                self.popupData.latLng = new qq.maps.LatLng(self.popupData.latitude, self.popupData.longitude)
                // 地图缩放
                self.locationMap.map.zoomTo(12);
                // 下点
                self.locationMap.marker.setPosition(self.popupData.latLng)
                // 搜索
                self.locationMap.searchService.search(self.popupData.joinValueString);
                // 对指定地址进行解析
                self.locationMap.geocoder.getLocation(self.popupData.joinValueString);
                // 设置服务请求成功的回调函数
                self.locationMap.geocoder.setComplete(function(result) {
                  // console.log('result: ', result.detail.location)
                  // setCenter()设置地图中心点坐标
                  self.locationMap.map.setCenter(result.detail.location);
                  // 通过 panTo 方法来设置地图的中心点
                  self.locationMap.map.panTo(result.detail.location);
                });
              })

              // console.log('self.popupData: ', self.popupData)
            } else {
              self.setMsg('error', res.msg)
            }
          })
        })
      },
      // 选中的地址，change事件
      changeAddr (value) {
        const self = this
        // console.log('change: ', value)
        // console.log('popupData.joinValueString: ', self.popupData.joinValueString)

        tcMap().then(qq => {
          // 如果marker不可见，设置marker可见
          if (!self.locationMap.marker.getVisible()) {
            self.locationMap.marker.setVisible(true)
          }
          // console.log('self.locationMap.marker.getVisible(): ', self.locationMap.marker.getVisible())

          // 选择地址到第几级，只在第三级的时候，才添加标记
          self.locationMap.addMarker = value.length - 1

          switch (value.length - 1) {
            case 0:
              self.popupData.provinceCode = value[0]
              self.locationMap.map.zoomTo(8);

              // 清空经纬度，用于新增、编辑时，没有点击地图添加标注，
              // 点击确定按钮，给出提示
              self.popupData.latitude = ''
              break;
            case 1:
              self.popupData.cityCode = value[1]
              self.locationMap.map.zoomTo(10);

              // 清空经纬度，用于新增、编辑时，没有点击地图添加标注，
              // 点击确定按钮，给出提示
              self.popupData.latitude = ''
              break;
            case 2:
              // 正常流程
              self.popupData.districtCode = value[2]
              self.popupData.joinValueArray = [value[0], value[1], value[2]]
              self.popupData.cascaderName = self.getCascaderObj(self.popupData.joinValueArray, self.popupData.addressList)
              // console.log('cascaderName: ', self.popupData.cascaderName)

              // 清空joinValueString
              self.popupData.joinValueString = ''
              // 用map方法，拿到级联的name
              for (let item of self.popupData.cascaderName) {
                self.popupData.joinValueString += item.name
                // console.log('item.name: ', item.name);
              }
              // console.log('self.popupData.joinValueString: ', self.popupData.joinValueString)

              self.locationMap.map.zoomTo(12);
              qq.maps.event.addListener(self.locationMap.map, 'click', function(event) {
                self.locationMap.marker.setPosition(event.latLng)

                // 拿到点击的经纬度
                self.popupData.latLng = event.latLng
                self.popupData.latitude = event.latLng.lat
                self.popupData.longitude = event.latLng.lng
                // console.log('click.latitude1: ', self.popupData.latitude, self.popupData.longitude);
              });
              // 设置Marker停止拖动事件
              qq.maps.event.addListener(self.locationMap.marker, 'dragend', function (event) {
                self.locationMap.marker.setPosition(event.latLng)

                // 拿到拖动的经纬度
                self.popupData.latLng = event.latLng
                self.popupData.latitude = event.latLng.lat
                self.popupData.longitude = event.latLng.lng
                console.log('dragend.latLng2: ', self.popupData.latLng)
              });
              break;
          }

          self.locationMap.searchService.search(self.popupData.joinValueString);
          // 对指定地址进行解析
          self.locationMap.geocoder.getLocation(self.popupData.joinValueString);
          // 设置服务请求成功的回调函数
          self.locationMap.geocoder.setComplete(function(result) {
            // console.log('result: ', result.detail.location)
            // setCenter()设置地图中心点坐标
            self.locationMap.map.setCenter(result.detail.location);
            // 通过 panTo 方法来设置地图的中心点
            self.locationMap.map.panTo(result.detail.location);
          });

          // 若服务请求失败，则运行以下函数
          // self.locationMap.geocoder.setError(function() {
            // self.$message.error('请求失败');
          // });
        })
      },
      // 用map方法，拿到级联的name
      getCascaderObj (val, opt) {
        return val.map(function(value, index, array) {
          for (var itm of opt) {
            if (itm.code === value) {
              opt = itm.children;
              return itm;
            }
          }
          return null;
        });
      },
      // 弹窗确认按钮
      sureAdd (formName, type) {
        const self = this
        // console.log('formName, type', formName, type)
        var ajaxName
        var dataJson = {
          storeName: self.popupData.storeName,
          spaceId: self.spatialInfo.id,
          provinceCode: self.popupData.provinceCode,
          cityCode: self.popupData.cityCode,
          districtCode: self.popupData.districtCode,
          address: self.popupData.address,
          latitude: self.popupData.latitude,
          longitude: self.popupData.longitude,
          contactName: self.popupData.contactName,
          contactTel: self.popupData.contactTel
        }

        self.dialogFormVisible = true
        self.$refs[formName].validate((valid) => {
          if (!self.popupData.latitude) {
            self.haveMarker = true
            return
          }
          if (type === 'edit') {
            ajaxName = updateStore
            dataJson.id = self.popupData.id
          } else {
            ajaxName = addStore
          }

          if (self.popupData.latLng) {
            // 重新获取一次标记的经纬度，针对标识拖动的情况
            self.popupData.latLng = self.locationMap.marker.getPosition()
            // console.log('click.latitude3: ', self.popupData.latitude, self.popupData.longitude);
          }

          // console.log('dataJson', dataJson)
          if (valid) {
            ajaxName(dataJson).then(res => {
              if (res.status === 'true') {
                // 新增门店后，刷新一下数据
                self.getPageData()

                self.dialogFormVisible = false
              } else {
                self.setMsg('error', res.msg)
              }
            })
          } else {
            return false;
          }
        });
      },
      // 切换门店营业状态
      businessToggle (currentStatus, id) {
        const self = this
        // console.log('currentStatus: ', currentStatus);
        if (currentStatus === 1) {
          updateStoreStatus({
            storeId: id,
            status: currentStatus
          }).then(res => {
            if (res.status === 'true') {
              self.setMsg('success', '成功开启门店!')
            } else {
              self.setMsg('error', res.msg)
            }
          })
        } else {
          self.$confirm('关闭后该门店下的所有场地都将停止开放，但不影响已有订单', '确认关闭？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            updateStoreStatus({
              storeId: id,
              status: currentStatus
            }).then(res => {
              if (res.status === 'true') {
                self.setMsg('success', '门店已关闭!')
              } else {
                self.setMsg('error', res.msg)
              }
            })
          }).catch(() => {
            // 刷新一下门店列表，展开switch
            self.getPageData()
            self.setMsg('已取消')
          });
        }
      },
      addStore (formName) {
        const self = this
        self.dialogFormVisible = true
        self.spatialTitle = '添加门店'
        self.spatialType = 'add'
        // console.log('test', self.dialogFormVisible, self.spatialType)

        // 回调新建地图
        self.startPromise(200).then(function(value) {
          // 重置一下表单
          self.popupData.storeName = ''
          self.popupData.spaceId = ''
          self.popupData.storeCode = ''
          self.popupData.provinceCode = ''
          self.popupData.cityCode = ''
          self.popupData.districtCode = ''
          self.popupData.address = ''
          self.popupData.latitude = ''
          self.popupData.longitude = ''
          self.popupData.contactName = ''
          // self.popupData.addressList = []
          self.popupData.joinValueArray = []
          self.popupData.joinValueString = ''
          self.popupData.latLng = null
          self.popupData.cascaderName = null
          self.popupData.selecetedStoreCode = ''
          self.popupData.contactTel = ''

          tcMap().then(qq => {
            // 设置默认经纬度
            self.popupData.latLng = new qq.maps.LatLng(23.1417100000, 113.3246500000)
            // 地图缩放还原
            self.locationMap.map.zoomTo(1);
            // 下点
            self.locationMap.marker.setPosition(self.popupData.latLng)
            // 设置marker不可见
            self.locationMap.marker.setVisible(false)
            // setCenter()设置地图中心点坐标
            self.locationMap.map.setCenter(self.popupData.latLng);
            // 通过 panTo 方法来设置地图的中心点
            self.locationMap.map.panTo(self.popupData.latLng);
            // console.log('self.locationMap.marker.getVisible()', self.locationMap.marker.getVisible());
          })
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  .spatial-info {
    .el-dialog {
      position: fixed;
      width: 683px;
      @media screen and (max-width: 1366px) {
        top: 30px;
        margin-top: 0 !important;
      }
      margin-top: 15vh;
      margin: 0 auto;
      left: 50%;
      margin-left: -342px;
    }
    .error-info {
      text-align: center;
      font-size: 12px;
    }
  }
</style>
