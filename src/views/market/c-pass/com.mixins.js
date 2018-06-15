import { API_PATH } from '@/config/env'
export default {
  data () {
    return {
      formData: {
        selectedContent: '',
        idx: 0,
        name: '',
        work: '',
        email: '',
        avator: ''
      },
      formDataRule: {
        name: [{ required: true, trigger: ['blur', 'change'], message: '姓名不能为空' }],
        work: [{ required: true, trigger: ['blur', 'change'], message: '职务不能为空' }],
        email: [{ required: true, trigger: ['blur', 'change'], message: '职务不能为空' }],
        avator: [{ required: true, message: '头像不能为空', trigger: ['blur', 'change'] }]
      },

      // 团队弹出框
      teamVisible: false,
      onType: '',
      teamData: { idx: 0, name: '', work: '', email: '', avator: '' },
      teamData2: { idx: 0, name: '', work: '', email: '', avator: '' },
      teamList: [],

      // 左上角标题
      pageTitle: '',
      // 请求头携带token
      headers: {
        token: sessionStorage.getItem('token')
      },
      // 图片上传地址
      imgServer: API_PATH + '/supervisor/file/upload',
      // 是否可编辑
      // 富文本编辑器当前字数长度
      quillLength: 0,
      // 富文本编辑器输入字数上限
      quillMaxLength: 3000, // 富文本编辑器的length
      // 富文本框图片上传状态
      quillUploadImg: false,
      // 富文本框参数设置
      editorOption: {
        placeholder: ' ',
        theme: 'snow',  // or 'bubble'
        modules: {
          toolbar: {
            container: [
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
              [{ 'header': 1 }, { 'header': 2 }],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              [{ 'script': 'sub' }, { 'script': 'super' }],
              [{ 'indent': '-1' }, { 'indent': '+1' }],
              [{ 'direction': 'rtl' }],
              [{ 'size': ['small', false, 'large', 'huge'] }],
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              [{ 'font': [] }],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'align': [] }],
              ['clean'],
              ['link', 'image']
            ],  // 工具栏
            handlers: {
              'image': function (value) {
                if (value) {
                  document.querySelector('#quill-upload input').click()
                } else {
                  this.quill.format('image', false)
                }
              }
            }
          }
        }
      }
    }
  },
  props: {},
  components: {},
  mounted() {
  },
  watch: {},
  computed: {},
  methods: {}
}
