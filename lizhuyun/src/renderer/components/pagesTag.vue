<!--
通用面包屑
    onceTag:第一级提示
    secTag:第二级提示
-->
<template>
    <div class="tagBox">
        当前位置：<span :class="{blue:secTag.length==0}">{{onceTag}}</span><p v-if="secTag.length>0">/<span>{{secTag}}</span></p>
    </div>
</template>
<script>
export default {
    name: 'tagBox',
    props: {
        onceTag: {
            type: String,
            default: ''
        },
        secTag: {
            type: String,
            default: ''
        }
    },
    data () {
        return {}
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
.tagBox{
    display: flex; justify-content: flex-start; align-items: center; padding-bottom: 10px; color: #fff; font-size: 14px; line-height: 16px;
    .blue{
        color: #75ddff;
    }
    p{
        span{
            color: #75ddff;
        }
    }
    
}
</style>