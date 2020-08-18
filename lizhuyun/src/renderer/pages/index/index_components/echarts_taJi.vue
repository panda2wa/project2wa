<!--设备状态-->
<template>
    <div>
        <div :id="id" :ref="id" :style="'height:'+height+'px'"></div>
    </div>
</template>
<script>
// import api from '@/apis/homeApi.js'
export default {
    name: 'echartsTaJi',
    props: {
        id: {
            type: String,
            default: ''
        },
        arr: {
            type: Array,
            default: [20, 7, 10, 3]
        },
        height: {
            type: Number,
            default: 220
        }
    },
    data () {
        return {
            taJi: ''
        }
    },
    watch: {
        'id': function (n, o) {
            if (n != o) {
                this.init()
            }
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
                let id = this.$refs[this.id]
                this.taJi = this.$echarts.init(id)
                this.lookTJEcharts()
            })
        },
        lookTJEcharts () {
            let data = this.arr
            let data2 = ['总计', '在线', '离线', '故障']
            let echartsFun = this.deviceConcrete2Fun(data, data2)
            this.taJi.setOption(echartsFun)
        },
        deviceConcrete2Fun (data, styleData) {
            let maxData
            if (Math.max(...data) == 0) maxData = 25
            let colorObj = new this.$echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                    { offset: 0, color: '#33daf3' },
                    { offset: 0.5, color: '#329fff' }
                ]
            )
            let option = {
                color: colorObj,
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: '' // 默认为直线，可选为：'line' | 'shadow'
                    },
                    extraCssText: 'border:1px solid #8d8d8d',
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    padding: 8
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '15%',
                    containLabel: true
                },
                xAxis: [{
                    type: 'category',
                    data: styleData, // ["17日","18日","19日"],
                    axisTick: {
                        alignWithLabel: true,
                        show: false // 不显示坐标轴刻度线
                    },
                    axisLine: {
                        show: false // 不显示坐标轴线
                    },
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color: '#6d84ae'
                        }
                    }
                }],
                yAxis: [{
                    max: maxData,
                    minInterval: 1,
                    axisLine: {
                        show: false // 不显示坐标轴线
                    },
                    axisTick: {
                        show: false // 不显示坐标轴刻度线
                    },
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}',
                        textStyle: {
                            color: '#6d84ae'
                        }
                    }, // 控制网格线是否显示
                    splitLine: {
                        show: true,
                        //  改变轴线颜色
                        lineStyle: {
                            // 使用深浅的间隔色
                            color: ['#1b284b']
                        }
                    }
                }],
                series: [{
                    type: 'bar',
                    barWidth: 36,
                    data: data,
                    itemStyle: {
                        normal: {
                            label: {
                                show: true, // 开启显示
                                position: 'top', // 在上方显示
                                textStyle: { // 数值样式
                                    color: '#9bcdff',
                                    fontSize: 12
                                }
                            }
                        }
                    }
                }, {
                    type: 'bar',
                    barWidth: 0.2,
                    tooltip: {
                        show: false
                    },
                    data: data,
                    itemStyle: {
                        normal: {
                            color: '#999999'
                        }
                    }
                }, {
                    name: 'a',
                    tooltip: {
                        show: false
                    },
                    type: 'bar',
                    barWidth: 8,
                    itemStyle: {
                        normal: {
                            barBorderRadius: [0, 0, 180, 0]
                        }
                    },
                    data: data,
                    barGap: 0
                }]
            }
            return option
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