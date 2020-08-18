<template>
    <div class="provice-style">
        <div class="liandongBox">
            <p class="selectTapProvice" @click="mapPullDown('province')">
                <span class="selectP">{{provinceArr[province_index]&&provinceArr[province_index].ProvinceName?provinceArr[province_index].ProvinceName:'全部'}}</span>
                <span class="jiantou-select">▲</span>
            </p>
            <ul class="proviceOption" v-show="isShowSelect=='province'">
                <li
                    class="optionItem"
                    @click="mapPullDownLi(index,'province',items,true)"
                    v-for="(items,index) in provinceArr"
                    :key="index"
                >{{items.ProvinceName}}</li>
            </ul>
        </div>
        <div class="liandongBox">
            <p class="selectTapProvice" @click="mapPullDown('city')">
                <span class="selectP">{{cityArr[city_index]&&cityArr[city_index].CityName?cityArr[city_index].CityName:'全部'}}</span>
                <span class="jiantou-select">▲</span>
            </p>
            <ul class="proviceOption" v-show="isShowSelect=='city'">
                <li
                    class="optionItem"
                    @click="mapPullDownLi(index,'city',items,true)"
                    v-for="(items,index) in cityArr"
                    :key="index"
                >{{items.CityName}}</li>
            </ul>
        </div>
        <div class="liandongBox">
            <p class="selectTapProvice" @click="mapPullDown('area')">
                <span class="selectP">{{areaArr[area_index]&&areaArr[area_index].AreaName?areaArr[area_index].AreaName:'全部'}}</span>
                <span class="jiantou-select">▲</span>
            </p>
            <ul class="proviceOption" v-show="isShowSelect=='area'">
                <li
                    class="optionItem"
                    @click="mapPullDownLi(index,'area',items,true)"
                    v-for="(items,index) in areaArr"
                    :key="index"
                >{{items.AreaName}}</li>
            </ul>
        </div>
    </div>
</template>

<script>
import api from '@/apis/homeApi.js'
export default {
    name: 'liandong',
    props: {
        centerPoint: {
            type: Array,
            default: []
        }
    },
    data () {
        return {
            isShowSelect: '',
            mapPullDownControl: '',
            provinceArr: [],
            province_index: 0,
            cityArr: [],
            city_index: 0,
            areaArr: [],
            area_index: 0
        }
    },
    watch: {
        centerPoint: function (n, o) { // 监听用户是否点击刷新
            if (n) {
                this.centerPointFn()
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
            // 三级联动数据获取
            this.GetLianDong()
        },
        centerPointFn () {
            let arr = this.provinceArr
            let len = arr.length
            let centerPoint = this.centerPoint[0].AreaCode
            for (let i = 0; i < len; i++) {
                if (arr[i].ProvinceAreaCode == centerPoint) {
                    this.mapPullDownLi(i, 'province', arr[i])
                    return false
                } else {
                    let cityArr = arr[i].Citys
                    let cityLen = cityArr.length
                    for (let j = 0; j < cityLen; j++) {
                        if (cityArr[j].CityAreaCode == centerPoint) {
                            this.mapPullDownLi(i, 'province', arr[i])
                            this.mapPullDownLi(j, 'city', cityArr[j])
                            return false
                        } else {
                            let areaArr = cityArr[j].Areas
                            if (!areaArr) continue
                            let areaLen = areaArr.length
                            for (let n = 0; n < areaLen; n++) {
                                if (areaArr[n].AreaCode == centerPoint) {
                                    this.mapPullDownLi(i, 'province', arr[i])
                                    this.mapPullDownLi(j, 'city', cityArr[j])
                                    this.mapPullDownLi(n, 'area', areaArr[n])
                                    return false
                                }
                            }
                        }
                    }
                }
            }
        },
        mapPullDown (parameter) { // 关闭或者打开下拉框
            this.isShowSelect = this.isShowSelect ? '' : parameter
        },
        mapPullDownLi (index, str, area, isClick) {
            this.isShowSelect = ''
            if (str == 'province') {
                this.province_index = index
                this.cityArr = this.provinceArr[index].Citys
                this.areaArr = [{
                    AreaCode: this.cityArr[0].CityAreaCode,
                    AreaName: '全部',
                    name: this.cityArr[0].ProvinceName
                }]
                this.city_index = 0
                this.area_index = 0

                if (isClick) {
                    let name = area.ProvinceName
                    if (name == '全部') {
                        name = area.name
                    }
                    this.$emit('getAreaId', {id: area.ProvinceAreaCode, name: name})
                }
            }
            if (str == 'city') {
                this.city_index = index
                if (isClick) {
                    let name = area.CityName
                    if (name == '全部') {
                        name = area.name
                    }
                    this.$emit('getAreaId', {id: area.CityAreaCode, name: name})
                }
                if (index == 0) {
                    this.area_index = index
                    this.areaArr = [{
                        AreaCode: this.cityArr[0].CityAreaCode,
                        AreaName: '全部',
                        name: this.cityArr[0].name || this.cityArr[0].CityName
                    }]
                } else {
                    this.areaArr = this.cityArr[index].Areas
                }
                this.area_index = 0
            }
            if (str == 'area') {
                this.area_index = index
                if (isClick) {
                    let name = area.AreaName
                    if (name == '全部') {
                        name = area.name
                    }
                    this.$emit('getAreaId', {id: area.AreaCode, name: name})
                }
            }
        },
        // 三级联动
        GetLianDong () {
            let dataPost = {
                query: this.mapSearchData
            }
            api.getMainMapAreaListInfo(dataPost).then(res => {
                if (res.code == 200) {
                    this.provinceArr = res.result.result
                    let len = this.provinceArr.length
                    if (len > 0) {
                        for (let i = 0; i < len; i++) {
                            let cityArr = this.provinceArr[i].Citys
                            cityArr.unshift({
                                CityAreaCode: this.provinceArr[i].ProvinceAreaCode,
                                Areas: [],
                                CityName: '全部',
                                name: this.provinceArr[i].ProvinceName
                            })
                            let cityLen = cityArr.length
                            for (let j = 0; j < cityLen; j++) {
                                this.provinceArr[i].Citys[j].Areas.unshift({
                                    AreaCode: cityArr[j].CityAreaCode,
                                    AreaName: '全部',
                                    name: cityArr[j].name || cityArr[j].CityName
                                })
                            }
                        }
                    }
                    if (this.provinceArr.length > 0 && this.provinceArr[0].Citys.length > 0) {
                        this.cityArr = this.provinceArr[0].Citys
                        this.areaArr = this.cityArr[0]
                    }
                }
            }).catch(err => {
                console.error('三级联动请求错误', err)
            })
        }
    },
    mounted () {
        this.init()
    },
    updated () {},
    destroyed () {}
}
</script>


<style scoped lang="scss">
.provice-style{
  display: flex; justify-content: space-between; align-items: center;
  >div{
    font-size: 16px; color: #0099ff; position: relative; flex: 1; margin-right: 20px;
    >p{
      cursor: pointer; display: flex; justify-content: flex-start; align-items: center; white-space: nowrap; min-width: 100px;
      .jiantou-select{
        transform: rotate(180deg); font-size: 8px; margin-left: 8px;
      }
    }
    .proviceOption{
      position: absolute; left: 0; top: 30px; max-height: 80px; min-width: 94px; background-color: rgba($color: #000000, $alpha: .4); box-sizing: border-box; z-index: 3; border: 1px solid rgba(141,141,141,.2);
      li{
        padding: 6px 18px; cursor: pointer;
      }
    }
  }
}

</style>

