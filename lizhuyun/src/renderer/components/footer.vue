<!--页尾-->
<template>
    <div class="footer">
      <div>
        <footer>
          <p>四川广聚其力电子科技有限公司&nbsp; 旗下产品&emsp;&nbsp; 服务热线：028-65176807 {{zzhTitle}}</p>
        </footer>
      </div>
    </div>
</template>
<script>

export default {
  name: 'footers',
  data () {
    return {
      zzhTitle: ''
    }
  },
  methods: {
    init () {
      const globalData = require('electron').remote.getGlobal('sharedObject')
      this.zzhTitle = globalData.zzhTitle
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
.footer{
  height: 30px; width: 100%; line-height: 30px;
  footer {
    width: 695px;
    height: 100%;
    display: flex;
    background: url(../assets/img/index/footer-bg.png) no-repeat center/100% auto;
    flex-flow: row nowrap;
    color: #9bcdff;
    justify-content: center;
    align-items: center;
    font-size: 12px;
  }
}
</style>