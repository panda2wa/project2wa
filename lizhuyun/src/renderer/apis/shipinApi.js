import data from '@/utils/request'
const request = data.service
const requestList = {
    getUserDepInfo (data = {}) { // 获取当前用户下的项目列表
        return request({
            url: '/crane/basicInfo/getUserDepInfo',
            method: 'post',
            data
        })
    }
}
export default requestList
