<!--今日报警记录-->
<template>
    <div>
        <div class="rel" :style="'height:'+height+'px'">
            <div :id="id" :ref="id" :style="'height:'+(height-20)+'px'"></div>
            <ul class="tab abs">
                <li @click="tabFn(item.type)" :class="{now:item.type==isAlarmFaultConcreteShow}" v-for="(item,index) in tabList" :key="index">{{item.text}}</li>
            </ul>
            <router-link to="/home" tag="span" class="moreData abs">更多</router-link>
        </div>
    </div>
</template>
<script>
import api from '@/apis/homeApi.js'
export default {
    name: 'echartsHunNingTuTodayBaoJing',
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
            isAlarmFaultConcreteShow: 1,
            alarmDataBlock: {
                InBlock: [], // 入架
                OutBlock: [] // 出架
            },
            eachartAlarmConcrete: null,
            timeAlarm: [],
            dsyArr: [],
            yhArr: [],
            timeArr: [],
            dsyObj: {},
            yhObj: {},
            waitUserTypeStatus: 1,
            tabList: [
                {
                    type: 1,
                    text: '试件'
                },
                {
                    type: 2,
                    text: '标养室'
                },
                {
                    type: 3,
                    text: '同养架'
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
                this.eachartAlarmConcrete = this.$echarts.init(id)
                this.getTodayCuringBlockOutForYH(1)
            })
        },
        getTodayCuringBlockOutForYH () {
            api.getTodayCuringBlockOutForYH().then(res => {
                if (res.code == 200) {
                    this.dsyArr = []
                    this.yhArr = []
                    this.timeArr = []
                    this.dsyObj = res.result.yhqcj
                    this.yhObj = res.result.dsywcj
                    for (const key in this.dsyObj) {
                        this.dsyArr.push(this.dsyObj[key])
                        this.yhArr.push(this.yhObj[key])
                    }
                    for (let index = 0; index < this.yhArr.length; index++) {
                        this.timeArr.push(index + ':00')
                    }
                    this.alarmData(
                        this.eachartAlarmConcrete,
                        this.timeArr,
                        this.yhArr,
                        this.dsyArr
                    )
                }
            }).catch(err => {
                console.error('今日报警记录试件请求错误', err)
            })
        },
        getTodayThData () {
            api.getTodayThData().then(res => {
                if (res.code == 200) {
                    this.dsyArr = []
                    this.yhArr = []
                    this.timeArr = []
                    this.dsyObj = res.result.hmap
                    this.yhObj = res.result.tmap
                    for (const key in this.dsyObj) {
                        this.dsyArr.push(this.dsyObj[key])
                        this.yhArr.push(this.yhObj[key])
                    }
                    for (let index = 0; index < this.yhArr.length; index++) {
                        this.timeArr.push(index + ':00')
                    }
                    this.alarmData(
                        this.eachartAlarmConcrete,
                        this.timeArr,
                        this.yhArr,
                        this.dsyArr
                    )
                }
            }).catch(err => {
                console.error('今日报警记录标养室请求错误', err)
            })
        },
        TYDataPost () {
            this.dsyArr = []
            this.yhArr = []
            this.timeArr = []
            this.dsyArr = [8, 2, 2, 6, 4, 6, 1, 2, 1, 2, 0, 2, 1, 1]
            this.yhArr = [0, 7, 2, 8, 3, 6, 8, 2, 0, 6, 1, 1, 1, 11]
            for (let index = 0; index < this.yhArr.length; index++) {
                this.timeArr.push(index + ':00')
            }
            this.alarmData(
                this.eachartAlarmConcrete,
                this.timeArr,
                this.yhArr,
                this.dsyArr
            )
        },
        tabFn (type) {
            this.isAlarmFaultConcreteShow = type
            if (type == 1) {
                this.getTodayCuringBlockOutForYH()
            }
            if (type == 2) {
                this.getTodayThData()
            }
            if (type == 3) {
                this.TYDataPost()
            }
        },
        alarmData (elem, time, dataOne, dataTow) {
            this.$nextTick(() => {
                let self = this
                let option = this.concreteLine(
                    time,
                    dataOne,
                    dataTow,
                    this.isAlarmFaultConcreteShow,
                    self
                )
                elem.clear()
                elem.setOption(option, true)
            })
        },
        concreteLine (time, dataOne, dataTow, x, self) {
            let unitText, dataValueText, maxData, unit, seriesData
            // 小圆点
            let dotOne =
            '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#ff0000"></span>'
            let dotTow =
            '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#339999"></span>'
            if (Math.max(...dataOne) + Math.max(...dataTow) == 0) maxData = 25
                if (x == 1) {
                    unitText = '(块) '
                if (self.curingControl == 1) {
                    dataValueText = ['待送样已超期']
                    unit = '{b0}</br>' + dotTow + '{a0}：{c0}块'
                } else {
                    dataValueText = ['养护期出架', '待送样已超期']
                    unit =
                    '{b0}</br>' + dotOne + '{a0}：{c0}块</br>' + dotTow + '{a1}：{c1}块'
                }
            } else if (x == 2) {
                if (this.waitUserTypeStatus == 6) {
                    unitText = '(间) '
                    unit =
                    '{b0}</br>' + dotOne + '{a0}：{c0}间</br>' + dotTow + '{a1}：{c1}间'
                } else {
                    unitText = '(次) '
                    unit =
                    '{b0}</br>' + dotOne + '{a0}：{c0}次</br>' + dotTow + '{a1}：{c1}次'
                }
                dataValueText = ['湿度异常', '温度异常']
            } else if (x == 3) {
                if (this.waitUserTypeStatus == 6) {
                    unitText = '(个) '
                    unit =
                    '{b0}</br>' + dotOne + '{a0}：{c0}个</br>' + dotTow + '{a1}：{c1}个'
                } else {
                    unitText = '(次) '
                    unit =
                    '{b0}</br>' + dotOne + '{a0}：{c0}次</br>' + dotTow + '{a1}：{c1}次'
                }
                dataValueText = ['关闭异常', '开启异常']
            }
            if (self.curingControl == 1) {
            seriesData = [
                {
                name: dataValueText[0],
                type: 'line',
                stack: '总量',
                areaStyle: {
                    normal: {
                    color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                        offset: 0,
                        color: '#339999'
                        },
                        {
                        offset: 1,
                        color: 'transparent'
                        }
                    ])
                    }
                },
                symbol: 'circle',
                symbolSize: 6,
                itemStyle: {
                    normal: {
                    color: '#339999',
                    lineStyle: {
                        color: '#339999'
                    }
                    }
                },
                data: dataTow
                // [36, 55, 24, 38, 34, 12, 50, 32, 11, 19, 44, 43,35]
                // [45,65,25,45,35,45,35,45,35,45,35]
                }
            ]
            } else {
            seriesData = [
                {
                name: dataValueText[1],
                type: 'line',
                // stack: '总量',
                areaStyle: {
                    normal: {
                    color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                        offset: 0,
                        color: '#ff0000'
                        },
                        {
                        offset: 1,
                        color: 'transparent'
                        }
                    ])
                    }
                },
                symbol: 'circle',
                symbolSize: 6,
                itemStyle: {
                    normal: {
                    color: '#ff0000',
                    lineStyle: {
                        color: '#ff0000'
                    }
                    }
                },
                data: dataOne
                // [12, 22, 32, 45, 55, 24, 36,12, 22, 32, 45, 55,23]
                // [23,12,16,15,25,32,12,45,48,21,23,24]
                },
                {
                name: dataValueText[0],
                type: 'line',
                stack: '总量',
                areaStyle: {
                    normal: {
                    color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                        offset: 0,
                        color: '#339999'
                        },
                        {
                        offset: 1,
                        color: 'transparent'
                        }
                    ])
                    }
                },
                symbol: 'circle',
                symbolSize: 6,
                itemStyle: {
                    normal: {
                    color: '#339999',
                    lineStyle: {
                        color: '#339999'
                    }
                    }
                },
                data: dataTow
                }
            ]
            }

            let option = {
            title: {
                text: unitText,
                padding: [36, 0, 0, 16],
                textStyle: {
                fontSize: 12,
                fontStyle: 'normal',
                fontWeight: 'normal',
                color: '#6d84ae'
                }
            },
            tooltip: {
                axisPointer: {
                type: 'none'
                },
                trigger: 'axis',
                extraCssText: 'border:1px solid #8d8d8d',
                backgroundColor: 'rgba(0,0,0,0.8)',
                padding: 8,
                formatter: unit
            },
            legend: {
                x: '100px',
                y: '4px',
                type: 'scroll',
                data: dataValueText,
                textStyle: {
                fontSize: 12, // 字体大小
                color: '#6d84ae' // 字体颜色
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                type: 'category',
                boundaryGap: false,
                data: time,
                axisLabel: {
                    interval: 0,
                    show: true,
                    textStyle: {
                    color: '#6d84ae',
                    fontSize: 10
                    }
                }
                }
            ],
            yAxis: [
                {
                minInterval: 1,
                type: 'value',
                max: maxData,
                axisLabel: {
                    formatter: '{value}',
                    textStyle: {
                    color: '#6d84ae'
                    }
                },
                splitLine: {
                    show: false
                }
                }
            ],
            series: seriesData
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
.moreData{
    right: 10px; bottom: -20px; cursor: pointer; font-size: 12px; color: #09f;
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