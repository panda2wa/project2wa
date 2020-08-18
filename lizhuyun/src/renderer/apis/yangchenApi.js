import data from '@/utils/request'
const request = data.service
const requestList = {
    dataChart (data = {}) { // 单项目某一天历史数据，刻度图表展示的数据
        return request({
            url: '/dust/dustDatas/dataChart',
            method: 'get',
            data
        })
    },
    data1D (data = {}) { // 单项目某一天的扬尘所有历史数据列表
        return request({
            url: '/dust/dustDatas/data1D',
            method: 'get',
            data
        })
    },
    proHistData (data = {}) { // 根据项目id查询历史数据详情列表 带分页
        return request({
            url: '/dust/dustDatas/proHistData',
            method: 'get',
            data
        })
    },
    manyProHistData (data = {}) { // 多项目历史数据
        return request({
            url: '/dust/dustDatas/manyProHistData',
            method: 'get',
            data
        })
    },
    addSets (data = {}) { // 添加规则 areaIds、pm25、pm10、noiseDay、noiseNight为必填项
        return request({
            url: '/dust/thresholdSets/addSets',
            method: 'post',
            data
        })
    },
    delTh (data = {}) { // 删除规则 thId为规则的aqiThId
        return request({
            url: '/dust/thresholdSets/delTh',
            method: 'get',
            data
        })
    },
    editTh (data = {}) { // 编辑规则 areaIds、pm25、pm10、noiseDay、noiseNight为必填项
        return request({
            url: '/dust/thresholdSets/editTh',
            method: 'post',
            data
        })
    },
    gaArea (data = {}) { // 获取广安市下的区域列表
        return request({
            url: '/dust/rangInfo/gaArea',
            method: 'get',
            data
        })
    },
    realWeather (data = {}) { // 获取项目所在地实时天气状况，每四小时刷新数据库，如果取不到当前项目的实时天气，默认返回广安的实时天气
        return request({
            url: '/dust/weathers/realWeather',
            method: 'get',
            data
        })
    },
    rangInfo (data = {}) { // 获取取当前用户绑定的项目 所在的区域，用于查询条件过滤
        return request({
            url: '/dust/rangInfo/hello',
            method: 'get',
            data
        })
    },
    thList (data = {}) { // 获取规则列表，时间过滤单位为天
        return request({
            url: '/dust/thresholdSets/thList',
            method: 'get',
            data
        })
    },
    realData (data = {}) { // 获取单项目项目扬尘实时数据
        return request({
            url: '/dust/dustDatas/realData',
            method: 'get',
            data
        })
    },
    manyProRealData (data = {}) { // 获取多项目实时数据
        return request({
            url: '/dust/dustDatas/manyProRealData',
            method: 'get',
            data
        })
    }
}
export default requestList
