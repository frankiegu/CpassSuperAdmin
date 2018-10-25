<template>
  <!-- ({{ idx + 1 }}/5) -->
  <el-dialog
    :title="insertType === 'title' ? '添加二级标题' : ((insertType === 'store' ? '添加空间（' : '添加场地（') + dialogData.addArr.length + '/5）')"
    :visible="dialogStatus"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    class="component-store-com-team"
    width="420px">

    <p v-show="repeatTipStatus" class="repeat-tip theme-red fz12">{{ repeatTip }}</p>

    <el-form
      :model="dialogData"
      :rules="dialogDataRule"
      ref="dialogData"
      label-width="0"
      @submit.native.prevent
      label-position="right">
      <!-- 添加标题 -->
      <div v-if="insertType === 'title'" key="1">
        <el-form-item prop="titleType" label="标题类型" label-width="80px">
          <el-select
            v-model="dialogData.titleType"
            placeholder="选择类型"
            @change="selectTitleType"
            class="width290px"
            filterable>
            <el-option
              v-for="(itm, key) in titleTypeList" :key="key"
              :label="itm.val" :value="itm.key"></el-option>
          </el-select>
        </el-form-item>

        <!-- 用v-show，会通不过校验 -->
        <el-form-item
          v-if="dialogData.titleType && dialogData.titleType !== 'arbitrarily'"
          prop="brandId"
          label="品牌名" label-width="80px">
          <el-select
            v-model="dialogData.brandId"
            @change="selectBrandId"
            placeholder="选择或搜索品牌名"
            class="width290px" filterable>
            <el-option
              v-for="itm in brandList" :key="itm.id"
              :label="itm.spaceName || '品牌id：' + itm.id" :value="itm.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="dialogData.titleType === 'store' || dialogData.titleType === 'field'"
          prop="storeId"
          label="空间名" label-width="80px">
          <el-select
            v-model="dialogData.storeId"
            @change="selectStoreId"
            placeholder="选择或搜索空间名"
            class="width290px" filterable>
            <el-option
              v-for="itm in storeList" :key="itm.id"
              :label="itm.storeName" :value="itm.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="dialogData.titleType === 'field'"
          prop="fieldId"
          label="场地名" label-width="80px">
          <el-select
            v-model="dialogData.fieldId"
            placeholder="选择或搜索场地名"
            @change="selectFieldId"
            class="width290px" filterable>
            <el-option
              v-for="itm in fieldList" :key="itm.id"
              :label="itm.fieldName" :value="itm.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="dialogData.titleType === 'arbitrarily'"
          prop="arbitrarilyName"
          label="任意名" label-width="80px">
          <el-input
            v-model.trim="dialogData.arbitrarilyName"
            @keyup.native.enter="submitForm('dialogData')"
            :maxlength="30"
            class="width290px"
            placeholder="输入名称"></el-input>
        </el-form-item>
      </div>

      <!-- 添加空间、场地 -->
      <div v-else class="add-box" key="2">
        <div
          v-for="(itm, idx) in dialogData.addArr" :key="idx"
          v-if="idx <= 4"
          class="add-li">

          <div class="add-li-box">
            <div class="store-tile mb12">
              <span class="fz16">{{ insertType === 'store' ? '空间' : '场地' }}{{ idx + 1 }}</span>
              <span
                v-if="idx"
                @click="delThisStore(idx)"
                class="btn-delete">删除</span>
            </div>

            <el-form-item
              :prop="'addArr.' + idx + '.brandId'"
              :rules="{
                required: true, message: '品牌名不能为空', trigger: ['blur', 'change']
              }"
              label="品牌名"
              label-width="80px">
              <el-select
                v-model="itm.brandId"
                placeholder="选择或搜索品牌名"
                @change="handleBrandId(idx + 1)"
                class="input-width" filterable>
                <el-option
                  v-for="item in itm.brandList" :key="item.id"
                  :label="item.spaceName || '品牌id：' + item.id" :value="item.id"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              :prop="'addArr.' + idx + '.storeId'"
              :rules="{
                required: true, message: '空间名不能为空', trigger: ['blur', 'change']
              }"
              label="空间名"
              label-width="80px">
              <el-select
                v-model="itm.storeId"
                @change="handleStoreId(idx + 1)"
                placeholder="选择或搜索空间名"
                class="input-width" filterable>
                <el-option
                  v-for="item in itm.storeList" :key="item.id"
                  :label="item.storeName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              v-if="insertType === 'field'"
              :prop="'addArr.' + idx + '.fieldId'"
              :rules="{
                required: true, message: '场地名不能为空', trigger: ['blur', 'change']
              }"
              label="场地名"
              label-width="80px"
              :class="{'lh-form-item0': idx === 4}">
              <el-select
                v-model="itm.fieldId"
                @change="handleFieldId(idx + 1)"
                placeholder="选择或搜索场地名"
                class="input-width" filterable>
                <el-option
                  v-for="item in itm.fieldList" :key="item.id"
                  :label="item.fieldName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </div>

          <el-button
            @click="addStoreField"
            :disabled="(insertType === 'store') ? !itm.storeId : (insertType === 'field') ? !itm.fieldId : ''"
            v-if="(dialogData.addArr.length === (idx + 1)) && idx < 4"
            icon="el-icon-circle-plus"
            type="primary"
            class="add-store">新增空间数</el-button>
        </div>
      </div>
    </el-form>

    <div slot="footer" class="dialog-footer align-center">
      <el-button
        @click="submitForm('dialogData')"
        type="primary"
        class="lh-btn-default">添加</el-button>
      <el-button @click="closeDialog" class="lh-btn-default">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import dataMixin from './data.mixin'
import indexMixin from './index.mixin'
import titleMixin from './title.mixin'
import storeFieldMixin from './store-field.mixin'
export default {
  name: 'SelectField',
  mixins: [dataMixin, indexMixin, titleMixin, storeFieldMixin],
  props: {
    dialogStatus: Boolean,
    insertType: String
  },
  watch: {
    dialogStatus: function(val, oldVal) {
      if (val) {
        // console.log('watch-showDialog', this.dialogData);
        switch (this.insertType) {
          case 'store':
          case 'field':
            this.getSpaces()
            break
          // case 'title':
          //   break
        }
      }
    }
  },
  methods: {
    // 去重，拿到下标
    // 插入空间、场地，并且数量大于1
    duplicateRemoval() {
      switch (this.insertType) {
        case 'store':
        case 'field':
          let repeatIdxs = new Map()

          if (this.dialogData.addArr.length > 1) {
            if (this.insertType == 'store') {
              this.dialogData.addArr.forEach((itm, idx) => {
                this.dialogData.addArr.forEach((list, i) => {
                  if (itm.storeId == list.storeId && idx != i) {
                    if (!repeatIdxs.has(idx)) {
                      repeatIdxs.set(idx, itm.storeId)
                    }
                    if (!repeatIdxs.has(i)) {
                      repeatIdxs.set(i, list.storeId)
                    }
                    // console.log('log: ', itm.storeId, list.storeId, repeatIdxs);
                  }
                })
              })
            } else {
              this.dialogData.addArr.forEach((itm, idx) => {
                this.dialogData.addArr.forEach((list, i) => {
                  if (itm.fieldId == list.fieldId && idx != i) {
                    if (!repeatIdxs.has(idx)) {
                      repeatIdxs.set(idx, itm.fieldId)
                    }
                    if (!repeatIdxs.has(i)) {
                      repeatIdxs.set(i, list.fieldId)
                    }
                  }
                })
              })
            }

            if (repeatIdxs.size) {
              let tipText
              if (this.insertType == 'store') {
                tipText = '空间'
                this.repeatTip = '空间名重复：'
              } else {
                tipText = '场地'
                this.repeatTip = '场地名重复：'
              }

              let arr = [...repeatIdxs.values()]
              let keys = [...repeatIdxs.keys()]

              for (let i = 0, len = arr.length; i < len; i++) {
                // console.log('repeatIdxs-------map', arr[i - 1], arr[i]);

                if (i > 0) {
                  if (arr[i - 1] != arr[i]) {
                    this.repeatTip += '; '
                  } else {
                    this.repeatTip += ','
                  }
                }

                this.repeatTip += (tipText + (keys[i] + 1))
              }

              this.repeatTipStatus = true
            } else {
              this.repeatTipStatus = false
            }
          }
          // console.log('verify-repeat', repeatIdxs, this.repeatTip, this.dialogData.addArr);
          break
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        // console.log('submitForm', valid, this.dialogData);
        if (valid) {
          this.duplicateRemoval()

          if (this.repeatTipStatus) return
          this.closeDialog('save')
        } else {
        }
      })
    },

    closeDialog(type) {
      // console.log('closeDialog', this.insertType, this.dialogData.titleType, this.dialogData)

      if (type !== 'save') {
        this.$emit('closeInsertDialog')
      } else {
        this.$emit('closeInsertDialog', { ...this.dialogData })
      }

      this.dialogData = { ...this.dialogData2 }
      this.dialogData.addArr = [...this.dialogData2.addArr]
      this.repeatTip = ''
      this.repeatTipStatus = false

      if (this.$refs.dialogData) {
        this.$refs.dialogData.resetFields()
      }
    }
  }
};
</script>

<style lang="scss" scoped src='./main.scss'></style>
