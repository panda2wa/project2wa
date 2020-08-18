<!--设备状态-->
<template>
    <div class="rel" :style="'height:'+height+'px'">
        <span class="abs tips">平均值</span>
        <div :id="id" :ref="id" :style="'height:'+(height-20)+'px'"></div>
        <ul class="tab abs">
            <li @click="tabFn(item.type)" :class="{now:item.type==idx}" v-for="(item,index) in tabList" :key="index">{{item.text}}</li>
        </ul>
    </div>
</template>
<script>
// import api from '@/apis/homeApi.js'
export default {
    name: 'echartsYangChenToday',
    props: {
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
            arr: [8, 2, 2, 6, 4, 6, 1, 2, 1, 2, 0, 2, 1, 1],
            timeArr: [],
            yangChen: '',
            tabList: [
                {
                    type: 0,
                    text: 'PM2.5'
                },
                {
                    type: 1,
                    text: 'PM10'
                },
                {
                    type: 2,
                    text: '降噪'
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
            this.$nextTick(() => {
                let id = this.$refs[this.id]
                for (let index = 0; index < this.arr.length; index++) {
                    this.timeArr.push(index + ':00')
                }
                this.yangChen = this.$echarts.init(id)
                this.tajialarmData(this.yangChen, this.timeArr, this.arr)
            })
        },
        tajialarmData (elem, time, data) {
            this.$nextTick(() => {
                let option = this.tajiEcharts(time, data)
                elem.clear()
                elem.setOption(option, true)
            })
        },
        tajiEcharts (time, data) {
            // let dotTow = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#339999"></span>'
            // let unit = '{b0}</br>' + dotTow + '{a0}：{c0}块'
            let option = {
                color: ['#0080ff', '#4cd5ce'],
                tooltip: {
                    // axisPointer: {
                    //   type: 'none'
                    // },
                    // trigger: 'axis',
                    // extraCssText: 'border:1px solid #8d8d8d',
                    // backgroundColor: 'rgba(0,0,0,0.8)',
                    // padding: 8,
                    // formatter: unit
                },
                grid: {
                    left: '5%',
                    right: '5%',
                    top: '10%',
                    bottom: '5%',
                    containLabel: true
                },
                xAxis: [{
                    type: 'category',
                    boundaryGap: false,
                    data: time,
                    axisLine: {
                        show: false // 不显示坐标轴线
                    },
                    axisTick: {
                        show: false // 不显示坐标轴刻度线
                    },
                    axisLabel: {
                        interval: 0,
                        show: true,
                        textStyle: {
                            color: '#6d84ae',
                            fontSize: 10
                        }
                    }
                }],
                yAxis: [{
                    minInterval: 1,
                    type: 'value',
                    axisLine: {
                        show: false // 不显示坐标轴线
                    },
                    axisTick: {
                        show: false // 不显示坐标轴刻度线
                    },
                    axisLabel: {
                        formatter: '{value}',
                        textStyle: {
                            color: '#6d84ae'
                        }
                    },
                    splitLine: {
                        show: false
                    },
                    nameTextStyle: {
                        fontStyle: 'normal',
                        fontSize: 10,
                        color: '#6d84ae',
                        verticalAlign: 'middle',
                        align: 'center'
                    },
                    name: '(ug/m³)'
                }],
                series: [{
                    type: 'line',
                    smooth: false, // 是否平滑曲线
                    stack: 100,
                    symbol: 'circle',
                    symbolSize: 10,
                    // areaStyle: { // 区域填充样式。\
                    //     normal: {
                    //         color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    //             offset: 0,
                    //             color: '#339999'
                    //         }, {
                    //             offset: 1,
                    //             color: 'transparent'
                    //         }])
                    //     }
                    // },
                    itemStyle: {
                        normal: {
                            color: '#56a1fd',
                            lineStyle: {
                                color: '#56a1fd'
                            }
                        }
                    },
                    data: data
                }]
            }
            return option
        },
        tabFn (type) {
            this.idx = type
            if (type == 0) {
                this.arr = [8, 2, 2, 6, 4, 6, 1, 2, 1, 2, 0, 2, 1, 1]
            }
            if (type == 1) {
                this.arr = [8, 12, 2, 6, 4, 6, 1, 2, 1, 2, 0, 2, 1, 1]
            }
            if (type == 2) {
                this.arr = [8, 12, 2, 6, 4, 6, 1, 2, 1, 2, 8, 2, 10, 1]
            }
            this.tajialarmData(this.yangChen, this.timeArr, this.arr)
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
.tips{
    font-size: 14px; color: #6d84ae; left: 186px; top: 10px;
}
.tab{
    display: flex; justify-content: center; align-items: center; color: #09f; font-size: 14px; left: 0; right: 0; bottom: -10px;
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