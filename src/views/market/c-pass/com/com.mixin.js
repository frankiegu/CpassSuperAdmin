import { API_PATH } from '@/config/env'
import { fieldData } from '../common'
export default {
  data() {
    return {
      // 预览弹出框
      showPreview: false,

      // 插入弹出框
      insertType: '',
      showInsert: false,
      onType: '',

      renderSelectField: false,
      teamData: fieldData, // 单个场地的数据
      teamDefaultData: fieldData,

      ajaxName: null, // 添加和编辑的接口名
      ajaxParam: {},  // 提交表单的参数
      platformSelectionField: [],

      insertList: [
        { id: 1, name: '二级标题', type: 'title' },
        { id: 2, name: '空间链接', type: 'store' },
        { id: 3, name: '场地链接', type: 'field' }
      ],

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
        authorName: null,
        link: null,
        switch: true,

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
        bannerPath: [{ required: true, message: ' ', trigger: ['blur', 'change'] }]
      },

      verifyCon: '',
      verifyImg: '',
      // 是否可编辑
      // 富文本编辑器当前字数长度
      quillLength: 0,
      // 富文本编辑器输入字数上限
      quillMaxLength: 3000, // 富文本编辑器的length
      // 富文本框图片上传状态
      quillLoading: false,
      // 富文本框参数设置
      editorOption: {
        placeholder: ' ',
        theme: 'snow',  // or 'bubble'
        modules: {
          toolbar: '.lh-toolbar'
        }
      }
    }
  }
}
