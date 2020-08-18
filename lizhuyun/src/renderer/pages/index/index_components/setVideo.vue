<!--用户信息-->
<template>
    <div class="setVideo fixed">
        <div id="overdiv" class="setVideoBox rel scrollYBox">
            <span class="iconFont abs" @click="closePopFn">&#xe631;</span>
            <h2>视频设置</h2>
            <div class="searchBox" v-if="isMore">
                <p>
                    <input type="text" placeholder="搜索项目名称" v-model="searchText" @keydown.13="searchProjectFn">
                    <span class="iconFont" @click="searchProjectFn">&#xe604;</span>
                </p>
            </div>
            <el-table :data="tableData" height="250" class="tableList" border header-row-class-name="tableTh" row-class-name="tableTr" style="width: 100%">
                <el-table-column prop="project_name" label="项目" v-if="isMore" align="center"></el-table-column>
                <el-table-column prop="video_device_name" label="位置" :width="isMore?180:''" align="center"></el-table-column>
                <el-table-column prop="video_type_name" label="机器类型" :width="isMore?180:''" align="center"></el-table-column>
                <el-table-column label="操作" align="center" width="120">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" v-if="scope.row.isAdded">已添加</el-button>
                        <el-button @click="handleClick(scope.row)" type="text" size="small" v-else>添加</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="videoBox">
                <div class="video-container">
                    <div v-for="(item,index) in 3" :key="index">
                        <div class="rel">
                            <iframe v-if="onLineList.length>0&&onLineList[index]&&onLineList[index].video_id" :id="'mainIframeIn_'+index" :ref="'mainIframeIn_'+index" :name="'mainIframeIn_'+index" src="static/video/video.html" frameborder="0" scrolling="no" />
                            <span class="videoIcon iconFont abs" v-else>&#xe62d;</span>
                            <span class="closeBtn iconFont abs" @click="deleteFn(index)">&#xe631;</span>
                        </div>
                        <p :title="onLineList[index]?onLineList[index].video_device_name:''">{{onLineList[index]?onLineList[index].video_device_name:''}}</p>
                    </div>
                </div>
            </div>
            <div class="btnBox">
                <span @click="resetFn">重置</span>
                <span @click="submitFn">确定</span>
            </div>
        </div>
        <textTips :text="text" :isShow="isShow" />
    </div>
</template>
<script>
import api from '@/apis/homeApi.js'
import textTips from '@/components/textTips'
const globalData = require('electron').remote.getGlobal('sharedObject')
export default {
  name: 'setVideo',
  components: {
      textTips
  },
  props: {
      selectIds: {
          type: Array,
          default: []
      },
      isMore: {
          type: Boolean,
          default: false
      }
  },
  watch: {},
  data () {
    return {
        searchText: '',
        defaultData: [],
        tableData: [],
        onLineList: [],
        text: '',
        isShow: false
    }
  },
  methods: {
    init () {
        this.$nextTick(() => {
            this.listDepSpDeivce()
        })
    },
    searchProjectFn () {
        if (this.searchText == '') {
            this.tableData = this.defaultData
        } else {
            this.tableData = this.defaultData.filter(item => {
                return item.project_name.indexOf(this.searchText) >= 0
            })
        }
    },
    submitFn () {
        let newIdArr = this.onLineList.map(item => {
            return item.id
        })
        let questData = {
            vpdIds: newIdArr.join(',')
        }
        api.addSpMainPageShow(questData).then(res => {
            if (res.code == 200) {
                this.isShow = true
                this.text = '设置成功'
                setTimeout(() => {
                    this.closePopFn()
                    this.$emit('refreshFn', true)
                }, 2000)
            } else {
                this.isShow = true
                this.text = res.msg
            }
        }).catch(err => {
            this.isShow = true
            this.text = err.msg
            console.error('用户添加首页显示视频错误', err)
        })
    },
    closePopFn () {
        this.$emit('closeFn', false)
    },
    resetFn () {
        this.onLineList = []
        this.testDataFn()
    },
    deleteFn (index) {
        this.$set(this.onLineList, index, {})
        this.testDataFn()
    },
    getOnLineVideoFn () {
        let arr = this.tableData
        let len = arr.length
        let inArr = this.selectIds
        let inLen = inArr.length
        for (let i = 0; i < len; i++) {
            this.$set(arr[i], 'isAdded', false)
            for (let n = 0; n < inLen; n++) {
                if (inArr[n] == arr[i].id) {
                    this.$set(arr[i], 'isAdded', true)
                    this.onLineList.push(arr[i])
                    this.$nextTick(() => {
                        this.iframeFn()
                    })
                }
            }
        }
    },
    testDataFn () {
        let arr = this.tableData
        let len = arr.length
        let inArr = this.onLineList
        let inLen = inArr.length
        for (let i = 0; i < len; i++) {
            this.$set(arr[i], 'isAdded', false)
            for (let n = 0; n < inLen; n++) {
                if (inArr[n].id == arr[i].id) {
                    this.$set(arr[i], 'isAdded', true)
                }
            }
        }
    },
    iframeFn () {
        for (let i = 0; i < this.onLineList.length; i++) {
            const id = 'mainIframeIn_' + i
            console.log(id)
            const mapFrame = document.getElementById(id)
            const url = 'http://' + globalData.videoName + ':' + globalData.videoPort + '/ajax/getvideo?id=' + this.onLineList[i].video_id + '&&type=1'
            const iframeWin = mapFrame.contentWindow
            iframeWin.postMessage({url: url, idx: i}, '*')
            mapFrame.addEventListener('load', function () {
                iframeWin.postMessage({url: url, idx: i}, '*')
            })
        }
    },
    handleClick (data) {
        if (!(this.onLineList[0] && this.onLineList[0].id)) {
            this.$set(this.onLineList, 0, data)
            this.$nextTick(() => {
                this.iframeFn()
                this.testDataFn()
            })
            return
        }
        if (!(this.onLineList[1] && this.onLineList[1].id)) {
            this.$set(this.onLineList, 1, data)
            this.$nextTick(() => {
                this.iframeFn()
                this.testDataFn()
            })
            return
        }
        this.$set(this.onLineList, 2, data)
        this.$nextTick(() => {
            this.iframeFn()
            this.testDataFn()
        })
        console.log(data)
    },
    listDepSpDeivce () {
        let questData = {
            pageSize: 10000
        }
        api.listDepSpDeivce(questData).then(res => {
            if (res.code == 200) {
                this.tableData = res.result
                this.defaultData = res.result
                this.testDataFn()
                this.getOnLineVideoFn()
            }
        }).catch(err => {
            console.error('视频设备列表请求错误', err)
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
<style lang="scss">
.setVideoBox .el-table th>.cell{
    color: #6d84ae;
}
.tableList.el-table::after, .tableList .el-table--group::after, .tableList.el-table::before{
    background-color: #142f57;
}
.tableList.el-table{
    border-color: #142f57; color: #fefefe;
    .el-table__body-wrapper{
        background-color: #142f57;
    }
    thead{
        color: #fefefe;
    }
    .el-table__body{
        width: 100%!important; box-sizing: border-box;
        td{
            border-color: #142f57; background: #183868; padding: 4px 0;
            .el-button--text{
                color: #09f;
            }
        }
    }
    
    .tableTr:hover{
        td{
            background-color: #214c8c;
        }
    }
    .tableTh{
        th,th.gutter:last-of-type{
            background-color: #142f57; border-color: #142f57;
        }
    }
}

</style>
<style lang="scss" scoped>
#overdiv{
    overflow: hidden;
}
.btnBox{
    display: flex; justify-content: center; align-items: center;
    span{
        width: 120px; height: 40px; border-radius: 5px; display: flex; justify-content: center; align-items: center; color: #333333; font-size: 18px; background-color: #b7bec7; cursor: pointer; margin: 0 50px;
    }
    span:last-child{
        background: linear-gradient(to right, #2c74cc, #06bfcc); color: #fff;
    }
}
.video-container{
    margin-top: 10px; border: 1px dashed #2e4b7a; padding: 20px 0; margin-bottom: 23px; display: flex; justify-content: center; align-items: center;
    iframe{
        width: 100%; height: 100%; 
    }
    >div:nth-child(2){
        margin: 0 85px;
    }
    >div{
        >div{
            border: 1px solid #34507f; width: 177px; height: 128px;
            .videoIcon{
                font-size: 45px; left: 50%; top: 50%; margin: -22px 0 0 -22px; color: #6699cc;
            }
            .closeBtn{
                background: #fefefe; width: 18px; height: 18px; display: flex; justify-items: center; align-items: center; font-size: 14px; color: #183868; cursor: pointer; border-radius: 50%; text-indent: 2px; right: 7px; top: 7px;
            }
        }
        >p{
            text-align: center; padding: 5px 0 10px; white-space: nowrap; width: 100%; overflow: hidden; text-overflow: ellipsis; max-width: 180px; height: 16px; line-height: 16px;
        }
    }
}
.setVideoBox{
    width: 62.5vw; height: 64.8vh; background-color: rgba($color: #183868, $alpha: .95); font-size: 14px; color: #fefefe; padding: 40px 20px 30px; box-sizing: border-box;
    >.searchBox{
        display: flex; justify-content: flex-end; align-items: center; padding-bottom: 10px; border: 0;
        p{
            border: 1px solid #6d84ae; width: 180px; height: 26px; border-radius: 13px; padding: 0 10px; text-indent: 2px; color: #09f; display: flex; justify-content: space-between; align-items: center;
            >input {
                flex: 1; color: #fff;
            }
            .iconFont{
                cursor: pointer;
            }
        }
    }
    >.iconFont{
        font-size: 22px; right: 20px; top: 20px; cursor: pointer;
    }
    >h2{
        text-align: center; font-size: 26px; line-height: 34px; padding-bottom: 20px; font-weight: normal;
    }
}
@media screen and ( max-width: 1400px ) {
    
}
@media screen and ( max-width: 1280px ) {
    
}
</style>