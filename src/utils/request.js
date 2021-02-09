import axios from 'axios'
import { Message } from 'element-ui'
import ajaxUrl from '@/ajaxUrl'
import store from '@/store'
import Qs from 'qs'
const service = axios.create({  //创建axios实例
  baseURL: '', // url = base url + request url
  transformRequest:[function(data,headers){     //content-type: text/html; charset=utf-8，防止后台接收不到数据  -- https://www.cnblogs.com/yiyi17/p/9409249.html
    return Qs.stringify(data)
  }],
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 50000 // request timeout
})
let promiseList = [];   //当前正在请求的地址列表(防止同时发送相同的请求-如果当前请求地址在数组中存在，则不再发送此请求)

// request interceptor  请求拦截器
service.interceptors.request.use(
  config => {
    let token = sessionStorage.getItem('token');
    if(token){
      config.headers.Authorization = 'Bearer ' + token;
    }
    // do something before request is sent
    // config.data['appcode'] = appcode;
    // config.data['key'] = sessionStorage.getItem("key") || "";
    return config
  },
  error => {
    // do something with request error
    return Promise.reject(error)
  }
)
// response interceptor 响应拦截器=================================luochulei damajiang le
service.interceptors.response.use(
  response => {
    const res = response.data;
    return Promise.resolve(res);
    // if(res.code == 1){
    //   return Promise.resolve(res)
    // }else{
    //   return Promise.reject("error:" + res.message)
    // }
  },
  async (error) => {
      let errRes = error.response.data.errors;
      let msg = "";
      if(errRes){
        msg = Object.keys(errRes).map((item)=>{return errRes[item]}).join(',');
      }else{
        msg = error.response.data.message;
      }
      Message({
        message: msg,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(error.response);
  }
)

function requestData(_url,data={},method='post'){
  if(method === 'get'){
    return service({
      url: _url,
      method: method,
      params:data
    })
  }else{
    return service({
      url: _url,
      method: method,
      data:data
    })
  }
}

export default requestData
