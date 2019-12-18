import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import FastClick from 'fastclick'
import VueLazyLoad  from 'vue-lazyload'

import toast from './components/common/toast'

Vue.config.productionTip = false

Vue.prototype.$bus = new Vue()

// 安装使用toast
Vue.use(toast)

//使用懒加载的插件
// Vue.use(VueLazyLoad)
Vue.use(VueLazyLoad,{
  loading:require('./assets/images/common/placeholder.png')
  // loading:'./assets/images/common/placeholder.png'
})

//解决移动端300ms延迟
FastClick.attach(document.body)

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
