<!--用户信息-->
<template>
    <div class="userInfoBox fixed">
        <div class="userInfoInner">
            <span class="iconFont closeBtn" @click="closeFn">&#xe631;</span>
            <dl>
                <dt>
                    <img src="@/assets/img/index/touxiang.png" alt="">
                </dt>
                <dd>
                    用户名：{{userInfo.username}}
                </dd>
            </dl>
            <ul>
                <li>
                    <p><span class="iconFont">&#xec4e;</span>角色：</p>{{userRole}}
                </li>
                <li>
                    <p><span class="iconFont">&#xe637;</span>注册手机号：</p>{{userInfo.phone}}
                </li>
                <li>
                    <p><span class="iconFont">&#xe616;</span>单位名称：</p>{{userInfo.company}}
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import api from '@/apis/indexApi.js'
export default {
  name: 'userInfo',
  data () {
    return {
        userRole: '',
        userInfo: {}
    }
  },
  methods: {
    init () {
        this.getUserType()
    },
    getUserType () {
        api.getUserType().then(res => {
            if (res.code == 200) {
                this.userInfo = res.result
                this.userRole = this.userInfo.userRole[0]
            }
        }).catch(err => {
            console.error('获取用户类型信息错误', err)
        })
    },
    closeFn () {
        this.$emit('closeFn', false)
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
.userInfoInner{
    width: 448px; background-color: #f2f2f2; position: relative;
    ul{
        padding: 21px 0 11px;
        li{
            background: #fff; display: flex; justify-content: flex-start; align-items: center; margin-bottom: 10px; padding: 0 34px; height: 50px; box-sizing: border-box; color: #036;
            p{
                color: #666; width: 130px; display: flex; justify-content: flex-start; align-items: center; font-size: 14px;
            }
            .iconFont{
                font-size: 28px; margin-right: 15px;
            }
        }
    }
    dl{
        background: #003566; padding-top: 32px;
        dd{
            color: #fff; font-size: 16px; padding-bottom: 28px; text-align: center; padding-top: 32px;
        }
        dt{
            display: flex; justify-content: center; align-items: center;
        }
    }
    .closeBtn{
        cursor: pointer; color: #fff; font-size: 28px; position: absolute; right: 12px; top: 8px;
    }
}
@media screen and ( max-width: 1400px ) {
    
}
@media screen and ( max-width: 1280px ) {
    
}
</style>