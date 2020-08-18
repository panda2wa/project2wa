<!--
  行为违章
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
        <tableBox :paginationObj='paginationObj' :len="tableData.length" @goJumpPageFn="goJumpPageFn">
            <el-table :data="tableData" style="width: 100%" height="100%" border>
                <!-- <el-table-column width="57" align="center">
                    <template slot="header">
                        <el-checkbox v-model="checked" @change="setChecked"></el-checkbox>
                    </template>
                    <template slot-scope="scope">
                        <el-checkbox v-model="scope.row.checked"></el-checkbox>
                    </template>
                </el-table-column> -->
                <el-table-column type="index" label="序号" align="center" :index="indexMethod" width="81"></el-table-column>
                <el-table-column prop="area_name" label="行政属地" align="center" width="106"></el-table-column>
                <el-table-column prop="jd_area_name" label="监督机构" align="center" width="89"></el-table-column>
                <el-table-column prop="propertyNumbers" label="产权备案号" align="center" width="176"></el-table-column>
                <el-table-column prop="model" label="设备型号" align="center" width="136"></el-table-column>
                <el-table-column prop="craneID" label="现场编号" align="center" width="92"></el-table-column>
                <el-table-column prop="project_name" label="项目名称" align="center"></el-table-column>
                <el-table-column prop="propertyUnitName" label="产权单位" align="center" width="250"></el-table-column>
                <el-table-column label="行为违章详情" align="center" width="106">
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
                <span>行为违章详情（共{{paginationDetailObj.total}}条记录）</span>
                <span class="iconFont" @click="showDetail({},false)">&#xe631;</span>
            </div>
            <div class="detailTableBox">
                <tableBox :paginationObj='paginationDetailObj' :len="tableDataDetail.length" @goJumpPageFn="goJumpPageDetail">
                    <el-table :data="tableDataDetail" style="width: 100%;" height="100%" border>
                        <el-table-column type="index" label="序号" width="43" align="center" :index="indexMethodDetail"></el-table-column>
                        <el-table-column prop="startTime" label="采集时间" width="164" align="center"></el-table-column>
                        <el-table-column label="碰撞" align="center">
                            <el-table-column prop="lcraneAlarm" align="center" label="左" width="54"></el-table-column>
                            <el-table-column prop="rcraneAlarm" align="center" label="右" width="54"></el-table-column>
                            <el-table-column prop="fcraneAlarm" align="center" label="远" width="54"></el-table-column>
                            <el-table-column prop="ncraneAlarm" align="center" label="近" width="54"></el-table-column>
                            <el-table-column prop="lowCrameAlarm" align="center" label="低" width="54"></el-table-column>
                        </el-table-column>
                        <el-table-column label="障碍物" align="center">
                            <el-table-column prop="nobstacleAlarm" align="center" label="左" width="54"></el-table-column>
                            <el-table-column prop="robstacleAlarm" align="center" label="右" width="54"></el-table-column>
                            <el-table-column prop="fobstacleAlarm" align="center" label="远" width="54"></el-table-column>
                            <el-table-column prop="nobstacleAlarm" align="center" label="近" width="54"></el-table-column>
                            <el-table-column prop="lowObstacleAlarm" align="center" label="低" width="54"></el-table-column>
                        </el-table-column>
                        <el-table-column label="回转行程限位" align="center">
                            <el-table-column prop="llimitAlarm" align="center" label="左" width="54"></el-table-column>
                            <el-table-column prop="rlimitAlarm" align="center" label="右" width="54"></el-table-column>
                        </el-table-column>
                        <el-table-column label="小车行程限位" align="center">
                            <el-table-column prop="flimitAlarm" align="center" label="远" width="54"></el-table-column>
                            <el-table-column prop="nlimitAlarm" align="center" label="近" width="54"></el-table-column>
                        </el-table-column>
                        <el-table-column label="其他" align="center">
                            <el-table-column prop="windSpeedAlarm" align="center" label="风速" width="54"></el-table-column>
                            <el-table-column prop="leanAlarm" align="center" label="倾斜" width="54"></el-table-column>
                        </el-table-column>
                        <el-table-column label="禁行区违章" align="center" prop="forbiddenAlarm"></el-table-column>
                        <el-table-column label="起重量限制" align="center" prop="weightAlarm"></el-table-column>
                        <el-table-column label="起重力矩限制" align="center" prop="lijuAlarm"></el-table-column>
                        <el-table-column label="高度行程限位" align="center" prop="hlimitAlarm"></el-table-column>
                        <el-table-column label="打卡（认证）" align="center" prop="login"></el-table-column>
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
                <h2>【{{questDataDetail.propertyNumbers}}】违章数据分析</h2>
                <div class="detailTableBox">
                    <tableBox :paginationObj='paginationInnerObj' :len="tableDataInner.length" @goJumpPageFn="goJumpPageInner">
                        <el-table :data="tableDataInner" style="width: 100%;" height="100%" border>
                            <el-table-column type="index" label="序号" width="43" align="center" :index="indexMethodInner"></el-table-column>
                            <el-table-column prop="startTime" label="采集时间" width="164" align="center"></el-table-column>
                            <el-table-column prop="alarmTypeName" label="违章类型" align="center"></el-table-column>
                            <el-table-column label="当前时间区间违章数据详情" align="center">
                                <el-table-column prop="weightValue" align="center" label="吊重（T）" width="105"></el-table-column>
                                <el-table-column prop="logicPointValue" align="center" label="角度（°）" width="105"></el-table-column>
                                <el-table-column prop="extentValue" align="center" label="幅度（m）" width="105"></el-table-column>
                                <el-table-column prop="heightValue" align="center" label="高度（m）" width="105"></el-table-column>
                                <el-table-column prop="torqueVlaue" align="center" label="力矩（%）" width="105"></el-table-column>
                            </el-table-column>
                        </el-table>
                    </tableBox>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import api from '@/apis/tajiApi.js'
import topFilter from '../taji_components/topFilter'
import tableBox from '@/components/tableBox'
export default {
    name: 'xingweiweizhang',
    components: {
        tableBox, topFilter
    },
    props: {},
    data () {
        return {
            isShowInner: false,
            tableDataInner: [],
            isShowDetail: false,
            tableDataDetail: [],
            checked: false,
            paginationObj: {},
            paginationDetailObj: {},
            paginationInnerObj: {
                currentPage: 1,
                total: 6,
                oncePageTotal: 5
            },
            questDataInner: {
                beginTime: null,
                pageIndex: 1,
                propertyNumbers: null,
                pageSize: 15
            },
            questDataDetail: {
                beginTime: null,
                endTime: null,
                pageIndex: 1,
                propertyNumbers: null,
                pageSize: 15
            },
            questData: {
                areaCode: null,
                beginTime: null,
                endTime: null,
                jdArea: null,
                pageIndex: 1,
                pageSize: 15,
                query: null
            },
            tableData: []
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
            this.getListBehaviorViolationDataView()
        },
        getListCraneBehaviorDetailsPage () {
            let questData = this.questDataInner
            api.getListCraneBehaviorDetailsPage(questData).then(res => {
                if (res.code == 200) {
                    this.tableDataInner = res.result.rowData
                    this.paginationInnerObj = {
                        currentPage: res.result.pageIndex,
                        total: res.result.total,
                        oncePageTotal: res.result.pageSize
                    }
                } else {
                    console.error('获取塔机行为违章设备违章数据列表详情错误', res)
                }
            }).catch(err => {
                console.error('获取塔机行为违章设备违章数据列表详情错误', err)
            })
        },
        getListCraneBehaviorViolationListPage () {
            let questData = this.questDataDetail
            api.getListCraneBehaviorViolationListPage(questData).then(res => {
                if (res.code == 200) {
                    this.tableDataDetail = res.result.rowData
                    this.paginationDetailObj = {
                        currentPage: res.result.pageIndex,
                        total: res.result.total,
                        oncePageTotal: res.result.pageSize
                    }
                } else {
                    console.error('获取塔机行为违章设备违章数据列表错误', res)
                }
            }).catch(err => {
                console.error('获取塔机行为违章设备违章数据列表错误', err)
            })
        },
        setDateRange (e) {
            this.questData.beginTime = e[0]
            this.questData.endTime = e[1]
            this.questData.pageIndex = 1
            this.showDetail({}, false)
            this.getListBehaviorViolationDataView()
        },
        setDataStatu (e) {
            this.questData.jdArea = e
            this.questData.pageIndex = 1
            this.showDetail({}, false)
            this.getListBehaviorViolationDataView()
        },
        setAreaValue (e) {
            this.questData.areaCode = e
            this.questData.pageIndex = 1
            this.showDetail({}, false)
            this.getListBehaviorViolationDataView()
        },
        setSearchValue (e) {
            this.questData.query = e
            this.questData.pageIndex = 1
            this.showDetail({}, false)
            this.getListBehaviorViolationDataView()
        },
        resetFn (e) {
            this.questData.areaCode = null
            this.questData.jdArea = null
            this.questData.query = null
            this.questData.beginTime = null
            this.questData.endTime = null
            this.questData.pageIndex = 1
            this.showDetail({}, false)
            this.getListBehaviorViolationDataView()
        },
        getListBehaviorViolationDataView () {
            let questData = this.questData
            api.getListBehaviorViolationDataView(questData).then(res => {
                if (res.code == 200) {
                    this.tableData = res.result.rowData
                    this.paginationObj = {
                        currentPage: res.result.pageIndex,
                        total: res.result.total,
                        oncePageTotal: res.result.pageSize
                    }
                }
                console.log(res)
            }).catch(err => {
                console.error('获取塔机行为违章列表错误', err)
            })
        },
        setChecked () {
            this.tableData.forEach(item => {
                this.$set(item, 'checked', this.checked)
            })
        },
        goJumpPageInner (e) {
            this.questDataInner.pageIndex = e
            this.getListCraneBehaviorDetailsPage()
        },
        goJumpPageDetail (e) {
            this.questDataDetail.pageIndex = e
            this.getListCraneBehaviorViolationListPage()
        },
        goJumpPageFn (e) {
            this.questData.pageIndex = e
            this.getListBehaviorViolationDataView()
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
        showDetail (item, bool) {
            this.isShowDetail = bool
            if (this.isShowDetail) {
                this.questDataDetail.beginTime = this.questData.beginTime
                this.questDataDetail.endTime = this.questData.endTime
                this.questDataDetail.propertyNumbers = item.propertyNumbers
                console.log(this.questDataDetail, item)
                this.getListCraneBehaviorViolationListPage()
            }
        },
        goDetail (item, bool) {
            this.isShowInner = bool
            if (this.isShowInner) {
                this.questDataInner.beginTime = item.startTime
                this.questDataInner.propertyNumbers = this.questDataDetail.propertyNumbers
                console.log(this.questDataInner, item)
                this.getListCraneBehaviorDetailsPage()
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

</style>