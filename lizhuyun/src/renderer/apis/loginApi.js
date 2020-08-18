import data from '@/utils/request'
const request = data.service
const requestList = {
  resetPassword (data = {}) { // 重置密码
    return request({
      url: '/login/userPwdEdit',
      method: 'post',
      data
    })
  },
  vsPhoneCode (data = {}) { // 验证验证码是否正确
    return request({
      url: '/login/verificationCodeCheck',
      method: 'post',
      data
    })
  },
  getVerificationCode (data = {}) { // 获取手机验证码
    return request({
      url: '/login/verificationCode',
      method: 'post',
      data
    })
  },
  userPhoneVerify (data = {}) { // 手机号验证
    return request({
      url: '/login/getPhoneNumberCheck',
      method: 'post',
      data
    })
  },
  editFirstUserLogin (data = {}) { // 首次登录修改密码
    return request({
      url: '/auth/userInfo/editFirstUserLogin',
      method: 'post',
      data
    })
  },
  userLogin (data = {}) { // 用户登录
    return request({
      url: '/login/userLogin',
      method: 'post',
      data
    })
  },
  getLoginQrCode (data = {}) { // 获取二维码登录code
    return request({
      url: '/login/getSweepCode',
      method: 'post',
      data
    })
  },
  testIsLoginQrCode (data = {}) { // 检测二维码登录 是否登录成功
    return request({
      url: '/login/loginBySweepCode',
      method: 'post',
      data
    })
  }
}
export default requestList
