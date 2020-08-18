<!--
  工作循环
-->
<template>
    <div class="wrap">
        <topFilter 
        :isArea="true"
        :isStatus="true"
        :isDateRange="true"
        :isSearch="true"
        :isReset="true"
        @resetFn="resetFn"
        @setDateRange="setDateRange"
        @setAreaValue="setAreaValue"
        @setSearchValue="setSearchValue"
        @setDataStatu="setDataStatu"
        />
        <tableBox :paginationObj='paginationObj' :len="tableData.length" @goJumpPageFn="goJumpPage">
            <el-table :data="tableData" style="width: 100%" height="100%" border>
                <el-table-column type="index" label="序号" align="center" :index="indexMethod" width="81"></el-table-column>
                <el-table-column prop="area_name" label="行政属地" align="center" width="106"></el-table-column>
                <el-table-column prop="jd_area_name" label="监督机构" align="center" width="89"></el-table-column>
                <el-table-column prop="propertyNumbers" label="产权备案号" align="center" width="176"></el-table-column>
                <el-table-column prop="craneID" label="现场编号" align="center" width="136"></el-table-column>
                <el-table-column prop="useUnitName" label="使用单位" align="center" width="92"></el-table-column>
                <el-table-column prop="project_name" label="项目名称" align="center"></el-table-column>
                <el-table-column prop="accumulatedLiftingWeight" label="累计吊重" align="center" width="136"></el-table-column>
                <el-table-column prop="accumulatedLiftingWeightCount" label="累计次数" align="center" width="136"></el-table-column>
                <el-table-column prop="accumulatedLiftingTime" label="累计时间" align="center" width="136"></el-table-column>
                <el-table-column label="工作循环" align="center" width="106">
                    <template slot-scope="scope">
                        <el-button
                        @click.native.prevent="showDetail(scope.row,true)"
                        type="text"
                        size="small">
                        查看
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </tableBox>
        <div class="detailListBox" v-show="isShowDetail">
            <div class="headBox">
                <span>行为违章详情（共156条记录）</span>
                <span class="iconFont" @click="showDetail({},false)">&#xe631;</span>
            </div>
            <div class="detailTableBox">
                <tableBox :paginationObj='paginationDetailObj' :len="tableDataDetail.length" @goJumpPageFn="goJumpPageDetail">
                    <el-table :data="tableDataDetail" style="width: 100%;" height="100%" border>
                        <el-table-column type="index" label="序号" width="43" align="center" :index="indexMethodDetail"></el-table-column>
                        <el-table-column prop="startTime" label="采集时间" width="134" align="center"></el-table-column>
                        <el-table-column prop="endTime" label="结束时间" width="134" align="center"></el-table-column>
                        <el-table-column prop="weight" label="吊重（t）" width="64" align="center"></el-table-column>
                        <el-table-column label="工作循环" align="center">
                            <el-table-column prop="maxTorque" align="center" label="最大力矩（kn^m）" width="134"></el-table-column>
                            <el-table-column prop="maxHeight" align="center" label="最大高度（m）" width="106"></el-table-column>
                            <el-table-column prop="minHeight" align="center" label="最小高度（m）" width="106"></el-table-column>
                            <el-table-column prop="maxExtent" align="center" label="最大幅度（m）" width="106"></el-table-column>
                            <el-table-column prop="minExtent" align="center" label="最小幅度（m）" width="106"></el-table-column>
                        </el-table-column>
                        <el-table-column label="起吊点状态" align="center">
                            <el-table-column prop="startAngle" align="center" label="角度（°）" width="74"></el-table-column>
                            <el-table-column prop="startExtent" align="center" label="幅度（m）" width="82"></el-table-column>
                            <el-table-column prop="startHeight" align="center" label="高度（m）" width="82"></el-table-column>
                        </el-table-column>
                        <el-table-column label="卸吊点" align="center">
                            <el-table-column prop="endAngle" align="center" label="角度（°）" width="74"></el-table-column>
                            <el-table-column prop="endExtent" align="center" label="幅度（m）" width="82"></el-table-column>
                            <el-table-column prop="endHeight" align="center" label="高度（m）" width="82"></el-table-column>
                        </el-table-column>
                        <el-table-column label="历史数据" align="center">
                            <template slot-scope="scope">
                                <el-button
                                @click.native.prevent="showDetail2d(scope.row,true)"
                                type="text"
                                size="small">
                                2D
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="详细数据" class-name="notBorder" align="center" prop="">
                            <template slot-scope="scope">
                                <el-button
                                @click.native.prevent="goDetail(scope.row,true)"
                                type="text"
                                size="small">
                                查看
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </tableBox>
            </div>
        </div>
        <div class="fixed detailInnerBox" v-show="isShowInner">
            <div class="innerBox">
                <span class="iconFont" @click="goDetail({},false)">&#xe631;</span>
                <h2>当前工作循环数据</h2>
                <div class="detailTableBox">
                    <tableBox :paginationObj='paginationInnerObj' :len="tableDataInner.length" @goJumpPageFn="goJumpPageInner">
                        <el-table :data="tableDataInner" style="width: 100%;" height="100%" border>
                            <el-table-column type="index" label="序号" width="43" align="center" :index="indexMethodInner"></el-table-column>
                            <el-table-column prop="startTime" label="采集时间" width="164" align="center"></el-table-column>
                            <el-table-column prop="weight" align="center" label="吊重（T）"></el-table-column>
                            <el-table-column prop="logicPoint" align="center" label="角度（°）"></el-table-column>
                            <el-table-column prop="extent" align="center" label="幅度（m）"></el-table-column>
                            <el-table-column prop="height" align="center" label="高度（m）"></el-table-column>
                            <el-table-column prop="torque" align="center" label="力矩（%）"></el-table-column>
                        </el-table>
                    </tableBox>
                </div>
            </div>
        </div>
        <div class="fixed detailInnerBox detailBox2d" v-if="isShow2d">
            <div class="innerBox">
                <shishishituDetail :isPop="true" :param="param" @setPopClose="setPopClose" />
            </div>
        </div>
    </div>
</template>
<script>
import api from '@/apis/tajiApi.js'
import topFilter from '../taji_components/topFilter'
import tableBox from '@/components/tableBox'
import shishishituDetail from './shishishituDetail'
export default {
    name: 'gongzuoxunhuan',
    components: {
        topFilter, shishishituDetail, tableBox
    },
    props: {},
    data () {
        return {
            param: {},
            isShow2d: false,
            isShowInner: false,
            tableDataInner: [],
            isShowDetail: false,
            tableDataDetail: [],
            checked: false,
            paginationObj: {},
            paginationDetailObj: {},
            paginationInnerObj: {},
            tableData: [],
            project_id: null,
            questDataList: {
                beginTime: null,
                endTime: null,
                pageIndex: 1,
                pageSize: 15,
                propertyNumbers: null
            },
            questDataInner: {
                beginTime: null,
                endTime: null,
                pageIndex: 1,
                pageSize: 15,
                propertyNumbers: null
            },
            questData: {
                areaCode: null,
                beginTime: null,
                endTime: null,
                jdArea: null,
                pageIndex: 1,
                pageSize: 15,
                query: null
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
    computed: {},
    methods: {
        init () {
            this.listWorkingCycleData()
        },
        ListWorkingCycleSpecificData () {
            let questData = this.questDataInner
            api.ListWorkingCycleSpecificData(questData).then(res => {
                if (res.code == 200) {
                    this.tableDataInner = res.result.rowData
                    this.paginationInnerObj = {
                        currentPage: res.result.pageIndex,
                        total: res.result.total,
                        oncePageTotal: res.result.pageSize
                    }
                } else {
                    console.error('获取具体工作循环详细数据错误', res)
                }
            }).catch(err => {
                console.error('获取具体工作循环详细数据错误', err)
            })
        },
        listWorkingCycleDetailDatas () {
            let questData = this.questDataList
            api.listWorkingCycleDetailDatas(questData).then(res => {
                if (res.code == 200) {
                    this.tableDataDetail = res.result.rowData
                    this.paginationDetailObj = {
                        currentPage: res.result.pageIndex,
                        total: res.result.total,
                        oncePageTotal: res.result.pageSize
                    }
                } else {
                    console.error('获取塔机工作循环列表点击查看对应工作循序列表错误', res)
                }
            }).catch(err => {
                console.error('获取塔机工作循环列表点击查看对应工作循序列表错误', err)
            })
        },
        listWorkingCycleData () {
            let questData = this.questData
            api.listWorkingCycleData(questData).then(res => {
                if (res.code == 200) {
                    this.tableData = res.result.rowData
                    this.paginationObj = {
                        currentPage: res.result.pageIndex,
                        total: res.result.total,
                        oncePageTotal: res.result.pageSize
                    }
                } else {
                    console.error('获取塔机累计工作循环列表错误', res)
                }
            }).catch(err => {
                console.error('获取塔机累计工作循环列表错误', err)
            })
        },
        setDateRange (e) {
            this.questData.beginTime = e[0]
            this.questData.endTime = e[1]
            this.questData.pageIndex = 1
            this.showDetail({}, false)
            this.listWorkingCycleData()
        },
        setDataStatu (e) {
            this.questData.jdArea = e
            this.questData.pageIndex = 1
            this.showDetail({}, false)
            this.listWorkingCycleData()
        },
        setAreaValue (e) {
            this.questData.areaCode = e
            this.questData.pageIndex = 1
            this.showDetail({}, false)
            this.listWorkingCycleData()
        },
        setSearchValue (e) {
            this.questData.query = e
            this.questData.pageIndex = 1
            this.showDetail({}, false)
            this.listWorkingCycleData()
        },
        resetFn (e) {
            this.questData.areaCode = null
            this.questData.jdArea = null
            this.questData.query = null
            this.questData.beginTime = null
            this.questData.endTime = null
            this.questData.pageIndex = 1
            this.showDetail({}, false)
            this.listWorkingCycleData()
        },
        setPopClose (e) {
            this.isShow2d = e
        },
        setChecked () {
            this.tableData.forEach(item => {
                this.$set(item, 'checked', this.checked)
            })
        },
        goJumpPageInner (e) {
            this.questDataInner.pageIndex = e
            this.ListWorkingCycleSpecificData()
        },
        goJumpPageDetail (e) {
            this.questDataList.pageIndex = e
            this.listWorkingCycleDetailDatas()
        },
        goJumpPage (e) {
            this.questData.pageIndex = e
            this.listWorkingCycleData()
        },
        indexMethodInner (index) {
            return (this.paginationInnerObj.currentPage - 1) * this.paginationInnerObj.oncePageTotal + (index + 1)
        },
        indexMethodDetail (index) {
            return (this.paginationDetailObj.currentPage - 1) * this.paginationDetailObj.oncePageTotal + (index + 1)
        },
        indexMethod (index) {
            return (this.paginationObj.currentPage - 1) * this.paginationObj.oncePageTotal + (index + 1)
        },
        showDetail2d (item, bool) {
            this.isShow2d = bool
            if (this.isShow2d) {
                this.param = item
                this.param.project_id = this.project_id
            }
        },
        showDetail (item, bool) {
            console.log(item)
            this.isShowDetail = bool
            if (this.isShowDetail) {
                this.questDataList.beginTime = this.questData.beginTime
                this.questDataList.endTime = this.questData.endTime
                this.questDataList.propertyNumbers = item.propertyNumbers
                this.project_id = item.project_id
                this.listWorkingCycleDetailDatas()
            }
        },
        goDetail (item, bool) {
            this.isShowInner = bool
            if (this.isShowInner) {
                this.questDataInner.beginTime = item.startTime
                this.questDataInner.endTime = item.endTime
                this.questDataInner.propertyNumbers = item.propertyNumbers
                this.ListWorkingCycleSpecificData()
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
.detailBox2d{
    .innerBox{
        height: 74vh; width: 73vw;
    }
}
</style>