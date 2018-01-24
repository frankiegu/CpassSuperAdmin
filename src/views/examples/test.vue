<template>
  <div>
    <el-row class="warp">
      <el-col :span="24" class="warp-main">
        <el-form ref="infoForm" :model="infoForm" :rules="rules" label-width="120px">

          <el-form-item label="详细">
            <div class="edit_container">
              <quill-editor v-model="infoForm.a_content"
                            ref="myQuillEditor"
                            class="editer"
                            :options="editorOption" @ready="onEditorReady($event)"></quill-editor>
            </div>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onSubmit">确认提交</el-button>
          </el-form-item>
        </el-form>
      </el-col>

    </el-row>
  </div>
</template>

<script>
  import { quillEditor } from 'vue-quill-editor' // 调用编辑器
  export default {
    data() {
      return {
        infoForm: {
          a_title: '',
          a_source: '',
          a_content: '',
          editorOption: {}
        },
        // 表单验证
        rules: {
          a_title: [
            {required: true, message: '请输入标题', trigger: 'blur,change'}
          ],
          a_content: [
            {required: true, message: '请输入详细内容', trigger: 'blur,change'}
          ]
        }
      }
    },
    computed: {
      editor() {
        return this.$refs.myQuillEditor.quill
      }
    },
    mounted() {
      // 初始化
    },
    methods: {
      onEditorReady(editor) {
      },
      onSubmit() {
        // 提交
// this.$refs.infoForm.validate，这是表单验证
        this.$refs.infoForm.validate((valid) => {
          if (valid) {
            this.$post('m/add/about/us', this.infoForm).then(res => {
              if (res.errCode === 200) {
                this.$message({
                  message: res.errMsg,
                  type: 'success'
                });
                this.$router.push('/aboutus/aboutlist');
              } else {
                this.$message({
                  message: res.errMsg,
                  type: 'error'
                });
              }
            });
          }
        });
      }
    },
    components: {
// 使用编辑器
      quillEditor
    }
  }
</script>
