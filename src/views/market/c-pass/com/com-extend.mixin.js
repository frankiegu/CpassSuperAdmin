export default {
  methods: {
    closeDialog() {
      console.log('closeDialog');

      this.showPreview = false
    },
    showInsertDialog(type) {
      if (this.noAllow) return

      this.showInsert = true
      this.insertType = type
      switch (type) {
        case 'title':
          break
        case 'store':
          break
        case 'field':
          break
      }

      console.log('type', this.insertType);
    },

    closeInsertDialog(teamData) {
      // console.log('closeTeamDialog', teamData);
      this.showInsert = false

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
