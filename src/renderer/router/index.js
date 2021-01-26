import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: require('@/components/Home').default
    },
    {
      path: '/ChildProcess',
      name: 'ChildProcess',
      component: require('@/components/sys/ChildProcess').default
    },
    // {
    //   path: '/excel/ExcelToJson',
    //   name: 'ExcelToJson',
    //   component: require('@/components/excel/ExcelToJson').default
    // },
    // {
    //   path: '/pdf/PicToPdf',
    //   name: 'PicToPdf',
    //   component: require('@/components/pdf/PicToPdf').default
    // },
    // {
    //   path: '/404',
    //   name: 'cmp404',
    //   component: require('@/components/common/cmp404').default
    // },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
