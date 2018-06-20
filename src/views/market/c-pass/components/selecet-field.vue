<template>
  <el-dialog title="选择场地"
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
      <el-form-item prop="name" label="所属空间" label-width="77px">
        <el-select v-model="dialogData.name" placeholder="请选择所属空间" class="width100" filterable>
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="work" label="场地" label-width="77px">
        <el-select v-model="dialogData.work" placeholder="请选择场地" class="width100" filterable>
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="title" label="场地描述" label-width="77px">
        <el-input v-model.trim="dialogData.title" placeholder="请输入场地描述"></el-input>
      </el-form-item>

      <el-form-item prop="avator" label="展示图" label-width="77px" class="lh-form-item0">
        <lh-upload ref="refSelectField"
          :imgUrl="dialogData.avator"
          @uploadImg="val => dialogData.avator = val"
          :size="64" class="fl"/>

        <el-popover
          ref="tipPopover"
          placement="right"
          title=""
          width="167"
          trigger="hover">
          <div class="fz12">
            建议尺寸：600PX * 460PX<br>
            支持格式：JPG / PNG
          </div>
        </el-popover>
        <span v-popover:tipPopover class="fl lh66">
          <lh-svg icon-class="icon-info" class="theme-gray"></lh-svg>
        </span>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog" class="lh-btn-default">取消</el-button>
      <el-button @click="submitForm('dialogData')" type="primary" class="lh-btn-default">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import lhUpload from '@/components/upload'
export default {
  name: 'SelecetField',
  props: {
    teamVisible: Boolean,
    storeCode: String,
    teamData: Object,
    onType: String
  },
  components: {
    [lhUpload.name]: lhUpload
  },
  data() {
    return {
      disabledweixinPay: false,
      dialogData: { idx: 0, name: '', work: '', title: '', avator: '' },
      dialogDataRule: {
        name: [{ required: true, trigger: ['blur', 'change'], message: '所属空间不能为空' }],
        work: [{ required: true, trigger: ['blur', 'change'], message: '场地不能为空' }],
        title: [{ required: true, trigger: ['blur', 'change'], message: '场地描述不能为空' }],
        avator: [{ required: true, trigger: ['blur', 'change'], message: '展示图不能为空' }]
      },
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }]
    }
  },
  watch: {
    teamVisible: function(val, oldVal) {
      this.dialogData = { ...this.teamData }
      if (this.onType === 'add') {
        this.$refs.dialogData.resetFields()
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.closeDialog('save')
        } else {
        }
      })
    },
    closeDialog(type) {
      if (type === 'save') {
        this.$emit('closeTeamDialog', { ...this.dialogData })
      } else {
        console.log('closeTeamDialog');
        this.$emit('closeTeamDialog')
      }

      this.dialogData = {
        idx: 0,
        name: '',
        work: '',
        title: '',
        avator: ''
      }
      console.log('dialogData', this.dialogData)
    }
  }
};
</script>

<style lang="scss" scoped>
.component-store-com-team {
  .dialog-tip {
    position: absolute;
    top: 48px;
    left: 20px;
  }
}
</style>
