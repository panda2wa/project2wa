<!--今日报警排名-->
<template>
    <div>
        <div :id="id" :ref="id" class="box" :style="'height:'+height+'px'">
            <ul class="list">
                <li>
                    <span>序号</span>
                    <span>项目名称</span>
                    <span>违章次数</span>
                </li>
                <li v-for="(item,index) in listArr" :key="index" v-if="index<5">
                    <span>{{index+1}}</span>
                    <span>{{item.name}}</span>
                    <span>{{item.time}}</span>
                </li>
            </ul>
            <ul class="tab abs">
                <li @click="tabFn(item.type,index)" :class="{now:index==idx}" v-for="(item,index) in tabArr" :key="index">{{item.text}}</li>
            </ul>
        </div>
    </div>
</template>
<script>
// import api from '@/apis/homeApi.js'
export default {
    name: 'echartsHunNingTuTodayPaiMing',
    props: {
        list: {
            type: Object,
            default: {}
        },
        tabArr: {
            type: Array,
            default: []
        },
        id: {
            type: String,
            default: ''
        },
        height: {
            type: Number,
            default: 220
        }
    },
    data () {
        return {
            idx: 0,
            listArr: []
        }
    },
    watch: {
        'list': function (n, o) {
            this.init()
        },
        '$store.state.refresh': function (n, o) { // 监听用户是否点击刷新
            if (n != o) {
                this.init()
            }
        }
    },
    methods: {
        init () {
            this.$nextTick(() => {
                this.idx = 0
                this.listArr = this.list[this.tabArr[0].type]
            })
        },
        tabFn (type, index) {
            this.listArr = this.list[type]
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
.list {
    font-size: 16px; color: #c2dafa; padding: 20px 10px;
    li{
        display: flex; justify-content: space-between; align-items: center; margin-top: 5px; padding: 0 10px; height: 34px; background: linear-gradient(to right, transparent, #003059);
        span{
            min-width: 100px; text-align: center; display: flex; justify-content: center; align-items: center;
        }
        span:first-child::before{
            content: ''; display: block; width: 4px; height: 11px; margin-right: 15px;
        }
    }
    li:first-child{
        background: linear-gradient(to right, #003059, transparent);
    }
    li:nth-child(2){
        span:first-child::before{
            background-color: #f33;
        }
    }
    li:nth-child(3){
        span:first-child::before{
            background-color: #d5500e;
        }
    }
    li:nth-child(4){
        span:first-child::before{
            background-color: #ff8e2a;
        }
    }
}
.tab{
    display: flex; justify-content: center; align-items: center; color: #09f; font-size: 14px; left: 0; right: 0; bottom: 10px;
    li{
        line-height: 14px; border-bottom: 2px solid transparent; padding: 0 10px 8px; cursor: pointer;
    }
    li.now{
        color: #75ddff; font-weight: bold; border-color: #75ddff;
    }
}
@media screen and ( max-width: 1400px ) {
    
}
@media screen and ( max-width: 1280px ) {
    
}
</style>