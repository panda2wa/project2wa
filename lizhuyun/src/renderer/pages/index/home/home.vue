<!--
  主页
-->
<template>
    <div>
        <moreBuild v-if="showPage==1" />
        <otherHomePage v-if="showPage==2" />
        <onceBuild v-if="showPage==3" />
    </div>
</template>
<script>
import moreBuild from './moreBuild'
import onceBuild from './onceBuild'
import otherHomePage from './otherHomePage'
export default {
    name: 'home',
    components: {
        moreBuild, onceBuild, otherHomePage
    },
    props: {},
    data () {
        return {
            showPage: 0
        }
    },
    watch: {
        '$store.state.projectIDs': function (n, o) { // 监听用户是否点击刷新
            if (n) {
                this.showPage = 3
            } else {
                this.showPage = 1
            }
        }
    },
    computed: {
        roleList () {
            return this.$store.getters.getRoleList.length ? this.$store.getters.getRoleList : [8]
        },
        projectNum () {
            return this.$store.getters.getProjectNum || 2
        }
    },
    methods: {
        init () {}
    },
    mounted () {
        this.init()
    },
    created () {
        if (this.projectNum > 1) {
            let all = [1, 8, 5, 6, 10, 14]
            let port = [11, 12]
            for (let index = 0; index < this.roleList.length; index++) {
                if (all.includes(this.roleList[index])) {
                    this.showPage = 1
                    return false
                } else if (port.includes(this.roleList[index])) {
                    this.showPage = 2
                    return false
                }
            }
        } else {
            this.showPage = 3
        }
    },
    destroyed () {}
}
</script>
<style lang="scss" scoped>
</style>