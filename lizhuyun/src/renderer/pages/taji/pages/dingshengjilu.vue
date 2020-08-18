<!--
  顶升纪录
-->
<template>
    <div class="wrap">
        <topFilter 
        :isStatus="true"
        :isDateRange="true"
        :isSearch="true"
        :isReset="true"
        @resetFn="resetFn"
        @setDateRange="setDateRange"
        @setSearchValue="setSearchValue"
        @setDataStatu="setDataStatu"
        />
        <tableBox :paginationObj='paginationObj' @goJumpPageFn="goJumpPageFn">
            <el-table :data="tableData" style="width: 100%;" height="100%" border>
                <!-- <el-table-column width="57" align="center">
                    <template slot="header">
                        <el-checkbox v-model="checked" @change="setChecked"></el-checkbox>
                    </template>
                    <template slot-scope="scope">
                        <el-checkbox v-model="scope.row.checked"></el-checkbox>
                    </template>
                </el-table-column> -->
                <el-table-column type="index" label="序号" align="center" :index="indexMethod" width="81"></el-table-column>
                <!-- <el-table-column prop="province" label="行政属地" align="center" width="106"></el-table-column> -->
                <el-table-column prop="jd_area_name" label="监督机构" align="center" width="89"></el-table-column>
                <el-table-column prop="propertyNumbers" label="产权备案号" align="center" width="176"></el-table-column>
                <el-table-column prop="model" label="规格型号" align="center" width="106"></el-table-column>
                <el-table-column prop="propertyUnitName" label="产权单位" align="center" width="92"></el-table-column>
                <el-table-column prop="project_name" label="项目名称" align="center"></el-table-column>
                <el-table-column prop="liftStartTime" :label="'顶升\n开始时间'" align="center" width="106"></el-table-column>
                <el-table-column prop="liftEndTime" :label="'顶升\n结束时间'" align="center" width="106"></el-table-column>
                <el-table-column prop="liftCountName" :label="'顶升\n标准数量'" align="center" width="106"></el-table-column>
                <el-table-column prop="startHeightName" :label="'顶升前\n高度（m）'" align="center" width="106"></el-table-column>
                <el-table-column prop="endHeightName" :label="'顶升后\n高度（m）'" align="center" width="106"></el-table-column>
                <el-table-column prop="endStateName" label="顶升状态" align="center" width="106"></el-table-column>
                <el-table-column prop="liftStatusConfrim" label="顶升确认" align="center" width="106"></el-table-column>
                <el-table-column label="详情" align="center" width="86">
                    <template slot-scope="scope">
                        <el-button
                        @click.native.prevent="goDetail(scope.row,true)"
                        type="text"
                        size="small">
                        查看
                        </el-button>
                        <el-button
                        @click.native.prevent="setSure(scope.row)"
                        type="text"
                        v-if="scope.row.liftStatusNumber!=1"
                        size="small">
                        确认
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </tableBox>
        <div class="dingshengDetailBox fixed" v-show="isShowDetail">
            <div class="inner rel">
                <span class="iconFont abs" @click="goDetail({},false)">&#xe631;</span>
                <h2>【{{detailObj.propertyNumbers}}】顶升记录</h2>
                <dl>
                    <dt>基础信息</dt>
                    <dd>
                        <div>
                            <span>产权备案号：</span>
                            <p>{{detailObj.propertyNumbers}}</p>
                        </div>
                    </dd>
                    <dd>
                        <div>
                            <span>产权单位：</span>
                            <p>{{detailObj.propertyUnitName}}</p>
                        </div>
                    </dd>
                    <dd>
                        <div>
                            <span>设备类型：</span>
                            <p>{{detailObj.craneTypeName}}</p>
                        </div>
                    </dd>
                    <dd>
                        <div>
                            <span>规格型号：</span>
                            <p>{{detailObj.model}}</p>
                        </div>
                    </dd>
                    <dd>
                        <div>
                            <span>项目名称：</span>
                            <p>{{detailObj.project_name}}</p>
                        </div>
                    </dd>
                </dl>
                <dl>
                    <dt>顶升数据</dt>
                    <dd>
                        <div>
                            <span>顶升开始时间：</span>
                            <p>{{detailObj.liftStartTime}}</p>
                        </div>
                        <div>
                            <span>顶升结束时间：</span>
                            <p>{{detailObj.liftEndTime}}</p>
                        </div>
                    </dd>
                    <dd>
                        <div>
                            <span>顶升前高度：</span>
                            <p>{{detailObj.startHeightName}}</p>
                        </div>
                        <div>
                            <span>顶升后高度：</span>
                            <p>{{detailObj.endHeightName}}</p>
                        </div>
                    </dd>
                    <dd>
                        <div>
                            <span>标准节数量：</span>
                            <p>{{detailObj.liftCountName}}</p>
                        </div>
                        <div>
                            <span>顶升高度：</span>
                            <p>{{detailObj.heightName}}</p>
                        </div>
                    </dd>
                </dl>
                <dl>
                    <dt>顶升确认</dt>
                    <dd>
                        <div>
                            <span>确认顶升前高度：</span>
                            <p>{{detailObj.cStartHeightName}}</p>
                        </div>
                        <div>
                            <span>确认顶升后高度：</span>
                            <p>{{detailObj.cEndHeightName}}</p>
                        </div>
                    </dd>
                    <dd>
                        <div>
                            <span>确认标准节数量：</span>
                            <p>{{detailObj.cLiftCountName}}</p>
                        </div>
                        <div>
                            <span>确认顶升高度：</span>
                            <p>{{detailObj.cHeightName}}</p>
                        </div>
                    </dd>
                    <dd>
                        <div>
                            <span>确认顶升：</span>
                            <p>{{detailObj.liftStatusConfrim}}</p>
                        </div>
                        <div>
                            <span>确认时间：</span>
                            <p>{{detailObj.confirmTime}}</p>
                        </div>
                    </dd>
                </dl>
            </div>
        </div>
        <textTips :text="text" :isShow="isShow" @setIsShow='setIsShow' />
        <confirm text="是否确定？" styles="font-size:20px" v-if="isShowConfirm" @confirm="confirm" />
    </div>
</template>
<script>
import api from '@/apis/tajiApi.js'
import topFilter from '../taji_components/topFilter'
import tableBox from '@/components/tableBox'
import textTips from '@/components/textTips'
import confirm from '@/components/confirm'
export default {
    name: 'dingshengjilu',
    components: {
        tableBox, topFilter, textTips, confirm
    },
    props: {},
    data () {
        return {
            text: '',
            isShow: false,
            isShowDetail: false,
            isShowConfirm: false,
            checked: false,
            detailObj: {},
            paginationObj: {
                currentPage: 1,
                total: 101,
                oncePageTotal: 13
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
            liftLogId: '',
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
            this.liftListRealTimeDateView()
        },
        setIsShow (e) {
            this.isShow = e
        },
        confirm (e) {
            if (e) {
                this.addLiftingConfirm()
            }
            this.isShowConfirm = false
        },
        addLiftingConfirm () {
            api.addLiftingConfirm({liftLogId: this.liftLogId}).then(res => {
                if (res.code == 200) {
                    this.text = '确认成功'
                    this.isShow = true
                    this.init()
                } else {
                    this.text = res.msg
                    this.isShow = true
                }
            }).catch(err => {
                console.error('顶升记录点击确认错误', err)
            })
        },
        getlistRealTimeDateView (obj) {
            api.getlistRealTimeDateView({liftLogId: obj.liftLogId}).then(res => {
                if (res.code == 200) {
                    this.detailObj = res.result
                } else {
                    console.error('获取顶升记录列表详细错误', res)
                }
            }).catch(err => {
                console.error('获取顶升记录列表详细错误', err)
            })
        },
        setDateRange (e) {
            this.questData.beginTime = e[0]
            this.questData.endTime = e[1]
            this.questData.pageIndex = 1
            this.goDetail({}, false)
            this.liftListRealTimeDateView()
        },
        setDataStatu (e) {
            this.questData.jdArea = e
            this.questData.pageIndex = 1
            this.goDetail({}, false)
            this.liftListRealTimeDateView()
        },
        setSearchValue (e) {
            this.questData.query = e
            this.questData.pageIndex = 1
            this.goDetail({}, false)
            this.liftListRealTimeDateView()
        },
        resetFn (e) {
            this.questData.areaCode = null
            this.questData.jdArea = null
            this.questData.query = null
            this.questData.beginTime = null
            this.questData.endTime = null
            this.questData.pageIndex = 1
            this.goDetail({}, false)
            this.liftListRealTimeDateView()
        },
        liftListRealTimeDateView () {
            let questData = this.questData
            api.liftListRealTimeDateView(questData).then(res => {
                if (res.code == 200) {
                    this.tableData = res.result.rowData
                    this.paginationObj = {
                        currentPage: res.result.pageIndex,
                        total: res.result.total,
                        oncePageTotal: res.result.pageSize
                    }
                } else {
                    console.error('获取顶升记录列表错误', res)
                }
            }).catch(err => {
                console.error('获取顶升记录列表错误', err)
            })
        },
        setSure (item) {
            this.liftLogId = item.liftLogId
            this.isShowConfirm = true
        },
        goDetail (item, bool) {
            this.isShowDetail = bool
            if (this.isShowDetail) {
                this.getlistRealTimeDateView(item)
            }
        },
        goJumpPageFn (e) {
            this.questData.pageIndex = e
            this.liftListRealTimeDateView()
        },
        setChecked () {
            this.tableData.forEach(item => {
                this.$set(item, 'checked', this.checked)
            })
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
.dingshengDetailBox{
    .inner{
        background: #183868; padding: 30px; border: 1px solid #2e5da2; width: 790px; box-sizing: border-box;
        dl{
            padding-top: 34px;
            dd{
                line-height: 36px; padding-left: 18px; display: flex; justify-content: flex-start; align-items: flex-start; font-size: 14px;
                >div{
                    display: flex; justify-content: flex-start; align-items: flex-start; flex: 1;
                    span{
                        color: #6d84ae; white-space: nowrap;
                    }
                    p{
                        line-height: 22px; padding-top: 7px;
                    }
                }
            }
            dt{
                font-size: 16px; display: flex; justify-content: flex-start; align-items: center; padding-bottom: 20px;
            }
            dt::before{
                content: ''; width: 8px; height: 8px; border-radius: 50%; background-color: #09f; margin-right: 8px;
            }
        }
        h2{
            font-size: 18px; font-weight: normal; display: flex; justify-content: center; align-items: center; line-height: 20px; padding-bottom: 10px;
        }
        .iconFont{
            font-size: 22px; right: 14px; top: 14px; cursor: pointer;
        }
    }
}
</style>