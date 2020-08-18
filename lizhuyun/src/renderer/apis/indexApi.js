import data from '@/utils/request'
const request = data.service
const requestList = {
  getUserType (data = {}) { // 获取用户类型信息
    return request({
      url: '/jt/mainIndex/getUserBaseInfo',
      method: 'post',
      data
    })
  },
  readMessageNotice (data = {}) { // 获取消息公告未读信息
    return request({
      url: '/jt/mainIndex/isNewMsgAndNotice',
      method: 'get',
      data
    })
  },
  getNewNoticeTitle (data = {}) { // 获取消息公告轮播列表
    return request({
      url: '/jt/mainIndex/getNewNoticeTitle',
      method: 'post',
      data
    })
  }
}
export default requestList
