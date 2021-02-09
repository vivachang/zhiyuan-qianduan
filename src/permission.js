import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { isLogin } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

import { filterRouter } from '@/utils/tool.js'
import { dev } from '@/config'
import asyncRouter from '@/router/asyncRouterMap'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
	// start progress bar
	NProgress.start()

	// set page title
	document.title = getPageTitle(to.meta.title)

	// determine whether the user has logged in
	const hasLogin = isLogin()

	// if (hasToken) {
	if (hasLogin) {
		if (to.path === '/login') {
			next({ path: '/' })
			NProgress.done()
		} else {
			if (dev != 'bd') {	//不是本地环境 验证权限
				//获取该账号对应的权限列表
				if (!store.getters.is_get_authority) {		//判断是否获取过权限(刷新页面重新获取) -- true 获取过， false 未获取
					// console.log("刷新页面")
					try{
						const authority = await store.dispatch('user/getAuthority');	//获取权限列表
						// await store.dispatch('user/getInfo');		//获取用户信息
						await store.dispatch('user/getDictionary');	//获取数据字典列表
						store.commit('user/SET_IS_GET_AUTHORITY', true);		//将标识是否获取过权限 设置为true
						const resultRole = authority.data.map((item)=>{return item.id});
						store.commit("user/SET_ROLElIST", resultRole);		//将后台返回的权限列表存入store
						const resultRouter = filterRouter(asyncRouter,resultRole);
						// console.log(resultRouter,'筛选后的路由');
						// router.addRoutes(asyncRouter) // 动态添加可访问路由表
						router.addRoutes(resultRouter) // 动态添加可访问路由表
						store.commit("user/SET_ROUTERS", resultRouter)		//将筛选出来的路由  加入路由表
						// store.commit("user/SET_ROUTERS", asyncRouter)		//将筛选出来的路由  加入路由表
						return next({ path: to.path ,query:to.query})		//结束此次跳转进程，进入下一次跳转
					}catch(err){
						console.log('获取权限列表错误',err);
						sessionStorage.clear();
						return next({path:'/'});
					}
				} else {
					next();
				}
			} else {	//本地环境 不验证权限
				if (!store.getters.is_get_authority) {
					store.commit('user/SET_IS_GET_AUTHORITY', true);
					// console.log(store.getters.is_get_authority)
					router.addRoutes(asyncRouter) // 动态添加可访问路由表
					store.commit("user/SET_ROUTERS", asyncRouter)		//将权限路由全部  加入路由表
					return next({ path: to.path ,query:to.query})		//结束此次跳转进程，进入下一次跳转
				} else {
					next();
				}
			}
		}
	} else {
		/* 未登录*/

		if (whiteList.indexOf(to.path) !== -1) {
			// in the free login whitelist, go directly
			next()
		} else {
			// other pages that do not have permission to access are redirected to the login page.
			next(`/login?redirect=${to.path}`)
			NProgress.done()
		}
	}
})

router.afterEach(() => {
	// finish progress bar
	NProgress.done()
})
