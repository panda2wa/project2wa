<!--
  修改密码
-->
<template>
  <div class="login-form-bg-newPass">
    <div class="login-forget-title">
      <span @click="returnLogin" class="iconFont">&#xe61a;</span>
      <h2>新密码设置</h2>
      <p class="pass-change-pwd"></p>
    </div>
    <div class='tishi'>
      <div class="input-container">
        <div class="input-container-code">
          <div class="iconFont">&#xe637;</div>
          <input type="tel" class="login-form-input" v-model="userForgetName" placeholder="请输入绑定手机号" @blur="phoneVerify" />
          <span class="phoneHintClass iconFont" :class="[phoneIsOk?'green':'red']" v-show="phoneHint">
            {{phoneIsOk?'&#xe607;':'&#xe631;'}}
          </span>
        </div>
        <div class="errorHint">{{errorHint1}}</div>
        <div class="input-container-code">
          <div class="iconFont">&#xec4d;</div>
          <input type="text" class="login-form-input" placeholder="请输入6位数验证码" v-model="phoneCode" />
          <div class="code-time-button">
            <button type="button" ref="codePhoneText" @click="getPhoneCode">{{codeText}}</button>
          </div>
        </div>
        <div class="errorHint">{{errorHint2}}</div>
        <div class="input-container-code">
          <div class="iconFont">&#xe66c;</div>
          <input 
          type="password" 
          @blur="changeNewPw" 
          ref="pwInputNew" 
          maxlength="16" 
          v-model="changePwdValue"
          @change="changePwdFunction"
          class="login-form-input" 
          placeholder="请设置6-20位数字字母混合密码"/>
          <em class="iconFont" @click="togglePwNew">{{isPwShowNew?'&#xe61b;':'&#xe617;'}}</em>
        </div>
        <div class="errorHint">{{errorHint3}}</div>
        <div class="input-container-code">
          <div class="iconFont">&#xe66c;</div>
          <input 
          type="password" 
          maxlength="16" 
          ref="pwInputNews" 
          v-model="changePwdValueAgein"
          @change="changePwdFunctionAgein"
          class="login-form-input" 
          placeholder="请再次输入密码" />
          <em class="iconFont" @click="togglePwNews">{{isPwShowNews?'&#xe61b;':'&#xe617;'}}</em>
        </div>
        <div class="errorHint">{{errorHint4}}</div>
      </div>
      <button class="login-form-button" @click="pwChange">确认</button>
      <div class="textLogin">
        <span>如有疑问，请咨询客服，客服电话：028-65176807</span>
      </div>
    </div>
    <!-- 
      提示弹窗
        text：需要提示的文字
        styles：提示文字样式控制
        timeout：自动关闭弹窗时间
        isAutoClose: 是否自动关闭弹窗 默认 true
        isShow: 是否显示弹窗 默认  false
    -->
    <texttips :isShow="isShowTips" :text="textTip" @setIsShow='setIsShow' />
  </div>
</template>
<script>
import api from '@/apis/loginApi.js'
import texttips from '@/components/textTips.vue'
let md5 = require('md5')
export default {
  name: 'findPwd',
  components: {
      texttips
  },
  props: {},
  data () {
    return {
      phoneHint: false,
      changePwdValue: '',
      changePwdValueAgein: '',
      isPwShowNew: false,
      isPwShowNews: false,
      isShowTips: false,
      phoneCode: '',
      textTip: '',
      errorHint1: '',
      errorHint2: '',
      errorHint3: '',
      errorHint4: '',
      phoneIsOk: false,
      userForgetName: '',
      codeText: '获取验证码'
    }
  },
  watch: {},
  methods: {
    init () {},
    // 第一次密码 失去焦点时做简单验证
    changeNewPw () {
      let newValuePw = this.changePwdValue
      if (newValuePw.length > 0) {
        if (isNaN(Number(newValuePw))) {
          if (newValuePw.length >= 6 && newValuePw.length <= 20) {
            this.errorHint3 = ''
            return true
          } else {
            this.errorHint3 = '请输入正确格式的密码'
            return false
          }
        } else {
          this.errorHint3 = '请输入正确格式的密码'
          return false
        }
      } else {
          this.errorHint3 = '请设置6-20位数字字母混合密码'
          return false
      }
    },
    changePwdFunction () { // 验证第一次密码是否符合规定格式
      if (/[0-9]/.test(this.changePwdValue) != true || /[a-z]/i.test(this.changePwdValue) != true || !(/^\w{6,50}$/.test(this.changePwdValue))) {
        this.errorHint3 = '请输入正确的格式'
        return false
      } else {
        this.errorHint3 = ''
        return true
      }
    },
    changePwdFunctionAgein () { // 验证第二次密码是否和第一次一致
      if (this.changePwdValueAgein != this.changePwdValue) {
        this.errorHint4 = '两次输入密码不一致'
        return false
      } else {
        this.errorHint4 = ''
        return true
      }
    },
    togglePwNew () { // 点击第一个密码框查看图标，切换密码域或者文本域
      this.isPwShowNew = !this.isPwShowNew
      const pwiEleNew = this.$refs.pwInputNew
      if (this.isPwShowNew) {
        pwiEleNew.setAttribute('type', 'text')
      } else {
        pwiEleNew.setAttribute('type', 'password')
      }
    },
    togglePwNews () { // 点击第二个密码框查看图标，切换密码域或者文本域
      this.isPwShowNews = !this.isPwShowNews
      const pwiEleNew = this.$refs.pwInputNews
      if (this.isPwShowNews) {
        pwiEleNew.setAttribute('type', 'text')
      } else {
        pwiEleNew.setAttribute('type', 'password')
      }
    },
    inputInfoTips (message) { // 打开提示信息弹窗
      this.isShowTips = true
      this.textTip = message
    },
    serviceError (code) { // 通用异常提示
      switch (code) {
        case 404:
          this.inputInfoTips('请求失败')
          break
        case 500:
          this.inputInfoTips('服务器异常，请稍后再试')
          break
        case 400:
          this.inputInfoTips('请求失败')
          break
        case 405:
          this.inputInfoTips('请求失败')
          break
        case 502:
          this.inputInfoTips('服务器异常，请稍后再试')
          break
        default:
          this.inputInfoTips('请求失败,请检查网络是否连接')
      }
    },
    getPhoneCode () { // 验证用户输入的手机号格式，并获取验证码
      let isInpTell = this.phoneVerify()
      if (!isInpTell) return false
      if (this.phoneIsOk) {
        let phoneRule = /^[1][3,4,5,7,8,9][0-9]{9}$/
        if (phoneRule.test(this.userForgetName)) {
          let num = 60
          const codePhoneText = this.$refs.codePhoneText
          // 获取验证码
          let dt = setInterval(() => {
            num--
            this.codeText = num + 's重新获取'
            codePhoneText.setAttribute('disabled', 'disabled')
            if (num == 0) {
              this.codeText = '获取验证码'
              codePhoneText.removeAttribute('disabled')
              clearInterval(dt)
            }
          }, 1000)
          // 发送手机号获取验证码
          let testData = {
            phoneNumber: this.userForgetName
          }
          api.getVerificationCode(testData).then(res => {
            if (res.code == 200) {
              this.errorHint2 = ''
            } else {
              this.errorHint2 = res.msg
              this.serviceError(res.code)
            }
          }).catch(err => {
            console.error('获取验证码失败', err)
          })
        } else {
          this.errorHint1 = '请输入正确的手机格式'
        }
      }
    },
    resetPassword () { // 发起重置密码请求，并提示用户重置结果
      let questData = {
        login_name: '',
        phoneNumber: this.userForgetName,
        verificationCode: this.phoneCode,
        password: md5(this.changePwdValue),
        confirmPassword: md5(this.changePwdValue)
      }
      api.resetPassword(questData).then(res => {
        if (res.code == 200) {
          this.inputInfoTips('重置密码成功')
          setTimeout(() => {
            this.userForgetName = ''
            this.phoneCode = ''
            this.changePwdValue = ''
            this.changePwdValueAgein = ''
            this.returnLogin()
          }, 3000)
        } else {
          this.inputInfoTips('重置失败')
        }
      }).catch(err => {
        this.serviceError(err.code)
        console.error('验证码验证错误', err)
      })
    },
    vsPhoneCode () { // 提交用户输入的验证码验证是否正确：true：修改密码，false:提示用户
      let questData = {
        verificationCode: this.phoneCode,
        phoneNumber: this.userForgetName
      }
      api.vsPhoneCode(questData).then(res => {
        if (res.code == 200) {
          this.errorHint2 = ''
          this.resetPassword()
        } else {
          this.errorHint2 = '验证码输入错误'
          this.inputInfoTips('验证码输入错误')
        }
      }).catch(err => {
        this.serviceError(err.code)
        console.error('验证码验证错误', err)
      })
    },
    pwChange () { // 验证用户输入，并提交验证码验证
      let isInpTell = this.phoneVerify()
      if (!isInpTell) return false
      if (this.phoneCode == '') {
        this.errorHint2 = '请输入6位数验证码'
        return false
      } else {
        this.errorHint2 = ''
      }
      let isChangePwd = this.changePwdFunction()
      if (!isChangePwd) return false
      let isChangePwdAgein = this.changePwdFunctionAgein()
      if (!isChangePwdAgein) return false
      this.vsPhoneCode()
    },
    phoneVerify () { // 验证用户输入手机号是否正确
      if (this.userForgetName != '') {
        api.userPhoneVerify({phoneNumber: this.userForgetName}).then(res => {
          this.phoneHint = true
          if (res.code == 200) {
            this.phoneIsOk = true
            this.errorHint1 = ''
          } else {
            this.errorHint1 = res.msg
            this.phoneIsOk = false
          }
        }).catch(err => {
          console.error('手机号验证请求错误', err)
        })
        return true
      } else {
        this.phoneHint = true
        this.phoneIsOk = false
        this.errorHint1 = '请输入绑定手机号'
        return false
      }
    },
    setIsShow (e) { // 接收子组件是否显示提示弹窗的值
      this.isShowTips = e
    },
    returnLogin () { // 返回
        this.$emit('setIsModifyPwd', 1)
    }
  },
  mounted () {
    this.init()
  },
  created () {},
  destroyed () {}
}
</script>
<style lang="scss" scoped>
.input-container-code{
  display: flex; justify-content: flex-start; align-items: center; position: relative; border: 1px solid #fff; border-radius: 5px; padding: 5px; height: 52px; box-sizing: border-box;
  em.iconFont{
    font-size: 28px; color: rgb(0, 153, 255); font-style: normal; cursor: pointer;
  }
  .code-time-button button{
    width: 120px; display: flex; justify-content: center; align-items: center; color: #fff; cursor: pointer; font-size: 12px; background-color: rgb(18, 139, 237); border-radius: 0 5px 5px 0; height: 52px; margin: -1px -6px -1px 0;
  }
  >.phoneHintClass.iconFont{
    font-size: 24px; color: rgb(166,166,166); position: absolute; right: -30px;
  }
  >.phoneHintClass.iconFont.green{
    color: green;
  }
  >.phoneHintClass.iconFont.red{
    color: red
  }
  >div.iconFont{
    font-size: 36px;
  }
  >input{
    flex: 1; font-size: 16px; color: #fff;
  }
  >input::-webkit-input-placeholder{
    color: rgb(102,154,204);
  }
}
.errorHint{
  height: 32px; line-height: 32px; color: #f00; 
}
.input-container{
  flex: 1; width: 100%;
}
.tishi{
  width: 510px; display: flex; flex-direction: column; justify-items: center; align-items: center; margin: 30px auto;
  .login-form-button{
    width: 100%; height: 74px; background: linear-gradient(to right, #3399ff, #9966ff); border-radius: 4px; color: #fff; font-size: 28px; letter-spacing: 15px; cursor: pointer; display: flex; justify-content: center; align-items: center; margin-top: 40px;
  }
  .textLogin{
    text-align: center; color: rgb(233,141,4); margin-top: 8px;
  }
}
.login-form-bg-newPass{
  width: 100%; height: 100%; box-sizing: border-box; padding: 35px 25px; color: #fff; position: relative;
}
.login-forget-title{
    display: flex; justify-content: space-between; align-items: center; line-height: 32px; position: relative;
    .iconFont{
        font-size: 36px; cursor: pointer;
    }
    h2{
        font-size: 32px; font-weight: normal;
    }
}
</style>