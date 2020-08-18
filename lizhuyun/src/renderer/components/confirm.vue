<!--
通用确认弹窗
    text:提示文字
    styles:提示文字样式
    @confirm：提交给父组件的值：
        true 点击确认了
        false 点击取消了
-->
<template>
    <div class="confirmBox fixed">
        <div class="confirmInner">
            <p :style="styles">{{text}}</p>
            <div class="btnBox">
                <span @click="cancel">取消</span>
                <span @click="confirm">确认</span>
            </div>
        </div>
    </div>
</template>
<script>

export default {
    name: 'confirm',
    props: {
        text: {
            type: String,
            default: ''
        },
        styles: {
            type: String,
            default: ''
        }
    },
    data () {
        return {}
    },
    methods: {
        init () {},
        cancel () {
            this.$emit('confirm', false)
        },
        confirm () {
            this.$emit('confirm', true)
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
.confirmBox{
    z-index: 9999;
}
.confirmInner{
    width: 384px; border-radius: 10px; background: #fff; overflow: hidden; display: flex; flex-direction: column;
    p{
        display: flex; justify-content: center; align-items: center; padding: 40px; color: #333; min-height: 150px; box-sizing: border-box; font-size: 12px;
    }
    .btnBox{
        display: flex; justify-content: center; align-items: center; color: #fff; font-size: 16px; background: #ccc;
        span{
            cursor: pointer; flex: 1; display: flex; justify-content: center; align-items: center; height: 52px;
        }
        span:last-child{
            background: linear-gradient(to right,#2776c6,#09c0cb);
        }
    }
}
</style>