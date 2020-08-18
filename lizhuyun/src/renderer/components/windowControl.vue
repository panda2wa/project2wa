<!--右上角窗口控制组件:放大、缩小、关闭-->
<template>
    <div class="windowControlBox">
        <div class="nav-tool-tap">
            <div @click="windowSmall" class="iconFont">
              &#xe66a;
            </div>
            <div @click="windowRestore" class="iconFont">
              {{topPng ? '&#xe669;' : '&#xe668;'}}
            </div>
            <div @click="windowClose" class="iconFont">
              &#xe631;
            </div>
          </div>
    </div>
</template>
<script>
let ipc = {}
if (window.require) {
  ipc = window.require('electron').ipcRenderer
}
export default {
  name: 'windowControl',
  data () {
    return {
      topPng: false
    }
  },
  methods: {
    init () {},
    /* *****************windows窗口操作******************* */
    windowSmall () {
      ipc.send('window-zoom')
    },
    windowRestore () {
      ipc.send('window-change')
      this.topPng = !this.topPng
    },
    windowClose () {
      ipc.send('window-close')
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
.nav-tool-tap{
    display: flex; justify-content: flex-end; align-items: center; background: url(../assets/img/index/icon-bg.png) no-repeat center/cover; width: 180px; height: 43px;
    >div{
        margin: 10px;
    }
    .iconFont{
      color: #fff; font-size: 26px; cursor: pointer;
    }
}
</style>