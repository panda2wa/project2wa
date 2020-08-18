<!--
  2d实时视图
-->
<template>
    <div class="wrap rel">
        <div class="routerBack abs" v-if="!isPop">
            <routerBack />
        </div>
        <div class="closePop" v-else>
            <p>{{param.propertyNumbers}}历史数据回放（2D）</p>
            <span class="iconFont" @click="closePopFn">&#xe631;</span>
        </div>
        <div class="swfBox rel">
            <div class="notSwf" v-if="!isShowSwf">
                <div>检测到您未安装Flash Player，请使用谷歌浏览器（或360浏览器极速模式）打开<span>https://www.flash.cn/</span>下载并安装成功后重启本程序</div>
                <p @click="copyFn" class="copyBtn btn" data-clipboard-text="https://www.flash.cn/">点击复制链接</p>
            </div>
            <iframe ref="myFrame" name="myFrame" id="myFrame" src="http://www.shanhetai.com/3rdVerINDEX3.html" v-else width="100%" height="100%" frameborder="0"></iframe>
            <div class="abs detailBox">
                <div class="detailInner" :class="{show:isShowBox}">
                    <div class="detailTag" @click="showBoxFn">
                        <span class="iconFont btn"><i>&#xe63c;</i></span>
                        <p>详细信息</p>
                    </div>
                    <div class="detailCon">
                        <dl>
                            <dt>设备基本参数</dt>
                            <dd>
                                <p>塔机现场编号</p>
                                <span>{{detailData.craneID}}</span>
                            </dd>
                            <dd>
                                <p>前壁长度（m）</p>
                                <span>{{detailData.frontLen}}</span>
                            </dd>
                            <dd>
                                <p>后壁长度（m）</p>
                                <span>{{detailData.bckgLen}}</span>
                            </dd>
                            <dd>
                                <p>塔身高度（m）</p>
                                <span>{{detailData.armHeight}}</span>
                            </dd>
                            <dd>
                                <p>塔帽高度（m）</p>
                                <span>{{detailData.hatHeigh}}</span>
                            </dd>
                            <dd>
                                <p>坐标X（m）</p>
                                <span>{{detailData.poinX}}</span>
                            </dd>
                            <dd>
                                <p>坐标Y（m）</p>
                                <span>{{detailData.pointY}}</span>
                            </dd>
                            <dd>
                                <p>安装经度（°）</p>
                                <span>{{detailData.fixLongtitude}}</span>
                            </dd>
                            <dd>
                                <p>安装纬度（°）</p>
                                <span>{{detailData.fixLatitude}}</span>
                            </dd>
                            <dd>
                                <p>安装零点角度（°）</p>
                                <span>{{detailData.fixAngle}}</span>
                            </dd>
                            <dd>
                                <p>地理零点角度（°）</p>
                                <span>{{detailData.geographyAngle}}</span>
                            </dd>
                            <dd>
                                <p>吊绳倍率（倍）</p>
                                <span>{{detailData.power}}</span>
                            </dd>
                        </dl>
                        <dl>
                            <dt>设备限制限位信息</dt>
                            <dd>
                                <p>左限位（°）</p>
                                <span>{{detailData.llimit}}</span>
                            </dd>
                            <dd>
                                <p>右限位（°）</p>
                                <span>{{detailData.rlimit}}</span>
                            </dd>
                            <dd>
                                <p>远限位（m）</p>
                                <span>{{detailData.flimit}}</span>
                            </dd>   
                            <dd>
                                <p>近限位（m）</p>
                                <span>{{detailData.nlimit}}</span>
                            </dd>
                            <dd>
                                <p>最大起重量限制（t）</p>
                                <span>{{detailData.weightLimit}}</span>
                            </dd>
                            <dd>
                                <p>最大幅度起重量限制（t）</p>
                                <span>{{detailData.maxExtentWL}}</span>
                            </dd>
                            <dd>
                                <p>起重力矩限制（%）</p>
                                <span>{{detailData.toqureLimit}}</span>
                            </dd>
                            <dd>
                                <p>高度限位（m）</p>
                                <span>{{detailData.hlimit}}</span>
                            </dd>
                        </dl>
                        <dl class="otherStyle">
                            <dt>司机打卡</dt>
                            <dd>{{detailData.iDCard}}</dd>
                            <dd>
                                <img src="@/assets/img/detail/touxiang.png" alt="">
                            </dd>
                            <dd>
                                未打卡
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
        <textTips :text="text" :isShow="isShow" @setIsShow='setIsShow' />
    </div>
</template>
<script>
import api from '@/apis/tajiApi.js'
import routerBack from '@/components/routerBack'
import textTips from '@/components/textTips'
import Clipboard from 'clipboard'
const globalData = require('electron').remote.getGlobal('sharedObject')
export default {
    name: 'shishishituDetail',
    components: {
        routerBack, textTips
    },
    props: {
        param: {
            type: Object,
            default: {}
        },
        isPop: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            detailData: {},
            isShowBox: false,
            text: '',
            isShow: false,
            isShowSwf: false
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
            if (!this.isPop) {
                this.getCraneBasicDate()
            } else {
                let param = this.param
                this.loadIframe(param)
            }
        },
        getCraneBasicDate () {
            let param = this.$route.query
            let questData = {
                propertyNumbers: param.propertyNumbers
            }
            api.getCraneBasicDate(questData).then(res => {
                if (res.code == 200) {
                    this.detailData = res.result
                    this.loadIframe(param)
                } else {
                    console.error('获取2d视图设备基本参数错误', res)
                }
            }).catch(err => {
                console.error('获取2d视图设备基本参数错误', err)
            })
        },
        loadIframe (obj) {
            if (globalData.isDownloadFlash) {
                this.isShowSwf = false
            } else {
                this.isShowSwf = true
                this.$nextTick(() => {
                    let myFrame = this.$refs.myFrame
                    myFrame.addEventListener('load', function () {
                        myFrame.contentWindow.doFlash(obj.url2d, obj.project_id, 5, obj.secretid, obj.htmltext ? obj.htmltext : 'HTTP/1.1', obj.propertyNumbersEncoding)
                    })
                })
            }
        },
        closePopFn () {
            this.$emit('setPopClose', false)
        },
        showBoxFn () {
            this.isShowBox = !this.isShowBox
        },
        setIsShow (e) {
            this.isShow = e
        },
        copyFn () {
            let clipboard = new Clipboard('.copyBtn')
            clipboard.on('success', e => {
                this.isShow = true
                this.text = '复制成功，赶快打开浏览器粘贴下载吧'
                // 释放内存
                clipboard.destroy()
            })
            clipboard.on('error', e => {
                this.isShow = true
                this.text = '复制失败，请手动选择并复制'
                // 释放内存
                clipboard.destroy()
            })
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
.closePop{
    display: flex; justify-content: flex-end; align-items: center; font-size: 18px; padding: 0 10px; color: #fff; height: 33px;
    .iconFont{
        font-size: 22px; cursor: pointer;
    }
    p{
        flex: 1; text-align: center;
    }
}
.detailBox{
    right: 0; top: 0; bottom: 0;
    .detailTag{
        width: 32px; background: #fff; color: #000; cursor: pointer;
        p{
            width: 100%; line-height: 18px; font-size: 14px; padding: 10px; box-sizing: border-box;
        }
        .btn{
            width: 100%; min-width: 0; border-radius: 0; margin: 0; padding: 0; font-size: 22px;
            i{
                font-style: normal; transform: rotate(90deg); transition: all .5s linear;
            }
        }
    }
    .detailCon{
        background: #183868; font-size: 12px; color: #6d84ae; height: 100%; overflow-y: auto;
        .otherStyle{
            padding-top: 10px; padding-bottom: 15px;
            dt,dd{
                border: 0; justify-content: center;
            }
        }
        dt{
            padding-top: 8px; height: 38px; display: flex; justify-content: center; align-items: center; color: #9cf; font-size: 13px; border-bottom: 1px solid #274b80;
        }
        dd{
            display: flex; justify-content: flex-start; align-items: center; border-bottom: 1px solid #274b80;
            p{
                line-height: 25px; border-right: 1px solid #274b80; width: 155px; padding-left: 17px; box-sizing: border-box;
            }
            span{
                width: 105px; padding-left: 15px; box-sizing: border-box;
            }
        }
    }
    .detailInner.show{
        transform: translateX(0);
        .detailTag .btn i{
             transform: rotate(-90deg);
        }
    }
    .detailInner{
        transition: all .5s linear; transform: translateX(260px); display: flex; justify-content: flex-end; align-items: flex-start; height: 100%; overflow-y: auto;
    }
}
.wrap{
    padding: 0;
}
.swfBox{
    display: flex; justify-content: center; align-items: center; height: 100%; font-size: 18px; flex: 1; overflow-x: hidden;
    .notSwf{
        display: flex; flex-direction: column; justify-content: center; align-items: center; white-space: nowrap; width: 100%;
        >div{
            span{
                color: #6d84ae; margin: 0 15px;
            }
        }
        p{
             margin-top: 40px;
        }
    }
}
.routerBack{
    width: 100%; height: 26px; top: -26px; background-color: #001439; left: 0;
}
</style>