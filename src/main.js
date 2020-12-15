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
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)
import '../public/UEditor/ueditor.config.js'
import '../public/UEditor/ueditor.all.js'
// import '../public/UEditor/ueditor.all.min.js'
import '../public/UEditor/lang/zh-cn/zh-cn.js'
import '../public/UEditor/ueditor.parse'
import '../public/UEditor/themes/default/css/ueditor.css'
// 引用svg图标
import svg from 'vue-svg-icon/Icon'
Vue.component('svg-icon', svg);
// 引入md5加密
import md5 from 'js-md5'
Vue.prototype.$md5 = md5
import animated from 'animate.css' // npm install animate.css --save安装，在引入
Vue.use(animated)
// 导入axios
import axios from 'axios'
// 引入animate动画库

// 配置axios
// 测试地址
axios.defaults.baseURL = 'http://192.168.0.107:8085/zhuoya-web/'
// 正式地址
// axios.defaults.baseURL = 'http://www.phmzykj.com/zhuoya-web/'
axios.defaults.timeout = 30000
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
  return config
}, function (error) {
  console.log(error)
})
// 全局挂载axios this.$http调用即可
Vue.prototype.$http = axios
// 测试地址
Vue.prototype.$ajax = 'http://192.168.0.107:8086/zhuoya-sheet/'
// 正式地址
// Vue.prototype.$ajax = 'http://www.phmzykj.com/zhuoya-sheet/'
// 文件上传地址
Vue.prototype.UPLOAD_IMG = 'http://www.phmzykj.com/zhuoya_manager/oss/fileUpload.do'
Vue.prototype.SHEET_IMG = 'http://www.phmzykj.com/zhuoya-sheet/upload'

Vue.config.productionTip = false

// 弹框拖拽功能
import './assets/js/directives.js'
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')