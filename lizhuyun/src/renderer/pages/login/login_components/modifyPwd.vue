<!--
  修改密码
-->
<template>
    <div class="login-form-bg">
        <div class="login-forget-title">
            <span @click="returnLogin" class="iconFont">&#xe61a;</span>
            <h2>密码修改</h2>
            <p class="pass-change-pwd" @click="passChangePwd">跳过</p>
        </div>
        <div class='tishi'>
            <div class="input-container">
                <div class="input-container-code">
                    <div class='change-pwd-text'>请输入密码</div>
                    <input type="password" maxlength="20" placeholder="输入6-20位数字字母混合密码" v-model="changePwdValue" @change="changePwdFunction" @blur="changePwdFunction(true)" />
                    <div class='change-pwd-img iconFont' :class="{show:isShowChange}">&#xe607;</div>
                </div>
                <div class="change-pwd-info">{{changePwdValueInfo}}</div>


                <div class="input-container-code">
                    <div class='change-pwd-text'>再次输入</div>
                    <input type="password" maxlength="20" placeholder="请再次输入新密码" v-model="changePwdValueAgein" @change="changePwdFunctionAgein" @blur="changePwdFunctionAgein(true)" />
                    <div class='change-pwd-img iconFont' :class="{show:isChangeShow}">&#xe607;</div>
                </div>
                <div class="change-pwd-info">{{changePwdValueInfoAgein}}</div>
            </div>
            <button class="login-form-button" type="button" @click="firstPwChange">确认</button>
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
  name: 'modifyPwd',
  components: {
      texttips
  },
  props: {},
  data () {
    return {
        changePwdValueAgein: '',
        isChangeShow: '',
        changePwdValueInfoAgein: '',
        isShowChange: false,
        changePwdValueInfo: '',
        changePwdValue: '',
        isShowTips: false,
        textTip: '',
        isSuccessShow: false // 是否显示登录成功弹窗
    }
  },
  watch: {},
  methods: {
    init () {},
    setIsShow (e) { // 接收子组件是否显示提示弹窗的值
      this.isShowTips = e
    },
    firstPwChange () {
        let isNext = this.changePwdFunction()
        let isNext2 = this.changePwdFunctionAgein()
        if (!isNext) {
            return false
        }
        if (!isNext2) {
            return false
        }
        let questData = {
            firstPass: md5(this.changePwdValue),
            confirmPass: md5(this.changePwdValueAgein)
        }
        api.editFirstUserLogin(questData).then(res => {
            if (res.code == 200) {
                this.isShowTips = true
                this.textTip = '密码修改成功'
                setTimeout(() => {
                    this.returnLogin()
                }, 2000)
            } else {
                this.isShowTips = true
                this.textTip = res.msg
            }
        }).catch(err => {
            console.error(err, '修改密码请求错误')
        })
    },
    changePwdFunctionAgein (isKeyUp) {
        if (isKeyUp && this.changePwdValueAgein.length < this.changePwdValue.length) return
        if (this.changePwdValueAgein != this.changePwdValue) {
            this.changePwdValueInfoAgein = '两次输入密码不一致'
            this.isChangeShow = false
            return false
        } else {
            this.changePwdValueInfoAgein = ''
            this.isChangeShow = true
            return true
        }
    },
    // 第一次密码
    changePwdFunction (isKenUp) {
        if (isKenUp && this.changePwdValue.length < 6) return
        if (/[0-9]/.test(this.changePwdValue) != true || /[a-z]/i.test(this.changePwdValue) != true || !(/^\w{6,50}$/.test(this.changePwdValue))) {
            this.changePwdValueInfo = '请输入正确的格式'
            this.isShowChange = false
            return false
        } else {
            this.changePwdValueInfo = ''
            this.isShowChange = true
            return true
        }
    },
    passChangePwd () {
        this.$router.push('/home')
    },
    returnLogin () {
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
.tishi{
    width: 480px; margin: 85px auto 0;
    .input-container-code{
        display: flex; justify-content: space-between; align-items: center;
        .change-pwd-text{
            font-size: 18px; width: 100px; text-align: right;
        }
        .change-pwd-img{
            color: rgb(0, 153, 28); font-size: 28px; width: 30px; visibility: hidden;
        }
        .change-pwd-img.show{
            visibility: visible;
        }
        input{
            border: 1px solid #fff; border-radius: 5px; height: 45px; flex: 1; margin: 0 10px; padding: 0 5px; color: #fff; font-size: 18px;
        }
        input::-webkit-input-placeholder {
            font-size: 14px; color: #6699cc; 
        }
    }
    .change-pwd-info{
        height: 60px; font-size: 12px; line-height: 18px; color: #f00; padding-left: 110px; box-sizing: border-box;
    }
    .login-form-button{
        width: 100%; height: 74px; background: linear-gradient(to right, #3399ff, #9966ff); border-radius: 4px; color: #fff; font-size: 28px; letter-spacing: 15px; cursor: pointer; display: flex; justify-content: center; align-items: center; 
    }
    .textLogin{
        text-align: center; color: #ff9900; font-size: 18px; line-height: 38px;
    }
}
.login-forget-title{
    display: flex; justify-content: space-between; align-items: center; line-height: 32px; position: relative;
    .iconFont{
        font-size: 36px; cursor: pointer;
    }
    h2{
        font-size: 32px; font-weight: normal;
    }
    p{
        font-size: 16px; color: #3399ff; cursor: pointer;
    }
}
.login-form-bg{
    width: 100%; height: 100%; box-sizing: border-box; padding: 35px 25px; color: #fff; position: relative;
}
</style>