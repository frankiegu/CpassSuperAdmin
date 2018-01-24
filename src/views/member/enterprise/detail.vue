<template>
  <div class="enterprise-detail">

    <!-- 有面包屑的时候，就隐藏这个标题 -->
    <div class="page-title">
      <!-- 根据URL是否携带id 查询，是则展示标题“企业详情”，否则展示“新建企业” -->
      <h1>{{ pageTitle() }}</h1>
    </div>

    <div class="card-padding card-padding-vertical">
      <el-form :model="companyForm" :rules="companyRules" ref="companyForm" label-width="100px">

        <h3 class="grid-title">企业信息</h3>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="进驻门店" prop="storeId">
              <el-select v-model="companyForm.storeId" placeholder="" width="100%" :disabled="notAllow">
                <el-option v-for="storeItem in storeList" :label="storeItem.storeName" :value="storeItem.id" :key="storeItem.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item label="公司号"><p :class="hasNum ? 'theme-red' : 'theme-gray'" class="form-static-txt">{{companyForm.code}}</p></el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="公司名称" prop="name">
              <el-input v-model.trim="companyForm.name" :disabled="notAllow"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="行业类别" prop="professionCode">
              <el-cascader
                :props="professionProps"
                :options="profession"
                :disabled="notAllow"
                v-model="companyForm.professionCode"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="公司人数" prop="companyScaleCode">
              <el-select v-model="companyForm.companyScaleCode" placeholder="请选择公司人数" width="100%" :disabled="notAllow">
                <el-option v-for="companyScale in companyScaleList" :label="companyScale.name" :value="companyScale.code" :key="companyScale.code"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!--<h3 class="grid-title">企业联系方式</h3>-->
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="企业联系人" prop="liablePerson"><el-input v-model.trim="companyForm.liablePerson" :disabled="notAllow"></el-input></el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="手机号码" prop="mobile"><el-input :maxlength="11" v-model.trim="companyForm.mobile" auto-complete="off" :disabled="notAllow"></el-input></el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="固定电话" prop="fixPhone"><el-input v-model.trim="companyForm.fixPhone" :disabled="notAllow"></el-input></el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="工作邮箱" prop="workEmail"><el-input v-model.trim="companyForm.workEmail" :disabled="notAllow"></el-input></el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-form-item class="button-row" label-width="0">
            <el-button
              v-if="!detailId"
              type="primary"
              @click="handleAddCompany('companyForm')"
              v-permissions="'/manage/company/addCompany'"
              :loading="saveLoading">{{ editTxt }}</el-button>
            <el-button
              v-if="detailId && handleHasPermissions('/manage/company/updateCompany')"
              type="primary"
              @click="handleEditCompany('companyForm')"
              v-permissions="'/manage/company/updateCompany'"
              :loading="saveLoading">{{ editTxt }}</el-button>
            <p v-if="!detailId" class="theme-gray">新增完成后，企业联系人会收到短信告知公司号</p>
          </el-form-item>
        </el-row>
      </el-form>

      <div class="compact-record" v-if="detailId">
        <h3 class="grid-title">合同记录</h3>
        <el-table border :data="compactRecord" v-loading="tableLoading">
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column label="签订时间" prop="startTime"></el-table-column>
          <el-table-column label="状态" prop="status">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 1">未生效</span>
              <span v-if="scope.row.status === 2">生效中</span>
              <span v-if="scope.row.status === 3">已完成</span>
            </template>
          </el-table-column>
          <el-table-column label="租赁场地" prop="rentGround"></el-table-column>
          <el-table-column label="场地租赁费" prop="rentCost">
            <template slot-scope="scope">
              <span>{{ scope.row.rentCost }}&nbsp;元/月</span>
            </template>
          </el-table-column>
          <el-table-column label="押金" prop="deposit">
            <template slot-scope="scope">
              <span v-if="scope.row.deposit">{{ scope.row.deposit }}&nbsp;元</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="合同期限" prop="endTime"></el-table-column>
          <el-table-column label="合同附件" prop="attachmentName">
            <template slot-scope="scope">
              <span v-if="!scope.row.attachmentName">未上传</span>
              <span
                class="table-link"
                @click="downCompactFile(scope.row.id)"
                v-else-if="handleHasPermissions('/manage/contract/downloadAttachment')">{{ scope.row.attachmentName }}</span>
              <span v-else>{{scope.row.attachmentName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" v-if="handleHasPermissions('/manage/contract/updateContract')">
            <template slot-scope="scope">
              <span class="table-link" @click="handleOpenCompact('edit', scope.row.id)" v-if="scope.row.status !== 3">编辑</span>
              <span class="table-link" @click="handleOpenCompact('readOnly', scope.row.id)" v-else>查看</span>
              <el-upload
                class="upload-compact"
                :action="uploadUrl"
                :headers="uploadHead"
                :data="uploadData"
                name="file"
                accept=".pdf, .doc, .docx"
                ref="uploadCompactFile"
                :multiple="false"
                :on-change="handleFileChange"
                :before-upload="beforeFileUpload"
                :show-file-list="false"
                :auto-upload="true"
                @click.native="getRecordId(scope.row.id)">
                <span class="table-link">上传附件</span>
              </el-upload>
            </template>
          </el-table-column>
        </el-table>

        <div class="button-row mt40">
          <el-button
            v-permissions="'/manage/contract/addContract'"
            type="primary" @click="handleOpenCompact('add')">{{ compactRecord.length === 0 ? '添加合同' : '续签合同' }}</el-button>
        </div>
      </div>

      <!-- 合同信息对话框 -->
      <el-dialog
        :title="compactTitle"
        :visible.sync="isShowCompact"
        :lock-scroll="false"
        :before-close="resetCompactForm">
        <el-form :model="compactForm" :rules="compactRules" ref="compactForm" label-width="100px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="租赁场地" prop="site" required>
                <p v-if="readOnly">{{ compactForm.site }}</p>
                <el-input @change="handleChangeFormItem" v-model.trim="compactForm.site" v-else></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="场地租赁费" prop="siteFee" required>
                <p v-if="readOnly" class="fl">{{ compactForm.siteFee }}</p>
                <el-input type="number" v-model.number="compactForm.siteFee" class="fl site-fee-ipt" v-else></el-input>
                <span :class="readOnly ? 'fl' : 'fr'"> 元/月</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="押金" prop="cashPledge">
                <p v-if="readOnly" class="fl">{{ compactForm.cashPledge ? compactForm.cashPledge : '' }}</p>
                <el-input type="number" v-model.number="compactForm.cashPledge" class="fl cash-pledge" v-else></el-input>
                <span :class="readOnly ? 'fl' : 'fr'">{{ !compactForm.cashPledge && readOnly ? '无' : '元' }}</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="起租日期" prop="inDate" required>
                <p v-if="readOnly" class="fl">{{ compactForm.inDate }}</p>
                <el-date-picker type="date" placeholder="选择日期" v-model="compactForm.inDate" style="width: 100%;" v-else></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合同期限" prop="expireDate" required>
                <p v-if="readOnly" class="fl">{{ compactForm.expireDate }}</p>
                <el-date-picker
                  type="date"
                  placeholder="选择日期"
                  v-model="compactForm.expireDate"
                  :picker-options="endTimeOption"
                  style="width: 100%;" v-else></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-form-item label-width="0" class="button-row">
              <el-button v-if="!uploadData.id" type="primary" @click="handleAddCompact('compactForm')" :loading="saveCompactLoading">{{ editCompactTxt }}</el-button>
              <el-button v-if="uploadData.id && !readOnly" type="primary" @click="handleUpdateCompact('compactForm', uploadData.id)" :loading="saveCompactLoading">{{ editCompactTxt }}</el-button>
              <el-button @click="resetCompactForm" :type="readOnly ? 'primary' : ''">{{ readOnly ? '确定' : '取消' }}</el-button>
            </el-form-item>
          </el-row>
        </el-form>
      </el-dialog>

    </div>
  </div>
</template>

<script>
  import handleHasPermissions from '@/config/com-mixins'
  import { PHONEREG, FIXPHONEREG, EMAILREG, API_PATH } from '@/config/env'
  import { formatTimeString, downloadFile } from '../../../config/utils'
  import { loadProfession, loadCompanyScale, findAllStore, addCompany, companyDetail, updateCompany, addContract, renewContract, updateContract } from '../../../service/index'
  export default {
    name: 'detail',
    mixins: [handleHasPermissions],
    data () {
      // 自定义手机号码校验规则
      var checkTel = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('手机号码不能为空'))
        }
        if (!PHONEREG.test(value)) {
          callback(new Error('手机号码不正确'))
        }
        callback()
      }
      // 自定义固定电话号码校验规则
      var checkFixPhone = (rule, value, callback) => {
        if (!value) {
          return callback()
        }
        if (!FIXPHONEREG.test(value)) {
          callback(new Error('固定电话号码格式不正确。例：020-8888888'))
        }
        callback()
      }
      // 自定义邮箱地址校验规则
      var checkEmail = (rule, value, callback) => {
        if (!value) {
          return callback()
        }
        if (!EMAILREG.test(value)) {
          callback(new Error('邮箱地址不正确'))
        }
        callback()
      }
      // 自定义正整数校验规则
      var validateIntegral = (rule, value, callback) => {
        if (value < 0 || value > 99999999) {
          callback(new Error('金额最小为0，最大8位数'))
        }
        if (value && value.toString().indexOf('.') !== -1) {
          callback(new Error('请确认输入正整数'))
        }
        callback()
      }
      // 自定义日期选择范围校验
      var validateStartTime = (rule, value, callback) => {
        if (!value) {
          return
        } else if (this.compactForm.expireDate && value >= this.compactForm.expireDate) {
          callback(new Error('起租日期须小于合同期限'))
        }
        callback()
      }
      var validateEndTime = (rule, value, callback) => {
        if (!value) {
          return
        } else if (this.compactForm.inDate && value <= this.compactForm.inDate) {
          callback(new Error('合同期限须大于起租日期'))
        }
        callback()
      }

      return {
        title: '企业信息管理',
        token: '',
        detailId: '', // 企业详情id
        hasNum: false, // 是否有公司号
        notAllow: false, // 不允许编辑控件
        editTxt: '编辑', // “编辑”或者“保存”按钮文本
        saveLoading: false, // 企业信息保存按钮loading状态
        editCompactTxt: '保存', // 合同信息“执行中”或者“保存”按钮文本
        saveCompactLoading: false, // 合同信息保存按钮loading状态
        isShowCompact: false, // 合同信息对话框显示状态
        compactTitle: '新增合同信息',

        // 级联行业类别
        profession: [],
        professionProps: {
          value: 'code',
          label: 'name',
          children: 'children'
        },
        // 企业规模列表
        companyScaleList: [],
        // 门店列表
        storeList: [],
        // 合同期限日期选择限制
        endTimeOption: {
          disabledDate(time) {
            return (time.getTime() + 3600 * 1000 * 24) < Date.now()
          }
        },

        // 企业信息表单字段及校验规则
        companyForm: {
          code: '由系统生成，员工通过公司号加入空间', // 公司号
          name: '', // 公司名称
          professionCode: [], // 行业code
          companyScaleCode: '', // 公司规模code
          liablePerson: '', // 联系人姓名
          mobile: '', // 手机号码
          fixPhone: '', // 固定电话
          workEmail: '', // 工作邮箱
          storeId: '' // 进驻门店
        },
        companyRules: {
          name: [
            { required: true, message: '请输入公司名称', trigger: 'blur, change' },
            { max: 40, message: '长度在 40 个字符以内', trigger: 'blur, change' }
          ],
          professionCode: [
            { type: 'array', required: true, message: '请选择行业类别', trigger: 'change' }
          ],
          companyScaleCode: [
            { required: true, message: '请选择公司规模', trigger: 'change' }
          ],
          liablePerson: [
            { required: true, message: '请输入负责人姓名', trigger: 'blur, change' },
            { max: 20, message: '长度在 20 个字符以内', trigger: 'blur, change' }
          ],
          mobile: [
            { required: true, validator: checkTel, trigger: 'blur, change' }
          ],
          fixPhone: [
            { validator: checkFixPhone, trigger: 'blur, change' }
          ],
          workEmail: [
            { validator: checkEmail, trigger: 'blur, change' }
          ],
          storeId: [
            { type: 'number', required: true, message: '请选择进驻门店', trigger: 'change' }
          ]
        },

        // 合同表单及校验规则
        compactForm: {
          site: '', // 租赁场地
          siteFee: '', // 场地租赁费
          cashPledge: '', // 押金
          inDate: '', // 进驻日期
          expireDate: '' // 合同期限
        },
        compactRules: {
          site: [
            { required: true, message: '请输入场地名称', trigger: 'blur, change' },
            { max: 20, message: '长度在 20 个字符以内', trigger: 'blur, change' }
          ],
          siteFee: [
            { required: true, message: '请输入场地租赁费', trigger: 'blur, change', type: 'number' },
            { validator: validateIntegral, trigger: 'blur, change' }
          ],
          cashPledge: [
            { validator: validateIntegral, trigger: 'blur, change', type: 'number' }
          ],
          inDate: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'blur, change' },
            { validator: validateStartTime, trigger: 'blur, change' }
          ],
          expireDate: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'blur, change' },
            { validator: validateEndTime, trigger: 'blur, change' }
          ]
        },
        compactRecord: [], // 合同记录
        tableLoading: false,
        readOnly: false, // 表单是否只读
        hasChangeForm: false, // 表单是否被修改

        // 上传文件
        uploadUrl: API_PATH + '/manage/contract/uploadAttachment',
        uploadHead: {
          token: sessionStorage.getItem('token')
        },
        uploadData: {
          // companyId: '',
          id: ''
        }
      }
    },
    props: {},
    components: {},
    mounted () {
      this.token = sessionStorage.getItem('token')
      this.editTxt = (this.notAllow) ? '编辑' : '保存'

      // 获取行业信息
      loadProfession({token: this.token}).then(res => {
        if (res.status === 'true') {
          this.profession = res.info
        } else {
          console.log(res.msg)
        }
      })
      // 获取可选的企业规模列表
      loadCompanyScale({token: this.token}).then(res => {
        if (res.status === 'true') {
          this.companyScaleList = res.info
        } else {
          console.log(res.msg)
        }
      })
      // 获取门店列表
      findAllStore({token: this.token}).then(res => {
        if (res.status === 'true') {
          this.storeList = res.info
        } else {
          console.log(res.msg)
        }
      })

      // 通过判断路由是否携带id 查询，有则展示“企业详情”，否则为“新建企业”
      this.detailId = this.$route.query.id ? this.$route.query.id : ''
      if (this.detailId) {
        // 企业详情展示时，默认不可编辑（点击“编辑”按钮后才转为可编辑状态）；点击编辑进入时，表单为可编辑状态
        this.notAllow = !(this.$route.query.edit)
        this.editTxt = (this.notAllow) ? '编辑' : '保存'

        // 记录企业id 用于关联上传附件
        // this.uploadData.companyId = this.detailId

        // 查询企业详情
        this.getCompanyDetail()
      }
    },
    watch: {},
    computed: {
      compactFormStr: function () {
        // if (this.uploadData.id) {}
        return this.compactForm.site + this.compactForm.siteFee + this.compactForm.cashPledge +
               (this.compactForm.inDate ? this.compactForm.inDate : '') +
               (this.compactForm.expireDate ? this.compactForm.expireDate : '')
      }
    },
    filters: {},
    methods: {
      handleChangeFormItem() {
        console.log('has Change')
        if (this.$refs['compactForm']) {
          this.$refs['compactForm'].clearValidate()
        }
      },
      pageTitle: function () {
        if (this.notAllow && this.detailId) {
          this.editTxt = '编辑'
          document.title = this.title = '企业详情'
        } else if (this.detailId) {
          this.editTxt = '保存'
          document.title = this.title = '编辑企业信息'
        } else {
          this.editTxt = '保存'
          document.title = this.title = '新建企业'
        }
        this.$store.commit('NAV_CRUMB', this.title)
        return this.detailId === '' ? '新建企业' : '企业详情'
      },

      // 企业详情
      getCompanyDetail() {
        const _this = this
        const paramsObj = {
          companyId: _this.detailId
        }
        _this.tableLoading = true
        companyDetail(paramsObj).then(res => {
          if (res.status === 'true') {
            _this.tableLoading = false
            // 企业信息
            _this.hasNum = true
            _this.companyForm.code = res.info.code
            _this.companyForm.name = res.info.name
            _this.companyForm.professionCode = [res.info.professionCode.slice(0, 4), res.info.professionCode]
            _this.companyForm.companyScaleCode = res.info.companyScaleCode
            _this.companyForm.liablePerson = res.info.liablePerson
            _this.companyForm.mobile = res.info.mobile
            _this.companyForm.workEmail = res.info.workEmail
            _this.companyForm.fixPhone = res.info.fixPhone
            _this.companyForm.storeId = res.info.storeId
            // 合同信息
            _this.compactRecord = res.info.contract
            for (let i = 0; i < _this.compactRecord.length; i++) {
              _this.compactRecord[i].startTime = res.info.contract[i].startTime ? res.info.contract[i].startTime.split(' ')[0] : null
              _this.compactRecord[i].endTime = res.info.contract[i].endTime ? res.info.contract[i].endTime.split(' ')[0] : null
            }
          } else {
            console.log(res.msg)
          }
        })
      },
      // 创建企业
      handleAddCompany(formName) {
        const _this = this
        _this.saveLoading = true
        _this.editTxt = '执行中…'
        const addParams = {
          name: _this.companyForm.name,
          professionCode: _this.companyForm.professionCode[1],
          companyScaleCode: _this.companyForm.companyScaleCode,
          liablePerson: _this.companyForm.liablePerson,
          mobile: _this.companyForm.mobile,
          workEmail: _this.companyForm.workEmail,
          fixPhone: _this.companyForm.fixPhone,
          storeId: _this.companyForm.storeId
        }
        _this.$refs[formName].validate((valid) => {
          if (valid) {
            addCompany(addParams).then(res => {
              if (res.status === 'true') {
                _this.saveLoading = false
                _this.editTxt = '编辑'
                _this.notAllow = true
                _this.detailId = res.info.companyId // 添加企业成功后返回的企业id
                _this.$message({
                  type: 'success',
                  message: '企业添加成功！'
                })
                setTimeout(() => {
                  _this.$router.replace('/member/enterprise/detail?id=' + this.detailId)
                }, 300)
              } else {
                _this.saveLoading = false
                _this.editTxt = '保存'
                _this.$message({
                  type: 'error',
                  message: res.msg
                })
              }
            })
          } else {
            // console.log('error submit!!')
            _this.saveLoading = false
            _this.editTxt = '保存'
            return false
          }
        })
      },
      // 编辑企业
      handleEditCompany(formName) {
        if (this.notAllow) {
          this.notAllow = false
          this.editTxt = '保存'
        } else {
          const _this = this
          _this.saveLoading = true
          _this.editTxt = '执行中…'
          const updateParams = {
            id: _this.detailId,
            name: _this.companyForm.name,
            professionCode: _this.companyForm.professionCode[1],
            companyScaleCode: _this.companyForm.companyScaleCode,
            liablePerson: _this.companyForm.liablePerson,
            mobile: _this.companyForm.mobile,
            workEmail: _this.companyForm.workEmail,
            fixPhone: _this.companyForm.fixPhone,
            storeId: _this.companyForm.storeId
          }
          this.$refs[formName].validate((valid) => {
            if (valid) {
              updateCompany(updateParams).then(res => {
                if (res.status === 'true') {
                  _this.saveLoading = false
                  _this.editTxt = '编辑'
                  _this.$message({
                    type: 'success',
                    message: '修改成功！'
                  })
                  _this.notAllow = true
                  // setTimeout(() => {
                  //   _this.$router.replace('/member/enterprise')
                  // }, 800)
                } else {
                  _this.saveLoading = false
                  _this.editTxt = '保存'
                  _this.$message({
                    type: 'error',
                    message: res.msg
                  })
                }
              })
            } else {
              _this.saveLoading = false
              _this.editTxt = '保存'
              return false
            }
          })
        }
      },

      // 新增或续签合同信息
      handleAddCompact(formName) {
        if (this.detailId) {
          const _this = this
          _this.saveCompactLoading = true
          _this.editCompactTxt = '执行中…'
          _this.$refs[formName].validate((valid) => {
            if (valid) {
              let compactParams = {
                companyId: _this.detailId,
                rentGround: _this.compactForm.site,
                rentCost: _this.compactForm.siteFee,
                deposit: _this.compactForm.cashPledge,
                startTime: formatTimeString(_this.compactForm.inDate),
                endTime: formatTimeString(_this.compactForm.expireDate)
              }
              if (_this.compactRecord.length === 0) {
                // 若不存在合同记录，则调用新增合同的接口
                addContract(compactParams).then(res => {
                  if (res.status === 'true') {
                    _this.saveCompactLoading = false
                    _this.editCompactTxt = '保存'
                    _this.isShowCompact = false
                    _this.$message.success('添加成功！')
                    _this.getCompanyDetail()
                  } else {
                    _this.saveCompactLoading = false
                    _this.editCompactTxt = '保存'
                    _this.$message.error(res.msg)
                  }
                })
              } else {
                // 若存在合同记录，则调用续签合同
                renewContract(compactParams).then(res => {
                  if (res.status === 'true') {
                    _this.saveCompactLoading = false
                    _this.editCompactTxt = '保存'
                    _this.isShowCompact = false
                    _this.$message.success('续签成功！')
                    _this.getCompanyDetail()
                  } else {
                    _this.saveCompactLoading = false
                    _this.editCompactTxt = '保存'
                    _this.$message.error(res.msg)
                  }
                })
              }
            } else {
              _this.saveCompactLoading = false
              _this.editCompactTxt = '保存'
              return false
            }
          })
        }
      },
      // 编辑合同信息
      handleUpdateCompact(formName, id) {
        const _this = this
        _this.saveCompactLoading = true
        _this.editCompactTxt = '执行中…'
        _this.$refs[formName].validate((valid) => {
          if (valid) {
            let updateCompactParams = {
              id: id,
              companyId: _this.detailId,
              rentGround: _this.compactForm.site,
              rentCost: _this.compactForm.siteFee,
              deposit: _this.compactForm.cashPledge,
              startTime: formatTimeString(_this.compactForm.inDate),
              endTime: formatTimeString(_this.compactForm.expireDate)
            }
            updateContract(updateCompactParams).then(res => {
              if (res.status === 'true') {
                _this.saveCompactLoading = false
                _this.editCompactTxt = '保存'
                _this.isShowCompact = false
                _this.$message.success('修改成功！')
                _this.getCompanyDetail()
              } else {
                _this.saveCompactLoading = false
                _this.editCompactTxt = '保存'
                _this.$message.error(res.msg)
              }
            })
          } else {
            _this.saveCompactLoading = false
            _this.editCompactTxt = '保存'
            return false
          }
        })
      },
      // 打开合同信息弹窗
      handleOpenCompact(type, id) {
        const _this = this
        _this.readOnly = false
        _this.hasChangeForm = false // 每次打开时默认表单没有被修改

        _this.getRecordDetail(id) // 获取合同详情
        _this.isShowCompact = true

        // 侦听合同记录id切换
        _this.$watch('uploadData.id', {
          handler: function (val, oldVal) {
            if ((oldVal !== '' && val !== oldVal) || !val) { // 排除第一次打开合同详情时的变化
              _this.hasChangeForm = false
            }
          }
        })
        _this.$watch('readOnly', {
          handler: function (val, oldVal) {
            if (oldVal === true) {
              _this.hasChangeForm = false
            }
          }
        })
        // 合同详情加载以后侦听表单内容修改
        _this.$watch('compactFormStr', {
          handler: function (val, oldVal) {
            // console.log(val, '\n' + oldVal)
            if (!val) {
              _this.hasChangeForm = false
              return
            }
            _this.hasChangeForm = val !== oldVal
          }
        })

        if (id != null) {
          // 如果是编辑合同信息
          if (type === 'edit') {
            _this.uploadData.id = id
            _this.compactTitle = '合同编辑'
            _this.readOnly = false
          }

          // 如果是查看合同信息
          if (type === 'readOnly') {
            _this.uploadData.id = id
            _this.compactTitle = '合同信息'
            _this.readOnly = true
            _this.getRecordDetail(id) // 获取合同详情
          }
        }
        // 如果是添加合同记录
        if (type === 'add' && !id) {
          _this.readOnly = false
          _this.uploadData.id = id
          if (_this.compactRecord.length === 0) {
            _this.compactTitle = '新增合同信息'
          } else {
            _this.compactTitle = '合同续签'
          }
          if (_this.$refs['compactForm']) {
            _this.$refs['compactForm'].clearValidate()
            // _this.hasChangeForm = false
          }
          _this.isShowCompact = true
        }
      },
      // 取消操作合同信息
      resetCompactForm() {
        const _this = this
        if (_this.hasChangeForm && !_this.readOnly) {
          _this.$confirm('修改尚未保存，确定取消操作吗？', {
            lockScroll: false
          }).then(() => {
            _this.getRecordDetail(_this.uploadData.id)
            _this.$refs['compactForm'].clearValidate()
            _this.isShowCompact = false
          })
        } else {
          _this.$refs['compactForm'].clearValidate()
          _this.isShowCompact = false
        }
      },
      // 获取合同信息
      getRecordDetail(id) {
        if (id) {
          const targetRecord = this.compactRecord.find((target) => {
            return target.id === id
          })
          this.compactForm.site = targetRecord.rentGround
          this.compactForm.siteFee = targetRecord.rentCost
          this.compactForm.cashPledge = targetRecord.deposit
          this.compactForm.inDate = this.readOnly ? targetRecord.startTime : new Date(targetRecord.startTime)
          this.compactForm.expireDate = this.readOnly ? targetRecord.endTime : new Date(targetRecord.endTime)
        } else {
          this.compactForm.site = ''
          this.compactForm.siteFee = ''
          this.compactForm.cashPledge = ''
          this.compactForm.inDate = ''
          this.compactForm.expireDate = ''
          if (this.$refs['compactForm']) {
            setTimeout(() => {
              this.$refs['compactForm'].clearValidate()
            }, 0)
          }
        }
      },

      // 获取合同id
      getRecordId(id) {
        this.uploadData.id = id
      },
      // 文件状态改变时
      handleFileChange(file, fileList) {
        // console.log(file, fileList)
        // 若上传成功
        if (file.status === 'success') {
          this.$message.success('上传成功！')
          this.getCompanyDetail()
        }
        // 若上传失败
        if (file.status === 'error') {
          this.$message.error('Oh no! 上传失败了！')
        }
      },
      // 上传之前文件过滤
      beforeFileUpload(file) {
        // 格式限制 pdf 或者 word文档，大小不超过10M
        const isXls = file.type === 'application/pdf' || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        const isLt4M = file.size / 1024 / 1024 < 10

        if (!isXls) {
          this.$message.error('文件暂只支持 word文档 或者 pdf 格式!')
        }
        if (!isLt4M) {
          this.$message.error('上传文件大小不能超过 10MB!')
        }

        return isXls && isLt4M
      },
      // 下载合同
      downCompactFile(id) {
        const downParams = {
          id: id
        }
        let url = API_PATH + '/manage/contract/downloadAttachment'
        downloadFile(url, downParams)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../styles/config";
  .enterprise-detail {
    .form-static-txt {
      white-space: nowrap;
    }

    .el-select, .el-cascader {
      display: block;
    }

    .button-row {
      margin-top: 20px;
      margin-bottom: 0;
      margin-left: 0;
      text-align: center;

      &.mt40 {
        margin-top: 40px;
      }

      button {
        width: auto;
        min-width: 120px;
      }

      p {
        margin-top: 0;
      }
    }

    .site-fee-ipt {
      width: calc(100% - 40px);
    }
    .cash-pledge {
      width: calc(100% - 20px);
    }
    .upload-compact {
      display: inline-block;

      button, .el-upload__tip {
        margin-top: 0;
        margin-right: 10px;
      }
    }
  }
</style>

<style lang="scss">
  .enterprise-detail {
    .el-upload-list__item:first-child {
      margin-top: 5px;
    }
  }
</style>
