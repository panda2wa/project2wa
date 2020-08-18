<template>
  <div id="wrapper">
    <!-- 右上角窗口控制组件 -->
    <div class="winControlBox">
      <windowControl />
    </div>
    <div class="loginBox">
      <div class="left-container">
        <div class="logo-container">
          <img src="../../assets/img/login/logo_1.png" alt="">
        </div>
        <div class="QR-container">
          <div>
            <p class="title">“力筑云平台”APP下载</p>
            <div class="qrCodeBox">
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
              <qrcode class="firstQrcode" id="androidQr" url="https://www.pgyer.com/UEQN" title="Android客户端" />
              <qrcode class="secQrcode" id="iosQr" url='https://www.pgyer.com/UEQN' title="Ios客户端" />
            </div>
          </div>
        </div>
      </div>
      <div class="login-form-container">
        <div class="loginBgBorder">
          <i class="leftTopBor"></i>
          <i class="rightTopBor"></i>
          <i class="rightBomBor"></i>
          <i class="leftBomBor"></i>
          <div v-show="isShowModifyPwd==1">
            <div class="tabCodeOrInp" :class="{hover:isHover}" @mousemove="setClass(true)" @mouseout="setClass(false)">
              <img src="../../assets/img/login/code-login.png" v-if="isInp" @click="tabLoginFn" alt="">
              <img src="../../assets/img/login/PC.png" v-else @click="tabLoginFn" alt="">
            </div>
            <!-- 
              手动输入或者扫码登录界面 
              isInp：
                true 手动输入登录
                false 扫码登录 
            -->
            <inpLogin :isInp="isInp" @setIsModifyPwd='setIsModifyPwd' />
          </div>
          <!-- 
            第一次登录修改密码
          -->
          <modifyPwd v-if="isShowModifyPwd==2" @setIsModifyPwd='setIsModifyPwd' />
          <!-- 
            找回密码
          -->
          <findPwd v-if="isShowModifyPwd==3" @setIsModifyPwd='setIsModifyPwd' />
        </div>
      </div>
    </div>
    <!-- 底部 -->
    <div class="footer">
      <footers />
    </div>
  </div>
</template>
<script>
import windowControl from '../../components/windowControl'
import footers from '../../components/footer'
import qrcode from './login_components/qrcode'
import inpLogin from './login_components/inpLogin'
import modifyPwd from './login_components/modifyPwd'
import findPwd from './login_components/findPwd'
export default {
  name: 'Login',
  components: {
    qrcode, windowControl, footers, inpLogin, modifyPwd, findPwd
  },
  data () {
    return {
      isInp: true,
      isShowModifyPwd: 1, // 是否显示修改密码界面  检测到用户使用默认密码时，会显示修改密码界面
      isHover: false
    }
  },
  methods: {
    init () {},
    setIsModifyPwd (e) { // 接收子组件传来的控制是否显示修改密码界面的值
      this.isShowModifyPwd = e
    },
    tabLoginFn () { // 点击切换登录方式图片，切换登录方式
      this.isInp = !this.isInp
    },
    setClass (isHover) { // 鼠标移入切换登录方式动画
      this.isHover = isHover
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
.tabCodeOrInp{
  position: absolute; right: 10px; top: 10px; background-color: rgb(49, 49, 53); border-radius: 10px; width: 5vw; height: 5vw; display: flex; justify-content: center; align-items: center; overflow: hidden;
  img{
    width: 60%; cursor: pointer;
  }
}
.tabCodeOrInp::after{
  transition: .5s all; width: 8vw; height: 7vw; transform: rotate(45deg) translate(-2vw,4vw); background-color: rgba($color: #000000, $alpha: .4); content: ''; display: block; position: absolute; z-index: 2; left: 0; top: 0;
}
.hover::after{
   transform: rotate(45deg) translate(-2vw,8vw);
}
.loginBgBorder{
  border: 1px solid rgb(51, 204, 204); border-radius: 15px; position: relative; overflow: hidden; width: 725px; min-height: 345px; max-height: 100%;
  >i{
    display: block; position: absolute; width: 1.5vw; height: 1.5vw; border: 2px solid rgb(51, 204, 204);
  }
  .leftTopBor{
    left: 0; top: 0; border-right-color: transparent; border-bottom-color: transparent; border-top-left-radius: 15px;
  }
  .rightTopBor{
    right: 0; top: 0; border-left-color: transparent; border-bottom-color: transparent; border-top-right-radius: 15px;
  }
  .rightBomBor{
    right: 0; bottom: 0; border-left-color: transparent; border-top-color: transparent; border-bottom-right-radius: 15px;
  }
  .leftBomBor{
    left: 0; bottom: 0; border-right-color: transparent; border-top-color: transparent; border-bottom-left-radius: 15px;
  }
}
#wrapper{
  background: url(../../assets/img/login/bg.png) no-repeat center/cover;
}
.title{
  margin-bottom: 6vh;
}
.qrCodeBox{
  display: flex; justify-content: space-between; align-items: flex-start;
  .QR-image-container{
    flex: 1;
  }
}
.firstQrcode{
  align-items: flex-start;
}
.secQrcode{
  align-items: flex-end;
}
.winControlBox{
  display: flex; justify-content: flex-end; align-items: center; width: 100%;
}
.loginBox{
  flex: 1; width: 100%; display: flex; justify-content: center; align-items: center;
  .left-container{
    width: 27vw; display: flex; flex-direction: column; background-color: rgba($color: #000000, $alpha: .4); height: 100%; padding-top: 13.7vh; box-sizing: border-box;
  }
  .login-form-container{
    flex: 1; display: flex; justify-content: center; align-items: flex-start; overflow-y: auto; max-height: 100%;
  }
}
.logo-container{
  text-align: center;
  img{
    width: 68%;
  }
}
.QR-container{
  flex: 1; display: flex; align-items: flex-end; justify-content: center; font-size: 24px; color: #fff; overflow: hidden;
  >div{
    width: 77%;
  }
}

</style>