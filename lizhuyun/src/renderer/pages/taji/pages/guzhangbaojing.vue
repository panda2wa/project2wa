<!--
  故障报警
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
        <div class="listBox">
            <tableBox :paginationObj='paginationObj' :len="tableData.length" @goJumpPageFn="goJumpPage">
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
                    <el-table-column prop="faultMaxValue" label="故障阈值" align="center" width="106"></el-table-column>
                    <el-table-column prop="faultValueName" label="实测值" align="center" width="106"></el-table-column>
                    <el-table-column prop="faultTime" label="故障时间" align="center" width="106"></el-table-column>
                    <el-table-column prop="craneTypeName" label="故障类型" align="center" width="106"></el-table-column>
                </el-table>
            </tableBox>
        </div>
    </div>
</template>
<script>
import api from '@/apis/tajiApi.js'
import topFilter from '../taji_components/topFilter'
import tableBox from '@/components/tableBox'
export default {
    name: 'guzhangbaojing',
    components: {
        topFilter, tableBox
    },
    props: {},
    data () {
        return {
            checked: false,
            paginationObj: {},
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
            this.listRealTimeDateView()
        },
        setDateRange (e) {
            this.questData.beginTime = e[0]
            this.questData.endTime = e[1]
            this.questData.pageIndex = 1
            this.listRealTimeDateView()
        },
        setDataStatu (e) {
            this.questData.jdArea = e
            this.questData.pageIndex = 1
            this.listRealTimeDateView()
        },
        setAreaValue (e) {
            this.questData.areaCode = e
            this.questData.pageIndex = 1
            this.listRealTimeDateView()
        },
        setSearchValue (e) {
            this.questData.query = e
            this.questData.pageIndex = 1
            this.listRealTimeDateView()
        },
        resetFn (e) {
            this.questData.areaCode = null
            this.questData.jdArea = null
            this.questData.query = null
            this.questData.beginTime = null
            this.questData.endTime = null
            this.questData.pageIndex = 1
            this.listRealTimeDateView()
        },
        listRealTimeDateView () {
            let questData = this.questData
            api.craneFaultListRealTimeDateView(questData).then(res => {
                if (res.code == 200) {
                    this.tableData = res.result.rowData
                    this.paginationObj = {
                        currentPage: res.result.pageIndex,
                        total: res.result.total,
                        oncePageTotal: res.result.pageSize
                    }
                }
            }).catch(err => {
                console.error('获取塔机故障报警列表错误', err)
            })
        },
        setChecked () {
            this.tableData.forEach(item => {
                this.$set(item, 'checked', this.checked)
            })
        },
        goJumpPage (e) {
            this.paginationObj.currentPage = e
        },
        indexMethod (index) {
            return (this.paginationObj.currentPage - 1) * this.paginationObj.oncePageTotal + (index + 1)
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