import request from '@/utils/request'
import ajaxUrl from '@/ajaxUrl/index.js'

export function getInfo() {
  return request(ajaxUrl.userInfo,{},'get');
}

export function getAuthority(){
  return request(ajaxUrl.authority,{},'get');
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function getDictionary(){
  return request(ajaxUrl.dictionaryList,{page:1,pageSize:99999},'get');
}
