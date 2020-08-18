<template>
  <div v-bind:class="isShowSale? 'regionalMapInfoBig':mapClassName">
    <div class="display-title">
      <div class="main-title">
        <span>{{mapName}}全局地图</span>
      </div>
    </div>
    <div class="area-map-position rel">
      <!-- /* 修改部分 */ -->
      <mapmask :message="projectMsg" v-if="mapFlag" :mouseX="mouseX" :isMore="false" :mouseY="mouseY" @mapShow="isMapShow" @mapHide="isMapHide"></mapmask>
      <!-- /* 修改部分 */ -->
      <div class="topInfo">
        <liandong :centerPoint="centerPoint" @getAreaId="getAreaId" />
        <div class="radio-map-style">
          <div class="regional-map-search">
            <input type="text" placeholder="请输入项目名称" @keyup.13="mapSearch" v-model="mapSearchData" />
            <div class="search-icon iconFont" @click="mapSearch">&#xe604;</div>
          </div>
          <div class="iconFont" @click="saleMapClick" v-html="isShowSale?'&#xe749;':'&#xe786;'"></div>
        </div>
      </div>
      <!--echarts-map展示-->
      <div
        class="map-show"
        :style="'height:'+height+'px;width:'+width+'px'"
        :class="{mapShowDiv:mapJurisdiction == 1}"
        id="mapEchartsShow"
        ref="mapEchartsShow"
      ></div>
      <div class="map-toast abs">
        <div>
          <div class="iconFont">&#xe615;</div>
          <span class>信息化搭建项目</span>
        </div>
        <div>
          <div class="map-toast-img iconFont">&#xe610;</div>
          <span class>信息化未搭建项目</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/apis/homeApi.js'
import mapmask from './mapmask'
import liandong from '@/components/liandong'
let mapEchartsDom
let mapNum = '51'
export default {
  name: 'mapIndex',
  components: {
    mapmask, liandong
  },
  props: {},
  data () {
    return {
      height: 500,
      width: '',
      oldWidth: '',
      isShowSale: false,
      mapClassName: 'regionalMapInfoDiv',
      mapJurisdiction: 2, // 权限控制"1"-->代表中大屏；"2"-->代表小屏
      mapName: '**', // 显示地图名称
      unitShow: 2,
      mapFlag: false,
      mapSearchData: '',
      centerPoint: [],
      projectMsg: {
        name: '',
        site: '',
        projectId: '',
        phone: ''
      }, // 地图蒙层数据，显示隐藏，位置控制
      /* 正常地图标注数据 */
      dataValueMap: [], // 地图icon坐标值
      geoCoordMap: {}, // 地图icon坐标值
      HFData: [],
      /* 异常地图标注数据 */
      dataValueMapAn: [], // 地图icon坐标值
      geoCoordMapAn: {}, // 地图icon坐标值
      isQuest: true
    }
  },
  methods: {
    init () {
      let unitShow = this.$store.getters.getRoleList
      for (let index = 0; index < unitShow.length; index++) {
        if (unitShow[index] == 3 || unitShow[index] == 11 || unitShow[index] == 12) {
          this.unitShow = 1
        } else {
          this.unitShow = 2
        }
      }
      this.mapJurisdiction = this.unitShow
      if (this.mapJurisdiction == 1) {
        this.mapClassName = 'regionalMapInfoDiv'
      } else {
        this.mapClassName = 'regionalMapInfo'
      }
      // 获取项目部经纬度信息
      this.GetCurOrgaAllProInfo()
      this.$nextTick(() => {
        let wid = document.getElementById('mapEchartsShow').offsetWidth
        this.width = wid
        this.oldWidth = wid
        mapEchartsDom = this.$echarts.init(this.$refs.mapEchartsShow)
      })
    },
    getAreaId (e) {
      this.mapName = e.name
      mapNum = e.id
      this.showMap(this.mapName, mapNum)
    },
    // 地图绘制
    showMap (pName) {
      mapEchartsDom.clear()
      this.isQuest = true
      let self = this
      let geoDataAn = customMethod.convertAnNotData(
        this.dataValueMapAn,
        this.geoCoordMapAn
      )
      customMethod.initEcharts(
        pName,
        mapEchartsDom,
        self.HFData,
        self.geoCoordMap,
        geoDataAn,
        self
      )
    },
    // 地图搜索
    mapSearch () {
      this.GetCurOrgaAllProInfo(this.mapSearchData)
    },
    // 放大缩小
    saleMapClick () {
      if (this.isShowSale) {
        this.isShowSale = false
        this.height = 500
        this.width = this.oldWidth
        this.showMap(this.mapName, mapNum) // 地图初始化
      } else {
        this.isShowSale = true
        this.height = window.innerHeight
        this.$nextTick(() => {
          this.width = document.querySelector('.area-map-position').offsetWidth
          console.log(this.width)
          this.showMap(this.mapName, mapNum) // 地图初始化
        })
      }
    },
    // 获取项目部经纬度信息
    GetCurOrgaAllProInfo (userText) {
      let text = userText
      let curOrgaPost = {
        query: text
      }
      api.getMainMapDepListInfo(curOrgaPost).then(data => {
        if (data.result) {
          this.HFData = []
          this.geoCoordMap = []
          this.dataValueMapAn = []
          this.geoCoordMapAn = []
          this.dataValueMap = []
          if (data.result.centerPoint) {
            this.centerPoint = data.result.centerPoint
            mapNum = this.centerPoint[0].AreaCode
            this.mapName = this.centerPoint[0].AreaName
            this.$emit('getProjectsId', data.result.ResultList)
            for (let i = 0; i < data.result.ResultList.length; i++) {
              let geoName = data.result.ResultList[i].area_name + i
              if (data.result.ResultList[i].isRn == 1) {
                this.geoCoordMap[geoName] = [
                  data.result.ResultList[i].lat,
                  data.result.ResultList[i].lng
                ]
                let arryHfData = [
                  { name: data.result.AreaName },
                  {
                    name: data.result.ResultList[i].area_name + i,
                    value: 66,
                    deptName: data.result.ResultList[i].project_name,
                    phone:
                      data.result.ResultList[i].manager +
                      ' ' +
                      data.result.ResultList[i].manager_phone,
                    address: data.result.ResultList[i].project_adr,
                    projectId: data.result.ResultList[i].project_id
                  }
                ]
                this.HFData.push(arryHfData)
              } else {
                let arryData = {
                  name: data.result.ResultList[i].area_name + i,
                  value: 66,
                  deptName: data.result.ResultList[i].project_name,
                  phone:
                    data.result.ResultList[i].manager +
                    ' ' +
                    data.result.ResultList[i].manager_phone,
                  address: data.result.ResultList[i].project_adr,
                  projectId: data.result.ResultList[i].project_id
                }
                this.dataValueMapAn.push(arryData)
                this.geoCoordMapAn[geoName] = [
                  data.result.ResultList[i].lat,
                  data.result.ResultList[i].lng
                ]
              }
            }
          } else {
            this.dataValueMapAn = []
            this.dataValueMap = []
            this.geoCoordMapAn = {}
            this.geoCoordMap = {}
          }
          this.showMap(this.mapName) // 地图初始化
        } else {
          mapEchartsDom.clear()
        }
      }).catch(err => {
        console.error('获取项目部经纬度错误', err)
      })
    },
    isMapShow (bol) {
      this.mapFlag = bol
    },
    isMapHide (bol) {
      this.mapFlag = bol
    }
  },
  mounted () {
    this.init()
  },
  updated () {},
  destroyed () {
    if (this.mapFlag) this.mapFlag = false
  },
  // components: indexData.componentsMsg,
  watch: {
    '$store.state.refresh': function (n, o) { // 监听用户是否点击刷新
        if (n != o) {
            this.init()
        }
    }
  }
}
let customMethod = {
  /* 地图绘制 */
  initEcharts (pName, elem, HFData, geoCoordMap, dataAbnormal, _this) {
    let series = []
    // 遍历由成都市到其他城市的线路
    let arrData = [[pName, HFData]]
    arrData.forEach(function (item, i) {
      // 配置
      series.push(
        {
          type: 'scatter',
          coordinateSystem: 'geo',
          zlevel: 3,
          data: item[1].map(function (dataItem) {
            return {
              name: dataItem[1].name,
              value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value]),
              deptName: dataItem[1].deptName,
              phone: dataItem[1].phone,
              address: dataItem[1].address,
              projectId: dataItem[1].projectId
            }
          }),
          showLegendSymbol: false,
          symbolSize: [34, 38],
          symbol:
            'image://data:image/png;base64,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',
          symbolRotate: 0
        },
        {
          type: 'scatter',
          coordinateSystem: 'geo',
          data: dataAbnormal,
          symbolSize: [18, 24],
          symbol:
            'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAYCAYAAAD3Va0xAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjYxMEY5MzUzNzU0NjExRTlCN0IzODE3OEY5OThDRjA4IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjYxMEY5MzU0NzU0NjExRTlCN0IzODE3OEY5OThDRjA4Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjEwRjkzNTE3NTQ2MTFFOUI3QjM4MTc4Rjk5OENGMDgiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NjEwRjkzNTI3NTQ2MTFFOUI3QjM4MTc4Rjk5OENGMDgiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4FrOnfAAAC3ElEQVR42oSUPWxSURTHz319pQEkQEvQfjhYW9GmjbGRQdNoXHSpk0YHmdwMjUtHGWVzs8bRRScnEx1MB2vqR1J1M4hRh1KgoPQD6Gvoe/Ce59y8e72l1J7kF+4595w/736cy5aWlqCDTSI3kQvIAMKQMvIBeY68E4nxeJz/6h1E5pBkh/hR5CxyF3mGJNRJ3XEcOUbeIufhYLuFnEYuIRVebNu2mHyjilSrVSgUClCv1bjv9/vhSH8/RCIRkTKOvEdi5LDFxUX6nUEe0oCEs9ksFFGkk5HQ+MQE6LrclfTU1FSKLSwskFNwNxW+ZTJQKpX+u65gMAhnJieBMToDMCmkNZvNODKAQKVSkSLHR0acaDQqi0OhEJwaG3PUZVMN4kGu6JZlnRPJq6ursnBzY4ONjI7ysWmacCIWg/zKChPzJczt6+uT14WEDgvP2NqSQmtra3y/jg0Pc395eRnKypINwwCsFW6YhMrCU64Ct1arJZOb/4qkKULbJPRFeB6PBxqNBh8HAgEYGByEfD7PRQaHhhwb/2hjfZ0vr6enRxX6qqHzCdmh4CEsFub1+exisehgIdTrdcjlcuDz+WQl5VKNyzwJmcgDCnR3d4MPLx7Z73JZq1WrcnO3DYMV8nmP+Bqv1ytEniYSibLmOinkF43pjlDSfkYi4d5efvSYv4nc5i2irHOa7qP4bCqg/aICsi68yRQj6BAItBvJZJIL6CIRLeu2yhzvHU2jfdrzRUp+GpmXHa9MkD1yO/raAd3/EUntekbahMiuI0Wkfx8RKrjYHtTdtbbbVeTzPkL0R3tupyY2TsWwwzWzpT9pj1st7QXOZdSYFKK2UGmwCJ3erMUClu105UTcdrQ/JgtSO81SjohLoQ6fftl97MHUwq8d0LCT2Y6lhV6588zN2WVMVb13/7G4T9NCrINRwUsinboD6oPfbpT0HaF36iS9ae5JbSI/3aP/0V70V4ABANNlmxyeI3uOAAAAAElFTkSuQmCC',
          symbolRotate: 0,
          showLegendSymbol: false
        }
      )
    })

    let urlPath
    if (mapNum.length > 2) {
      urlPath = '/jsonMap/couties/' + mapNum + '.json'
    } else {
      urlPath = '/jsonMap/province/' + mapNum + '.json'
    }
    this.getAjax(urlPath, function (data) {
      if (!_this.isQuest) return false
      _this.isQuest = false
      _this.$echarts.registerMap(pName, data) // 注册
      let option = {
        title: {
          x: 'center'
        },
        // json数据加载
        geo: {
          name: 'my custom map',
          type: 'map',
          roam: false,
          map: pName, // 使用
          silent: true,
          label: {
            normal: {
              show: true,
              textStyle: {
                color: '#ffffff',
                opacity: 0.5,
                fontSize: 10
              }
            },
            emphasis: {
              show: false
            }
          },
          itemStyle: {
            // 地图区域的多边形 图形样式
            normal: {
              // 是图形在默认状态下的样式
              label: {
                show: true, // 是否显示标签
                textStyle: {
                  color: '#ffffff',
                  fontSize: 10
                }
              },
              areaColor: {
                type: 'radial',
                x: 0.5,
                y: 0.5,
                r: 0.75,
                colorStops: [
                  {
                    offset: 0,
                    color: 'transparent' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#263fa8' // 100% 处的颜色
                  }
                ],
                globalCoord: false // 缺省为 false
              },
              borderWidth: 1,
              borderColor: new _this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#0182b6' },
                { offset: 1, color: '#00e6ff' }
              ]),
              childBorderWidth: 1,
              shadowColor: '#0bb3ff',
              shadowBlur: 150
            }
          }
        },
        series: series
      }
      elem.setOption(option, true)
      elem.resize()
      elem.off('click', null)
      // 地图蒙层
      elem.on('click', e => {
        if (e.componentType == 'series') {
          _this.mapFlag = false
          _this.mapFlag = true
          _this.projectMsg.site = e.data.address
          _this.projectMsg.name = e.data.deptName
          _this.projectMsg.phone = e.data.phone
          _this.projectMsg.projectId = e.data.projectId
          _this.mouseX = event.offsetX
          _this.mouseY = event.offsetY
        }
      })
    }, _this)
  },
  convertAnNotData (data, geoData) {
    let res = []
    for (var i = 0; i < data.length; i++) {
      var geoCoord = geoData[data[i].name]
      if (geoCoord) {
        res.push({
          name: data[i].name,
          value: geoCoord.concat(data[i].value),
          deptName: data[i].deptName,
          phone: data[i].phone,
          address: data[i].address,
          projectId: data[i].projectId
        })
      }
    }
    return res
  },
  getAjax (url, returnData, _this) {
    if (!_this.isQuest) return
    api.jsonMap(url, {isHttp: true}).then(res => {
      let data = res
      returnData(data)
    }).catch(err => {
      console.error('地图请求错误', err)
      returnData('暂无地图数据')
    })
  }
}
</script>
<style scoped lang="scss">
.map-toast{
  right: 0; bottom: 0; padding: 8px 13px; border: 1px dashed #0099ff;
  >div{
    display: flex; justify-content: flex-start; align-items: center;
    span{
      color: #6d84ae; font-size: 12px; margin-left: 10px;
    }
    .iconFont{
      font-size: 22px;
    }
  }
  >div:first-child{
    margin-bottom: 10px;
    .iconFont{
      color: #fecc1c;
    }
  }
  >div:last-child{
    .iconFont{
      color: #7f7e7e;
    }
  }
}
#mapEchartsShow{
  display: flex; justify-content: center; align-items: center;
}
.regionalMapInfo{
  width: 100%; height: 100%; overflow: hidden;
}
.regionalMapInfoBig {
  width: 100vw;
  height: 100vh;
  position: absolute;
  padding: 20px; box-sizing: border-box;
  top: 0;
  left: 0;
  background-image: url("../../../assets/img/index/BGIndex.png");
  background-size: 100% 100%;
  z-index: 101;
}
.search-icon{
  color: #0099ff; font-size: 16px; cursor: pointer;
}
.topInfo{
  display: flex; justify-content: space-between; align-items: center;
  .radio-map-style{
    display: flex; justify-content: space-between; align-items: center;
    >.iconFont{
      font-size: 23px; color: #0099ff; margin-left: 10px; cursor: pointer;
    }
    .regional-map-search{
      display: flex; justify-content: space-between; align-items: center; width: 180px; height: 24px; border: 1px solid #0099ff; border-radius: 12px; padding: 0 10px; box-sizing: border-box; color: #09f;
      input{
        color: #fff; font-size: 14px; text-indent: 3px; flex: 1; box-sizing: border-box; border-color: #0099ff; border-radius: 12px; width: 100%;
      }
    }
  }
}

.main-title{
  text-align: center; font-size: 22px; height: 45px; color: #fff;
}

</style>

