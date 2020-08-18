import axios from 'axios'
import Qs from 'qs'
const globalData = require('electron').remote.getGlobal('sharedObject')
// axios.defaults.withCredentials=true;
const BASE_API = globalData.domainName
const port = ':' + globalData.portNumber
const VIDEO_BASE_API = globalData.videoName
const VIDEO_PORT = ':' + globalData.videoPort
const YANGCHEN_BASE_API = globalData.yangchenName
const YANGCHEN_PORT = ':' + globalData.yangchenPort
axios.defaults.withCredentials = true
const service = axios.create({
  baseURL: BASE_API,
  timeout: 30000
})
service.interceptors.request.use(
  config => {
    config.baseURL = 'http://' + BASE_API + port
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
    if (config.data.isHttp) {
      config.baseURL = 'http://221.10.254.184:10008'
      delete config.data.isHttp
    }
    if (config.data.isYangchen) {
      config.baseURL = 'http://' + YANGCHEN_BASE_API + YANGCHEN_PORT
      delete config.data.isYangchen
    }
    if (config.data.isVideo) {
      config.baseURL = 'http://' + VIDEO_BASE_API + VIDEO_PORT
      delete config.data.isVideo
    }
    if (config.method == 'get') {
      config.params = config.data
    }
    config.data = Qs.stringify(config.data)
    config.headers['Token'] = localStorage.getItem('token')
    config.headers['UserID'] = localStorage.getItem('userID')
    // config.headers['Accept'] = 'application/json;charset=utf-8'
    return config
  },
  error => {
    // 这里处理一些请求出错的情况
    const data = error.response.data
    console.error(data, 111111222)
    Promise.reject(error)
  }
)
// response 拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    // 这里处理一些response 正常放回时的逻辑
    // console.log(res, '请求的数据');
    return res
  },
  error => {
    // 这里处理一些response 出错时的逻辑
    return Promise.reject(error)
  }
)

export default {BASE_API, service}
