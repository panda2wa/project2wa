import data from '@/utils/request'
const request = data.service
const requestList = {
    addSpMainPageShow (data = {}) { // 用户添加首页显示视频接口
        return request({
            url: '/jt/mainIndex/addSpMainPageShow',
            method: 'post',
            data
        })
    },
    listSpUserChooseShow (data = {}) { // 获取已经添加的视频接口
        return request({
            url: '/jt/mainIndex/listSpUserChooseShow',
            method: 'post',
            data
        })
    },
    listDepSpDeivce (data = {}) { // 获取主页视频弹窗设备列表
        return request({
            url: '/jt/mainIndex/listDepSpDeivce',
            method: 'post',
            data
        })
    },
    getDepBackImgAndInfo (data = {}) { // 获取单标段项目主页大图
        return request({
            url: '/jt/mainIndex/getDepBackImgAndInfo',
            method: 'post',
            data
        })
    },
    getTodayThData (data = {}) { // 今日报警数据统计---混凝土--标养室
        return request({
            url: '/jt/mainIndex/getTodayThData',
            method: 'post',
            data
        })
    },
    getTodayCuringBlockOutForYH (data = {}) { // 今日报警数据统计---混凝土--试件
        return request({
            url: '/jt/mainIndex/getTodayCuringBlockOutForYH',
            method: 'post',
            data
        })
    },
    getdevices (data = {}) { // 获取地图内项目信息
        return request({
            url: '/ajax/getdevices',
            method: 'post',
            data
        })
    },
    jsonMap (url, data = {}) { // 获取地图内项目信息
        return request({
            url: url,
            method: 'get',
            data
        })
    },
    getDepPointClickInfo (data = {}) { // 获取地图内项目信息
        return request({
            url: '/jt/mainIndex/getDepPointClickInfo',
            method: 'post',
            data
        })
    },
    getMainMapAreaListInfo (data = {}) { // 获取三级联动数据
        return request({
            url: '/jt/mainIndex/getMainMapAreaListInfo',
            method: 'post',
            data
        })
    },
    getMainMapDepListInfo (data = {}) { // 获取项目部行政区域
        return request({
            url: '/jt/mainIndex/getMainMapDepListInfo',
            method: 'post',
            data
        })
    },
    getTodayCuringSampleData (data = {}) { // 获取主页今日数据混凝土统计
        return request({
            url: '/jt/mainIndex/gettodayCuringSampleData',
            method: 'post',
            data
        })
    },
    deviceDataInfo (data = {}) { // 设备统计
        return request({
            url: '/jt/mainIndex/getodayEquData',
            method: 'post',
            data
        })
    },
    getProjectInfoById (data = {}) { // 获取主页项目信息
        return request({
            url: '/jt/mainIndex/getProjectInfoById',
            method: 'post',
            data
        })
    }
}
export default requestList
