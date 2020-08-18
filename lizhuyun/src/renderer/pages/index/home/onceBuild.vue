<!--
  主页
-->
<template>
    <div class="homeBox">
        <div class="leftBox rel">
          <span class="abs iconFont backBtn" @click="backFn" v-show="isShowBack">&#xe61a;</span>
          <projectInfo :isMore="false" />
          <div class="height18"></div>
          <!-- 今日设备状态 -->
          <deviceState :isMore="false" :height="280" />
        </div>
        <div class="centerBox">
          <dl class="centerCon">
            <dt>{{imgAndInfo.project_name}}</dt>
            <dd>
              <img :src="imgAndInfo.imgUrl" alt="">
            </dd>
          </dl>
          <div class="height18"></div>
          <videoBox :videoProjectIds="projectId" />
        </div>
        <div class="rightBox">
          <todayBaoJing :isMore="false" :height="350" />
          <div class="height18"></div>
          <todayData :isMore="false" :height="280" />
        </div>
    </div>
</template>
<script>
import api from '@/apis/homeApi.js'
import projectInfo from '@/pages/index/index_components/projectInfo'
import deviceState from '@/pages/index/index_components/deviceState'
import todayBaoJing from '@/pages/index/index_components/todayBaoJing'
import todayData from '@/pages/index/index_components/todayData'
import videoBox from '@/pages/index/index_components/video'
let global = require('electron').remote.getGlobal('sharedObject')
export default {
  name: 'onceBuild',
  components: {
    projectInfo, deviceState, videoBox, todayBaoJing, todayData
  },
  props: {},
  data () {
    return {
      projectId: '',
      isShowBack: false,
      imgAndInfo: {}
    }
  },
  watch: {},
  methods: {
    init () {
      this.projectId = this.$store.getters.getProjectIDs
      if (this.projectId) {
        this.isShowBack = true
      } else {
        this.isShowBack = false
      }
      this.getDepBackImgAndInfo()
    },
    backFn () {
      this.$store.commit('setProjectIDs', '')
    },
    getDepBackImgAndInfo () {
      let questData = {
        projectId: this.projectId
      }
      api.getDepBackImgAndInfo(questData).then(res => {
        if (res.code == 200) {
          this.imgAndInfo = res.result
          this.projectId = this.imgAndInfo.projectId
          this.imgAndInfo.imgUrl = 'http://' + global.imgName + ':' + global.imgPort + this.imgAndInfo.imgUrl
        }
      }).catch(err => {
        console.error('获取单标段项目主页大图错误', err)
      })
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
.backBtn{
  left: 0; top: -40px; color: #09f; font-size: 22px; cursor: pointer;
}
.centerCon{
  color: #fff; font-size: 22px; display: flex; flex-direction: column; height: 53.9vh;
  dt{
    text-align: center; height: 45px; line-height: 30px;
  }
  dd{
    flex: 1; display: flex; justify-content: center; align-items: center; background-color: rgba($color: #09f, $alpha: .05);
    img{
      max-width: 100%; max-height: 100%;
    }
  }
}
</style>