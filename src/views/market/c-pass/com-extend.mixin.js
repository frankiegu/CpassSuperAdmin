export default {
  methods: {
    closeDialog() {
      this.showPreview = false
      this.dialogStatus = false
    },
    showInsertDialog(type) {
      this.teamVisible = true
      // switch (type) {
      //   case 1:
      //   break;
      //   case 2:
      //   break;
      //   case 3:
      //   break;
      // }
    },

    closeTeamDialog(teamData) {
      // console.log('closeTeamDialog', teamData);
      this.teamVisible = false

      // 第一次渲染添加场地弹出框请求接口数据，往后再不请求品牌、空间、场地列表数据
      if (!this.renderSelectField) {
        this.renderSelectField = true
      }

      if (teamData) {
        if (teamData.idx === 'add') {
          // this.teamsData.push(teamData)
        } else {
          // this.teamsData.splice(teamData.idx, 1, teamData)
        }
      }

      // 清空数据
      if (this.teamData.spaceId) {
        this.teamData = { ...this.teamDefaultData }
      }
      // console.log('closeTeamDialog', this.teamData)
    }
  }
}
