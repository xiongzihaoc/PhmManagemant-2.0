import Vue from 'vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 导入弹框组件
import {Message} from 'element-ui'
Vue.use(Element)

// 全局弹框
Vue.prototype.$message = Message
