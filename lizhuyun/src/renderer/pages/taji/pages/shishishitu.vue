<!--
  实时视图
-->
<template>
    <div class="wrap">
        <topFilter
        :isArea="true"
        :isStatus="true"
        :isSearch="true"
        @resetFn = "resetFn"
        @setAreaValue = "setAreaValue"
        @setSearchValue = "setSearchValue"
        @setDataStatu = "setDataStatu"
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
                    <el-table-column prop="propertyNumbers" label="产权备案号" align="center" width="276"></el-table-column>
                    <el-table-column prop="craneTypeName" label="设备型号" align="center" width="136"></el-table-column>
                    <el-table-column prop="craneID" label="现场编号" align="center" width="92"></el-table-column>
                    <el-table-column prop="craneStatus" label="当前情况" align="center" width="106"></el-table-column>
                    <el-table-column prop="monitorUnitName" label="使用单位" align="center" width="250"></el-table-column>
                    <el-table-column prop="project_name" label="项目名称" align="center"></el-table-column>
                    <el-table-column label="实时监控" align="center" width="86">
                        <template slot-scope="scope">
                            <el-button
                            @click.native.prevent="goDetail(scope.row)"
                            type="text"
                            size="small">
                            2D
                            </el-button>
                        </template>
                    </el-table-column>
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
    name: 'shishishitu',
    components: {
        topFilter, tableBox
    },
    props: {},
    data () {
        return {
            checked: false,
            paginationObj: {
                currentPage: 1,
                total: 101,
                oncePageTotal: 13
            },
            questData: {
                areaCode: null,
                jdArea: null,
                pageIndex: 1,
                pageSize: 14,
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
            this.questData.pageIndex = 1
            this.listRealTimeDateView()
        },
        listRealTimeDateView () {
            let questData = this.questData
            api.listRealTimeDateView(questData).then(res => {
                if (res.code == 200) {
                    this.tableData = res.result.rowData
                    this.paginationObj = {
                        currentPage: res.result.pageIndex,
                        total: res.result.total,
                        oncePageTotal: res.result.pageSize
                    }
                } else {
                    console.error('获取塔机实时视图列表错误', res)
                }
            }).catch(err => {
                console.error('获取塔机实时视图列表错误', err)
            })
        },
        goDetail (item) {
            this.$router.push({path: '/shishishituDetail', query: item})
        },
        setChecked () {
            this.tableData.forEach(item => {
                this.$set(item, 'checked', this.checked)
            })
        },
        goJumpPage (e) {
            this.questData.pageIndex = e
            this.listRealTimeDateView()
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