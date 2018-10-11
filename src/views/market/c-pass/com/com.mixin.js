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

      updateSpaces: null,

      copyQuillCon: null,
      formData: {
        id: null,
        title: null,
        subhead: null,
        bannerPath: null,
        content: null,
        authorName: null,
        selectionLink: null,
        styleSwitch: 0,

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
      },
      // 字体颜色与背景色公用，以后有需要可以分离
      // 替换成我们的主题色
      colorBgc: ['#818490', '#ffffff', '#ffd7d5', '#ffdaa9', '#fffed5', '#d4fa00', '#73fcd6', '#a5c8ff', '#ffacd5', '#ff7faa', '#d6d6d6', '#ffacaa', '#ffb995', '#fffb00', '#73fa79', '#00fcff', '#20A0FF', '#d84fa9', '#ff4f79', '#b2b2b2', '#d7aba9', '#ff6827', '#ffda51', '#00d100', '#00d5ff', '#0080ff', '#ac39ff', '#FF4949', '#888888', '#7a4442', '#ff4c00', '#EE9F1D', '#36C626', '#3daad6', '#5A72F6', '#7a4fd6', '#d92142', '#333', '#7b0c00', '#ff4c41', '#d6a841', '#407600', '#007aaa', '#021eaa', '#797baa', '#ab1942']
      // 微信颜色库
      // ['#818490', '#ffffff', '#ffd7d5', '#ffdaa9', '#fffed5', '#d4fa00', '#73fcd6', '#a5c8ff', '#ffacd5', '#ff7faa', '#d6d6d6', '#ffacaa', '#ffb995', '#fffb00', '#73fa79', '#00fcff', '#78acfe', '#d84fa9', '#ff4f79', '#b2b2b2', '#d7aba9', '#ff6827', '#ffda51', '#00d100', '#00d5ff', '#0080ff', '#ac39ff', '#ff2941', '#888888', '#7a4442', '#ff4c00', '#ffa900', '#3da742', '#3daad6', '#0052ff', '#7a4fd6', '#d92142', '#000000', '#7b0c00', '#ff4c41', '#d6a841', '#407600', '#007aaa', '#021eaa', '#797baa', '#ab1942']
    }
  }
}
