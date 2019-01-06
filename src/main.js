// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import moment from 'moment'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Http from '@/plugins/http.js'
import '@/assets/index.css'
import MyBread from '@/components/cusBread.vue'

Vue.use(Http)
Vue.use(ElementUI)
// 全局过滤器
Vue.filter('fmDate', (v) => {
  return moment(v).format('YYYY-MM-DD')
})
// 注册全局对象
Vue.component(MyBread.name, MyBread)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
