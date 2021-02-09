import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'

import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import BaiduMap from 'vue-baidu-map'
import '@/icons' // icon
import '@/permission' // permission control

import "@/utils/flexible.js";

import * as filters from './filters' // global filters

// import mixin from '@/mixins'


import ajaxUrl from '@/ajaxUrl';
import { publicObj } from '@/config.js'
/**
 * If you don't want to use mock-server
 * you want to use mockjs for request interception
 * you can execute:
 *
 * import { mockXHR } from '../mock'
 * mockXHR()
 */

// set ElementUI lang to EN
// Vue.prototype.$echarts = echarts
Vue.use(ElementUI);

Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: 'AVVlbFF6Rv5F4Hf4sV6Klf1wyBltIfFo'
});
Vue.prototype.ajaxUrl = ajaxUrl;    //接口列表
Vue.prototype.publicObj = publicObj;  //公用状态字段

// 过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
});
// 自定义指令 -- 按钮权限
Vue.directive('btnRole',{
  inserted:function(el,binding){
    let roleList = store.getters.roleList;
    // console.log(el,binding.value,store.getters.roleList);
    if(typeof binding.value === 'string'){
      let roleIds = binding.value.split(',').map((item)=>{return Number(item)});
      let isShow = roleIds.some((item)=>{
        return roleList.includes(item)
      })
      if(!isShow){
        el.parentNode.removeChild(el);
      }
    }else{
      if(!roleList.includes(binding.value)){
        el.parentNode.removeChild(el);
      }
    }
  }
})

// 防抖 
Vue.directive('preventReClick',{
    inserted: function (el, binding) {
      el.addEventListener('click', () => {
        let pointerEvents = el.style.pointerEvents;
        if (pointerEvents!="none") {
            el.style.pointerEvents = 'none';
            setTimeout(() => {
              el.style.pointerEvents = 'auto';
            }, binding.value || 3000)
        }
      })
  }
})

// 混入 - 暂时没用到
// Vue.mixin(mixin);
Vue.config.productionTip = false;
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
// setTimeout(()=>{
  // console.log(store.getters.roleList,22222222)
// },1000)
