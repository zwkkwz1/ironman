import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import imageUpload from '@/components/order-admin'
import sysConfig from '@/components/sys-config'
import sysGroup from '@/components/sys-config-group'
import commodityAdmin from '@/components/commodity-admin'
import commodityClassification from '@/components/commodity-classification'
import userPoints from '@/components/user-points'
import userExperience from '@/components/user-experience'
import order from '@/components/order'
import information from '@/components/consult'
import pointsRuleConf from '@/components/points-rule-conf'
import userGroup from '@/components/user-group'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/image-upload',
      name: '图片管理',
      component: imageUpload
    },
    {
      path: '/sys-config',
      name: '数据字典管理',
      component: sysConfig
    },
    {
      path: '/sys-group',
      name: '数据字典分类管理',
      component: sysGroup
    },
    {
      path: '/commodity-admin',
      name: '商品管理',
      component: commodityAdmin
    },
    {
      path: '/commodity-classification',
      name: '商品分类管理',
      component: commodityClassification
    },
    {
      path: '/user-points',
      name: '积分历史',
      component: userPoints
    },
    {
      path: '/user-experience',
      name: '经验值历史',
      component: userExperience
    },
    {
      path: '/order',
      name: '订单管理',
      component: order
    },
    {
      path: '/information',
      name: '资讯管理',
      component: information
    },
    {
      path: '/points-rule-conf',
      name: '积分规则管理',
      component: pointsRuleConf
    },
    {
      path: '/user-group',
      name: '用户组管理',
      component: userGroup
    }
  ]
})
