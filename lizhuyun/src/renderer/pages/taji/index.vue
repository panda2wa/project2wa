<template>
    <div class="tajiBox pageBox">
        <div class="leftWrap">
          <menuNav :menuList="menuList" :width="217" @getOnceTag="getOnceTag" @getSecTag="getSecTag" title="塔机监控" />
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
  name: 'taji',
  components: {
    menuNav, tagBox
  },
  data () {
    return {
      onceTag: '',
      secTag: '',
      menuList: [
        {
          name: '违章报警',
          icon: '&#xe600;',
          list: [
            {text: '行为违章', url: '/xingweiweizhang'},
            {text: '故障报警', url: '/guzhangbaojing'}
            // {text: '行为违章设置', url: '/xingweiweizhangshezhi'}
          ]
        },
        {
          name: '实时监控',
          icon: '&#xe62d;',
          list: [
            {text: '实时视图', url: '/shishishitu'},
            {text: '工作循环', url: '/gongzuoxunhuan'},
            {text: '顶升记录', url: '/dingshengjilu'}
          ]
        }
        // {
        //   name: '违章及故障监管',
        //   icon: '&#xe62e;',
        //   list: [
        //     {text: '行为违章整改', url: '/xingweiweizhangzhenggai'},
        //     {text: '故障报警整改', url: '/guzhangbaojingzhenggai'},
        //     {text: '整改设置', url: '/zhenggaishezhi'}
        //   ]
        // },
        // {
        //   name: '设备管理',
        //   icon: '&#xe619;',
        //   isGoPage: true,
        //   url: '/shebeiguanli',
        //   list: []
        // },
        // {
        //   name: '司机管理',
        //   icon: '&#xe620;',
        //   isGoPage: true,
        //   url: '/sijiguanli',
        //   list: []
        // },
        // {
        //   name: '统计分析',
        //   icon: '&#xe630;',
        //   list: [
        //     {text: '设备在线统计', url: '/shebeizaixiantongji'},
        //     {text: '行为违章统计', url: '/xingweiweizhangtongji'},
        //     {text: '行为违章排名', url: '/xingweiweizhangpaiming'},
        //     {text: '故障报警统计', url: '/guzhangbaojingtongji'},
        //     {text: '故障报警排名', url: '/guzhangbaojingpaiming'},
        //     {text: '整改设置', url: '/zhenggaishezhi'}
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