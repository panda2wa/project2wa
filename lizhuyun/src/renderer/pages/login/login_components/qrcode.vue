<!--
  二维码生成组件
  接收属性值：
    id：生成二维码dom ID
    width：生成二维码的宽度 默认：140px
    height：生成二维码的高度 默认：140px
    url：需要生成二维码的链接
    title：生成二维码图片下面的标题文字
    dec：二维码下面简述文字
    styles：简述文字样式集合
-->
<template>
    <div class="QR-image-container">
      <div>
        <div v-if="url" class="marginbom10">
          <div class="qrcodeBox">
            <div class="QR-image" :id="id" :ref="id"></div>
            <img :src="icon" class="iosIcon" alt="">
          </div>
        </div>
        <img v-else src="@/assets/img/iosSecCode.png" class="qrImg marginbom10" :style="'max-width:'+(width+20)+'px'" alt />
        <div class="QR-detail">
            <p v-if="title">{{title}}</p>
            <p class="red" v-if="dec" :style="styles">{{dec}}</p>
        </div>
      </div>
    </div>
</template>
<script>
import QRCode from 'qrcodejs2'
import logo from '@/assets/img/icon.png'
export default {
  name: 'qrcode',
  props: {
    styles: {
      type: String,
      default: ''
    },
    width: {
      type: Number,
      default: 140
    },
    height: {
      type: Number,
      default: 140
    },
    id: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    },
    dec: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      icon: logo
    }
  },
  watch: {
    'url': {
      handler (val, oVal) {
        if (val != oVal) {
          let dom = this.$refs[this.id]
          let childs = dom.children
          if (childs.length > 0) {
            for (let i = 0; i < childs.length; i++) {
              dom.removeChild(childs[i])
            }
          }
          this.init()
        }
      }
    }
  },
  methods: {
    init () {
      this.createQrcode()
    },
    createQrcode () {
      if (!this.url) return
      let qrcode = new QRCode(this.id, {
        width: this.width,
        height: this.height,
        text: this.url
      })
      console.log(qrcode, '二维码生成')
    }
  },
  mounted () {
    this.init()
  },
  created () {},
  destroyed () {}
}
</script>
<style>
.QR-image img{
  width: 100%;
}
</style>
<style lang="scss" scoped>

.marginbom10{
  margin-bottom: 20px;
}
.QR-image-container{
   text-align: center; display: flex; width: 100%; flex-direction: column; justify-content: center; align-items: center;
   >div{
      width: 70%; display: flex; flex-direction: column; justify-content: center; align-items: center;
      .qrImg{
        width: 100%; 
      }
    }
}
.QR-detail{
  font-size: 16px;
  .red{
    color: #f00; font-size: 12px;
  }
}
.qrcodeBox{
  display: flex; justify-content: center; align-items: center; position: relative; background-color: #fff; padding: 10px; width: 100%; box-sizing: border-box; font-size: 14px;
  .iosIcon{
    position: absolute; z-index: 2; width: 25%;
  }
}
@media screen and ( max-width: 1400px ) {
  .QR-detail{
    font-size: 14px;
  }
}
@media screen and ( max-width: 1280px ) {
  .QR-detail{
    font-size: 12px;
  }
}
</style>