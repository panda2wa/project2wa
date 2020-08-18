import data from '@/utils/request'
const request = data.service
const requestList = {
    addLiftingConfirm (data = {}) { // 顶升记录点击确认
        return request({
            url: '/crane/lift/addLiftingConfirm',
            method: 'post',
            data
        })
    },
    liftListRealTimeDateView (data = {}) { // 获取顶升记录列表
        return request({
            url: '/crane/lift/listRealTimeDateView',
            method: 'get',
            data
        })
    },
    getlistRealTimeDateView (data = {}) { // 获取顶升记录列表详细
        return request({
            url: '/crane/lift/getlistRealTimeDateView',
            method: 'get',
            data
        })
    },
    ListWorkingCycleSpecificData (data = {}) { // 获取具体工作循环详细数据
        return request({
            url: '/crane/workingCycle/ListWorkingCycleSpecificData',
            method: 'get',
            data
        })
    },
    listWorkingCycleDetailDatas (data = {}) { // 获取塔机工作循环列表点击查看对应工作循序列表
        return request({
            url: '/crane/workingCycle/listWorkingCycleDetailDatas',
            method: 'get',
            data
        })
    },
    craneFaultListRealTimeDateView (data = {}) { // 获取塔机故障报警列表
        return request({
            url: '/crane/craneFault/listRealTimeDateView',
            method: 'get',
            data
        })
    },
    listWorkingCycleData (data = {}) { // 获取塔机累计工作循环列表
        return request({
            url: '/crane/workingCycle/listWorkingCycleData',
            method: 'get',
            data
        })
    },
    getListCraneBehaviorDetailsPage (data = {}) { // 获取塔机行为违章设备违章数据列表详情
        return request({
            url: '/crane/behaviorViolation/getListCraneBehaviorDetailsPage',
            method: 'get',
            data
        })
    },
    getListCraneBehaviorViolationListPage (data = {}) { // 获取塔机行为违章设备违章数据列表
        return request({
            url: '/crane/behaviorViolation/getListCraneBehaviorViolationListPage',
            method: 'get',
            data
        })
    },
    getListBehaviorViolationDataView (data = {}) { // 获取塔机行为违章列表
        return request({
            url: '/crane/behaviorViolation/getListBehaviorViolationDataView',
            method: 'get',
            data
        })
    },
    getCraneBasicDate (data = {}) { // 获取2d视图设备基本参数
        return request({
            url: '/crane/realTimeData/getCraneBasicDate',
            method: 'get',
            data
        })
    },
    getlistRealTimeDateSelect (data = {}) { // 获取塔机实时视图搜索框区域、监督
        return request({
            url: '/crane/realTimeData/getlistRealTimeDateSelect',
            method: 'get',
            data
        })
    },
    listRealTimeDateView (data = {}) { // 获取塔机实时视图列表
        return request({
            url: '/crane/realTimeData/listRealTimeDateView',
            method: 'post',
            data
        })
    }
}
export default requestList
