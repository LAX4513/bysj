import Vue from 'vue'
// 导入 ElementUI 组件库
import ElementUI from 'element-ui'
// 导入 ElementUI 组件库 的样式
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from './router'

import './common/request'

// 引入公用样式
import '@/assets/style/index.less'

import myPlugin from '@/components/plugin'
Vue.use(myPlugin)

// 把ElemenUI加入 到 Vue插件 中，这样就可以 直接使用了
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
