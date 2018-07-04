import { API_PATH } from '@/config/env'
import { fieldData } from './common'
export default {
  data () {
    return {
      // 团队弹出框
      teamVisible: false,
      onType: '',

      renderSelectField: false,
      teamData: fieldData, // 单个场地的数据
      teamDefaultData: fieldData,
      // 精选场地table
      teamsData: [],
      spaceId: null,

      ajaxName: null, // 添加和编辑的接口名
      ajaxParam: {},  // 提交表单的参数
      platformSelectionField: [],

      // 左上角标题
      pageTitle: '',
      // 请求头携带token
      headers: {
        token: sessionStorage.getItem('token')
      },
      // 图片上传地址
      imgServer: API_PATH + '/supervisor/file/upload',

      formData: {
        id: null,
        title: null,
        subhead: null,
        bannerPath: null,
        content: null,

        status: null,
        pvCount: null,
        isSelection: null,
        topTime: null,
        isDelete: null,
        created: null
      },
      formDataRule: {
        title: [{ required: true, trigger: ['blur', 'change'], message: '精选标题不能为空' }],
        subhead: [{ required: true, trigger: ['blur', 'change'], message: '副标题不能为空' }],
        content: [{ required: true, trigger: ['blur', 'change'], message: ' ' }],
        bannerPath: [{ required: true, message: '请上传头像', trigger: ['blur', 'change'] }]
      },

      verifyCon: '',
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
  mounted() {},
  methods: {}
}
