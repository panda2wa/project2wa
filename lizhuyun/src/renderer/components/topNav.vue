<!--页尾-->
<template>
    <div class="navBox">
      <ul>
          <li v-for="(item,index) in navList" :key="index" @click="goPage(item,index)" :class="[{ now: idx== index}, {gray:!item.isClick}, item.className]" @mouseover="showSelectFn(item)" @mouseout="hideSelectFn(item)">
              <span class="iconFont" v-html="item.icon"></span>
              <p>{{item.text}}</p>
              <dl class="secSelectBox" :class="{hover:isHover}" v-if="item.selectList.length>0">
                  <dd v-for="(i,x) in item.selectList" :key="x" :class="{gray:!i.isClick}" @click.stop="goPageSelect(i,index)">{{i.text}}</dd>
              </dl>
          </li>
      </ul>
    </div>
</template>
<script>

export default {
  name: 'topNav',
  data () {
    return {
        idx: 0,
        timer: null,
        isHover: false,
        navList: [
            {
                icon: '&#xe60a;',
                text: '主页',
                url: '/home',
                isClick: true,
                className: '',
                selectList: []
            },
            {
                icon: '&#xe60b;',
                text: '质量管理',
                url: '/zhiLiangGuanLi',
                className: '',
                selectList: []
            },
            {
                icon: '&#xe60e;',
                text: '安全施工',
                isClick: true,
                url: '/xingweiweizhang',
                className: 'notClick',
                selectList: [
                    {
                        text: '塔式起重机',
                        isClick: true,
                        url: '/xingweiweizhang'
                    },
                    {
                        text: '视频监控',
                        isClick: true,
                        url: '/shishishipin'
                    }
                ]
            },
            {
                icon: '&#xe60c;',
                text: '绿色施工',
                isClick: true,
                url: '/shishishuju',
                className: '',
                selectList: []
            },
            {
                icon: '&#xe60d;',
                text: '劳务实名制',
                url: '/laoWuShiMingZhi',
                className: '',
                selectList: []
            },
            {
                icon: '&#xe611;',
                text: '智慧办公',
                url: '/zhiHuiBanGong',
                className: '',
                selectList: []
            },
            {
                icon: '&#xe613;',
                text: '信息查询',
                url: '/xinXiChaXun',
                className: '',
                selectList: []
            }
        ]
    }
  },
  methods: {
    init () {},
    hideSelectFn (item) {
        if (item.selectList.length == 0) return false
        this.timer = setTimeout(() => {
            this.isHover = false
        }, 300)
    },
    showSelectFn (item) {
        if (item.selectList.length == 0) return false
        this.isHover = true
        clearTimeout(this.timer)
    },
    goPageSelect (item, index) {
        if (!item.isClick) return
        this.idx = index
        this.$router.push(item.url)
        this.isHover = false
    },
    goPage (item, index) {
        if (!item.isClick) return
        if (item.selectList.length > 0) return
        this.$router.push(item.url)
        console.log(index)
        this.idx = index
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
.navBox{
    color: #0099ff; font-size: 16px; margin: 2.8vh 0 0 15.1vw;
    ul{
        display: flex; justify-content: flex-start; align-items: center;
        .gray{
            *{
                color: gray;
            }
        }
        .gray:hover{
            *{
                color: gray;
            }
        }
        li{
            display: flex; justify-content: flex-start; align-items: center; position: relative; margin-right: 2vw;
            span{
                margin-right: 4px; cursor: pointer;
            }
            >p{
                cursor: pointer;
            }
            >dl.hover{
                display: block;
            }
            >dl{
                position: absolute; left: 0; top: 30px; display: none; padding: 8px 0; width: 108px; height: 100px; border: 1px solid #0099ff; background-color: rgba($color: #183868, $alpha: .95); z-index: 3;
                .gray{
                    color: gray;
                }
                dd{
                     cursor: pointer; padding: 12px 0; text-align: center; width: 100%; color: #0099ff; font-size: 14px;
                }
                dd:first-child{
                    border-bottom: 1px solid rgba($color: #0099ff, $alpha: .1);
                }
            }
        }
        li.now{
            span,p{
                color: #75ddff; font-weight: bold;
            }
        }
        li:hover{
            span,p{
                color: #75ddff; font-weight: bold;
            }
            dl{
                .gray:hover{
                    color: gray;
                }
                dd:hover{
                    color: #75ddff; font-weight: bold;
                }
            }
        }
        li.notClick:hover{
            span,p{
                cursor: default;
            }
        }
    }
}
@media screen and ( max-width: 1400px ) {
    .navBox{
        font-size: 12px;
    }
}
@media screen and ( max-width: 1280px ) {
    .navBox{
        font-size: 11px;
    }
}
</style>