<!--
  顶部查询条件
-->
<template>
    <div class="topFilterBox">
        <div class="leftCom">
            <div class="areaBox" v-if="isArea">
                行政属地：
                <el-select v-model="areaValue" @change="getAreaValue" placeholder="全部">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="areaBox" v-if="isStatus">
                监督机构：
                <el-select v-model="testValue" @change="getTestValue" placeholder="全部">
                    <el-option
                    v-for="item in testOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="areaBox onceDate" v-if="isDate">
                设置时间：
                <el-date-picker
                v-model="value2"
                align="right"
                type="date"
                value-format="yyyy-MM-dd"
                @change="getDate"
                placeholder="选择日期"
                :picker-options="dateOptions">
                </el-date-picker>
            </div>
            <div class="areaBox" v-if="isDateRange">
                时间：
                <el-date-picker
                v-model="dateValue"
                type="daterange"
                align="right"
                @change="getDateValue"
                value-format="yyyy-MM-dd"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions">
                </el-date-picker>
            </div>
            <div class="areaBox searchBox" v-if="isSearch">
                <p>
                    <input type="text" v-model="searchValue" @keyup.13="getSearchFn" :placeholder="placeholderText">
                    <span class="iconFont" @click="getSearchFn">&#xe604;</span>
                </p>
            </div>
        </div>
        <div class="rightBtns">
            <span class="btn" @click="reset" v-if="isReset">重置</span>
            <span class="btn" v-if="isGetExcel" @click="getExcel">导出</span>
            <span class="btn" v-if="isAdd" @click="addFn">添加</span>
        </div>
    </div>
</template>
<script>
import api from '@/apis/tajiApi.js'
export default {
    name: 'topFilter',
    components: {},
    props: {
        placeholderText: {
            type: String,
            default: '产权备案号、项目部'
        },
        isAdd: {
            type: Boolean,
            default: false
        },
        isDate: {
            type: Boolean,
            default: false
        },
        isGetExcel: {
            type: Boolean,
            default: false
        },
        isSearch: {
            type: Boolean,
            default: false
        },
        isDateRange: {
            type: Boolean,
            default: false
        },
        isStatus: {
            type: Boolean,
            default: false
        },
        isReset: {
            type: Boolean,
            default: true
        },
        isArea: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            searchValue: '',
            testValue: '',
            value2: '',
            testOptions: [
                {
                    label: '全部',
                    value: null
                },
                {
                    label: '正常',
                    value: 0
                },
                {
                    label: '超标',
                    value: 1
                }
            ],
            options: [],
            areaValue: '',
            dateOptions: {
                disabledDate (time) {
                    return time.getTime() > Date.now()
                },
                shortcuts: [{
                    text: '今天',
                    onClick (picker) {
                        picker.$emit('pick', new Date())
                    }
                }, {
                    text: '昨天',
                    onClick (picker) {
                        const date = new Date()
                        date.setTime(date.getTime() - 3600 * 1000 * 24)
                        picker.$emit('pick', date)
                    }
                }, {
                    text: '一周前',
                    onClick (picker) {
                        const date = new Date()
                        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
                        picker.$emit('pick', date)
                    }
                }]
            },
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick (picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    text: '最近一个月',
                    onClick (picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    text: '最近三个月',
                    onClick (picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                        picker.$emit('pick', [start, end])
                    }
                }]
            },
            dateValue: ''
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
            this.rangInfo()
        },
        addFn () {
            this.$emit('addBtnClick', true)
        },
        getAreaValue () {
            this.$emit('setAreaValue', this.areaValue)
        },
        rangInfo () {
            api.getlistRealTimeDateSelect().then(res => {
                this.testOptions = []
                if (res.code == 200) {
                    this.testOptions = res.result.jdArea.map(item => {
                        let obj = {
                            value: item.area_code,
                            label: item.area_name
                        }
                        return obj
                    })
                    this.options = res.result.area.map(item => {
                        let obj = {
                            value: item.area_code,
                            label: item.area_name
                        }
                        return obj
                    })
                    this.testOptions.unshift({
                        value: null,
                        label: '全部'
                    })
                    this.options.unshift({
                        value: null,
                        label: '全部'
                    })
                } else {
                    console.error('获取塔机实时视图搜索框区域、监督错误', res)
                }
            }).catch(err => {
                console.error('获取取当前用户绑定的项目 所在的区域，用于查询条件过滤错误', err)
            })
        },
        reset () {
            this.searchValue = ''
            this.testValue = ''
            this.value2 = ''
            this.areaValue = ''
            this.dateValue = ''
            this.$emit('resetFn', {})
        },
        getSearchFn () {
            this.$emit('setSearchValue', this.searchValue)
        },
        getTestValue () {
            this.$emit('setDataStatu', this.testValue)
        },
        getExcel () {
            this.$emit('setExcel', true)
        },
        getDate () {
            this.$emit('setDateFn', this.value2)
        },
        getDateValue () {
            this.$emit('setDateRange', this.dateValue)
        }
    },
    mounted () {
        this.init()
    },
    created () {},
    destroyed () {}
}
</script>
