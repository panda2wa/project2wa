<!--今日报警记录-->
<template>
    <div class="todayDataBox rel">
        <span class="lineBgTop abs"></span>
        <span class="lineBgBom abs"></span>
        <dl :class="{moreDevice:isMore}" class="stateBox">
            <dt>今日报警记录</dt>
            <dd>
                <span @click="tabFn(item.type)" :class="{now:item.type==idx}" v-for="(item,index) in tabList" :key="index">{{item.text}}</span>
            </dd>
        </dl>
        <div class="echartsBox">
            <echartsHunNingTuTodayBaoJing v-if="idx==0" id="hunNingTuTodayBaoJing" :height="height+10" />
            <echartsTaJiTodayBaoJing v-if="idx==1" id="taJiToday" :height="height" :arr="[20, 7, 10, 3]" />
            <div style="padding-top:10px">
                <echartsYangChenTodayBaoJing v-if="idx==5" id="yangChenToday" :height="height" />
            </div>
        </div>
        <router-link to="/home" v-if="idx==5" tag="span" class="moreData abs">更多</router-link>
    </div>
</template>
<script>
// import api from '@/apis/homeApi.js'
import echartsHunNingTuTodayBaoJing from './echarts_hunNingTu_today_baojing'
import echartsTaJiTodayBaoJing from './echarts_taJiToday_baojing'
import echartsYangChenTodayBaoJing from './echarts_yangChenToday_baojing'
export default {
    name: 'todayBaoJing',
    components: {
        echartsHunNingTuTodayBaoJing, echartsTaJiTodayBaoJing, echartsYangChenTodayBaoJing
    },
    props: {
        height: {
            type: Number,
            default: 290
        },
        isMore: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            idx: -1,
            tabList: [
                // {
                //     type: 0,
                //     text: '混凝土'
                // },
                {
                    type: 1,
                    text: '塔机'
                },
                // {
                //     type: 2,
                //     text: '施工升降机'
                // },
                // {
                //     type: 3,
                //     text: '摄像头'
                // },
                // {
                //     type: 4,
                //     text: '闸机'
                // },
                {
                    type: 5,
                    text: '扬尘'
                }
            ]
        }
    },
    watch: {
        '$store.state.refresh': function (n, o) { // 监听用户是否点击刷新
            if (n != o) {
                this.init()
            }
        }
    },
    methods: {
        init () {
            this.tabFn(this.tabList[0].type)
        },
        tabFn (index) {
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
.echartsBox{
    padding-bottom: 20px;
}
.moreData{
    right: 10px; bottom: 10px; cursor: pointer; font-size: 12px; color: #09f;
}
.stateBox{
    font-size: 14px; color: #09f; padding: 10px 10px 0;
    dt{
        font-size: 22px; color: #fff; text-align: center; line-height: 22px;
    }
    dd{
        display: flex; justify-content: flex-start; align-items: center; margin: 10px 0 0 0;
        span{
            height: 25px; text-align: center; line-height: 25px; padding: 0 10px; position: relative; cursor: pointer; margin-right: 5px;
        }
        span.now{
             border: 1px solid #004c74; border-left: 0; border-right: 0; background-color: rgba($color: #09f, $alpha: .2); color: #75ddff; font-weight: bold;
        }
        span.now::before,span.now::after{
            content: ''; height: 2px; width: 15px; background-color: #009ece; position: absolute; left: 50%; margin-left: -7px;
        }
        span.now::before{
            top: 0;
        }
        span.now::after{
            bottom: 0;
        }
    }
}
.todayDataBox{
    background-color: rgba($color: #009fc7, $alpha: .05);
}
@media screen and ( max-width: 1400px ) {
    
}
@media screen and ( max-width: 1280px ) {
    
}
</style>