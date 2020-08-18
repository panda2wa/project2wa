import Vue from 'vue'
import Router from 'vue-router'
import index from '@/pages/index/index.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: require('@/pages/login/login').default
    },
    {
      path: '',
      name: 'index',
      component: index,
      children: [
        {
          path: '/home',
          name: 'home',
          component: require('@/pages/index/home/home').default
        },
        {
          path: '',
          name: 'shishishipin',
          component: require('@/pages/shipinjiankong/index.vue').default,
          children: [
            {
              path: '/shipin_shebeizhuangtai',
              name: 'shipin_shebeizhuangtai',
              component: require('@/pages/shipinjiankong/pages/shipin_shebeizhuangtai').default
            },
            {
              path: '/shipin_lishijilu',
              name: 'shipin_lishijilu',
              component: require('@/pages/shipinjiankong/pages/shipin_lishijilu').default
            },
            {
              path: '/toupingshezhi',
              name: 'toupingshezhi',
              component: require('@/pages/shipinjiankong/pages/toupingshezhi').default
            },
            {
              path: '/shipinjietu',
              name: 'shipinjietu',
              component: require('@/pages/shipinjiankong/pages/shipinjietu').default
            },
            {
              path: '/shishishipin',
              name: 'shishishipin',
              component: require('@/pages/shipinjiankong/pages/shishishipin').default
            }
          ]
        },
        {
          path: '',
          name: 'yangchen',
          component: require('@/pages/yangchen/index.vue').default,
          children: [
            {
              path: '/chaobiaoshezhi',
              name: 'chaobiaoshezhi',
              component: require('@/pages/yangchen/pages/chaobiaoshezhi').default
            },
            {
              path: '/lishishuju_detail',
              name: 'lishishuju_detail',
              component: require('@/pages/yangchen/pages/lishishuju_detail').default
            },
            {
              path: '/lishishuju',
              name: 'lishishuju',
              component: require('@/pages/yangchen/pages/lishishuju').default
            },
            {
              path: '/shishishuju',
              name: 'shishishuju',
              component: require('@/pages/yangchen/pages/shishishuju').default
            },
            {
              path: '/chaobiaozhenggai',
              name: 'chaobiaozhenggai',
              component: require('@/pages/yangchen/pages/chaobiaozhenggai').default
            },
            {
              path: '/chaobiaoshezhi',
              name: 'chaobiaoshezhi',
              component: require('@/pages/yangchen/pages/chaobiaoshezhi').default
            }
          ]
        },
        {
          path: '',
          name: 'taji',
          component: require('@/pages/taji/index.vue').default,
          children: [
            {
              path: '/xingweiweizhang',
              name: 'xingweiweizhang',
              component: require('@/pages/taji/pages/xingweiweizhang').default
            },
            {
              path: '/shishishitu',
              name: 'shishishitu',
              component: require('@/pages/taji/pages/shishishitu').default
            },
            {
              path: '/dingshengjilu',
              name: 'dingshengjilu',
              component: require('@/pages/taji/pages/dingshengjilu').default
            },
            {
              path: '/gongzuoxunhuan',
              name: 'gongzuoxunhuan',
              component: require('@/pages/taji/pages/gongzuoxunhuan').default
            },
            {
              path: '/shishishituDetail',
              name: 'shishishituDetail',
              component: require('@/pages/taji/pages/shishishituDetail').default
            },
            {
              path: '/guzhangbaojing',
              name: 'guzhangbaojing',
              component: require('@/pages/taji/pages/guzhangbaojing').default
            }
          ]
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
