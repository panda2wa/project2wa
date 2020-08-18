<template>
    <div class="tajiBox pageBox rel">
        <div class="leftWrap" :class="{width0:isShowBig}">
            <menuNav 
            :menuList="menuList" 
            :width="217" 
            :paddingLeft="40"
            @getOnceTag="getOnceTag" 
            @getSecTag="getSecTag" 
            title="视频监控" />
        </div>
        <div class="rightWrap">
            <tagBox :onceTag="onceTag" :secTag="secTag" />
            <router-view></router-view>
        </div>
        <span class="iconFont abs moveBoxIcon" :class="{moveBoxIconLeft:isShowBig}" @click="showBig">&#xe63c;</span>
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
      isShowBig: false,
      menuList: [
        {
          name: '实时视频',
          icon: '&#xe8cc;',
          isGoPage: true,
          url: '/shishishipin',
          list: []
        }
        // {
        //   name: '历史记录',
        //   icon: '&#xe644;',
        //   isGoPage: true,
        //   url: '/shipin_lishijilu',
        //   list: []
        // },
        // {
        //   name: '视频截图',
        //   icon: '&#xe657;',
        //   isGoPage: true,
        //   url: '/shipinjietu',
        //   list: []
        // },
        // {
        //   name: '设备状态',
        //   icon: '&#xe623;',
        //   isGoPage: true,
        //   url: '/shipin_shebeizhuangtai',
        //   list: []
        // },
        // {
        //   name: '投屏设置',
        //   icon: '&#xe623;',
        //   isGoPage: true,
        //   url: '/toupingshezhi',
        //   list: []
        // }
      ]
    }
  },
  methods: {
    init () {},
    showBig () {
        this.isShowBig = !this.isShowBig
    },
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
.leftWrap{
    transition: all .5s;
}
.width0{
    width: 0;
}
.moveBoxIcon{
    font-size: 24px; color: #09f; transform: rotate(90deg); transition: all .5s; top: 50%; left: 185px; z-index: 9; cursor: pointer;
}
.moveBoxIconLeft{
    left: -25px;  transform: rotate(-90deg);
}
</style>