<!--设备状态-->
<template>
    <div>
        <ul :id="id" :ref="id" class="box" :style="'height:'+height+'px'">
            <li>
                <span>行为违章：</span>
                <div>
                    <p>20</p>
                    待整改
                </div>
                <div>
                    <p>15</p>
                    已整改
                </div>
                <div>
                    <p>30</p>
                    逾期
                </div>
            </li>
            <li>
                <span>故障报警：</span>
                <div>
                    <p>40</p>
                    待整改
                </div>
                <div>
                    <p>20</p>
                    已整改
                </div>
                <div>
                    <p>10</p>
                    逾期
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
// import api from '@/apis/homeApi.js'
export default {
    name: 'echartsTaJiToday',
    props: {
        id: {
            type: String,
            default: ''
        },
        height: {
            type: Number,
            default: 220
        }
    },
    data () {
        return {}
    },
    watch: {
        '$store.state.refresh': function (n, o) { // 监听用户是否点击刷新
            if (n != o) {
                this.init()
            }
        }
    },
    methods: {
        init () {}
    },
    mounted () {
        this.init()
    },
    created () {},
    destroyed () {}
}
</script>
<style lang="scss" scoped>
.box{
    padding: 20px 10px; box-sizing: border-box;
    li{
        display: flex; justify-content: flex-start; align-items: center; font-size: 14px; color: #6d84ae; margin-top: 20px;
        >span{
            margin-right: 10px;
        }
        >div{
            flex: 1; position: relative; padding: 12px 0; display: flex; justify-content: center; align-items: center; font-size: 12px; cursor: pointer; flex-direction: column; color: #09f;
            p{
                font-size: 24px; line-height: 24px; padding-bottom: 8px;
            }
        }
        >div:hover{
            background: rgba($color: #0cf, $alpha: .1); color: #75ddff; font-weight: bold; text-align: center;
            >p::after,>p::before{
                content: ''; width: 4px; height: 2px; background-color: #02acde; position: absolute; right: 0;
            }
            >p::after{
                top: 0;
            }
            >p::before{
                bottom: 0;
            }
        }
        >div:hover::before,>div:hover::after{
            content: ''; width: 4px; height: 2px; background-color: #02acde; position: absolute; left: 0;
        }
        >div:hover::before{
            top: 0;
        }
        >div:hover::after{
            bottom: 0;
        }
    }
}
@media screen and ( max-width: 1400px ) {
    
}
@media screen and ( max-width: 1280px ) {
    
}
</style>