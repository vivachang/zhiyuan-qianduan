import { logout, getInfo, getAuthority, getDictionary } from '@/api/user'
import { getToken, removeToken } from '@/utils/auth'
import { resetRouter ,constantRoutes} from '@/router'

const state = {
	token: getToken(),
	name: '',
	admin_detail: {},
	is_get_authority:false,
	routers:[],			//筛选后的路由列表
	role_list:[],		//权限列表
	dictionaryList:[],		//数据字典列表
}

const mutations = {
	SET_TOKEN: (state, token) => {
		state.token = token
	},
	SET_NAME: (state, name) => {
		state.name = name
	},
	SET_ADMIN_DETAIL: (state, admin_detail) => {  //将登陆者详细信息存入store
		state.admin_detail = admin_detail
	},
	SET_IS_GET_AUTHORITY:(state,bool) => {  //判断用户是否获取过权限
		state.is_get_authority = bool
	},
	SET_ROUTERS:(state,routers)=>{
		state.routers = constantRoutes.concat(routers)
	},
	SET_ROLElIST:(state,role_list)=>{
		state.role_list = role_list;
	},
	LOGOUT:(state)=>{
		state.role_list = [],
		state.routers = [];
		state.admin_detail = {}
	},
	SET_DICTIONART:(state, list)=>{
		state.dictionaryList = list;
	}
}

const actions = {

	  //获取登录用户详细信息
	getInfo({ commit, state }) { 
		return new Promise((resolve, reject) => {
			getInfo().then(response => {
				commit('SET_ADMIN_DETAIL',response);
				resolve(response);
			}).catch(error => {
				reject(error)
			})
		})
	},
	  //获取登录用户 权限列表
	getAuthority({ commit, state }) {
		return new Promise((resolve, reject) => {
			getAuthority().then((res) => {
				resolve(res);
			}).catch(error => {
				reject(error);
			})
		})
	},
	// 获取数据字典列表
	getDictionary({ commit, state }){
		return new Promise((resolve, reject) => {
			getDictionary().then(response => {
				commit('SET_DICTIONART',response.data);
				resolve(response);
			}).catch((err)=>{
				reject(err)
			})
		})
	},
	// user logout
	logout({ commit, state }) {
		return new Promise((resolve, reject) => {
			logout(state.token).then(() => {
				commit('SET_TOKEN', '')
				removeToken()
				resetRouter()
				resolve()
			}).catch(error => {
				reject(error)
			})
		})
	},

	// remove token
	resetToken({ commit }) {
		return new Promise(resolve => {
			commit('SET_TOKEN', '')
			removeToken()
			resolve()
		})
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}

