<!--
  实时数据
-->
<template>
    <div class="wrap rel">
        <div v-if="isMore" class="wrapInner">
            <topFilter 
            :isSearch="true"
            :isArea="true" 
            @setAreaValue="setAreaValue"
            @setSearchValue="setSearchValue" 
            @resetFn="resetFn" />
            <tableBox :paginationObj='paginationObj' :len="tableData.length" @goJumpPageFn="goJumpPageFn">
                <el-table :data="tableData" style="width: 100%;" height="100%" border>
                    <el-table-column type="index" label="序号" align="center" :index="indexMethod" width="81"></el-table-column>
                    <el-table-column prop="areaName" label="行政区域" align="center" width="106"></el-table-column>
                    <el-table-column prop="projectName" label="项目名称" align="center"></el-table-column>
                    <el-table-column prop="buildName" label="施工单位" align="center"></el-table-column>
                    <el-table-column prop="supervisionName" label="监理单位" align="center"></el-table-column>
                    <el-table-column prop="zip" label="数据采集位置" align="center" width="176"></el-table-column>
                    <el-table-column label="操作" align="center" width="156">
                        <template slot-scope="scope">
                            <el-button
                            @click.native.prevent="goDetail(scope.row)"
                            type="text"
                            size="small">查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </tableBox>
        </div>
        <div v-else class="onceBuildBox wrapInner">
            <topFilter 
            :isDate="true"
            :isReset="false"
            @setDateFn="setDateFn" />
            <div class="echartBox" style="padding-bottom:20px; border-bottom:1px solid rgba(255,255,255,.1); margin-bottom:20px">
                <dl>
                    <dt>颗粒物</dt>
                    <dd>pm10</dd>
                    <dd>pm2.5</dd>
                </dl>
                <div class="echartsYangChen">
                    <echartsYangChen id="keliwu" :height="300" :propArr='propArr' />
                </div>
                <div class="errorBox">
                    <p>0次</p>
                    <span>异常次数</span>
                </div>
            </div>
            <div class="echartBox">
                <dl>
                    <dt>噪声</dt>
                    <dd>22点-6点</dd>
                    <dd>6点-22点</dd>
                </dl>
                <div class="echartsYangChen">
                    <echartsYangChen id="zaosheng" :height="300" :propArr='propArr' />
                </div>
                <div class="errorBox">
                    <p>0次</p>
                    <span>异常次数</span>
                </div>
            </div>
            <div class="abs detailBox">
                <div class="detailInner rel" :class="{show:isShowBox}">
                    <div class="detailTag" @click="showBoxFn">
                        <span class="iconFont btn"><i>&#xe63c;</i></span>
                        <p>详细信息</p>
                    </div>
                    <div class="detailCon detailTableBox">
                        <h2>数据明细</h2>
                        <tableBox :paginationObj='propArrObj' :len="tableDataDetail.length">
                            <el-table :data="tableDataDetail" style="width: 100%;" height="100%" border>
                                <el-table-column prop="datatime" label="采集时间" align="center" width="90"></el-table-column>
                                <el-table-column prop="pm25" label="pm2.5" align="center">
                                    <template slot-scope="scope">
                                        <div class="tableTextBox rel" :class="{red:scope.row.isPm25Exceed==1}">
                                            <span class="abs" v-if="scope.row.isPm25Exceed==1"><img src="@/assets/img/detail/pic_02.png" alt=""></span>
                                            <p>{{scope.row.pm25}}ug/m³</p>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="pm10" label="pm10" align="center">
                                    <template slot-scope="scope">
                                        <div class="tableTextBox rel" :class="{red:scope.row.isPm10Exceed==1}">
                                            <span class="abs" v-if="scope.row.isPm10Exceed==1"><img src="@/assets/img/detail/pic_02.png" alt=""></span>
                                            <p>{{scope.row.pm10}}ug/m³</p>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="噪声" align="center">
                                    <el-table-column prop="noiseDay" label="6点-22点" align="center">
                                    <template slot-scope="scope">
                                        <div class="tableTextBox rel" v-if="scope.row.noiseDay!=0" :class="{red:scope.row.isNoiseDayExceed==1}">
                                            <span class="abs" v-if="scope.row.isNoiseDayExceed==1"><img src="@/assets/img/detail/pic_02.png" alt=""></span>
                                            <p>{{scope.row.noiseDay}}dB</p>
                                        </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="noiseNight" label="22点-6点" align="center">
                                        <template slot-scope="scope">
                                            <div class="tableTextBox rel" :class="{red:scope.row.isNoiseNightExceed==1}">
                                                <span class="abs" v-if="scope.row.isNoiseNightExceed==1"><img src="@/assets/img/detail/pic_02.png" alt=""></span>
                                                <p>{{scope.row.noiseNight}}dB</p>
                                            </div>
                                        </template>
                                    </el-table-column>
                                </el-table-column>
                            </el-table>
                        </tableBox>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import api from '@/apis/yangchenApi.js'
import topFilter from '../yangchen_components/topFilter'
import tableBox from '@/components/tableBox'
import echartsYangChen from '../yangchen_components/echarts_yangchen'
export default {
    name: 'shishishuju',
    components: {
        topFilter, tableBox, echartsYangChen
    },
    props: {},
    data () {
        return {
            isMore: false,
            tableData: [],
            tableDataDetail: [],
            propArr: [],
            isShowBox: false,
            propArrObj: {
                currentPage: 1,
                total: 100,
                oncePageTotal: 1000
            },
            paginationObj: {},
            date: null,
            duobiaoQuestData: {
                projectId: null,
                areaCode: null,
                dataStatu: null,
                query: null,
                beginTime: null,
                endTime: null,
                pageIndex: 1,
                pageSize: 15
            }
        }
    },
    watch: {
        '$store.state.refresh': function (n, o) { // 监听用户是否点击刷新
            if (n != o) {
                this.init()
            }
        }
    },
    computed: {
        projectNum () {
            return this.$store.getters.getProjectNum || 1
        }
    },
    methods: {
        init () {
            if (this.isMore) {
                this.manyProHistData()
            } else {
                this.data1D()
                this.dataChart()
            }
        },
        showBoxFn () {
            this.isShowBox = !this.isShowBox
        },
        dataChart () {
            let questData = {
                isYangchen: true,
                date: this.date
            }
            api.dataChart(questData).then(res => {
                if (res.code == 200) {
                    this.propArr = res.result
                } else {
                    console.error('单项目某一天历史数据，刻度图表展示的数据错误', res)
                }
            }).catch(err => {
                console.error('单项目某一天历史数据，刻度图表展示的数据错误', err)
            })
        },
        data1D () {
            let questData = {
                isYangchen: true,
                date: this.date
            }
            api.data1D(questData).then(res => {
                if (res.code == 200) {
                    this.tableDataDetail = res.result
                    this.propArrObj.total = this.tableDataDetail.length
                } else {
                    console.error('单项目某一天的扬尘所有历史数据列表错误', res)
                }
            }).catch(err => {
                console.error('单项目某一天的扬尘所有历史数据列表错误', err)
            })
        },
        goDetail (item) {
            this.$router.push({
                path: '/lishishuju_detail',
                query: item
            })
        },
        goJumpPageFn (e) {
            this.duobiaoQuestData.pageIndex = e
            this.manyProHistData()
        },
        indexMethod (index) {
            return (this.paginationObj.currentPage - 1) * this.paginationObj.oncePageTotal + (index + 1)
        },
        resetFn (e) {
            this.duobiaoQuestData.dataStatu = null
            this.duobiaoQuestData.areaCode = null
            this.duobiaoQuestData.pageIndex = 1
            this.duobiaoQuestData.query = null
            this.manyProHistData()
        },
        setAreaValue (e) {
            this.duobiaoQuestData.areaCode = e
            this.duobiaoQuestData.pageIndex = 1
            this.manyProHistData()
        },
        setDateFn (e) {
            if (e) {
                this.date = e + ' 00:00:00'
                this.init()
            }
        },
        setSearchValue (e) {
            this.duobiaoQuestData.query = e
            this.duobiaoQuestData.pageIndex = 1
            this.manyProHistData()
        },
        manyProHistData () {
            let questData = this.duobiaoQuestData
            questData.isYangchen = true
            api.manyProHistData(questData).then(res => {
                if (res.code == 200) {
                    this.paginationObj = {
                        currentPage: res.result.pageNum,
                        total: res.result.total,
                        oncePageTotal: res.result.pageSize
                    }
                    this.tableData = res.result.list
                } else {
                    console.error('获取多项目历史数据错误', res)
                }
            }).catch(err => {
                console.error('获取多项目历史数据错误', err)
            })
        }
    },
    mounted () {
        let date = new Date()
        let Y = date.getFullYear() + '-'
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
        let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
        let _thisDate = Y + M + D + ' 00:00:00'
        this.date = _thisDate
        this.init()
    },
    created () {
        if (this.projectNum > 1) {
            this.isMore = true
        }
    },
    destroyed () {}
}
</script>

<style lang="scss" scoped>
.wrap{
    overflow-x: hidden;
}
.detailTableBox{
    height: 100%;
    h2{
        text-align: center; font-weight: normal; line-height: 40px;
    }
}
.detailBox{
    right: 0; top: 0; bottom: 0;
    .detailTag{
        width: 32px; background: #fff; color: #000; cursor: pointer;
        p{
            width: 100%; line-height: 18px; font-size: 14px; padding: 10px; box-sizing: border-box;
        }
        .btn{
            width: 100%; min-width: 0; border-radius: 0; margin: 0; padding: 0; font-size: 22px;
            i{
                font-style: normal; transform: rotate(90deg); transition: all .5s linear;
            }
        }
    }
    .detailCon{
        background: #183868; font-size: 12px; color: #6d84ae; max-height: 100%; box-sizing: border-box; padding-bottom: 10px; width: 515px;
        .otherStyle{
            padding-top: 10px; padding-bottom: 15px;
            dt,dd{
                border: 0; justify-content: center;
            }
        }
        dt{
            padding-top: 8px; height: 38px; display: flex; justify-content: center; align-items: center; color: #9cf; font-size: 13px; border-bottom: 1px solid #274b80;
        }
        dd{
            display: flex; justify-content: flex-start; align-items: center; border-bottom: 1px solid #274b80;
            p{
                line-height: 25px; border-right: 1px solid #274b80; width: 166px; padding-left: 17px; box-sizing: border-box;
            }
            span{
                width: 73px; padding-left: 15px; box-sizing: border-box;
            }
        }
    }
    .detailInner.show{
        transform: translateX(0);
        .detailTag .btn i{
             transform: rotate(-90deg);
        }
    }
    .detailInner{
        transition: all .5s linear; transform: translateX(515px); display: flex; justify-content: flex-end; align-items: flex-start; height: 100%; overflow: hidden;
    }
}
.echartBox{
    display: flex; justify-content: space-between; align-items: center;
    .errorBox{
        width: 180px; text-align: center; font-size: 14px; color: #7b8eae; display: none;
        p{
            font-size: 26px;
        }
    }
    dl{
        width: 168px; padding-left: 50px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: center; align-items: center;
        dd::before{
            content: ''; width: 12px; height: 12px; border-radius: 50%; margin-right: 10px; background-color: #43a9ff;
        }
        dd:last-child:before{
            background-color: #43ffbf;
        }
        dd{
            color: #7b8eae; display: flex; justify-content: flex-start; align-items: center; line-height: 18px; font-size: 16px; padding-bottom: 8px; width: 100%;
        }
        dt{
            font-size: 20px; line-height: 22px; padding-bottom: 40px; width: 100%;
        }
    }
    .echartsYangChen{
        flex: 1;
    }
}
</style>