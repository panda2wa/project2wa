<!--
  登录成功提示弹窗
-->
<template>
    <div class="login-success" v-if="successLoginStatus">
        <div>
            <div class="bg-login">
                <img src="@/assets/img/login/login-bg.png" alt />
            </div>
            <div class="loginText">
                <p>登录成功！</p>
                <p>正在跳转...</p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  name: 'successLoginTips',
  props: {
      successLoginStatus: {
          type: Boolean,
          default: false
      }
  },
  data () {
    return {}
  },
  watch: {},
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
.login-success{
    position: absolute; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; left: 0; top: 0;
    >div{
        display: flex; justify-content: center; align-items: center; padding: 10px; background: rgba($color: #000000, $alpha: .7); min-width: 300px; min-height: 250px; border-radius: 5px; position: relative;
        .loginText{
            width: 85px; height: 85px; display: flex; justify-content: center; align-items: center; font-size: 14px; color: #fff; flex-direction: column; position: absolute; left: 50%; top: 50%; margin: -42px 0 0 -42px;
        }
        .bg-login{
            animation: roate 2s linear infinite;
        }
    }
}
@keyframes roate{
    from {transform: rotate(0);}
    to {transform: rotate(-360deg);}
}
</style>