import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

export function getToken() {
	return sessionStorage.getItem('token');
}
export function isLogin(){
	return sessionStorage.getItem("token");
}

export function setToken(token) {
	return sessionStorage.setItem('token', token)
}

export function removeToken() {
	return Cookies.remove(TokenKey)
}

