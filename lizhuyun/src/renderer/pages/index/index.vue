<template>
  <div id="wrapper" :class="{mapBg:isMapBg}">
    <!-- 顶部导航及右上角窗口控制组件 -->
    <div class="winControlBox">
        <topNav />
        <windowControl />
    </div>
    <div class="noticeBox">
      <noticeAndControl />
    </div>
    <div class="indexBox scrollYBox">
        <router-view></router-view>
    </div>
    <!-- 底部 -->
    <div class="footer">
      <footers />
    </div>
  </div>
</template>
<script>
import windowControl from '../../components/windowControl'
import noticeAndControl from '../../components/noticeAndControl'
import topNav from '../../components/topNav'
import footers from '../../components/footer'
export default {
  name: 'Login',
  components: {
    windowControl, footers, topNav, noticeAndControl
  },
  data () {
    return {
      isMapBg: true
    }
  },
  watch: {
    '$route.path': function (n, o) {
      if (n == '/home') {
        this.isMapBg = true
      } else {
        this.isMapBg = false
      }
    }
  },
  methods: {
    init () {
      console.log(this.$route.path)
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
.noticeBox{
   width: 100%; padding: 0 15px 0 20px; box-sizing: border-box;
}
.indexBox{
    flex: 1; width: 100%; padding: 0 15px 0 20px; box-sizing: border-box;
}
.winControlBox{
    width: 100%; background: url(../../assets/img/index/titleBg.png) no-repeat left 1vh /100% 6vh; height: 7vh; display: flex; justify-content: space-between; align-items: flex-start;
}
#wrapper{
  background-color: #001439;
}
#wrapper.mapBg{
  background: url(../../assets/img/index/bg.jpg) no-repeat center/cover;
}
.title{
  margin-bottom: 6vh;
}

</style>