<template>
  <div class="fixed-assets-register">
    <div class="page-title"><h1>固资登记</h1></div>

    <div class="card-padding">
      <el-form :model="assetsRegForm" :rules="assetsRegRules" ref="assetsRegForm" label-width="100px">
        <el-form-item label="操作类型" prop="operationType">
          <el-radio-group v-model="assetsRegForm.operationType" @change="toggleType">
            <el-radio-button :label="0" :key="0">领用</el-radio-button>
            <el-radio-button :label="1" :key="1">归还</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          :required="assetsRegForm.operationType === 0"
          label="领用公司"
          prop="companyArr"
          v-show="assetsRegForm.operationType === 0">
          <el-select
            class="width300px"
            v-model="assetsRegForm.companyArr"
            placeholder="请选择"
            value-key="id"
            filterable
            multiple
            @change="handleChangeCompany">
            <el-option
              v-for="item in companyList"
              :key="item.id"
              :label="item.name"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          :required="assetsRegForm.operationType === 1"
          label="归还公司"
          prop="singleCompany"
          v-show="assetsRegForm.operationType === 1">
          <el-select
            class="width300px"
            v-model="assetsRegForm.singleCompany"
            placeholder="请选择"
            value-key="id"
            filterable
            style="height: 36px"
            @change="handleChangeCompany">
            <el-option
              v-for="item in companyList"
              :key="item.id"
              :label="item.name"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>

        <!-- 选中的公司列表 -->
        <el-form-item>
          <el-table :data="selectedCompany" max-height="241" border style="width: 80%">
            <el-table-column label="所属门店" prop="storeName"></el-table-column>
            <el-table-column label="企业名称" prop="name"></el-table-column>
          </el-table>
        </el-form-item>

        <el-form-item
          :required="assetsRegForm.operationType === 0"
          label="领用固资"
          prop="assetsIds"
          v-if="assetsRegForm.operationType === 0">
          <el-select
            class="width300px"
            v-model="assetsRegForm.assetsIds"
            placeholder="请选择"
            value-key="id"
            filterable
            multiple
            @change="handleChangeAssets">
            <el-option
              v-for="item in assetsList"
              :key="item.id"
              :label="item.assertName"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>

        <!-- 选中的固资列表 -->
        <el-form-item
          :label="assetsRegForm.operationType === 1 ? '归还固资' : ''"
          prop="assetsSize">
          <el-table :data="selectedAssets" max-height="241" border style="width: 80%;">
            <el-table-column label="固资名称" prop="assertName"></el-table-column>
            <el-table-column label="规格型号" prop="assertType"></el-table-column>

            <el-table-column label="领用数量" prop="size">
              <template slot-scope="scope">
                <el-input-number
                  v-if="assetsRegForm.operationType === 0"
                  v-model="scope.row.amount"
                  :min="1"
                  :max="99"
                  style="width: 140px"
                  @change="getAssetsSize">
                </el-input-number>
                <span v-else>{{scope.row.size}}</span>
              </template>
            </el-table-column>

            <el-table-column label="归还数量" v-if="assetsRegForm.operationType === 1">
              <template slot-scope="scope">
                <el-input-number
                  v-model="scope.row.amount"
                  :min="0"
                  :max="scope.row.size"
                  style="width: 140px"
                  @change="getAssetsSize">
                </el-input-number>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

        <el-form-item label-width="0" class="text-center">
          <el-button type="primary" class="width120px" @click="handleRegister">登记</el-button>
          <el-button class="width120px" @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {companyListAll, spaceAssert, findFetchedAssert, recordAssert} from '@/service'
  export default {
    name: 'register',
    data () {
      const checkCompanyArr = (rule, value, callback) => {
        if (this.assetsRegForm.operationType === 0) {
          if (!value || !value.length) {
            callback(new Error('请选择领用公司'))
          }
          callback()
        } else {
          callback()
        }
      }
      const checkSingleCompany = (rule, value, callback) => {
        if (this.assetsRegForm.operationType === 1) {
          if (!value) {
            callback(new Error('请选择归还公司'))
          }
          callback()
        } else {
          callback()
        }
      }
      const checkAssetsIds = (rule, value, callback) => {
        if (this.assetsRegForm.operationType === 0) {
          if (!value || !value.length) {
            callback(new Error('请选择领用固资'))
          }
          callback()
        } else {
          callback()
        }
      }
      const checkAssetsSize = (rule, value, callback) => {
        if (this.assetsRegForm.operationType === 1 && this.selectedAssets.length !== 0) {
          if (!value || !value.length) {
            callback(new Error('请输入归还数量'))
          } else {
            let sum = 0
            for (let i = 0; i < value.length; i++) {
              sum += value[i]
            }
            if (sum === 0) {
              callback(new Error('请输入归还数量'))
            } else {
              callback()
            }
          }
        } else {
          callback()
        }
      }
      return {
        assetsRegForm: {
          operationType: 0,
          companyArr: [],
          singleCompany: '',
          assetsIds: [],
          assetsSize: []
        },
        assetsRegRules: {
          companyArr: [
            {validator: checkCompanyArr, type: 'array', trigger: 'blur, change'}
          ],
          singleCompany: [
            {validator: checkSingleCompany, trigger: 'blur, change'}
          ],
          assetsIds: [
            {validator: checkAssetsIds, type: 'array', trigger: 'blur, change'}
          ],
          assetsSize: [
            {validator: checkAssetsSize, type: 'array', trigger: 'blur, change'}
          ]
        },

        // 公司列表
        companyList: [],
        selectedCompany: [],
        selectedCompanyIds: [],

        // 固资列表
        assetsList: [],
        selectedAssets: [],
        selectedAssetsIds: []
      }
    },
    props: {},
    components: {},
    mounted () {
      // 查询公司列表
      this.findCompanyList()
      // 查询固资列表
      this.findAssetsListAll()
    },
    watch: {},
    computed: {
      hasChangeForm: function () {
        return !!(this.assetsRegForm.companyArr.length || this.assetsRegForm.singleCompany)
      }
    },
    filters: {},
    methods: {
      // 查询公司列表
      findCompanyList() {
        companyListAll().then(res => {
          if (res.status === 'true') {
            this.companyList = res.info
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      // 查询固资列表
      findAssetsListAll() {
        spaceAssert().then(res => {
          if (res.status === 'true') {
            this.assetsList = res.info.result
          } else {
            this.$message.error(res.msg)
          }
        })
      },

      // 切换登记类型时重置选中的选项
      toggleType(val) {
        this.assetsRegForm.companyArr = []
        this.assetsRegForm.singleCompany = ''
        this.assetsRegForm.assetsIds = []
        this.selectedCompany = []
        this.selectedCompanyIds = []
        this.selectedAssets = []
        this.selectedAssetsIds = []
        this.assetsRegForm.assetsSize = []
        if (this.assetsRegForm.operationType === 0) {
          for (let i = 0; i < this.selectedAssets.length; i++) {
            this.selectedAssets[i].amount = 1
          }
        }
        if (this.$refs['assetsRegForm']) {
          this.$refs['assetsRegForm'].clearValidate()
        }
      },
      // 选择登记公司
      handleChangeCompany(val) {
        this.selectedCompany = []
        this.selectedCompanyIds = []
        /*
        ** 领用固资时多选公司
        ** 归还固资时单选公司且查找公司下的固资领取列表
        */
        if (this.assetsRegForm.operationType === 0) {
          for (let i = 0; i < val.length; i++) {
            this.selectedCompanyIds.push(val[i].id)
          }
        } else {
          this.selectedCompanyIds.push(val.id)
          this.findFetchedAssets(val.id)
        }
        this.assetsRegForm.operationType === 0 ? this.selectedCompany = val : this.selectedCompany.push(val)
      },

      // 选择登记固资
      handleChangeAssets(val) {
        this.selectedAssets = []
        this.selectedAssetsIds = []
        this.assetsRegForm.assetsSize = []
        for (let i = 0; i < val.length; i++) {
          this.selectedAssetsIds.push(val[i].id)
          this.assetsRegForm.assetsSize.push(val[i].amount || 1)
        }
        this.selectedAssets = val
      },

      // 获取固资数量
      getAssetsSize(value) {
        this.assetsRegForm.assetsSize = []
        this.$nextTick(() => {
          for (let i = 0; i < this.selectedAssets.length; i++) {
            this.selectedAssets[i].amount = this.selectedAssets[i].amount ? this.selectedAssets[i].amount : 0
            if (this.selectedAssets[i].amount.toString().indexOf('.') !== -1) {
              this.$nextTick(() => {
                this.assetsRegForm.assetsSize[i] = this.selectedAssets[i].amount = value = parseInt(this.selectedAssets[i].amount)
              })
            }
            this.assetsRegForm.assetsSize.push(this.selectedAssets[i].amount)
          }
        })
      },

      // 查询公司已领取的固资
      findFetchedAssets(companyId) {
        this.selectedAssetsIds = []
        this.assetsRegForm.assetsSize = []
        findFetchedAssert({
          companyId: companyId
        }).then(res => {
          if (res.status === 'true' && res.info) {
            this.selectedAssets = res.info.result
            for (let i = 0; i < this.selectedAssets.length; i++) {
              this.selectedAssetsIds.push(this.selectedAssets[i].id)
            }
          } else {
            this.$message.error(res.msg)
          }
        })
      },

      // 取消登记
      handleCancel() {
        if (this.hasChangeForm) {
          this.$confirm('确认取消登记并跳转至固资列表页吗？', '确认取消？', {
            lockScroll: false
          }).then(_ => {
            this.$router.replace('/fixed/assets')
          }).catch(_ => {
            return false
          })
        } else {
          this.$router.replace('/fixed/assets')
        }
      },

      // 提交登记
      handleRegister() {
        let obj = {
          companyIds: this.selectedCompanyIds,
          assertIds: this.selectedAssetsIds,
          size: this.assetsRegForm.assetsSize,
          operationType: this.assetsRegForm.operationType
        }
        if (this.assetsRegForm.singleCompany && !this.selectedAssets.length) {
          this.$message.info('该公司未领用固资')
          return
        }
        this.$refs['assetsRegForm'].validate((valid) => {
          if (valid) {
            recordAssert(obj).then(res => {
              if (res.status === 'true') {
                if (this.assetsRegForm.operationType === 0) {
                  this.$message.success('领用登记成功！')
                  this.toggleType()
                } else {
                  this.$message.success('归还登记成功！')
                  this.findFetchedAssets(this.selectedCompanyIds[0])
                  setTimeout(() => {
                    if (this.$refs['assetsRegForm']) {
                      this.$refs['assetsRegForm'].clearValidate()
                    }
                  }, 100)
                }
              } else {
                this.$message.error(res.msg)
              }
            })
          } else {
            // this.$message.error('表单未完成')
            return false
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .fixed-assets-register {
    .el-tag {
      height: 20px;
      line-height: 18px;
    }
  }
</style>

<style lang="scss" scoped>
  .fixed-assets-register {
    .el-table {
      line-height: normal;
    }
  }
</style>
