<!--
  表格
-->
<template>
    <div class="tableBoxWrap">
        <div class="listBox" ref="tableBox">
            <div class="tableBox" :style="'height:'+height+'px'" :class="{notBorder:len==0}">
                <slot ref="innerHei"></slot>
            </div>
        </div>
        <pagination :paginationObj="paginationObj" @goJumpPage="goJumpPage" />
    </div>
</template>
<script>
// import api from '@/apis/tajiApi.js'
import pagination from '@/components/pagination'
export default {
    name: 'tableBox',
    components: {
        pagination
    },
    props: {
        len: {
            type: Number,
            default: 0
        },
        paginationObj: {
            type: Object,
            default: {}
        }
    },
    data () {
        return {
            height: ''
        }
    },
    watch: {
        len: function (n, o) {
            if (n != o) {
                this.init()
            }
        }
    },
    computed: {},
    methods: {
        init () {
            this.getStyleHei()
        },
        getStyleHei () {
            let ele = this.$refs.tableBox
            if (ele && ele.offsetHeight) {
                this.$nextTick(() => {
                    setTimeout(() => {
                        let notHei = 0
                        if (ele.querySelector('.el-table .el-table__empty-block') && ele.querySelector('.el-table .el-table__empty-block').offsetHeight) {
                            notHei = ele.querySelector('.el-table .el-table__empty-block').offsetHeight
                        }
                        let eleInner = ele.querySelector('.el-table .el-table__header-wrapper').offsetHeight + ele.querySelector('.el-table .el-table__body').offsetHeight + notHei + 2
                        let outHeight = ele.offsetHeight
                        this.height = Math.min(eleInner, outHeight)
                    }, 500)
                })
            }
        },
        goJumpPage (e) {
            this.$emit('goJumpPageFn', e)
        }
    },
    mounted () {
        this.init()
    },
    created () {},
    destroyed () {}
}
</script>

<style lang="scss">
.notBorder{
    .el-table{
        border: 0;
    }
    .el-table::before,.el-table::after{
        height: 0;
    }
}
.listBox{
     margin-bottom: 16px;
}
.detailInnerBox{
    .tableBox .el-table td, .tableBox .el-table th{
        padding: 6px 0;
    }
    .detailTableBox .el-table th, .detailTableBox .el-table tr, .detailTableBox .el-table thead.is-group th{
        background-color: #142f57;
    }
    .tableBox .el-table--enable-row-transition .el-table__body td, .tableBox .el-table tbody tr{
        background: none;
    }
}
.detailTableBox{
    display: flex; flex-direction: column; flex: 1;
    .is-group tr th:last-child,.has-gutter tr th.is-hidden{
        border-right: 0;
    }
    .el-table th, .el-table tr,.el-table thead.is-group th{
        background: none;
    }
    .el-table tbody tr:hover td{
        background: none;
    }
    .el-table td, .el-table th.is-leaf, .el-table--border, .el-table--group{
        border-right: 1px;
    }
}
.tableBox{
    display: flex; flex-direction: column; max-width: 100%;
    .el-table--enable-row-hover .el-table__body tr:hover>td{
        background: none;
    }
    .notBorder{
        border-right: 0!important;
    }
    .el-table__fixed-right-patch{
        display: none;
    }
    .el-table--border tr:first-child th.gutter:last-of-type{
        border-color: transparent;
    }
    .el-table--border th.gutter:last-of-type{
        border-color: #214276; width: 4px!important;
    }
    .el-table--border th{
        border: 0;
    }
    .el-table thead th{
        color: #6d84ae;
    }
    .el-table tr{
        color: #fff;
    }
    .el-table thead th,.el-table__fixed-right-patch{
        background-color: #183868;
    }
    .el-table--enable-row-transition .el-table__body td,.el-table tbody tr{
        background-color: #08244e; border-color: #214276;
    }
    .el-checkbox__inner{
        background: none;
    }
    .el-table__fixed-right{
        right: 4px!important;
    }
    .el-table--border::after, .el-table--group::after, .el-table::before,.el-table__fixed-right::before, .el-table__fixed::before{
        background-color: #214276; z-index: 23;
    }
    .el-table td, .el-table th{
        padding: 11px 0;
    }
    .el-table td, .el-table th.is-leaf,.el-table--border, .el-table--group{
        border-color: #214276; border-right-style: dashed;
    }
    .el-table--border{
        border-right: none;
    }
    .el-table{
        flex: 1; background: none;
    }
}
.detailTableBox{
    .el-table--border th{
        border-bottom: 1px dashed #214276; border-right: 1px dashed #214276;
    }
}
</style>
<style lang="scss" scoped>
.tableBoxWrap{
    flex: 1; display: flex; flex-direction: column;
}
</style>