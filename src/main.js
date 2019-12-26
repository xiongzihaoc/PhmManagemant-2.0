import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/store/index';
// 全局css
import './assets/css/global.css'
import './plugins/element.js'
// nprogress 请求进度条导入
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
// 导入字体图表图标
import './assets/iconfont/iconfont.css'
// 引入md5加密
import md5 from 'js-md5';
Vue.prototype.$md5 = md5;
// 导入axios
import axios from 'axios'
// 配置axios
axios.defaults.baseURL = 'http://192.168.0.105:8085/zhuoya-web/'
// axios请求拦截器
axios.interceptors.request.use(function (config) {
  Nprogress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
}, function (error) {
  console.log(error);
})
// axios响应拦截器
axios.interceptors.response.use(function (config) {
  if (config.status != 200) return this.$message.error('服务器异常')
  Nprogress.done()
  return config;
}, function (error) {
  console.log(error)
})
// 全局挂载axios this.$http调用即可
Vue.prototype.$http = axios
// 文件上传地址
Vue.prototype.UPLOAD_IMG = 'http://test.phmzykj.com/zhuoya_manager/oss/fileUpload.do'
Vue.config.productionTip = false

// 弹框拖拽功能
import './assets/js/directives.js'
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')