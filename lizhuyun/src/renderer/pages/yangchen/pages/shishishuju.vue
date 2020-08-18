<!--
  实时数据
-->
<template>
    <div class="wrap">
        <div v-if="isMore" class="wrapInner">
            <topFilter 
            :isSearch="true"
            :isStatus="true"
            :isArea="true"
            @setDataStatu="setDataStatu" 
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
                    <!-- <el-table-column prop="zip" label="数据采集位置" align="center" width="176"></el-table-column> -->
                    <el-table-column prop="pm25" label="pm2.5" align="center" width="156">
                        <template slot-scope="scope">
                            <div class="tableTextBox rel" :class="{red:scope.row.isPm25Exceed==1}">
                                <span class="abs" v-if="scope.row.isPm25Exceed==1"><img src="@/assets/img/detail/pic_02.png" alt=""></span>
                                <p>{{scope.row.pm25}}ug/m³</p>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="pm10" label="pm10" align="center" width="156">
                        <template slot-scope="scope">
                            <div class="tableTextBox rel" :class="{red:scope.row.isPm10Exceed==1}">
                                <span class="abs" v-if="scope.row.isPm10Exceed==1"><img src="@/assets/img/detail/pic_02.png" alt=""></span>
                                <p>{{scope.row.pm10}}ug/m³</p>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="zip" label="噪声" align="center" width="156">
                        <template slot-scope="scope">
                            <div class="tableTextBox rel" v-if="scope.row.noiseDay!=0" :class="{red:scope.row.isNoiseDayExceed==1}">
                                <span class="abs" v-if="scope.row.isNoiseDayExceed==1"><img src="@/assets/img/detail/pic_02.png" alt=""></span>
                                <p>{{scope.row.noiseDay}}dB</p>
                            </div>
                            <div class="tableTextBox rel" v-else :class="{red:scope.row.isNoiseNightExceed==1}">
                                <span class="abs" v-if="scope.row.isNoiseNightExceed==1"><img src="@/assets/img/detail/pic_02.png" alt=""></span>
                                <p>{{scope.row.noiseNight}}dB</p>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </tableBox>
        </div>
        <div v-else class="onceBuildBox wrapInner">
            <div class="topInfo" v-if="onceBuild&&onceBuild.project&&onceBuild.project.projectName">
                <p>扬尘采集位置：{{onceBuild.project.projectName}}</p>
                <div>
                    <div class="address">
                        <span>天气实况</span>
                        <p>
                            <span class="iconFont">&#xe66e;</span> {{weatherObj.city}}
                        </p>
                    </div>
                    <div class="info">
                        <div>
                            <p>风力风向：{{weatherObj.win}}{{weatherObj.winSpeed}}</p>
                            <p>空气质量：{{weatherObj.airLevel}}</p>
                        </div>
                        <ul>
                            <li>
                                <span v-if="weatherObj.weaType=='xue'" class="el-icon-light-rain"></span>
                                <span v-if="weatherObj.weaType=='lei'" class="el-icon-lightning"></span>
                                <span v-if="weatherObj.weaType=='shachen'" class="el-icon-sunrise-1"></span>
                                <span v-if="weatherObj.weaType=='wu'" class="el-icon-sunset"></span>
                                <span v-if="weatherObj.weaType=='bingbao'" class="el-icon-light-rain"></span>
                                <span v-if="weatherObj.weaType=='yun'" class="el-icon-cloudy"></span>
                                <span v-if="weatherObj.weaType=='yu'" class="el-icon-heavy-rain"></span>
                                <span v-if="weatherObj.weaType=='yin'" class="el-icon-cloudy-and-sunny"></span>
                                <span v-if="weatherObj.weaType=='qing'" class="el-icon-sunny"></span>
                                <p>{{weatherObj.tem}}℃</p>
                            </li>
                            <li>
                                <span class="iconFont">&#xe614;</span>
                                <p>{{weatherObj.humidity}}</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="bottomInfo" v-if="onceBuild&&onceBuild.dustData&&onceBuild.dustData.isPm25Exceed">
                <ul>
                    <li>
                        <p class="tag" :class="onceBuild.dustData.isPm25Exceed==1?'red':'green'">{{onceBuild.dustData.isPm25Exceed==1?'超标,正在降尘':'正常'}}</p>
                        <span>PM2.5</span>
                        <div>
                            <p>{{onceBuild.dustData.pm25}} ug/m³</p>
                            <span>标准值{{onceBuild.thresholdSet.pm25}} ug/m³</span>
                        </div>
                    </li>
                    <li>
                        <p class="tag" :class="onceBuild.dustData.isPm25Exceed==1?'red':'green'">{{onceBuild.dustData.isPm10Exceed==1?'超标,正在降尘':'正常'}}</p>
                        <span>PM10</span>
                        <div>
                            <p>{{onceBuild.dustData.pm10}} ug/m³</p>
                            <span>标准值{{onceBuild.thresholdSet.pm25}} ug/m³</span>
                        </div>
                    </li>
                    <li>
                        <p class="tag" v-if="onceBuild.dustData.noiseDay!=0" :class="onceBuild.dustData.isNoiseDayExceed==1?'red':'green'">{{onceBuild.dustData.isNoiseDayExceed==1?'超标':'正常'}}</p>
                        <p class="tag" :class="onceBuild.dustData.isNoiseNightExceed==1?'red':'green'" v-else>{{onceBuild.dustData.isNoiseNightExceed==1?'超标':'正常'}}</p>
                        <span>噪声</span>
                        <div>
                            <p>{{onceBuild.dustData.noiseDay?onceBuild.dustData.noiseDay:onceBuild.dustData.noiseNight}} dB</p>
                            <span>标准值{{onceBuild.dustData.noiseDay!=0 ? onceBuild.thresholdSet.noiseDay:onceBuild.thresholdSet.noiseNight}} dB</span>
                        </div>
                    </li>
                </ul>
                <div class="imgBox"><img src="@/assets/img/detail/pic_01.png" alt=""></div>
            </div>
        </div>
    </div>
</template>
<script>
import api from '@/apis/yangchenApi.js'
import topFilter from '../yangchen_components/topFilter'
import tableBox from '@/components/tableBox'
export default {
    name: 'shishishuju',
    components: {
        topFilter, tableBox
    },
    props: {},
    data () {
        return {
            isMore: false,
            tableData: [],
            onceBuild: {},
            weatherObj: {},
            paginationObj: {},
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
            return this.$store.getters.getProjectNum
        }
    },
    methods: {
        init () {
            if (this.isMore) {
                this.manyProRealData()
            } else {
                this.realData()
                this.realWeather()
            }
        },
        realWeather () {
            api.realWeather({isYangchen: true}).then(res => {
                if (res.code == 200) {
                    this.weatherObj = res.result
                } else {
                    console.error('项目所在地实时天气状况错误', res)
                }
            }).catch(err => {
                console.error('项目所在地实时天气状况错误', err)
            })
        },
        realData () {
            api.realData({isYangchen: true}).then(res => {
                if (res.code == 200) {
                    this.onceBuild = res.result
                } else {
                    console.error('单项目项目扬尘实时数据错误', res)
                }
            }).catch(err => {
                console.error('单项目项目扬尘实时数据错误', err)
            })
        },
        goJumpPageFn (e) {
            this.duobiaoQuestData.pageIndex = e
            this.manyProRealData()
        },
        indexMethod (index) {
            return (this.paginationObj.currentPage - 1) * this.paginationObj.oncePageTotal + (index + 1)
        },
        resetFn (e) {
            this.duobiaoQuestData.dataStatu = null
            this.duobiaoQuestData.areaCode = null
            this.duobiaoQuestData.pageIndex = 1
            this.duobiaoQuestData.query = null
            this.manyProRealData()
        },
        setAreaValue (e) {
            this.duobiaoQuestData.areaCode = e
            this.duobiaoQuestData.pageIndex = 1
            this.manyProRealData()
        },
        setDataStatu (e) {
            this.duobiaoQuestData.dataStatu = e
            this.duobiaoQuestData.pageIndex = 1
            this.manyProRealData()
        },
        setSearchValue (e) {
            this.duobiaoQuestData.query = e
            this.duobiaoQuestData.pageIndex = 1
            this.manyProRealData()
        },
        manyProRealData () {
            let questData = this.duobiaoQuestData
            questData.isYangchen = true
            api.manyProRealData(questData).then(res => {
                if (res.code == 200) {
                    this.paginationObj = {
                        currentPage: res.result.pageNum,
                        total: res.result.total,
                        oncePageTotal: res.result.pageSize
                    }
                    this.tableData = res.result.list
                } else {
                    console.error('获取多项目实时数据错误', res)
                }
            }).catch(err => {
                console.error('获取多项目实时数据错误', err)
            })
        }
    },
    mounted () {
        this.init()
    },
    created () {
        console.log(this.projectNum)
        if (this.projectNum > 1) {
            this.isMore = true
        }
    },
    destroyed () {}
}
</script>
<style lang="scss">
.wrapInner{
    flex: 1; display: flex; flex-direction: column;
}
.tableTextBox.red{
    color: #f00;
}
.tableTextBox{
    display: flex; justify-content: center; align-items: center;
    .abs{
        right: -47px; top: -25px;
        img{
            width: 54px;
        }
    }
}
</style>
<style lang="scss" scoped>


.onceBuildBox{
    flex: 1; display: flex; flex-direction: column;
}
.bottomInfo{
    flex: 1; overflow-y: auto;
    ul{
        display: flex; justify-content: flex-start; align-items: center; padding-top: 105px; padding-bottom: 137px;
        li{
            position: relative; width: 428px; height: 184px; display: flex; justify-content: space-between; align-items: center; font-size: 20px; color: #c2dafa; background: linear-gradient(90deg,rgba(0,123,255,.3) 0%,rgba(1,168,168,.3) 15%,rgba(0,44,82,.3) 100%); margin-left: 80px; box-sizing: border-box; padding: 0 120px 0 50px;
            >div{
                text-align: center;
                >span{
                    font-size: 14px;
                }
                >p{
                    font-size: 24px; color: #fff;
                }
            }
            .tag{
                position: absolute; top: 11px; right: -19px; text-align: right; padding-bottom: 15px; color: #3ed180; min-width: 100px;
            }
            .tag::after{
                content: ''; width: 100px; height: 10px; position: absolute; bottom: 0; right: 0; background: linear-gradient(to right,rgba(62,209,128,0),rgba(62,209,128,1));
            }
            .tag.red{
                color: #d83535;
            }
            .tag.red::after{
                 background: linear-gradient(to right,rgba(216, 53, 53,0),rgba(216, 53, 53,1));
            }
        }
    }
    .imgBox{
        display: flex; justify-content: center; align-items: center;
    }
}
.topInfo{
    display: flex; justify-content: space-between; align-items: flex-start; height: 123px;
    >div{
        display: flex; flex-direction: column; width: 490px;
        .info{
             padding-top: 15px; border-top: 1px dashed #172d59; margin-top: 22px; 
            ul{
                display: flex; justify-content: flex-end; align-items: center;
                li{
                    font-size: 14px; color: #6d84ae; margin-left: 55px; text-align: center;
                    span{
                        font-size: 30px; color: #0cf;
                    }
                }
            }
            >div{
                >p::before{
                    content: ''; width: 6px; height: 6px; border-radius: 50%; background-color: #7bf4ff; margin-right: 5px;
                }
                >p{
                    font-size: 16px; color: #6d84ae; display: flex; justify-content: flex-start; align-items: center;
                }
            }
        }
        .address{
            color: #6d84ae;
            >p{
                font-size: 18px;
                >span{
                    color: #2a78cc; font-size: 20px;
                }
            }
            >span{
                font-size: 20px;
            }
        }
        >div{
            display: flex; justify-content: space-between; align-items: center;
        }
    }
    >p{
        font-size: 14px;
    }
}
</style>