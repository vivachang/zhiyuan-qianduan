import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

// import Layout from '@/views/layout/Layout'
/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
    {
        path: '/login',
        component: () => import('@/views/login/index'),
        hidden: true
    },
    {
        path: '/404',
        component: () => import('@/views/404'),
        hidden: true
    },
    {
        path: '/',
        component: Layout,
        redirect: 'home',
        children: [
            {
                path: 'home',
                component: () => import('@/views/home/index'),
                name: 'Home',
                meta: { title: '首页', icon: 'index', noCache: true },
            },
            {
                path: 'msgCenter',
                component: () => import('@/views/home/msgCenter'),
                name: 'msgCenter',
                hidden: true,
                meta: { title: '消息中心', icon: 'index', noCache: true },
            }
        ]
    },
    {
        path: '/large',
        // component:Layout,
        component: () => import('@/views/largeSize/largeLayout'),
        name: 'large',
        redirect: 'noRedirect',
        hidden: true,
        meta: {
            title: '大屏',
            icon: 'financial'
        },
        children: [
            {
                path: 'index',
                component: () => import('@/views/largeSize/index'),
                name: 'largeIndex',
                hidden: false,
                meta: { title: '大屏首页', noCache: true, hideNav: true }
            },
            {
                path: 'largeWarningDetail',
                component: () => import('@/views/largeSize/largeWarningDetail'),
                name: 'largeWarningDetail',
                hidden: false,
                meta: { title: '预警警报详情', noCache: true, hideNav: true }
            },
            {
                path: 'estimatedDetail/:id',
                component: () => import('@/views/largeSize/estimatedDetail'),
                name: 'estimatedDetail',
                hidden: false,
                meta: { title: '预估值详情', noCache: true, hideNav: true }
            },
            {
                path: 'areaDetail/:id',
                component: () => import('@/views/largeSize/areaDetail'),
                name: 'areaDetail',
                hidden: false,
                meta: { title: '监测点详情', noCache: true, hideNav: true }
            },
            {
                path: 'dataComparison/:id',
                component: () => import('@/views/largeSize/dataComparison'),
                name: 'dataComparison',
                hidden: false,
                meta: { title: '监测点数据对比', noCache: true, hideNav: true }
            }
        ]
    },

    {
        path: '/largeSmallIndex',
        component: () => import('@/views/largeSmallSize/index'),
        name: 'largeSmallSizeIndex',
        meta: {
            title: '大屏',
            icon: 'financial'
        },
        hidden: true,
        redirect: '/smallMain',
        children: [
            {
                path: '/smallMain',
                component: () => import('@/views/largeSmallSize/smallMain'),
                name: 'smallMain'
            },
            {
                path: '/smallMonitor',
                component: () => import('@/views/largeSmallSize/smallMonitor'),
                name: 'smallMonitor'
            },
            {
                path: '/smallMonitorDetails',
                component: () => import('@/views/largeSmallSize/smallMonitorDetails'),
                name: 'smallMonitorDetails'
            },
        ]
    },

    {
        path: '/redirect',
        component: Layout,
        hidden: true,
        children: [
            {
                path: '/redirect/:path*',
                component: () => import('@/views/redirect/index')
            }
        ]
    },
    // 404 page must be placed at the end !!!
    // { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router
