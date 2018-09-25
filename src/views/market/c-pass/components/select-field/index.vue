<template>
  <el-dialog
    title="选择场地"
    :visible="teamVisible"
    :before-close="closeDialog"
    class="component-store-com-team"
    width="420px">
    <el-form
      :model="dialogData"
      :rules="dialogDataRule"
      ref="dialogData"
      label-width="0"
      @submit.native.prevent
      label-position="right">
      <el-form-item prop="titleType" label="标题类型" label-width="77px">
        <el-select
          v-model="dialogData.titleType"
          placeholder="选择类型"
          @change="selectTitleType"
          class="width100"
          filterable>
          <el-option
            v-for="(itm, key) in titleTypeList" :key="key"
            :label="item.val"
            :value="item.key"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="spaceId" label="c" label-width="77px">
        <el-select v-model="dialogData.spaceId" placeholder="选择或搜索品牌名" @change="selectSpaceId" class="width100" filterable>
          <el-option v-for="item in spaceList" :key="item.id" :label="item.spaceName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="storeId" label="空间名" label-width="77px">
        <el-select v-model="dialogData.storeId" placeholder="选择或搜索空间名" @change="selectStoreId" class="width100" filterable>
          <el-option v-for="item in storeList" :key="item.id" :label="item.storeName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="fieldId" label="场地名" label-width="77px">
        <el-select v-model="dialogData.fieldId" placeholder="选择或搜索场地名" class="width100" filterable>
          <el-option v-for="item in fieldList" :key="item.id" :label="item.fieldName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer align-center">
      <el-button @click="closeDialog" class="lh-btn-default">取消</el-button>
      <el-button
        @click="submitForm('dialogData')"
        type="primary"
        class="lh-btn-default">添加</el-button>
    </div>
  </el-dialog>
</template>

<script>
import indexField from './index.mixins'
import { cPassFindUseStore, cPassFindUseField, cPassFindUseSpace } from '@/service/market'
export default {
  name: 'SelectField',
  mixins: [indexField],
  props: {
    teamVisible: Boolean,
    renderSelectField: Boolean,
    storeCode: String,
    teamData: Object,
    teamsData: Array,
    onType: String
  },
  watch: {
    teamVisible: function(val, oldVal) {
      this.dialogData = { ...this.teamData }
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
    selectSpaceId() {
      if (this.dialogData.storeId) {
        this.dialogData.storeId = null
      }
      if (this.dialogData.fieldId) {
        this.dialogData.fieldId = null
      }
      this.getStores()
    },
    selectStoreId(data) {
      if (this.dialogData.fieldId) {
        this.dialogData.fieldId = null
      }
      this.getFields()
    },
    getSpaces() {
      cPassFindUseSpace().then(res => {
        if (res.status === 'true') {
          this.spaceList = res.info
          if (this.dialogData.spaceId && this.onType === 'edit') {
            this.getStores()
          }
        } else {
          this.setMsg('error', res.msg)
        }
      })
    },
    getStores() {
      cPassFindUseStore({ spaceId: this.dialogData.spaceId }).then(res => {
        if (res.status === 'true') {
          this.storeList = res.info

          if (this.dialogData.storeId) {
            this.getFields()
          }
        } else {
          this.setMsg('error', res.msg)
        }
      })
    },
    getFields() {
      cPassFindUseField({ storeId: this.dialogData.storeId }).then(res => {
        if (res.status === 'true') {
          this.fieldList = res.info
        } else {
          this.setMsg('error', res.msg)
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.closeDialog('save')
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
        this.$emit('closeTeamDialog')
      } else {
        this.$emit('closeTeamDialog', { ...this.getDialogFormData() })
      }

      this.dialogData = {
        id: 0,
        idx: 'add',
        platformSelectionId: null,
        spaceId: null,
        storeId: null,
        fieldId: null,
        fieldTitle: null,
        fieldName: null,
        imgPath: null,
        created: null,
        updated: null,
        spaceName: null,
        storeName: null
      }
      // console.log('dialogData', this.dialogData)
    }
  }
};
</script>

<style lang="scss" scoped src='./main.scss'></style>
