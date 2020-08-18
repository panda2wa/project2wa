<!--视频播放器-->
<template>
    <div class="videoBox">
        <dl class="title">
            <dt>实时视频</dt>
            <dd @click="showSetBox">
                <span class="iconFont">&#xe66b;</span> 设置
            </dd>
        </dl>
        <div class="video-container" v-if="onLineList.length>0">
            <div>
                <div v-for="(item,index) in onLineList" :key="index" :class="{fixed:idx==index}">
                    <div>
                        <iframe :id="'mainIframe_'+index" :ref="'mainIframe_'+index" @click="showBig(index)" :name="'mainIframe_'+index" src="static/video/video.html" frameborder="0" scrolling="no" />
                        <span class="closeBtn iconFont" @click="close" v-show="idx==index">&#xe631;</span>
                        <span class="getImg iconFont" @click="getImg(index)" v-show="idx==index">&#xe66d;</span>
                    </div>
                </div>
            </div>
            <router-link to="/shishishipin" tag="span" class="moreBtn">更多 <span class="iconFont">&#xe63c;</span></router-link>
        </div>
        <div v-else class="notData">没有发现监控视频</div>
        <setVideo :isMore="isMore" v-if="isShowSet" @closeFn="closeFn" :selectIds="selectIds" @refreshFn="refreshFn" />
    </div>
</template>
<script>
import api from '@/apis/homeApi.js'
import setVideo from './setVideo'
const globalData = require('electron').remote.getGlobal('sharedObject')
export default {
    name: 'videoBox',
    components: {
        setVideo
    },
    props: {
        isMore: {
            type: Boolean,
            default: true
        },
        videoProjectIds: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            list: [],
            url: '',
            isShowSet: false,
            idx: -1,
            src: '',
            selectIds: [],
            onLineList: []
        }
    },
    watch: {
        videoProjectIds: function (n, o) {
            if (n) {
                this.init()
            }
        },
        '$store.state.refresh': function (n, o) { // 监听用户是否点击刷新
            if (n != o) {
                this.init()
            }
        }
    },
    methods: {
        init () {
            this.listSpUserChooseShow()
            this.$nextTick(() => {
                window.addEventListener('message', (e) => {
                    this.showBig(e.data)
                })
            })
        },
        refreshFn (e) {
            if (e) {
                this.listSpUserChooseShow()
            }
        },
        closeFn (e) {
            this.isShowSet = e
        },
        listSpUserChooseShow () {
            api.listSpUserChooseShow().then(res => {
                if (res.code == 200) {
                    for (let i = 0; i < res.result.length; i++) {
                        res.result[i].Id = res.result[i].video_id
                    }
                    this.onLineList = res.result
                    this.selectIds = this.onLineList.map(item => {
                        return item.vpd_id
                    })
                    console.log(this.selectIds, 87667657333)
                    if (this.onLineList.length == 0) {
                        this.getdevices()
                    } else {
                        this.$nextTick(() => {
                            this.iframeFn()
                        })
                    }
                }
            }).catch(err => {
                console.error('获取已经添加的视频接口错误', err)
            })
        },
        showSetBox () {
            this.isShowSet = true
        },
        getImg (idx) {
            const id = 'mainIframe_' + idx
            const mapFrame = document.getElementById(id)
            const iframeWin = mapFrame.contentWindow
            iframeWin.postMessage({isSetImg: true, idx: idx}, '*')
        },
        close () {
            this.idx = -1
        },
        showBig (idx) {
            this.idx = idx
        },
        iframeFn () {
            for (let i = 0; i < this.onLineList.length; i++) {
                const id = 'mainIframe_' + i
                const mapFrame = document.getElementById(id)
                const url = 'http://' + globalData.videoName + ':' + globalData.videoPort + '/ajax/getvideo?id=' + this.onLineList[i].Id + '&&type=1'
                const iframeWin = mapFrame.contentWindow
                iframeWin.postMessage({url: url, idx: i}, '*')
                mapFrame.addEventListener('load', function () {
                    iframeWin.postMessage({url: url, idx: i}, '*')
                })
            }
        },
        getdevices () {
            this.onLineList = []
            let questData = {
                isVideo: true,
                project: this.videoProjectIds
            }
            api.getdevices(questData).then(res => {
                if (res.Code == 0) {
                    this.list = JSON.parse(res.Items)
                }
                let isFor = true
                for (let i = 0; i < this.list.length; i++) {
                    if (!isFor) break
                    let len = this.list[i].Nodes.length
                    if (len > 0) {
                        for (let j = 0; j < len; j++) {
                            if (this.list[i].Nodes[j].Status == 1) {
                                this.onLineList.push(this.list[i].Nodes[j])
                                if (this.onLineList.length > 2) {
                                    isFor = false
                                    break
                                }
                            }
                        }
                    }
                }
                this.$nextTick(() => {
                    this.iframeFn()
                })
            }).catch(err => {
                console.error('视频列表请求错误', err)
            })
        }
    },
    mounted () {},
    created () {},
    destroyed () {}
}
</script>
<style lang="scss" scoped>
.notData{
    display: flex; justify-content: center; align-items: center; color: #ccc;
}
.video-container{
    display: flex; justify-content: flex-start; align-items: center; flex: 1;
    .moreBtn{
        margin: 0 25px; width: 14px; color: #09f; font-size: 14px; cursor: pointer;
        .iconFont{
            display: block; margin-top: 5px; text-align: center; text-indent: -1px;
        }
    }
}
.title{
    display: flex; justify-content: flex-start; align-items: center; color: #fff; font-size: 22px; padding-bottom: 20px;
    dd{
        margin-left: 25px; color: #09f; cursor: pointer; display: flex; align-items: center; font-size: 14px;
        .iconFont{
            font-size: 22px;
        }
    }
}
.getImg,.closeBtn{
    cursor: pointer; font-size: 24px; position: absolute; z-index: 4; right: 10px; bottom: 10px; color: #09f;
}
.closeBtn{
    top: 10px; color: #fff;
}
.video-container{
    >div{
        display: flex; justify-content: center; align-items: center; height: 250px; flex: 1;
        >div{
            flex: 1; height: 100%; background-color: rgba($color: #09f, $alpha: .2);
            div{
                height: 100%;
            }
            iframe{
                 height: 100%; width: 100%;
            }
        }
        >div:nth-child(2){
            margin: 0 15px;
        }
        >.fixed{
            background-color: rgba($color: #000, $alpha: .5);
            >div{
                width: 60vw; height: 64vh; position: relative; background-color: rgba($color: #000, $alpha: 1);
            }
        }
    }
}
@media screen and ( max-width: 1400px ) {
    
}
@media screen and ( max-width: 1280px ) {
    
}
</style>