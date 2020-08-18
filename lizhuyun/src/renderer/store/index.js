import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const state = {
  // 消息是否已读
  isReadMessage: false,
  // 公告是否已读
  isReadNotice: false,
  hash: '',
  // 试件统计开始时间
  StartTime: '',
  // 试件统计结束时间
  EndTime: '',
  // 选择时间
  timeSelectText: '',
  // 系统时间
  serviceTime: '',
  // 用户信息
  waitUserTypeStatus: '',
  objUserInfo: {},
  projectIDs: '',
  // 记录当前页面
  currentPage: '',
  // 触发刷新指定页面函数的指令；
  refresh: 0,
  // 弹出简报信息
  bulletinMsg: {},
  // 养护状态控制
  curingControl: '',
  roleList: [],
  port: 'http://192.168.1.85:8080',
  projectList: [],
  projectNum: 0
}
const getters = {
  getIsReadMessage (state) {
    return state.isReadMessage
  },
  getIsReadNotice (state) {
    return state.isReadNotice
  },
  getHash (state) {
    return state.hash
  },
  getStartTime (state) {
    return state.StartTime
  },
  getEndTime (state) {
    return state.EndTime
  },
  getTimeSelectText (state) {
    return state.timeSelectText
  },
  getServiceTime (state) {
    return state.serviceTime
  },
  getWaitUserTypeStatus (state) {
    return state.waitUserTypeStatus
  },
  getObjUserInfo (state) {
    return state.objUserInfo
  },
  getProjectIDs (state) {
    return state.projectIDs
  },
  getCurrentPage (state) {
    return state.currentPage
  },
  getRefresh (state) {
    return state.refresh
  },
  getBulletinMsg (state) {
    return state.bulletinMsg
  },
  getCuringControlStatus (state) {
    return state.curingControl
  },
  getRoleList (state) {
    return state.roleList
  },
  getPort (state) {
    return state.port
  },
  getProjectList (state) {
    return state.projectList
  },

  getProjectNum (state) {
    return state.projectNum
  }
}

const mutations = {
  setIsReadMessage (state, newIsReadMessage) {
    state.isReadMessage = newIsReadMessage
  },
  setIsReadNotice (state, newIsReadNotice) {
    state.isReadNotice = newIsReadNotice
  },
  setHash (state, newHash) {
    state.hash = newHash
  },
  setStartTime (state, newTime) {
    state.StartTime = newTime
  },
  setEndTime (state, newTime) {
    state.EndTime = newTime
  },
  setTimeSelectText (state, newTime) {
    state.timeSelectText = newTime
  },
  setServiceTime (state, newTime) {
    state.serviceTime = newTime
  },
  SetWaitUserTypeStatus (state, newUser) {
    state.waitUserTypeStatus = newUser
  },
  setObjUserInfo (state, newObj) {
    state.objUserInfo = newObj
  },
  setProjectIDs (state, newObj) {
    state.projectIDs = newObj
  },
  setCurrentPage (state, newPage) {
    state.currentPage = newPage
  },
  setRefresh (state, newIncident) {
    state.refresh = newIncident
  },
  setBulletinMsg (state, newMsg) {
    state.bulletinMsg = newMsg
  },
  setCuringControlStatus (state, newMsg) {
    state.curingControl = newMsg
  },
  setRoleList (state, role) {
    state.roleList.push(role)
  },
  clearRoleList (state) {
    state.roleList = []
  },

  setProjectList (state, role) {
    state.projectList.push(role)
  },
  clearProjectList (state) {
    state.projectList = []
  },
  setProjectNum (state, num) {
    state.projectNum = num
  }
}
const actions = {}
const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
export default store
