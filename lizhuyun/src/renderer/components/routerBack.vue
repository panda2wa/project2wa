<template>
    <div class="iconFont" @click="backFn">&#xe61a;</div>
</template>
<script>
export default {
  name: 'routerBack',
  props: {},
  components: {},
  data () {
    return {}
  },
  methods: {
    init () {},
    backFn () {
        this.$router.go(-1)
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
.iconFont{
    font-size: 22px; color: #09f; cursor: pointer;
}
</style>