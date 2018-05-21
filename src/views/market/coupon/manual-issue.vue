<template>
  <div class="manual-issue">
    <lh-title />

    <div class="lh-card-main card-padding">
      <el-steps :active="active" align-center>
        <el-step title="选择卡券"></el-step>
        <el-step title="选择会员"></el-step>
        <el-step title="发放结果"></el-step>
      </el-steps>

      <!-- 选择卡券 -->
      <div class="step-cont" v-if="active === 1">选择卡券</div>

      <!-- 选择会员 -->
      <div class="step-cont" v-if="active === 2">选择会员</div>

      <!-- 发放结果 -->
      <div class="step-cont" v-if="active === 3">发放结果</div>

      <div class="button-bar">
        <el-button v-if="active === 2" @click="prev">返回上一步</el-button>
        <el-button v-if="active === 1" type="primary" @click="next">下一步</el-button>
        <el-button v-if="active === 2" type="primary" @click="next">确 定</el-button>
        <el-button v-if="active === 3" @click="next">返回列表</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'manual-issue',
    data() {
      return {
        active: 1
      }
    },
    mounted() {
    },
    methods: {
      prev() {
        if (this.active-- < 1) this.active = 1
      },
      next() {
        if (this.active++ > 2) this.active = 1
      }
    }
  }
</script>

<style lang="scss" scoped>
  .manual-issue {
    .button-bar {
      text-align: center;
    }
  }
</style>
