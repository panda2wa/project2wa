<!--顶部左侧公告列表及右侧控制按钮-->
<template>
    <div class="noticeAndControlBox">
        <div class="leftNotice">
            <div v-show="isShowLeft">
              <span class="iconFont">&#xe8c4;</span>
              <ul v-if="list.length>0" @mouseover="clearIntal" @mouseout="slidFn" :class="{ani:isAni}" :style="'top:-'+num*idx+'px'">
                  <li v-for="(item,index) in list" @click="goPage" :key="index">{{item}}</li>
              </ul>
              <div v-else>
                暂无消息
              </div>
            </div>
        </div>
        <div class="rightControl">
            <span class="iconFont" @click="refresh">&#xe6b5;</span>
            <router-link class="iconFont" tag="span" to="/messages">&#xe640;<em v-if="isMessageLook">1</em></router-link>
            <router-link class="iconFont" tag="span" to="/notices">&#xe8c4;<em v-if="isNoticeLook">1</em></router-link>
            <span class="iconFont" @click="showUserInfoControl">&#xe61f;</span>
            <dl class="secSelectBox" v-show="isShowSelectUserInfoNav">
              <dd @click="lookUserInfo">个人资料</dd>
              <dd @click="lookQrFn">下载手机版</dd>
              <dd @click="showConfirmFn">退出登录</dd>
            </dl>
        </div>
        <userInfo v-if="isShowUserInfo" @closeFn="closeFn" />
        <div class="QR-container fixed" v-if="isShowQrPop">
          <div>
            <span class="iconFont closeBtn" @click="closeQrPopFn">&#xe631;</span>
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
        <confirm text="您确定退出“力筑云”平台吗？" styles="font-size:20px" v-if="isShowLogOut" @confirm="confirm" />
    </div>
</template>
<script>
import api from '@/apis/indexApi.js'
import qrcode from '@/pages/login/login_components/qrcode'
import userInfo from '@/pages/index/index_components/userInfo'
import confirm from './confirm'
export default {
  name: 'noticeAndControl',
  components: {
    userInfo, qrcode, confirm
  },
  props: {

  },
  data () {
    return {
      timer: null,
      isShowLeft: true,
      isMessageLook: false,
      isNoticeLook: false,
      isShowQrPop: false,
      isShowUserInfo: false,
      isShowLogOut: false,
      isShowSelectUserInfoNav: false,
      num: 23,
      idx: 0,
      isAni: false,
      list: []
    }
  },
  watch: {
    '$store.state.isReadMessage': function (n, o) {
      this.isMessageLook = n
    },
    '$store.state.isReadNotice': function (n, o) {
      this.isNoticeLook = n
      this.getNewNoticeTitle()
    },
    '$store.state.projectIDs': function (n, o) { // 监听用户是否点击刷新
        if (n) {
            this.isShowLeft = false
        } else {
            this.isShowLeft = true
            this.init()
        }
    },
    '$store.state.refresh': function (n, o) { // 监听用户是否点击刷新
      if (n != o) {
        this.init()
      }
    }
  },
  methods: {
    init () {
      this.getNewNoticeTitle()
      this.readMessageNotice()
    },
    showConfirmFn () {
      this.isShowLogOut = true
    },
    confirm (e) {
      if (e) {
        localStorage.clear()
        this.isShowLogOut = false
        this.$store.commit('setProjectIDs', '')
        this.$router.push('/')
      } else {
        this.isShowLogOut = false
      }
    },
    closeQrPopFn () {
      this.isShowQrPop = false
    },
    lookQrFn () {
      this.isShowQrPop = true
      this.showUserInfoControl()
    },
    closeFn (e) {
      this.isShowUserInfo = e
    },
    lookUserInfo () {
      this.isShowUserInfo = true
      this.showUserInfoControl()
    },
    showUserInfoControl () {
      this.isShowSelectUserInfoNav = !this.isShowSelectUserInfoNav
    },
    readMessageNotice () {
      api.readMessageNotice().then(res => {
        if (res.code == 200) {
          this.$store.commit('setIsReadMessage', res.result.newMsg)
          this.$store.commit('setIsReadNotice', res.result.newNotice)
        } else {
          this.$store.commit('setIsReadMessage', false)
          this.$store.commit('setIsReadNotice', false)
        }
      }).catch(err => {
        console.error('消息公告未读信息请求错误', err)
      })
    },
    refresh () { // 刷新事件
      let refreshNum = this.$store.getters.getRefresh
      this.$store.commit('setRefresh', refreshNum + 1)
    },
    clearIntal () {
      clearInterval(this.timer)
    },
    slidFn () { // 轮播控制
      let len = this.list.length
      if (len <= 1) return false
      this.timer = setInterval(() => {
        this.isAni = true
        this.idx += 1
        if (this.idx >= len) {
          this.isAni = false
          this.idx = 0
        }
      }, 3000)
    },
    goPage () {
      this.$router.push('/noticeList')
    },
    getNewNoticeTitle () { // 公告轮播
      let questData = {
        pageIndex: 1,
        pageSize: 10
      }
      this.list = []
      api.getNewNoticeTitle(questData).then(res => {
        if (res.code == 200) {
          this.list = res.result
          this.clearIntal()
          this.slidFn()
        }
      }).catch(err => {
        console.error('公告轮播请求错误', err)
      })
    }
  },
  mounted () {
    this.init()
  },
  created () {},
  destroyed () {
    clearInterval(this.timer)
  }
}
</script>
<style lang="scss" scoped>
.QR-container{
  >div{
    background: #fff; position: relative; width: 723px; padding: 60px 20px; box-sizing: border-box;
    .qrCodeBox{
      display: flex; justify-content: center; align-items: flex-start; padding-top: 78px;
    }
    .closeBtn{
      color: #666; font-size: 28px; position: absolute; top: 12px; right: 20px; cursor: pointer;
    }
  }
}
.secSelectBox{
    position: absolute; right: 0; top: 30px; padding: 8px 0; width: 108px; border: 1px solid #0099ff; background-color: rgba($color: #16396c, $alpha: .9); z-index: 3;
    dd{
      cursor: pointer; padding: 12px 0; text-align: center; width: 100%; color: #0099ff; font-size: 14px;border-bottom: 1px solid rgba($color: #0099ff, $alpha: .1);
    }
    dd:last-child{
      border-bottom: none;
    }
    dd:hover{
        color: #75ddff; font-weight: bold;
    }
}
.rightControl{
  font-size: 22px; color: #09f; display: flex; justify-content: flex-end; align-items: center; align-self: flex-start; position: relative;
  span{
    cursor: pointer; margin-left: 12px; position: relative;
    em{
      font-size: 6px; width: 8px; height: 8px; position: absolute; right: -6px; top: 0; border-radius: 50%; background-color: #f00; text-indent: -9999em; overflow: hidden;
    }
  }
  span:hover{
    color: #75ddff;
  }
}
.leftNotice{
  >div{
    display: flex; justify-content: flex-start; align-items: center; margin-top: 20px; overflow: hidden; height: 17px; font-size: 14px; color: #fff;
    .iconFont{
      color: #f90; font-size: 20px; margin-right: 10px;
    }
    ul.ani{
      transition: .5s all linear;
    }
    ul,>div{
      align-self: flex-start; position: relative;
      li{
        line-height: 18px; height: 23px; cursor: pointer; max-width: 35vw; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      }
      li:hover{
        text-decoration: underline;
      }
    }
  }
}
.noticeAndControlBox{
    display: flex; justify-content: space-between; align-items: flex-end; width: 100%;
}
@media screen and ( max-width: 1400px ) {
    
}
@media screen and ( max-width: 1280px ) {
    
}
</style>