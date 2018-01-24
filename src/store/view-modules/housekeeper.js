const housekeeper = {
  state: {
    monitorClick: null,
    dialogTitle: '',
    dialogVisible: false
  },

  getters: {
    getMonitorClick: state => state.monitorClick,
    getDialogTitle: state => state.dialogTitle,
    getDialogVisible: state => state.dialogVisible
  },

  mutations: {
    SET_MONITORCLICK: (state, value) => {
      state.monitorClick = value
    },
    SET_DIALOGTITLE: (state, value) => {
      state.dialogTitle = value
    },
    SET_DIALOGVISIBLE: (state, value) => {
      state.dialogVisible = value
    }
  }
};

export default housekeeper;
