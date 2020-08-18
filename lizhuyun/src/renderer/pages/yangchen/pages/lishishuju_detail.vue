<!--
  实时数据
-->
<template>
    <div class="wrap">
        <div class="title">
            <routerBack />
            <p>项目名称：{{name}}</p>
        </div>
        <topFilter 
        :isDateRange="true"
        :isStatus="true" 
        :isGetExcel="true" 
        @setDataStatu="setDataStatu"
        @setDateRange="setDateRange" 
        @setExcel="setExcel" 
        @resetFn="resetFn" />
        <!-- <a href="http://192.168.1.79:9008/dust/dustDatas/exportHistData?UserID=70708ee0-ae6b-4c86-bf88-47767e2d7bee&projectId=60370116-4209-42aa-8a32-295122b4964a" >4363(⊙o⊙)…</a> -->
        <div class="detailTableBox">
            <tableBox :paginationObj='paginationObj' :len="tableData.length" @goJumpPageFn="goJumpPageFn">
                <el-table :data="tableData" border>
                    <el-table-column type="index" label="序号" align="center" :index="indexMethod" width="81"></el-table-column>
                    <el-table-column prop="datatime" label="采集时间" align="center"></el-table-column>
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
</template>
<script>
import api from '@/apis/yangchenApi.js'
import topFilter from '../yangchen_components/topFilter'
import tableBox from '@/components/tableBox'
import routerBack from '@/components/routerBack'
const globalData = require('electron').remote.getGlobal('sharedObject')
export default {
    name: 'shishishuju',
    components: {
        topFilter, tableBox, routerBack
    },
    props: {},
    data () {
        return {
            tableData: [],
            name: '',
            paginationObj: {},
            duobiaoQuestData: {
                projectId: null,
                areaCode: null,
                dataStatu: null,
                query: null,
                beginTime: null,
                endTime: null,
                pageIndex: 1,
                pageSize: 14
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
            return this.$store.getters.getProjectNum || 2
        }
    },
    methods: {
        init () {
            this.duobiaoQuestData.projectId = this.$route.query.projectId
            this.name = this.$route.query.projectName
            this.proHistData()
        },
        setExcel (e) {
            if (e) {
                this.exportHistData()
            }
        },
        goJumpPageFn (e) {
            this.duobiaoQuestData.pageIndex = e
            this.proHistData()
        },
        indexMethod (index) {
            return (this.paginationObj.currentPage - 1) * this.paginationObj.oncePageTotal + (index + 1)
        },
        resetFn (e) {
            this.duobiaoQuestData.dataStatu = null
            this.duobiaoQuestData.areaCode = null
            this.duobiaoQuestData.pageIndex = 1
            this.duobiaoQuestData.beginTime = null
            this.duobiaoQuestData.endTime = null
            this.duobiaoQuestData.query = null
            this.proHistData()
        },
        setDataStatu (e) {
            this.duobiaoQuestData.dataStatu = e
            this.duobiaoQuestData.pageIndex = 1
            this.proHistData()
        },
        setDateRange (e) {
            console.log(e)
            this.duobiaoQuestData.beginTime = e[0] + ' 00:00:00'
            this.duobiaoQuestData.endTime = e[1] + ' 00:00:00'
            this.duobiaoQuestData.pageIndex = 1
            this.proHistData()
        },
        exportHistData () {
            let questData = this.duobiaoQuestData
            const aLink = document.createElement('a')
            let url = 'http://' + globalData.yangchenName + ':' + globalData.yangchenPort + '/dust/dustDatas/exportHistData'
            let param = '?UserID=' + localStorage.userID + '&projectId=' + questData.projectId + '&pageIndex=' + questData.pageIndex + '&pageSize=' + questData.pageSize + '&areaCode=' + questData.areaCode + '&query=' + questData.query
            if (questData.beginTime) {
                param += '&beginTime=' + questData.beginTime
            }
            if (questData.endTime) {
                param += '&endTime=' + questData.endTime
            }
            if (questData.dataStatu) {
                param += '&dataStatu=' + questData.dataStatu
            }
            aLink.href = url + param
            aLink.click()
        },
        proHistData () {
            let questData = this.duobiaoQuestData
            questData.isYangchen = true
            api.proHistData(questData).then(res => {
                if (res.code == 200) {
                    this.paginationObj = {
                        currentPage: res.result.pageNum,
                        total: res.result.total,
                        oncePageTotal: res.result.pageSize
                    }
                    this.tableData = res.result.list
                } else {
                    console.error('根据项目id查询历史数据详情列表 带分页错误', res)
                }
            }).catch(err => {
                console.error('根据项目id查询历史数据详情列表 带分页错误', err)
            })
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
.title{
    display: flex; justify-content: flex-start; align-items: center; padding-bottom: 15px;
    >p{
        font-size: 14px; margin-left: 20px;
    }
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