<!--设备状态-->
<template>
    <div>
        <div :id="id" :ref="id" :style="'height:'+height+'px'"></div>
    </div>
</template>
<script>
import api from '@/apis/homeApi.js'
export default {
    name: 'echartsHunNingTu',
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
            hunNingTu: ''
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
                this.deviceDataInfo()
                let id = this.$refs[this.id]
                this.hunNingTu = this.$echarts.init(id)
            })
        },
        deviceDataInfo () {
            api.deviceDataInfo().then(res => {
                let dataNum = res.result
                let dataZ = ['植入设备', dataNum.zr.stoped, dataNum.zr.fail, dataNum.zr.running]
                let dataB = ['标养架', dataNum.by.stoped, dataNum.by.fail, dataNum.by.running]
                let dataT = ['同样架', dataNum.ty.stoped, dataNum.ty.fail, dataNum.ty.running]
                let dataJ = ['主机', dataNum.host.stoped, dataNum.host.fail, dataNum.host.running]
                this.showConcreteDevice(dataZ, dataB, dataT, dataJ, 1)
            }).catch(err => {
                console.error('设备统计请求错误', err)
            })
        },
        // 混凝土-设备状态
        showConcreteDevice (dataZ, dataB, dataT, dataJ, x) {
            let echartConcreteDevice = this.hunNingTu
            let maxData
            let testDataZ = dataZ[1] + dataZ[2] + dataZ[3]
            let testDataB = dataB[1] + dataB[2] + dataB[3]
            let testDataT = dataT[1] + dataT[2] + dataT[3]
            let testDataJ = dataJ[1] + dataJ[2] + dataJ[3]
            if (testDataZ + testDataB + testDataT + testDataJ == 0) {
                maxData = 12
            }
            let dataTest
            if (x == 2) {
                dataTest = [
                    { product: '收样设备', '离线': dataZ[1], '故障': dataZ[2], '在线': dataZ[3] },
                    { product: '认样设备', '离线': dataJ[1], '故障': dataJ[2], '在线': dataJ[3] }
                ]
            } else {
                dataTest = [
                    { product: '植入设备', '总计': testDataZ, '离线': dataZ[1], '故障': dataZ[2], '在线': dataZ[3] },
                    { product: '标养架', '总计': testDataB, '离线': dataB[1], '故障': dataB[2], '在线': dataB[3] },
                    { product: '同养架', '总计': testDataT, '离线': dataT[1], '故障': dataT[2], '在线': dataT[3] },
                    { product: '主机', '总计': testDataJ, '离线': dataJ[1], '故障': dataJ[2], '在线': dataJ[3] }
                ]
            }
            let option = {
                title: {
                    text: '(台)',
                    padding: [36, 0, 0, 16],
                    textStyle: {
                        fontSize: 12,
                        fontStyle: 'normal',
                        fontWeight: 'normal',
                        color: '#6d84ae'
                    }
                },
                legend: {
                    x: 'right',
                    y: 'top',
                    textStyle: { color: '#6d84ae' },
                    padding: [10, 30, 0, 0],
                    icon: 'rect',
                    itemWidth: 12,
                    itemHeight: 12
                },
                tooltip: {
                    axisPointer: {
                        type: 'none'
                    },
                    trigger: 'axis',
                    extraCssText: 'border:1px solid #8d8d8d',
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    padding: 8
                },
                dataset: {
                    dimensions: ['product', '总计', '离线', '故障', '在线'],
                    source: dataTest
                },
                xAxis: {
                    type: 'category',
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color: '#6d84ae'
                        }
                    }
                },
                yAxis: {
                    max: maxData,
                    minInterval: 1,
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
                },
                // Declare several bar series, each will be mapped
                // to a column of dataset.source by default.
                series: [
                    {
                        type: 'bar',
                        barWidth: 8,
                        itemStyle: {
                        normal: {
                            color: new this.$echarts.graphic.LinearGradient(200, 0, 400, 0, [{
                                offset: 0,
                                color: '#128bed'
                            }, {
                                offset: 0.5,
                                color: '#828282'
                            }, {
                                offset: 1,
                                color: '#128bed'
                            }]),
                            label: {
                                show: true, // 开启显示
                                position: 'top', // 在上方显示
                                textStyle: { // 数值样式
                                    color: '#6d84ae',
                                    fontSize: 12
                                }
                            },
                            barBorderRadius: [12, 12, 0, 0]
                        }
                        }
                    },
                    {
                        type: 'bar',
                        barWidth: 8,
                        itemStyle: {
                            normal: {
                                color: new this.$echarts.graphic.LinearGradient(200, 0, 400, 0, [{
                                    offset: 0,
                                    color: '#5d5d5c'
                                }, {
                                    offset: 0.5,
                                    color: '#828282'
                                }, {
                                    offset: 1,
                                    color: '#5d5d5c'
                                }]),
                                label: {
                                    show: true, // 开启显示
                                    position: 'top', // 在上方显示
                                    textStyle: { // 数值样式
                                        color: '#6d84ae',
                                        fontSize: 12
                                    }
                                },
                                barBorderRadius: [12, 12, 0, 0]
                            }
                        }
                    },
                    {
                        type: 'bar',
                        barWidth: 8,
                        itemStyle: {
                            normal: {
                                color: new this.$echarts.graphic.LinearGradient(200, 0, 400, 0, [{
                                    offset: 0,
                                    color: '#ff0000'
                                }, {
                                    offset: 0.5,
                                    color: '#ff3333'
                                }, {
                                    offset: 1,
                                    color: '#ff0000'
                                }]),
                                label: {
                                    show: true, // 开启显示
                                    position: 'top', // 在上方显示
                                    textStyle: { // 数值样式
                                        color: '#6d84ae',
                                        fontSize: 12
                                    }
                                },
                                barBorderRadius: [12, 12, 0, 0]
                            }
                        }
                    },
                    {
                        type: 'bar',
                        barWidth: 8,
                        itemStyle: {
                            normal: {
                                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: '#d7970a'
                                }, {
                                    offset: 0.5,
                                    color: '#fece22'
                                }, {
                                    offset: 1,
                                    color: '#d7970a'
                                }]),
                                label: {
                                    show: true, // 开启显示
                                    position: 'top', // 在上方显示
                                    textStyle: { // 数值样式
                                        color: '#6d84ae',
                                        fontSize: 12
                                    }
                                },
                                barBorderRadius: [12, 12, 0, 0]
                            }
                        }
                    }
                ]
            }
            if (echartConcreteDevice) {
                echartConcreteDevice.clear()
                echartConcreteDevice.setOption(option, true)
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

@media screen and ( max-width: 1400px ) {
    
}
@media screen and ( max-width: 1280px ) {
    
}
</style>