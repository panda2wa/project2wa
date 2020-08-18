<!--今日报警记录-->
<template>
    <div class="todayDataBox rel">
        <span class="lineBgTop abs"></span>
        <span class="lineBgBom abs"></span>
        <dl :class="{moreDevice:isMore}" class="stateBox">
            <dt>今日报警排名</dt>
            <dd>
                <span @click="tabFn(item.type)" :class="{now:item.type==idx}" v-for="(item,index) in tabList" :key="index">{{item.text}}</span>
            </dd>
        </dl>
        <div class="echartsBox">
            <echartsHunNingTuTodayPaiMing :list='list' :tabArr="tabArr" id="paiming" :height="300" />
        </div>
        <router-link to="/home" tag="span" class="moreData abs">更多</router-link>
    </div>
</template>
<script>
// import api from '@/apis/homeApi.js'
import echartsHunNingTuTodayPaiMing from './echarts_paiMingToday'
export default {
    name: 'todayPaiMing',
    components: {
        echartsHunNingTuTodayPaiMing
    },
    props: {
        isMore: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            idx: 0,
            list: {},
            tabArr: [],
            tajiContent: {
                breakRule: [
                    { name: '景.尚景四期', time: '39次' },
                    { name: '恒大山水城', time: '32次' },
                    { name: '御富枫景', time: '24次' },
                    { name: '西财置业·学府尚郡', time: '19次' },
                    { name: '龙湾社区', time: '15次' },
                    { name: '金海岸二期B区', time: '13次' },
                    { name: '锦上城', time: '9次' },
                    { name: '广场花园二期', time: '5次' },
                    { name: '“泉水人家”二期', time: '4次' },
                    { name: '骑龙国际', time: '2次' }
                ],
                breakDown: [
                    { name: '滨江商住楼一期', time: '42次' },
                    { name: '上锦颐园一佳境二标段', time: '38次' },
                    { name: '东林春天二期', time: '34次' },
                    { name: '城市春天2号楼', time: '30次' },
                    { name: '宏瑞-世纪滨江二标段', time: '26次' },
                    { name: '国嘉生物技术公司办公楼', time: '22次' },
                    { name: '恒江丽苑三期', time: '18次' },
                    { name: '御富枫景', time: '14次' },
                    { name: '万安雅居乐花园', time: '11次' },
                    { name: '“上福佳苑”2#楼', time: '8次' }
                ]
            },
            yangchenContent: {
                littleGrain: [
                    { name: '财富又一城', time: '29次' },
                    { name: '荣华上林三期', time: '27次' },
                    { name: '公园一号', time: '25次' },
                    { name: '银海金岸', time: '21次' },
                    { name: '中海兰庭', time: '17次' },
                    { name: '万科、水岸华庭', time: '14次' },
                    { name: '全兴蓉上坊', time: '10次' },
                    { name: '东立国际花城', time: '9次' },
                    { name: '龙华二期', time: '5次' },
                    { name: '万鸿城市花园', time: '3次' }
                ],
                largeGrain: [
                    { name: '东立国际花城', time: '26次' },
                    { name: '龙华新居二期', time: '24次' },
                    { name: '锦上南庭', time: '22次' },
                    { name: '和谐公寓', time: '19次' },
                    { name: '柳岸锦城', time: '14次' },
                    { name: '东山国际新城E区', time: '10次' },
                    { name: '富丽.碧蔓汀', time: '7次' },
                    { name: '成飞盛畅园', time: '4次' },
                    { name: '都市豪庭商住楼', time: '3次' },
                    { name: '生态水城三期', time: '1次' }
                ],
                noice: [
                    { name: '东郊安置房', time: '38次' },
                    { name: '成飞盛畅园', time: '34次' },
                    { name: '红光金仪小区', time: '29次' },
                    { name: '凤凰小区农迁房', time: '25次' },
                    { name: '峰景尚品居', time: '21次' },
                    { name: '全兴蓉上坊二期', time: '15次' },
                    { name: '丰尚领域', time: '10次' },
                    { name: '天泉聚龙新一期', time: '9次' },
                    { name: '万鸿城市花园', time: '7次' },
                    { name: '水城上岛', time: '4次' }
                ]
            },
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
            if (index == 1) {
                this.tabArr = [
                    {
                        type: 'breakRule',
                        text: '行为违章'
                    },
                    {
                        type: 'breakDown',
                        text: '故障报警'
                    }
                ]
                this.list = this.tajiContent
            }
            if (index == 5) {
                this.tabArr = [
                    {
                        type: 'littleGrain',
                        text: 'PM2.5'
                    },
                    {
                        type: 'largeGrain',
                        text: 'PM10'
                    },
                    {
                        type: 'noice',
                        text: '噪声'
                    }
                ]
                this.list = this.yangchenContent
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