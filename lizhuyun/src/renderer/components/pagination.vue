<!--
通用分页
    paginationObj:分页相关字段
    
-->
<template>
 <!-- v-if="Math.ceil(paginationObj.total/paginationObj.oncePageTotal)>1" -->
    <div class="paginationBox">
        <div class="paginationLeftBox">
            <span class="iconFont" @click="firstFn">&#xe646;</span>
            <span class="iconFont" @click="prevFn">&#xe628;</span>
            <span class="iconFont" @click="nextFn">&#xec14;</span>
            <span class="iconFont" @click="lastFn">&#xe650;</span>
            <p>
                <span>{{paginationObj.total>0?paginationObj.currentPage:0}}</span> / {{Math.ceil(paginationObj.total/paginationObj.oncePageTotal)}}页
            </p>
            <p>跳转到 <input type="number" v-model="goNumberPage" @keyup="getCurrentPage"> 页</p>
            <span @click="goJumpPage">GO</span>
        </div>
        <div class="paginationRightBox">共{{paginationObj.total}}条记录</div>
        <textTips :text="text" :isShow="isShow" @setIsShow='setIsShow' />
    </div>
</template>
<script>
import textTips from './textTips'
export default {
    name: 'pagination',
    components: {
        textTips
    },
    props: {
        paginationObj: {
            type: Object,
            default: {}
        }
    },
    data () {
        return {
            text: '',
            isShow: false,
            goNumberPage: ''
        }
    },
    methods: {
        init () {},
        lastFn () {
            let num = Math.ceil(this.paginationObj.total / this.paginationObj.oncePageTotal)
            this.goPage(num)
        },
        nextFn () {
            let num = this.paginationObj.currentPage * 1 + 1
            if (num > Math.ceil(this.paginationObj.total / this.paginationObj.oncePageTotal)) {
                this.text = '已经是最后一页啦'
                this.isShow = true
                return false
            }
            this.goPage(num)
        },
        prevFn () {
            let num = this.paginationObj.currentPage - 1
            if (num < 1) {
                this.text = '已经是第一页啦'
                this.isShow = true
                return false
            }
            this.goPage(num)
        },
        firstFn () {
            this.goPage(1)
        },
        goPage (num) {
            this.goNumberPage = num
            this.$emit('goJumpPage', num)
        },
        goJumpPage () {
            if (this.goNumberPage == this.paginationObj.currentPage) {
                this.text = '您已经在当前页啦'
                this.isShow = true
                return false
            }
            this.goPage(this.goNumberPage)
        },
        setIsShow (e) {
            this.isShow = e
        },
        getCurrentPage () {
            let num = this.goNumberPage
            if (num < 1) {
                this.text = '分页数据不能小于1'
                this.isShow = true
                this.goNumberPage = ''
            }
            if (num > Math.ceil(this.paginationObj.total / this.paginationObj.oncePageTotal)) {
                this.text = '分页数据不能大于总页数'
                this.isShow = true
                this.goNumberPage = ''
            }
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
.paginationLeftBox{
    display: flex; justify-content: flex-start; align-items: center;
    >p{
        margin-right: 28px; display: flex; justify-content: center; align-items: center;
        >input{
            width: 26px; height: 22px; display: flex; justify-content: center; align-items: center; border: 1px solid #435472; border-radius: 3px; color: #09f; margin: 0 5px; text-align: center;
        }
        >span{
            color: #75ddff;
        }
    }
    >span{
        width: 26px; height: 22px; display: flex; justify-content: center; align-items: center; border: 1px solid #435472; border-radius: 3px; margin-right: 20px; color: #09f; cursor: pointer; font-size: 22px;
    }
    >span:last-child{
        font-size: 16px;
    }
}
.paginationBox{
    display: flex; justify-content: space-between; align-items: center; font-size: 14px; color: #fff; height: 22px;
}
</style>