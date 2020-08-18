<template>
    <div class="menuBox">
        <h2>{{title}}</h2>
        <div v-if="menuList.length>0">
            <dl v-for="(item,index) in menuList" :key="index" :class="{now:index==outIdx}">
                <dt :class="{now:index==outIdx}" @click="showSelect(item,index)" :style="'padding-left:'+paddingLeft+'px'">
                    <span class="iconFont" v-html="item.icon"></span>
                    {{item.name}}
                </dt>
                <dd v-if="item.list.length>0" :style="'height:'+(index==outIdx?item.list.length*35:0)+'px;'+'padding-left:'+(paddingLeft+20)+'px'">
                    <p v-for="(i,idx) in item.list" :key="idx" @click="goPage(i,idx)" :class="{now:(index==outIdx&&idx==innerIdx)}">{{i.text}}</p>
                </dd>
            </dl>
        </div>
    </div>
</template>
<script>
export default {
  name: 'menuNav',
  props: {
      title: {
          type: String,
          default: ''
      },
      paddingLeft: {
          type: Number,
          default: 17
      },
      width: {
          type: Number,
          default: 0
      },
      menuList: {
          type: Array,
          default: []
      }
  },
  components: {},
  data () {
    return {
        outIdx: 0,
        innerIdx: 0
    }
  },
  methods: {
    init () {
        this.getOnceTag()
    },
    getSecTag () {
        if (!this.menuList[this.outIdx].isGoPage) {
            this.$emit('getSecTag', this.menuList[this.outIdx].list[this.innerIdx].text)
        } else {
            this.$emit('getSecTag', '')
        }
    },
    getOnceTag () {
        this.$emit('getOnceTag', this.menuList[this.outIdx].name)
        this.getSecTag()
    },
    goPage (item, index) {
        this.innerIdx = index
        this.getSecTag()
        this.$router.push(item.url)
    },
    showSelect (item, index) {
        this.outIdx = index
        this.innerIdx = 0
        this.getOnceTag()
        if (item.isGoPage) {
            this.$router.push(item.url)
        } else {
            this.$router.push(item.list[0].url)
        }
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
.menuBox{
    padding-right: 21px; box-sizing: border-box; width: 100%;
    dl.now{
        dd{
            visibility: visible;
        }
    }
    dl{
        color: #09f; font-size: 16px; line-height: 18px; overflow: hidden; transition: .3s all linear;
        dd{
             padding-left: 37px; cursor: pointer; transform-origin: center top; visibility: hidden; transition: .3s all linear;
            p{
                border-left: 4px solid transparent; padding-left: 13px; margin-bottom: 19px;
            }
            p.now{
                border-color: #75ddff; color: #75ddff;
            }
        }
        dt{
            background: url('../assets/img/index/leftnavicon.png') no-repeat center/ 100%; height: 60px; width: 100%; display: flex; justify-content: flex-start; align-items: center; padding-left: 17px; box-sizing: border-box; cursor: pointer;
            .iconFont{
                font-size: 24px; margin-right: 8px;
            }
        }
        dt.now{
            background-image: url('../assets/img/index/leftnavicon1.png'); color: #75ddff;
        }
    }
    h2{
        font-size: 16px; color: #fff; text-align: center; line-height: 18px;
    }
}
</style>