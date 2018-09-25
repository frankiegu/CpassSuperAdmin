<template>
  <el-dialog
    :title="insertType === 'title' ? '添加二级标题' : (insertType === 'store' ? '添加空间' : '添加场地')"
    :visible="dialogStatus"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    class="component-store-com-team"
    width="420px">
    <el-form
      :model="dialogData"
      :rules="dialogDataRule"
      ref="dialogData"
      label-width="0"
      @submit.native.prevent
      label-position="right">

      <!-- 添加标题 -->
      <div v-if="insertType === 'title'">
        <el-form-item prop="titleType" label="标题类型" label-width="77px">
          <el-select
            v-model="dialogData.titleType"
            placeholder="选择类型"
            @change="selectTitleType"
            class="width100"
            filterable>
            <el-option
              v-for="(itm, key) in titleTypeList" :key="key"
              :label="itm.val"
              :value="itm.key"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="dialogData.titleType && dialogData.titleType !== 'arbitrarily'" prop="spaceId" label="品牌名" label-width="77px">
          <el-select v-model="dialogData.spaceId" placeholder="选择或搜索品牌名" @change="selectSpaceId" class="width100" filterable>
            <el-option
              v-for="itm in spaceList" :key="itm.id"
              :label="itm.spaceName" :value="itm.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="dialogData.titleType === 'store' || dialogData.titleType === 'field'" prop="storeId" label="空间名" label-width="77px">
          <el-select v-model="dialogData.storeId" placeholder="选择或搜索空间名" @change="selectStoreId" class="width100" filterable>
            <el-option
              v-for="itm in storeList" :key="itm.id"
              :label="itm.storeName" :value="itm.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="dialogData.titleType === 'field'" prop="fieldId" label="场地名" label-width="77px">
          <el-select v-model="dialogData.fieldId" placeholder="选择或搜索场地名" class="width100" filterable>
            <el-option
              v-for="itm in fieldList" :key="itm.id"
              :label="itm.fieldName" :value="itm.id"></el-option>
          </el-select>
        </el-form-item>
        </el-form-item>

        <el-form-item v-if="dialogData.titleType === 'arbitrarily'" prop="arbitrarilyName" label="任意名" label-width="77px">
          <el-input
            v-model.trim="dialogData.arbitrarilyName"
            :maxlength="20"
            class="width100"
            placeholder="输入名称"></el-input>
        </el-form-item>
      </div>

      <!-- 添加空间 -->
      <div v-if="insertType === 'store'" class="store-box">
        <div
          v-for="(itm, idx) in dialogData.addStoreList" :key="idx"
          v-if="idx <= 4">
          <div class="store-tile mb12">
            <span class="fz16">空间({{ idx + 1 }}/5)</span>
            <span @click="delThisStore(idx)" class="btn-delete">删除</span>
          </div>

          <el-form-item
            :prop="'addStoreList.' + idx + '.sBandId'"
            :rules="{
              required: true, message: '品牌名不能为空', trigger: ['blur', 'change']
            }"
            label="品牌名"
            label-width="77px" class="is-required">
            <el-select
              v-model="itm.sBandId"
              placeholder="选择或搜索品牌名"
              @change="getStores(idx + 1)"
              class="width290px" filterable>
              <el-option
                v-for="item in itm.sStoreList" :key="item.id"
                :label="item.spaceName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            :prop="'addStoreList.' + idx + '.sStoreId'"
            :rules="{
              required: true, message: '空间名不能为空', trigger: ['blur', 'change']
            }"
            label="空间名"
            label-width="77px" class="is-required">
            <el-select
              v-model="itm.sStoreId"
              placeholder="选择或搜索空间名"
              class="width290px" filterable>
              <el-option
                v-for="itm in storeList" :key="itm.id"
                :label="itm.storeName" :value="itm.id"></el-option>
            </el-select>
          </el-form-item>
        </div>

        <!-- v-if="dialogData.addStoreList.length <= 4" -->
        <el-button
          @click="addStore"
          icon="el-icon-circle-plus"
          class="add-store">新增空间数</el-button>
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
import fieldMixin from './field.mixin'
import storeMixin from './store.mixin'
import titleMixin from './title.mixin'
export default {
  name: 'SelectField',
  mixins: [dataMixin, indexMixin, titleMixin, fieldMixin, storeMixin],
  props: {
    dialogStatus: Boolean,
    insertType: String
  },
  watch: {
    dialogStatus: function(val, oldVal) {
      console.log('insertType', this.insertType);

      // this.dialogData = { ...this.teamData }
      // 用于去重判断
      this.currentFieldId = this.dialogData.fieldId

      if (this.onType === 'add' && this.$refs.dialogData) {
        this.$refs.dialogData.resetFields()
      }

      if (!this.renderSelectField) {
        this.renderComponent()
      }
    }
  },
  methods: {
    renderComponent() {
      this.getSpaces()
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          switch (this.insertType) {
            case 'title':
              break
            case 'store':
              break
            case 'field':
              break
          }
          // this.closeDialog('save')
        } else {
        }
      })
    },

    getDialogFormData() {
      let spaceName
      for (let item of this.spaceList) {
        if (this.dialogData.spaceId === item.id) {
          spaceName = item.spaceName
          break;
        }
      }

      let storeName
      for (let item of this.storeList) {
        if (this.dialogData.storeId === item.id) {
          storeName = item.storeName
          break;
        }
      }

      let dialogData
      for (let item of this.fieldList) {
        if (this.dialogData.fieldId === item.id) {
          dialogData = {
            id: this.dialogData.id,
            idx: this.dialogData.idx,
            platformSelectionId: null, // 场地列表找不到次字段
            spaceId: item.spaceId,
            storeId: item.storeId,
            fieldId: item.id,
            fieldTitle: null, // 场地列表找不到次字段
            fieldName: item.fieldName,
            imgPath: this.dialogData.imgPath,
            created: item.created,
            updated: item.updated,
            spaceName,
            storeName
          }
          // console.log('getDialogFormData', this.dialogData.idx)
          return dialogData
        }
      }
    },
    closeDialog(type) {
      if (type !== 'save') {
        this.$emit('closeInsertDialog')
      } else {
        this.$emit('closeInsertDialog', { ...this.getDialogFormData() })
      }
      // console.log('dialogData', this.dialogData)
    }
  }
};
</script>

<style lang="scss" scoped src='./main.scss'></style>
