<!--
  实时数据
-->
<template>
    <div class="wrap">
        <div v-if="!isEdit" class="wrapInner">
            <topFilter 
            :isDate="true"
            :isAdd="true"
            @addBtnClick="addBtnClick"
            @setDateFn="setDateFn" 
            @resetFn="resetFn" />
            <tableBox :paginationObj='paginationObj' :len="tableData.length" @goJumpPageFn="goJumpPageFn">
                <el-table :data="tableData" style="width: 100%;" height="100%" border>
                    <el-table-column type="index" label="序号" align="center" :index="indexMethod" width="81"></el-table-column>
                    <el-table-column prop="areaName" label="适用区域" align="center" width="106"></el-table-column>
                    <el-table-column prop="updateTime" label="设置时间" align="center"></el-table-column>
                    <el-table-column prop="pm25" label="pm2.5超标值" align="center"></el-table-column>
                    <el-table-column prop="pm10" label="pm10超标值" align="center"></el-table-column>
                    <el-table-column prop="noiseDay" label="6-22点噪声超标值" align="center" width="176"></el-table-column>
                    <el-table-column prop="noiseNight" label="22-6点噪声超标值" align="center" width="176"></el-table-column>
                    <el-table-column prop="collectionInterval" label="采集时间间隔" align="center" width="106">
                        <template slot-scope="scope">
                            <span>{{scope.row.collectionInterval/60}} 分钟</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="106">
                        <template slot-scope="scope">
                            <el-button 
                            @click.native.prevent="editFn(scope.row,true)"
                            type="text"
                            size="small">编辑</el-button>
                            <el-button
                            @click.native.prevent="deleteFn(scope.row)"
                            type="text"
                            size="small">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </tableBox>
        </div>
        <div class="editBox wrapInner" v-else>
            <p class="backBtn">
                <span class="iconFont" @click="closeFn">&#xe61a;</span> 超标值设置
            </p>
            <dl class="dlBox">
                <dt>适用区域设置（多选）</dt>
                <dd v-if="isAdded">
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                    <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                        <el-checkbox v-for="city in cities" :label="city.areaCode" :key="city.areaCode">{{city.areaName}}</el-checkbox>
                    </el-checkbox-group>
                </dd>
                <dd v-else>
                    <el-checkbox :indeterminate="isIndeterminate" checked disabled v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                    <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                        <el-checkbox v-for="city in cities" checked disabled :label="city.areaCode" :key="city.areaCode">{{city.areaName}}</el-checkbox>
                    </el-checkbox-group>
                </dd>
            </dl>
            <dl>
                <dt>阈值设置</dt>
                <dd>
                    <div>
                        <span>PM2.5</span>
                        <label class="inputBox">
                            <input type="text" v-model="addQuestData.pm25">
                            <span>ug/m³</span>
                        </label>
                    </div>
                    <div>
                        <span>PM10</span>
                        <label class="inputBox">
                            <input type="text" v-model="addQuestData.pm10">
                            <span>ug/m³</span>
                        </label>
                    </div>
                    <div>
                        <span>噪声</span>
                        <label class="inputBox">
                            <input type="text" v-model="addQuestData.noiseDay">
                            <span>dB(6点-22点)</span>
                        </label>
                        <label class="marginleft72 inputBox">
                            <input type="text" v-model="addQuestData.noiseNight">
                            <span>dB(22点-6点)</span>
                        </label>
                    </div>
                </dd>
            </dl>
            <div class="btnBox">
                <span class="btn" @click="resetEditFn">重置</span>
                <span class="btn" @click="submitFn">确定</span>
            </div>
        </div>
        <textTips :text="text" :isShow="isShow" @setIsShow='setIsShow' />
        <confirm text="确定删除？" styles="font-size:20px" v-if="isShowDelete" @confirm="confirm" />
    </div>
</template>
<script>
import api from '@/apis/yangchenApi.js'
import topFilter from '../yangchen_components/topFilter'
import tableBox from '@/components/tableBox'
import textTips from '@/components/textTips'
import confirm from '@/components/confirm'
export default {
    name: 'shishishuju',
    components: {
        topFilter, tableBox, textTips, confirm
    },
    props: {},
    data () {
        return {
            text: '',
            isShow: false,
            isShowDelete: false,
            addQuestData: {
                pm25: '',
                noiseDay: '',
                noiseNight: '',
                pm10: ''
            },
            isEdit: false,
            tableData: [],
            onceBuild: {},
            weatherObj: {},
            paginationObj: {},
            checkAll: false,
            checkedCities: [],
            cityOptions: [],
            cities: [],
            isAdded: false,
            aqiThId: null,
            isIndeterminate: false,
            questData: {
                date: null,
                pageIndex: 1,
                pageSize: 10000
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
            this.thList()
        },
        closeFn () {
            this.isEdit = false
            this.init()
        },
        confirm (e) {
            console.log(e)
            if (e) {
                let questData = {
                    thId: this.aqiThId,
                    isYangchen: true
                }
                api.delTh(questData).then(res => {
                    if (res.code == 200) {
                        this.text = res.result
                        this.isShow = true
                        this.init()
                    } else {
                        this.text = res.msg
                        this.isShow = true
                    }
                }).catch(err => {
                    console.error('删除规则错误', err)
                })
            }
            this.isShowDelete = false
        },
        deleteFn (item) {
            console.log(item)
            this.isShowDelete = true
            this.aqiThId = item.aqiThId
        },
        setIsShow (e) {
            this.isShow = e
        },
        submitFn () {
            if (this.checkedCities.length == 0) {
                this.text = '请选择适用区域'
                this.isShow = true
                return false
            }
            if (this.addQuestData.pm25 == '') {
                this.text = '请设置pm2.5阈值'
                this.isShow = true
                return false
            }
            if (this.addQuestData.pm10 == '') {
                this.text = '请设置pm10阈值'
                this.isShow = true
                return false
            }
            if (this.addQuestData.noiseDay == '') {
                this.text = '请设置白天噪声阈值'
                this.isShow = true
                return false
            }
            if (this.addQuestData.noiseNight == '') {
                this.text = '请设置夜晚噪声阈值'
                this.isShow = true
                return false
            }
            console.log(this.isAdded)
            if (this.isAdded) {
                this.addSets()
            } else {
                this.editTh()
            }
        },
        editTh () {
            let questData = this.addQuestData
            questData.areaIds = this.checkedCities
            console.log(this.checkedCities)
            questData.isYangchen = true
            api.editTh(questData).then(res => {
                if (res.code == 200) {
                    this.text = res.result
                    this.isShow = true
                    this.resetEditFn()
                    setTimeout(() => {
                        this.isEdit = false
                    }, 3500)
                    this.init()
                } else {
                    this.text = res.msg
                    this.isShow = true
                }
            }).catch(err => {
                console.error('编辑规则错误', err)
            })
        },
        addSets () {
            let questData = this.addQuestData
            questData.areaIds = this.checkedCities.join(',')
            questData.isYangchen = true
            api.addSets(questData).then(res => {
                if (res.code == 200) {
                    this.text = res.result
                    this.isShow = true
                    this.resetEditFn()
                    setTimeout(() => {
                        this.isEdit = false
                    }, 3000)
                    this.init()
                } else {
                    this.text = res.msg
                    this.isShow = true
                }
            }).catch(err => {
                console.error('添加规则错误', err)
            })
        },
        resetEditFn () {
            this.addQuestData.pm25 = ''
            this.addQuestData.noiseDay = ''
            this.addQuestData.noiseNight = ''
            this.addQuestData.pm10 = ''
            if (this.isAdded) {
                this.checkAll = false
                this.isIndeterminate = false
                this.checkedCities = []
            }
        },
        gaArea () {
            api.gaArea({isYangchen: true}).then(res => {
                if (res.code == 200) {
                    this.cityOptions = res.result
                    this.cities = res.result
                } else {
                    console.error('获取广安市下的区域列表错误', res)
                }
            }).catch(err => {
                console.error('获取广安市下的区域列表错误', err)
            })
        },
        handleCheckAllChange (val) {
            this.checkedCities = val ? this.cityOptions.map(item => {
                return item.areaCode
            }) : []
            this.isIndeterminate = false
        },
        handleCheckedCitiesChange (value) {
            let checkedCount = value.length
            this.checkAll = checkedCount === this.cities.length
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length
        },
        addBtnClick (e) {
            this.isAdded = true
            this.isEdit = true
            this.gaArea()
        },
        editFn (obj, bool) {
            console.log(obj)
            this.isAdded = false
            this.isEdit = bool
            this.addQuestData = obj
            this.cities = [{
                areaCode: obj.areaId,
                areaName: obj.areaName
            }]
        },
        thList () {
            let questData = this.questData
            questData.isYangchen = true
            api.thList(questData).then(res => {
                if (res.code == 200) {
                    this.paginationObj = {
                        currentPage: 1,
                        total: 1,
                        oncePageTotal: 10000
                    }
                    this.tableData = res.result
                    console.log(res)
                } else {
                    console.error('获取规则列表，时间过滤错误', res)
                }
            }).catch(err => {
                console.error('获取规则列表，时间过滤错误', err)
            })
        },
        setDateFn (e) {
            this.questData.date = e + ' 00:00:00'
            this.thList()
        },
        goJumpPageFn (e) {
            this.questData.pageIndex = e
            this.thList()
        },
        indexMethod (index) {
            return (this.paginationObj.currentPage - 1) * this.paginationObj.oncePageTotal + (index + 1)
        },
        resetFn (e) {
            this.questData.date = null
            this.questData.pageIndex = 1
            this.thList()
        }
    },
    mounted () {
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
<style lang="scss">
.el-checkbox{
    margin-bottom: 10px; color: #fefefe!important;
}
.dlBox{
    >dd{
        >.el-checkbox{
            margin-right: 70px; display: flex; justify-content: flex-start; align-items: center;
        }
        >div{
            margin-bottom: 0!important; margin-right: 0!important;
        }
        .el-checkbox__input.is-indeterminate .el-checkbox__inner::before{
            top: 9px; background-color: #0d1935;
        }
        label{
            margin-bottom: 10px;
            .el-checkbox__inner{
                background-color: #0d1935; border-color: #263558; width: 23px; height: 23px;
            }
        }
        .el-checkbox__inner::after{
            height: 10px; left: 8px; top: 2px; width: 6px; border-color: #0d1935;
        }
        .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner{
            background-color: #0d1935; border-color: #263558;
        }
        .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{
            display: flex; justify-content: center; align-items: center;
        }
    }
}
</style>
<style lang="scss" scoped>
.btnBox{
    padding-top: 150px; display: flex; justify-content: center; align-items: center;
    .btn{
        min-width: 120px; margin: 0 50px;
    }
}
.editBox{
    dl{
        padding-top: 100px; padding-left: 50px; font-size: 16px; color: #fefefe;
        dd{
            display: flex; justify-content: flex-start; align-items: center; flex-wrap: wrap;
            >div{
                display: flex; justify-content: flex-start; align-items: center; margin-right: 92px; margin-bottom: 10px;
                >span{
                    margin-right: 10px;
                }
                .marginleft72{
                    margin-left: 72px;
                }
                >.inputBox{
                    background-color: #0d1935; border: 1px solid #263558; display: flex; justify-content: space-between; align-items: center; width: 180px; height: 40px; padding-right: 5px; border-radius: 5px; box-sizing: border-box;
                    input{
                        width: 80px; display: block; height: 100%; color: #fff; text-indent: 1em;
                    }
                    span{
                        color: #6d84ae; white-space: nowrap;
                    }
                }
            }
        }
        dt{
            font-size: 18px; color: #fff; padding-bottom: 40px; line-height: 20px;
        }
    }
    .backBtn{
        color: #fff; font-size: 14px; display: flex; justify-content: flex-start; align-items: center;
        span{
            cursor: pointer; color: #09f; font-size: 22px; margin-right: 20px;
        }
    }
}
</style>