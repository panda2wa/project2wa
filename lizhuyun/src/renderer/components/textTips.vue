<!--
通用文字提示弹窗
    text：需要提示的文字
    styles：提示文字样式控制
    timeout：自动关闭弹窗时间
    isAutoClose: 是否自动关闭弹窗 默认 true
    isShow: 是否显示弹窗 默认  false
-->
<template>
    <div class="textTipsBox fixed" v-if="isShow">
      <div>
        <span :style="styles">{{text}}</span>
      </div>
    </div>
</template>
<script>

export default {
    name: 'texttips',
    props: {
        isShow: {
            type: Boolean,
            default: false
        },
        isAutoClose: {
            type: Boolean,
            default: true
        },
        text: {
            type: String,
            default: ''
        },
        styles: {
            type: String,
            default: ''
        },
        timeout: {
            type: Number,
            default: 3000
        }
    },
    data () {
        return {
            timer: null
        }
    },
    watch: {
        'isShow': {
            handler (o, v) {
                if (o && this.isAutoClose) {
                    this.toastFn()
                }
            }
        }
    },
    methods: {
        init () {},
        toastFn () {
            this.timer = setTimeout(() => {
                this.$emit('setIsShow', false)
            }, this.timeout)
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
.textTipsBox{
    position: absolute;
    >div{
        background: rgba($color: #000000, $alpha: .7); padding: 10px; display: flex; justify-content: center; align-items: center; color: #fff; font-size: 12px; min-width: 300px; min-height: 80px; border-radius: 5px;
    }
}

</style>