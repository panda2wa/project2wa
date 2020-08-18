<!--扬尘某天数据-->
<template>
    <div class="rel" :style="'height:'+height+'px'">
        <div :id="id" :ref="id" :style="'height:'+(height-20)+'px'"></div>
    </div>
</template>
<script>
// import api from '@/apis/homeApi.js'
export default {
    name: 'echartsYangChen',
    props: {
        propArr: {
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
            arr: [],
            arrOther: [],
            danwei: '(um)',
            timeArr: [],
            yangChen: ''
        }
    },
    watch: {
        propArr: function (n, o) { // 监听用户是否点击刷新
            if (n != o) {
                this.init()
            }
        }
    },
    methods: {
        init () {
            this.$nextTick(() => {
                this.arr = []
                this.arrOther = []
                this.timeArr = []
                let id = this.$refs[this.id]
                if (this.id == 'keliwu') {
                    this.propArr.forEach(item => {
                        this.arr.push(item.pm10)
                    })
                    this.propArr.forEach(item => {
                        this.arrOther.push(item.pm25)
                    })
                } else {
                    this.propArr.forEach(item => {
                        this.arr.push(item.noiseDay)
                    })
                    this.propArr.forEach(item => {
                        this.arrOther.push(item.noiseNight)
                    })
                    this.danwei = '(dB)'
                }
                for (let index = 0; index < this.propArr.length; index++) {
                    this.timeArr.push(this.propArr[index].datatime.split(' ')[1].substr(0, 5))
                }
                this.yangChen = this.$echarts.init(id)
                this.tajialarmData(this.yangChen, this.timeArr, this.arr, this.arrOther)
            })
        },
        tajialarmData (elem, time, data, data2) {
            this.$nextTick(() => {
                let option = this.tajiEcharts(time, data, data2)
                elem.clear()
                elem.setOption(option, true)
            })
        },
        tajiEcharts (time, data, data2) {
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
                    axisLabel: {
                        interval: 1,
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
                    name: this.danwei
                }],
                series: [
                    {
                        name: 'pm2.5',
                        type: 'line',
                        smooth: true, // 是否平滑曲线
                        symbol: 'circle',
                        symbolSize: 10,
                        areaStyle: { // 区域填充样式。\
                            normal: {
                                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: '#43ffbf'
                                }, {
                                    offset: 1,
                                    color: 'transparent'
                                }])
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#43ffbf',
                                lineStyle: {
                                    color: '#43ffbf'
                                }
                            }
                        },
                        data: data
                    },
                    {
                        name: 'pm10',
                        type: 'line',
                        smooth: true, // 是否平滑曲线
                        symbol: 'circle',
                        symbolSize: 10,
                        areaStyle: { // 区域填充样式。\
                            normal: {
                                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: '#43a9ff'
                                }, {
                                    offset: 1,
                                    color: 'transparent'
                                }])
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#43a9ff',
                                lineStyle: {
                                    color: '#43a9ff'
                                }
                            }
                        },
                        data: data2
                    }
                ]
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
                this.arr = [8, 12, 2, 6, 4, 6, 1, 2, 1, 2, 0, 2, 8, 30]
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
@media screen and ( max-width: 1400px ) {
    
}
@media screen and ( max-width: 1280px ) {
    
}
</style>