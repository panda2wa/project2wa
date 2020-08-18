<!--用户信息-->
<template>
    <div class="porjectBox rel">
        <span class="lineBgTop abs"></span>
        <span class="lineBgBom abs"></span>
        <dl class="moreProject" v-if="isMore">
            <dt>施工信息</dt>
            <dd>
                <div>
                    <span class="iconFont">&#xe616;</span>
                    <div>
                        <span>建筑面积</span>
                        <p>{{projectInfo.floorage}} ㎡</p>
                    </div>
                </div>
                <div>
                    <span class="iconFont">&#xe612;</span>
                    <div>
                        <span>在建项目</span>
                        <p>{{projectInfo.building}} 个</p>
                    </div>
                </div>
            </dd>
            <dd>
                <div>
                    <span class="iconFont">&#xe615;</span>
                    <div>
                        <span>信息化搭建项目</span>
                        <p>{{projectInfo.djPoject}} 个</p>
                    </div>
                </div>
                <div>
                    <span class="iconFont">&#xe610;</span>
                    <div>
                        <span>信息化未搭建项目</span>
                        <p>{{projectInfo.wdjPoject}} 个</p>
                    </div>
                </div>
            </dd>
        </dl>
        <dl class="onceProject" v-else>
            <dt>项目信息</dt>
            <dd>
                <p>
                    <span class="iconFont">&#xe612;</span>
                    项目名称
                </p>
                <div>{{projectInfo.project_name}}</div>
            </dd>
            <dd>
                <p>
                    <span class="iconFont">&#xe66e;</span>
                    项目地址
                </p>
                <div>{{projectInfo.project_adr}}</div>
            </dd>
            <dd>
                <p>
                    <span class="iconFont">&#xe616;</span>
                    建筑面积
                </p>
                <div>{{projectInfo.floorage}} ㎡</div>
            </dd>
            <dd>
                <p>
                    <span class="iconFont">&#xe609;</span>
                    项目经理
                </p>
                <div>{{projectInfo.manager}}</div>
            </dd>
            <dd>
                <p>
                    <span class="iconFont">&#xe62c;</span>
                    项目经理电话
                </p>
                <div>{{projectInfo.manager_phone}}</div>
            </dd>
            <dd>
                <p>
                    <span class="iconFont">&#xe68c;</span>
                    开工时间
                </p>
                <div>{{projectInfo.start_date}}</div>
            </dd>
            <dd>
                <p>
                    <span class="iconFont">&#xe63a;</span>
                    拟竣工时间
                </p>
                <div>{{projectInfo.end_date}}</div>
            </dd>
        </dl>
    </div>
</template>
<script>
import api from '@/apis/homeApi.js'
export default {
  name: 'projectInfo',
  props: {
      isMore: {
          type: Boolean,
          default: false
      }
  },
  data () {
    return {
        projectInfo: {}
    }
  },
  methods: {
    init () {
        this.projectId = this.$store.getters.getProjectIDs
        this.getProjectInfoById()
    },
    getProjectInfoById () {
        let id = this.projectId
        let questData = {
            projectId: ''
        }
        if (id) {
            questData = {
                projectId: id
            }
        }
        api.getProjectInfoById(questData).then(res => {
            if (res.code == 200) {
                this.projectInfo = res.result.projectInfo
            }
        }).catch(err => {
            console.error('请求项目信息出错', err)
        })
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
.onceProject{
    padding: 10px; font-size: 16px; line-height: 20px; color: #fff;
    dt{
        font-size: 22px; text-align: center; padding-bottom: 20px; line-height: 22px;
    }
    dd{
        margin-top: 19px; display: flex; justify-content: flex-start; align-items: flex-start;
        p{
            display: flex; justify-content: flex-start; align-items: center; color: #6d84ae; font-size: 14px; width: 145px;
            .iconFont{
                font-size: 24px; margin-right: 8px;
            }
        }
        >div{
            height: 40px; flex: 1;
        }
    }
}
.moreProject{
    padding: 10px 30px 25px; font-size: 12px; color: #c2dafa;
    dt{
        color: #fff; font-size: 22px; text-align: center;
    }
    dd{
        display: flex; justify-content: space-between; align-items: flex-start; margin-top: 21px;
        >div{
            display: flex; justify-content: flex-start; align-items: flex-start; width: 40%;
            .iconFont{
                font-size: 24px; margin-right: 5px;
            }
            p{
                font-size: 20px; margin-top: 5px;
            }
        }
    }
}
.porjectBox{
    background-color: rgba($color: #009fc7, $alpha: .05);
}
@media screen and ( max-width: 1400px ) {
    
}
@media screen and ( max-width: 1280px ) {
    
}
</style>