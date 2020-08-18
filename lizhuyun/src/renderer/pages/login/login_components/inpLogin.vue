<!--
  手动输入登录组件
  接收属性值：
    isInp：
      true 手动输入登录
      false 扫码登录 
-->
<template>
  <div class="inpLoginBox">
    <div v-show="isInp">
      <dl>
        <dt>用户登录</dt>
        <dd>
          <!-- <img src="../../../assets/img/login/user.png" alt=""> -->
          <span class="iconFont">&#xe629;</span>
          <input v-model="userNameValue" type="text" placeholder="请输入您的账号">
        </dd>
        <dd>
          <!-- <img src="../../../assets/img/login/password.png" alt=""> -->
          <span class="iconFont fontsize32">&#xe66c;</span>
          <input v-model="userPassword" :type="isPassword?'password':'text'" placeholder="请输入您的密码">
          <span class="iconFont isPassword" @click="setIsPassword">{{isPassword?'&#xe617;':'&#xe61b;'}}</span>
          <!-- <img class="isPassword" src="../../../assets/img/login/hidden.png" v-if="isPassword" @click="setIsPassword" alt="">
          <img class="isPassword" @click="setIsPassword" src="../../../assets/img/login/show.png" v-else alt=""> -->
        </dd>
      </dl>
      <p class="tabPassword" @click="goFindPwd">忘记密码？</p>
      <button class="loginBtn" @click="userLogin">登录</button>
    </div>
    <div v-if="!isInp">
      <dl>
        <dt>手机扫码登录</dt>
      </dl>
      <div class="qrBox">
        <!-- 
          二维码生成
          * id:定义生成二维码唯一标识，不可重复
          width:生成二维码的宽度
          height:生成二维码的高度
          url:需要生成的二维码地址，不传则显示默认不可扫描的图片
          title：二维码下面的文字
          dec：第二行小号文字，用于提示
          styles:第二行的文字样式控制，字符串类型
        -->
        <qrcode id="loginQr" :width="210" :height="210" :url="loginQrcodeUrl" styles="font-size:18px; color:rgb(233,141,4)" title="" dec="打开力筑云App扫一扫登录" />
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
    <texttips :isShow="isShow" :text="textTips" @setIsShow='setIsShow' />
    <!--
      登录成功提示弹窗
    -->
    <successLoginTips :successLoginStatus="isSuccessShow" />
  </div>
</template>
<script>
import api from '@/apis/loginApi.js'
import qrcode from './qrcode'
import texttips from '@/components/textTips.vue'
import successLoginTips from './successLoginTips.vue'
let md5 = require('md5')
export default {
  name: 'inpLogin',
  components: {
    qrcode, texttips, successLoginTips
  },
  props: {
    isInp: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      isPassword: true,
      isSuccessShow: false, // 是否显示登录成功弹窗
      isShow: false, // 是否显示提示框
      textTips: '', // 提示弹窗文字
      loginQrcodeUrl: '',
      timer: null, // 用于每两秒检测一次是否手机扫码成功
      timerRefresh: null, // 用于每分钟刷新登录二维码
      code: '', // 用于生成扫码登录二维码的code串
      userNameValue: '', // 用户输入的账号
      userPassword: '' // 用户输入的密码
    }
  },
  watch: {
    'isInp': { // 监听是否切换到二维码登录，用于处理二维码登录状态
      handler: function (val, oVal) {
        if (!val) {
          this.timer = setInterval(this.testIsLoginQrCode, 2000) // 每两秒检测是否扫码
          this.timerRefresh = setInterval(this.init, 60000) // 每分钟刷新二维码
        } else {
          clearInterval(this.timer)
          clearInterval(this.timerRefresh)
        }
      }
    }
  },
  methods: {
    init () {
      this.getLoginQrCode()
      document.addEventListener('keydown', this.onKeyFn, false)
    },
    goFindPwd () {
      this.$emit('setIsModifyPwd', 3)
    },
    onKeyFn (event) { // 绑定键盘确定试件
      if (event.keyCode == 13) {
        this.userLogin()
      }
    },
    setIsShow (e) { // 接收子组件是否显示提示弹窗的值
      this.isShow = e
    },
    saveUserData (data) {
        this.$store.commit('clearRoleList')
        this.$store.commit('SetWaitUserTypeStatus', data.result.roles[0].roleCode)
        for (let index = 0; index < data.result.roles.length; index++) {
          this.$store.commit('setRoleList', data.result.roles[index].roleCode)
        }
        this.$store.commit('setProjectNum', data.result.depNumber)
        localStorage.setItem('token', data.result.token)
        localStorage.setItem('userID', data.result.userId)
        this.$store.commit('setCuringControlStatus', 0)
        this.isSuccessShow = true
        if (!data.result.is_alter) {
          setTimeout(() => {
            this.isSuccessShow = false
            this.userPassword = ''
            this.$emit('setIsModifyPwd', 2)
          }, 2000)
          return
        }
        setTimeout(() => {
          this.isSuccessShow = false
          this.$router.push('/home')
        }, 2000)
    },
    userLogin () { // 点击登录
      let isTestInp = this.testLogin()
      if (!isTestInp) {
        this.isShow = true
        this.textTips = '用户名或密码不能为空'
        return false
      }
      let pwd = md5(this.userPassword)
      let dataPost = {
        login_name: this.userNameValue,
        password: pwd
      }
      api.userLogin(dataPost).then(res => {
        if (res.code == 400) {
          this.isShow = true
          this.textTips = res.msg
          return
        }
        if (res.code == 200) {
          this.saveUserData(res)
        } else {
          this.isShow = true
          this.textTips = res.msg
        }
      }).catch(err => {
        this.isShow = true
        this.textTips = '服务器响应出错，请稍候再试'
        console.error(err)
      })
    },
    testLogin () {
      this.userNameValue = this.userNameValue.replace(/^\s+|\s+$/g, '')
      return this.userNameValue != '' && this.userPassword != ''
    },
    testIsLoginQrCode () { // 检测登录二维码是否扫描登录
      const data = {
        code: this.code
      }
      api.testIsLoginQrCode(data).then(res => {
        if (res.code == 200) {
          clearInterval(this.timer)
          clearInterval(this.timerRefresh)
          this.saveUserData(res)
        } else {
          // this.isShow = true
          // this.textTips = res.msg
          console.error('扫码失败')
        }
      }).catch(err => {
        console.error(err, '二维码登录异常')
      })
    },
    getLoginQrCode () { // 获取登录二维码code值
      const data = {
        qrCodePwd: 'jtCloudQrPwd'
      }
      api.getLoginQrCode(data).then(res => {
        if (res.code == 200) {
          const globalData = require('electron').remote.getGlobal('sharedObject')
          this.code = res.result.code
          let url = 'http://' + globalData.domainName + ':' + globalData.portNumber + 'MobileSweep' + this.code
          this.loginQrcodeUrl = url
        }
      }).catch(err => {
        console.error(err, '获取二维码生成code出错')
      })
    },
    setIsPassword () {
      this.isPassword = !this.isPassword
    }
  },
  mounted () {
    this.init()
  },
  created () {},
  destroyed () {
    document.removeEventListener('keydown', this.onKeyFn, false)
  }
}
</script>
<style lang="scss" scoped>

.qrBox{
    padding-top: 100px;
}
.loginBtn{
    margin: 50px auto 0; display: block; width: 100%; height: 74px; background: linear-gradient(to right, #3399ff, #9966ff); border-radius: 4px; color: #fff; font-size: 28px; letter-spacing: 15px; cursor: pointer;
}
.inpLoginBox{
    max-width: 100%; display: flex; justify-content: center; align-items: center; padding: 45px 105px 65px; box-sizing: border-box;
    >div{
        width: 100%;
    }
    dl{
        color: #fff; font-size: 16px; width: 100%;
        dt{
            font-size: 40px; font-weight: bold; text-align: center; padding-bottom: 10px;
        }
        dd{
            display: flex; justify-content: space-between; align-items: center; border: 1px solid rgb(156, 156, 156); border-radius: 3px; margin-top: 50px; height: 75px; box-sizing: border-box; padding: 0 10px;
            span{
              font-size: 28px;
            }
            .fontsize32{
              font-size: 32px;
            }
            input{
                flex: 1; margin-left: 5px; color: #fff; font-size: 18px; line-height: 24px;
            }
            input::-webkit-input-placeholder {
                font-size: 16px;
                color: #6699cc;
            }
            >img{
                width: 40px;
            }
            .isPassword{
                cursor: pointer; font-size: 24px; color: rgb(0, 153, 255);
            }
        }
    }
}
.tabPassword{
    text-align: right; font-size: 16px; color: rgb(0, 148, 236); margin-top: 30px; padding: 0 5px; cursor: pointer;
}
.tabPassword:hover{
    text-decoration: underline;
}
@media screen and ( max-width: 1400px ) {
  
}
@media screen and ( max-width: 1280px ) {
  
}
</style>