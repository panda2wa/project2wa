<!--设备状态-->
<template>
    <div>
        <div :id="id" :ref="id" :style="'height:'+height+'px'"></div>
    </div>
</template>
<script>
import api from '@/apis/homeApi.js'
export default {
    name: 'echartsHunNingTuToday',
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
            blockDataTotal: {}
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
                this.getTodayCuringSampleData()
            })
        },
        getTodayCuringSampleData () {
            api.getTodayCuringSampleData().then(res => {
                if (res.code == 200) {
                    this.blockDataTotal = res.result
                    let blockDataTotalArr = [
                        res.result.yry,
                        res.result.ysy,
                        res.result.dsy,
                        res.result.yh,
                        res.result.qy
                    ]
                    this.y_showConcreteData(this.blockDataTotal, blockDataTotalArr)
                } else {
                    this.blockDataTotal = {
                        qy: 0,
                        yh: 0,
                        dsy: 0,
                        ysy: 0,
                        yry: 0
                    }
                    this.y_showConcreteData(this.blockDataTotal)
                }
            }).catch(err => {
                console.error('混凝土今日数据统计错误', err)
            })
        },
        // 混凝土-数据统计
        y_showConcreteData (data, arr) {
            let oldData = []
            let category
            let barData
            if (this.curingControl == 1) {
                category = ['已认样', '已收样', '待送样', '取样']
                barData = [
                    data.yry,
                    data.ysy,
                    data.dsy,
                    data.qy
                ]
                oldData = [
                    data.yry,
                    data.ysy,
                    data.dsy,
                    data.qy
                ]
            } else {
                category = ['已认样', '已收样', '待收样', '养护', '取样']
                barData = [
                    data.yry,
                    data.ysy,
                    data.dssy,
                    data.yh,
                    data.qy
                ]
                oldData = [
                    data.yryP,
                    data.ysyP,
                    data.dssyP,
                    data.yhP,
                    data.qyP
                ]
            }
            let eachartBoxConcrete = this.$echarts.init(this.$refs[this.id])
            let maxData
            if (Math.max(...data) == 0) maxData = 25
            let option = {
                title: {
                    text: '',
                    padding: [222, 0, 0, 386],
                    textStyle: {
                        fontSize: 12,
                        fontStyle: 'normal',
                        fontWeight: 'normal',
                        color: '#6d84ae'
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'none'
                    },
                    extraCssText: 'border:1px solid #8d8d8d',
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    padding: 8,
                    formatter: function (data) {
                        return data[0].name + '：' + oldData[data[0].dataIndex]
                    }
                },
                grid: {
                    left: '3%',
                    right: '8%',
                    bottom: '2%',
                    top: '10%',
                    containLabel: true
                },
                xAxis: {
                    max: maxData,
                    minInterval: 1,
                    type: 'value',
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: true,
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
                },
                yAxis: {
                    type: 'category',
                    data: category,
                    splitLine: { show: false },
                    axisLine: {
                        show: false
                    },
                    axisLabel: {
                        textStyle: {
                            align: 'left',
                            color: '#6d84ae'
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    offset: 40,
                    nameTextStyle: {
                        fontSize: 15
                    }
                },
                series: [{
                    name: '数量',
                    type: 'bar',
                    data: barData,
                    barWidth: 6,
                    barCateGoryGap: 10,
                    smooth: true,
                    label: {
                        normal: {
                            show: true,
                            position: 'right',
                            offset: [5, 2],
                            textStyle: {
                                color: '#6d84ae',
                                fontSize: 10
                            }
                        }
                    },
                    itemStyle: {
                        emphasis: {
                            barBorderRadius: 4
                        },
                        normal: {
                            barBorderRadius: 4,
                            color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                { offset: 0, color: '#2d64d1' },
                                { offset: 1, color: '#00d4ce' }
                            ])
                        }
                    }
                }]
            }
            eachartBoxConcrete.clear()
            eachartBoxConcrete.setOption(option, true, false)
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