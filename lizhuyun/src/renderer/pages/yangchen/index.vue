<template>
    <div class="tajiBox pageBox">
        <div class="leftWrap">
          <menuNav 
          :menuList="menuList" 
          :width="217" 
          :paddingLeft="40"
          @getOnceTag="getOnceTag" 
          @getSecTag="getSecTag" 
          title="扬尘监控" />
        </div>
        <div class="rightWrap">
          <tagBox :onceTag="onceTag" :secTag="secTag" />
          <router-view></router-view>
        </div>
    </div>
</template>
<script>
import menuNav from '@/components/menu'
import tagBox from '@/components/pagesTag'
export default {
  name: 'yangchen',
  components: {
    menuNav, tagBox
  },
  data () {
    return {
      onceTag: '',
      secTag: '',
      menuList: [
        {
          name: '扬尘数据',
          icon: '&#xe655;',
          list: [
            {text: '实时数据', url: '/shishishuju'},
            {text: '历史数据', url: '/lishishuju'},
            {text: '超标设置', url: '/chaobiaoshezhi'}
          ]
        },
        {
          name: '超标整改',
          icon: '&#xe656;',
          list: [
            {text: '整改清单', url: '/chaobiaozhenggai'},
            {text: '整改设置', url: '/chaobiaoshezhi'}
          ]
        }
        // {
        //   name: '设备管理',
        //   icon: '&#xe63b;',
        //   isGoPage: true,
        //   url: '/yangchen_shebeiguanli',
        //   list: []
        // },
        // {
        //   name: '数据统计',
        //   icon: '&#xe630;',
        //   list: [
        //     {text: '平均值统计', url: '/pingjunzhitongji'},
        //     {text: '超标次数统计', url: '/chaobiaocishutongji'},
        //     {text: '平均值排名', url: '/pingjunzhipaiming'},
        //     {text: '超标次数排名', url: '/chaobiaocishupaiming'},
        //     {text: '设备统计', url: '/yangchen_shebeitongji'}
        //   ]
        // },
        // {
        //   name: '扬尘监控',
        //   icon: '&#xe654;',
        //   list: [
        //     {text: '实时视频', url: '/shishishipin'},
        //     {text: '历史视频', url: '/lishishipin'}
        //   ]
        // }
      ]
    }
  },
  methods: {
    init () {},
    getSecTag (e) {
      this.secTag = e
    },
    getOnceTag (e) {
      this.onceTag = e
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