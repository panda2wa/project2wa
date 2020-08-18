<!--实时视频-->
<template>
    <div class="videoBox wrap" id="wrap">
        <div class="videoTitle">
            <div class="searchBox rel" v-if="projectList.length>1">
                <p class="search">
                    <span class="iconFont">&#xe604;</span>
                    <input type="text" placeholder="搜索" @focus="showProjectFilterListFn" @blur="closeProjectFilterListFn" @keyup="showProjectFilterListFn" v-model="searchProjectValue">
                    <span class="iconFont">&#xec15;</span>
                </p>
                <ul class="abs selectBox" v-if="isShowProjectFilterList&&projectFilterList.length>0">
                    <li v-for="(item,index) in projectFilterList" @click="getThisProjectFn(item)" :key="index">{{item.project_name}}</li>
                </ul>
            </div>
            <p v-else class="onceTitle">{{projectName}}</p>
            <div class="rightBtnBox">
                <div class="screenBtn" :class="'screenBtn_'+screenArr[num]" @click="screenClickFn">
                    <span v-for="(item,index) in screenArr[num]" :key="index"></span>
                </div>
            </div>
        </div>
        <div class="videoWrap">
            <div class="leftTreeBox">
                <div class="searchBox rel">
                    <p class="search">
                        <span class="iconFont">&#xe604;</span>
                        <input type="text" placeholder="搜索" @keyup="showVideoListFn" v-model="searchVideoValue">
                        <span class="iconFont">&#xec15;</span>
                    </p>
                    <div class="treeBox">
                        <dl v-for="(item,index) in list" :key="index" :class="{showDD:idxDD==index}">
                            <dt @click="showOrHideDD(index)" :class="{now:idxDD==index}"><span class="iconFont">&#xec14;</span>{{item.Name}}</dt>
                            <dd v-for="(i,idx) in item.Nodes" :key="idx" @click="linkVideo(i,idx)" :class="[{now:idxLink==idx},{gray:i.Status==2}]">
                                <span :title="i.Name">{{i.Name}}</span> {{i.Status==2?'离线':''}}
                                <i class="iconFont" v-if="idxLink==idx||i.windowName">&#xe66f;</i>
                                <span v-if="i.windowName">（{{i.windowName}} 号窗口）</span>
                            </dd>
                        </dl>
                    </div>
                </div>
                <div class="conCtrlBox" :class="{gray:isLock}" v-show="videoObj.CameraType == 2">
                    <h2>球机镜头调试</h2>
                    <dl>
                        <dt class="rel">
                            <span class="iconFont abs top" @click="setVideoFn('dir,1')">&#xe624;</span>
                            <span class="iconFont abs right" @click="setVideoFn('dir,4')">&#xe624;</span>
                            <span class="iconFont abs bottom" @click="setVideoFn('dir,2')">&#xe624;</span>
                            <span class="iconFont abs left" @click="setVideoFn('dir,3')">&#xe624;</span>
                        </dt>
                        <dd>
                            <span class="iconFont" @click="setVideoFn('apperat,4')">&#xe621;</span>
                            <p>变焦</p>
                            <span class="iconFont" @click="setVideoFn('apperat,1')">&#xe622;</span>
                        </dd>
                        <dd>
                            <span class="iconFont" @click="setVideoFn('apperat,3')">&#xe621;</span>
                            <p>聚焦</p>
                            <span class="iconFont" @click="setVideoFn('apperat,0')">&#xe622;</span>
                        </dd>
                        <dd>
                            <span class="iconFont" @click="setVideoFn('apperat,5')">&#xe621;</span>
                            <p>光圈</p>
                            <span class="iconFont" @click="setVideoFn('apperat,2')">&#xe622;</span>
                        </dd>
                    </dl>
                </div>
            </div>
            <div class="rightVideoBox">
                <ul :class="'screenVideoBox_'+screenArr[num]">
                    <li v-for="(item,index) in screenArr[num]" :key="index">
                        <div @click="linkBox(index)" :ref="'linkBox_'+index" :id="'linkBox_'+index" :class="{linkBox:index==linkBoxIdx}"></div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import homeApi from '@/apis/homeApi.js'
import api from '@/apis/shipinApi.js'
import elementResizeDetectorMaker from 'element-resize-detector'
const { spawn } = require('child_process')
const globalData = require('electron').remote.getGlobal('sharedObject')
const path = globalData.filePath
const os = require('os')
// const path1 = require('path')
const { remote } = require('electron')
export default {
    name: 'topNav',
    data () {
        return {
            linkBoxIdx: -1,
            isLock: true,
            num: 0,
            idxDD: -1,
            idxLink: -1,
            screenArr: [1, 4, 9],
            isShowProjectFilterList: false,
            webSocket: null,
            searchProjectValue: '',
            videoObj: {},
            list: [],
            listOld: [],
            projectName: '',
            projectList: [],
            videoArr: [],
            projectFilterList: [],
            videoProjectIds: '',
            searchVideoValue: '',
            url: '127.0.0.1:9123',
            types: ''
        }
    },
    watch: {
        '$store.state.refresh': function (n, o) { // 监听用户是否点击刷新
            if (n != o) {
                this.getUserDepInfo()
            }
        }
    },
    methods: {
        init () {
            const erd = elementResizeDetectorMaker()
            let _this = this
            erd.listenTo(document.getElementById('wrap'), (element) => {
                _this.$nextTick(() => {
                    let leftEle = document.querySelector('.leftWrap')
                    let leftEleWidth = leftEle.offsetWidth
                    let arr = this.videoArr
                    for (let i = 0; i < arr.length; i++) {
                        if (arr[i] && arr[i].intptr) {
                            let _thisEle = _this.$refs['linkBox_' + i][0]
                            let left = _thisEle.offsetLeft + 37 + leftEleWidth
                            let width = _thisEle.offsetWidth - 30
                            let str = 'changewindows,' + arr[i].intptr + ',' + ',w=' + width + ',x=' + left
                            this.send(str)
                        }
                    }
                })
            })
            // let path2 = path1.join(__static, '/Debug/DHVideoClient.exe')
            // let path2 = path1.join(__static, '/Debug/DHVideoClient.exe')
            let cmdPath = path.replace(/lizhuyun.exe/, 'Debug\\DHVideoClient.exe')
            let workerProcess = spawn(cmdPath, [os.tmpdir()])
            // 执行命令行，如果命令不需要路径，或就是项目根目录，则不需要cwd参数：
            // 打印正常的后台可执行程序输出
            workerProcess.stdout.on('data', function (data) {
                // console.log('stdout: ' + data)
            })
            _this.initSocket()
            // 打印错误的后台可执行程序输出
            workerProcess.stderr.on('data', function (data) {
                // console.log('stderr: ' + data)
            })
            // 退出之后的输出
            workerProcess.on('close', function (code) {
                // console.log('out code：' + code)
            })
            remote.ipcMain.on('window-zoom', (e, arg) => { // 窗口最小化了
                this.changewindows('hide')
            })
            remote.ipcMain.on('window-close', (e, arg) => { // 窗口关闭了
                console.log(35585)
            })
            remote.getCurrentWindow().on('blur', (e, arg) => { // 窗口失去焦点了
                this.changewindows('low')
            })
            remote.getCurrentWindow().on('minimize', (e, arg) => { // 窗口最小化了
                console.log(1111)
                this.changewindows('hide')
            })
            remote.getCurrentWindow().on('focus', (e, arg) => { // 窗口获得焦点了
                this.changewindows('top' + ',' + 'show')
            })
        },
        setVideoFn (str) {
            if (this.isLock) return false
            this.send('changevideo,' + this.videoArr[this.linkBoxIdx].Id + ',' + str)
        },
        changewindows (param) {
            let arr = this.videoArr
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] && arr[i].intptr) {
                    let str = 'changewindows,' + arr[i].intptr + ',' + param
                    this.send(str)
                }
            }
        },
        linkBox (index) {
            if (!this.videoObj.Id) return false
            this.$nextTick(() => {
                if (this.videoArr.length > 0 && this.videoArr[index] && this.videoArr[index].intptr) {
                    let strClose = 'changewindows,' + this.videoArr[index].intptr + ',' + 'close'
                    this.send(strClose)
                    this.clearWinName(index)
                }
                let ele = document.querySelector('.noticeBox')
                let leftEle = document.querySelector('.leftWrap')
                let eleTop = ele.offsetTop
                let leftEleWidth = leftEle.offsetWidth
                let eleHei = ele.offsetHeight
                let _thisEle = this.$refs['linkBox_' + index][0]
                let left = _thisEle.offsetLeft + 37 + leftEleWidth
                let top = _thisEle.offsetTop + eleHei + eleTop + 74
                let width = _thisEle.offsetWidth - 30
                let height = _thisEle.offsetHeight - 30
                let winWidth = window.innerWidth
                let winHei = window.innerHeight
                this.linkBoxIdx = index
                this.$set(this.list[this.idxDD].Nodes[this.idxLink], 'windowName', index + 1)
                let userid = localStorage.getItem('userID')
                let str = 'createwindows,' + index + ',' + left + ',' + top + ',' + width + ',' + height + ',' + this.videoObj.Id + ',1,1,1,1,1,0,0,' + winWidth + ',' + winHei + ',' + userid
                this.send(str)
                this.videoArr[index] = {
                    left: left,
                    top: top,
                    width: width,
                    height: height,
                    Id: this.videoObj.Id,
                    userid: userid
                }
            })
        },
        linkVideo (item, index) {
            if (item.Status == 2) return false
            this.idxLink = index
            this.videoObj = item
        },
        showOrHideDD (index) {
            this.idxDD = index
            this.idxLink = -1
            this.linkBoxIdx = -1
        },
        screenClickFn () {
            this.num += 1
            if (this.num >= this.screenArr.length) {
                this.num = 0
            }
            this.changewindows('close')
            this.clearWinName()
            this.idxLink = -1
            this.linkBoxIdx = -1
        },
        clearWinName (index) {
            let arr = this.list
            for (let i = 0; i < arr.length; i++) {
                let inArr = arr[i].Nodes
                for (let t = 0; t < inArr.length; t++) {
                    if (index) {
                        if (inArr[t].Id == this.videoArr[index].Id) {
                            this.$set(this.list[i].Nodes[t], 'windowName', 0)
                        }
                    } else {
                        this.$set(this.list[i].Nodes[t], 'windowName', 0)
                    }
                }
            }
        },
        getThisProjectFn (item) {
            this.searchProjectValue = item.project_name
            this.videoProjectIds = item.project_id
            this.closeProjectFilterListFn()
            this.getDeviceList()
        },
        showProjectFilterListFn () {
            this.isShowProjectFilterList = true
            this.projectFilterList = this.projectList.filter(item => {
                return item.project_name.indexOf(this.searchProjectValue) >= 0
            })
        },
        showVideoListFn () {
            this.idxDD = -1
            this.idxLink = -1
            this.linkBoxIdx = -1
            this.list = this.listOld.filter(item => {
                console.log(item, 9999)
                return item.Name.indexOf(this.searchVideoValue) >= 0
            })
        },
        closeProjectFilterListFn () {
            setTimeout(() => {
                this.isShowProjectFilterList = false
            }, 100)
        },
        send (str) {
            // 给后台发送数据
            this.webSocket.send(str)
        },
        getUserDepInfo () {
            api.getUserDepInfo().then(res => {
                if (res.code == 200) {
                    this.projectList = res.result
                    this.projectFilterList = res.result
                    let arr = res.result.map(item => {
                        return item.project_id
                    })
                    this.videoProjectIds = arr.join(',')
                    this.projectName = res.result[0].project_name
                    this.getDeviceList()
                }
            }).catch(err => {
                console.error('获取项目列表错误', err)
            })
        },
        getDeviceList () {
            let questData = {
                isVideo: true,
                project: this.videoProjectIds
            }
            homeApi.getdevices(questData).then(res => {
                if (res.Code == 0) {
                    this.list = JSON.parse(res.Items)
                    this.listOld = JSON.parse(res.Items)
                } else {
                    console.error('获取视频设备列表错误', res)
                }
            }).catch(err => {
                console.error('获取视频设备列表错误', err)
            })
        },
        // 建立连接
        initSocket () {
            // 有参数的情况下：
            let url = `ws://${this.url}/${this.types}`
            // 没有参数的情况:接口
            // let url1 = 'ws://localhost:9998'
            this.webSocket = new WebSocket(url)
            this.webSocket.onopen = this.webSocketOnOpen
            this.webSocket.onclose = this.webSocketOnClose
            this.webSocket.onmessage = this.webSocketOnMessage
            this.webSocket.onerror = this.webSocketOnError
            this.getUserDepInfo()
        },
        // 建立连接成功后的状态
        webSocketOnOpen () {
            console.log('websocket连接成功')
        },
        // 获取到后台消息的事件，操作数据的代码在onmessage中书写
        webSocketOnMessage (res) {
            if (res.data == 'True') {
                this.isLock = false
                return false
            }
            if (res.data == 'False') {
                this.isLock = true
                return false
            }
            let arr = res.data.split(',')
            if (arr[0] == 'click') {
                this.linkBox(arr[1] * 1)
                return false
            }
            if (arr[0] == 'lock') {
                this.isLock = false
                this.linkBoxIdx = arr[1]
                return false
            }
            if (arr[0] == 'unlock') {
                this.isLock = true
                this.linkBoxIdx = arr[1]
                return false
            }
            this.videoArr[arr[0]].intptr = arr[1]
            this.send('getlock,' + this.videoArr[arr[0]].intptr)
        },
        // 关闭连接
        webSocketOnClose () {
            this.webSocket.close()
            console.log('websocket连接已关闭')
        },
        // 连接失败的事件
        webSocketOnError (res) {
            console.log('websocket连接失败')
            // 打印失败的数据
            console.log(res)
        }
    },
    mounted () {
        this.init()
    },
    created () {},
    destroyed () {
        this.changewindows('close')
        this.send('closeserver')
        this.webSocket.close()
    }
}
</script>
<style lang="scss" scoped>
.conCtrlBox{
    margin-top: 33px; width: 100%;
    dl{
        border: 1px solid #154fb0; padding-bottom: 20px; border-top: 0; display: flex; flex-direction: column; align-items: center;
        dd{
            margin-top: 20px; width: 131px; display: flex; justify-content: space-between; align-items: center;
            span{
                color: #09f; cursor: pointer; font-size: 19px;
            }
            p{
                color: #a2bada; font-size: 16px;
            }
            span:hover{
                color: #75ddff;
            }
        }
        dt{
            width: 131px; height: 131px; font-size: 38px; margin-top: 20px;
            .right{
                top: 42px; right: -19px; transform: rotate(90deg);
            }
            .left{
                top: 42px; left: -24px; transform: rotate(-90deg);
            }
            .top{
                left: 20px; top: -1px;
            }
            .bottom{
                left: 20px; bottom: 4px; transform: rotate(180deg);
            }
            span{
                cursor: pointer; color: #0e4eb6;
            }
            span:hover{
                color: #75ddff;
            }
        }
    }
    h2{
        display: flex; justify-content: center; align-items: center; background-color: #032459; border: 1px solid #154fb0; height: 38px; color: #09f; font-size: 14px;
    }
}
.gray.conCtrlBox{
    background: #131b27;
    h2{
        background-color: #131b27; border-color: #494949; color: #494949;
    }
    dl {
        border-color: #494949;
        dd {
            span{
                color: #494949; cursor: default;
            }
        }
        dt {
            span{
                color: #494949; cursor: default;
            }
        }
    }
}
.rightVideoBox{
    height: 100%; margin-left: 48px; display: flex; justify-content: center; align-items: center;
    .screenVideoBox_1{
        li{
            width: 100%; height: 100%;
            >div{
                width: 100%;
            }
        }
    }
    .screenVideoBox_9{
        flex-wrap: wrap;
        li:nth-child(2),li:nth-child(5),li:nth-child(8){
            padding: 0 5px;
        }
        li:nth-child(1),li:nth-child(4),li:nth-child(7){
            padding-right: 10px;
        }
        li:nth-child(3),li:nth-child(6),li:nth-child(9){
            padding-left: 10px;
        }
        li{
            width: 33.3%; height: 33.3%;
            >div{
                margin-bottom: 15px;
            }
        }
    }
    .screenVideoBox_4{
        flex-wrap: wrap;
        li:nth-child(2n){
            padding-left: 20px;
        }
        li:nth-child(2n+1){
            padding-right: 20px;
        }
        li{
            width: 50%; height: 50%;
            >div{
                margin-bottom: 40px;
            }
        }
    }
    >ul{
        display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; flex-wrap: wrap;
        >li{
            box-sizing: border-box; overflow: hidden; display: flex; flex-direction: column; justify-content: center; align-items: center;
            >div{
                border: 1px solid #154fb0; cursor: pointer; flex: 1; width: 100%; box-sizing: border-box;
            }
            .linkBox{
                border: 2px solid #75ddff;
            }
        }
    }
}
.leftTreeBox {
    .searchBox{
        height: 367px; border: 0; padding: 0; box-sizing: border-box;
        .treeBox{
            flex: 1; overflow-y: auto; width: 100%; border: 1px solid #154fb0; box-sizing: border-box; margin-top: -2px; border-top: 0; padding: 15px; font-size: 14px; color: #09f;
            .showDD{
                dd{
                    display: flex; justify-content: flex-start; align-items: center;
                }
            }
            dt{
                .iconFont{
                    transition: all .5s linear; transform: rotate(90deg); margin-right: 3px;
                }
            }
            dd{
                padding-left: 18px; display: none;
                span:first-child{
                    width: 102px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
                }
                .iconFont{
                    font-style: normal;
                }
            }
            dt,dd{
                cursor: pointer; padding-bottom: 18px;
            }
            dt:hover,dd:hover,dt.now,dd.now{
                color: #75ddff;
                .iconFont{
                    color: #75ddff;
                }
            }
            dd.gray,dd.gray:hover{
                color: gray;
                .iconFont{
                    color: gray;
                }
            }
        }
        .search {
            height: 37px; width: 100%; box-sizing: border-box; background: #032459;
            input{
                height: 100%; width: 100%;
            }
        }
    }
}
.rightBtnBox{
    display: flex; justify-content: flex-end; align-items: center;
    .btn{
        margin-right: 38px;
    }
    .screenBtn_1{
        span{
            width: 22px; height: 22px;
        }
    }
    .screenBtn_4{
        span{
            width: 10px; height: 10px; margin: 1px;
        }
    }
    .screenBtn_9{
        span{
            width: 6px; height: 6px; margin: 1px;
        }
    }
}
.screenBtn{
    display: flex; padding: 3px 16px; justify-content: center; align-items: center; height: 32px; border: 1px solid #154fb0; border-radius: 6px; cursor: pointer; flex-wrap: wrap; box-sizing: border-box; width: 58px; overflow: hidden;
    span{
        background-color: #09f;
    }
}
.onceTitle{
    font-size: 26px; text-align: center; padding-left: 200px; flex: 1;
}
.videoTitle{
    display: flex; justify-content: space-between; align-items: center;
    .searchBox{
        border: 0; height: auto; max-width: 725px; padding: 0; flex: 1;
        p{
            width: 100%;
        }
    }
}
.selectBox{
    left: 0; top: 43px; right: 0; background-color: #183868; border: 1px solid #2e5da2; max-height: 140px; overflow-y: auto; z-index: 9;
    li{
        border-bottom: 1px solid #2e5da2; cursor: pointer; padding-left: 54px; height: 46px; line-height: 46px; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    li:hover{
        color: #75ddff;
    }
}
.search{
    display: flex; justify-content: space-between; align-items: center; border: 1px solid #154fb0; border-radius: 6px; padding-left: 5px;
    input{
        flex: 1; color: #fff; font-size: 18px; height: 43px; margin: 0 10px;
    }
    span{
        color: #09f; font-size: 22px;
    }
}
.videoWrap{
    display: flex; justify-content: space-between; align-items: flex-start; flex: 1; margin-top: 17px;
    .leftTreeBox{
        width: 275px; height: 100%;
        .searchBox{
            flex-direction: column;
        }
    }
    .rightVideoBox{
        display: flex; justify-content: flex-start; align-items: flex-start; flex: 1; flex-wrap: wrap;
    }
}
@media screen and ( max-width: 1400px ) {
    
}
@media screen and ( max-width: 1280px ) {
    
}
</style>