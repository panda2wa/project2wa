<!--
  主页
-->
<template>
    <div class="homeBox">
      <div class="leftBox">
        <!-- 施工或项目信息 -->
        <projectInfo :isMore="true" />
        <div class="height18"></div>
        <!-- 今日设备状态 -->
        <deviceState :isMore="true" />
        <div class="height18"></div>
        <!-- 今日数据统计 -->
        <todayData :isMore="true" />
      </div>
      <div class="centerBox">
        <mapIndex @getProjectsId="getProjectsId" />
        <videoBox :videoProjectIds="videoProjectIds" :isMore="true" />
      </div>
      <div class="rightBox">
        <todayBaoJing :isMore="true" :height="320" />
        <div class="height18"></div>
        <todayPaiMing :isMore="true" :height="350" />
      </div>
    </div>
</template>
<script>
// import api from '@/apis/homeApi.js'
import projectInfo from '@/pages/index/index_components/projectInfo'
import deviceState from '@/pages/index/index_components/deviceState'
import mapIndex from '@/pages/index/index_components/mapIndex'
import todayData from '@/pages/index/index_components/todayData'
import todayBaoJing from '@/pages/index/index_components/todayBaoJing'
import todayPaiMing from '@/pages/index/index_components/todayPaiMing'
import videoBox from '@/pages/index/index_components/video'
export default {
  name: 'moreBuild',
  components: {
    projectInfo, deviceState, todayData, mapIndex, videoBox, todayBaoJing, todayPaiMing
  },
  props: {},
  data () {
    return {
      videoProjectIds: ''
    }
  },
  watch: {},
  methods: {
    init () {},
    getProjectsId (e) {
      let idArr = e.map(item => {
        return item.project_id
      })
      this.videoProjectIds = idArr.join(',')
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

</style>