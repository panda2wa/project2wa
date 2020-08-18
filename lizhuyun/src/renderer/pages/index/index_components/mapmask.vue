<!--地图弹窗-->
<template>
    <div id='mask' class="abs" @click='maskClick'>
        <div class='project-infomation'>
          <div></div>
          <div class='closeBtn' @click.stop='closeBtn'>✖</div>
        </div>
        <div class='project-infomation'>
          <div class="projectTitle"><div class="iconFont">&#xe618;</div><div class='title-text'>项目信息</div></div>
          <div>
            <div class='img-info img-info1'></div>
            <div class='img-info img-info2'></div>
            <div class='img-info img-info3'></div>
          </div>
        </div>
        <div class="projectList rel">
          <div class='projectName'>
            <div class='content-text'>项目名称：{{message.name}}</div>
          </div>
          <div class='projectSite'>
            <div class='content-text'>项目地址：{{message.site}}</div>
          </div>
          <div class='phone'>
            <div class='content-text'>项目经理及电话：{{message.phone}}</div>
          </div>
          <span class="abs doIn" @click='goDetail' v-if="!isMore">进入</span>
        </div>
        <div v-if="isMore">
            <div class='project-infomation'>
          <div><div class="title-text-img2"></div><div class='title-text'>今日报警记录</div></div>
          <div></div>
        </div>
        <div class='project-infomation'>
          <div class='litle-title-text'>·混凝土</div>
          <div></div>
        </div>
        <div class='project-infomation'>
            <div class='ingo-details content-text'>养护期出架：<span class='true-text'>{{chanceConcrete.concreteWarn.outBlockNumber}}块</span></div>
            <div class='ingo-details content-text'>待送样已超期：<span class='true-text'>{{chanceConcrete.concreteWarn.sendBlockNumer}}块</span></div>
          </div>
          <div class='project-infomation'>
            <div class='ingo-details content-text'>标养室异常：<span class='true-text'>{{chanceConcrete.concreteWarn.curingHoseAbnormal}}间</span></div>
            <div class='ingo-details content-text'>同养架异常：<span class='true-text'>{{chanceConcrete.concreteWarn.sameShelvesAbnormalNumber}}个</span></div>
          </div>
        <!--
        <div class='project-infomation'>
          <div class='litle-title-text'>·塔机</div>
          <div></div>
        </div>
        <div class='project-infomation'>
            <div class='ingo-details content-text'>行为违章：13次</div>
            <div class='ingo-details content-text'>逾期未整改：3次</div>
          </div>
          <div class='project-infomation'>
            <div class='ingo-details content-text'>故障报警：15次</div>
            <div class='ingo-details content-text'>逾期未整改：4次</div>
          </div>
        <div class='project-infomation'>
          <div class='litle-title-text'>·施工升降机</div>
          <div></div>
        </div>
        <div class='project-infomation'>
            <div class='ingo-details content-text'>行为违章：23次</div>
            <div class='ingo-details content-text'>逾期未整改：7次</div>
          </div>
          <div class='project-infomation'>
            <div class='ingo-details content-text'>故障报警：29次</div>
            <div class='ingo-details content-text'>逾期未整改：4次</div>
          </div>
        <div class='project-infomation'>
          <div class='litle-title-text'>·扬尘</div>
          <div></div>
        </div>
        <div class='project-infomation'>
            <div class='ingo-details content-text'>超标次数：13次</div>
            <div class='ingo-details content-text'>逾期未整改：3次</div>
          </div>
        <div class='project-infomation'>
          <div class='litle-title-text'>·人工考勤</div>
          <div></div>
        </div>
        <div class='project-infomation'>
            <div class='ingo-details content-text'>应到未到：23人</div>
            <div class='ingo-details content-text'></div>
        </div>
        -->
        <div class='project-infomation project-watch'>
          <div><div class="title-text-img3"></div><div class='title-text'>监控设备</div></div>
          <div>
          </div>
        </div>
        <!--
        <div class='project-infomation'>
          <div class='ingo-details content-text'>塔机：13台</div>
          <div class='ingo-details content-text'>施工升降机：15台</div>
        </div>
        <div class='project-infomation'>
          <div class='ingo-details content-text'>扬尘：8台</div>
          <div class='ingo-details content-text'>闸机：12台</div>
        </div>
        -->
        <div class='project-infomation'>
          <!--<div class='ingo-details content-text'>摄像头：{{concreteWarn.cameraNumber}}台</div>-->
          <div class='ingo-details content-text'>植入设备：{{chanceConcrete.concreteWarn.implantationDeviceNumber}}台</div>
          <div class='ingo-details content-text'>主机：{{chanceConcrete.concreteWarn.hostNumer}}个</div>
        </div>
        <div class='project-infomation'>
          <div class='ingo-details content-text'>标养架：{{chanceConcrete.concreteWarn.standardShelvesNumber}}个</div>
          <div class='ingo-details content-text'>同养架：{{chanceConcrete.concreteWarn.sameShelvesNumber}}个</div>
        </div>
        <!--
        <div class='project-infomation'>
          <div class='ingo-details content-text'>主机：{{concreteWarn.hostNumer}}个</div>
          <div class='ingo-details content-text'></div>
        </div>-->
        </div>
    </div>
</template>
<script>
import api from '@/apis/homeApi.js'
export default {
    name: 'mapmask',
    props: {
        message: Object,
        isMore: Boolean,
        mouseY: Number,
        mouseX: Number
    },
    data () {
        return {
            chanceConcrete: {},
            _mouseY: 0,
            _mouseX: 0
        }
    },
    watch: {
        '$store.state.refresh': function (n, o) { // 监听用户是否点击刷新
            if (n != o) {
                this.init()
            }
        }
    },
    methods: {
        init () {
            this.getDepPointClickInfo()
        },
        showBoxFn () {
            this.$nextTick(() => {
                let mask = document.getElementById('mask')
                let eve = window.event
                this._mouseY = this.mouseY
                this._mouseX = this.mouseX
                let h = mask.offsetHeight // 高度
                let w = mask.offsetWidth // 宽度
                let boxW = 1030
                let winH = window.innerHeight
                let moY = eve.screenY
                if (winH - moY < h) {
                    this._mouseY = this._mouseY - 30 - h
                }
                if (boxW - this._mouseX < boxW / 2 && this.mapFlag) {
                    this._mouseX = this._mouseX - 30 - w
                }
                mask.style.left = this._mouseX + 15 + 'px'
                mask.style.top = this._mouseY + 15 + 'px'
                mask.style.display = 'block'
            })
        },
        getDepPointClickInfo () {
            let dataPost = {
                project_id: this.message.projectId
            }
            api.getDepPointClickInfo(dataPost).then(res => {
                this.chanceConcrete = res.result.result
                this.showBoxFn()
            }).catch(err => {
                console.error('地图内项目数据请求错误', err)
            })
        },
        maskClick () {
          this.$emit('mapShow', true)
        },
        goDetail () {
          this.$store.commit('setProjectIDs', this.message.projectId)
        },
        closeBtn () {
          this.$emit('mapHide', false)
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
.projectList{
  padding: 20px;
  .doIn{
    color: #0099ff; right: 5px; bottom: 5px; cursor: pointer;
  }
}
.project-infomation{
  display: flex; justify-content: space-between; align-items: center;
  >.projectTitle{
    color: #9cf; font-weight: bold; display: flex; justify-content: flex-start; align-items: center;
    .iconFont{
      margin-right: 4px; font-size: 22px;
    }
  }
}
.closeBtn{
  color: #fff; cursor: pointer;
}
#mask img { width: 23px; height: 23px; color: #99ccff;}

#mask { 
  padding: 16px; max-height: 1200px; z-index: 5; background-color: rgba($color: #000000, $alpha: .8); font-size: 14px; color: #6d84ae; line-height: 28px; display: none;
  
}
.closeBtn { position: inherit; margin-bottom: 15px;}
@media screen and ( max-width: 1400px ) {
    
}
@media screen and ( max-width: 1280px ) {
    
}
</style>