// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// 刷新网页进入页面之后运行
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import config from '@/components/config'
import FileUpload from 'vue-upload-component/src'

/* ...there may be other imports here */
// const VueUploadComponent = require('vue-upload-component')
Vue.config.productionTip = false
Vue.component('file-upload', FileUpload)

Vue.prototype.axios = axios
// 设置默认请求头，以及host
axios.defaults.baseURL = 'http://192.168.0.242:8280'
axios.defaults.headers.post['AppType'] = axios.defaults.headers.get['AppType'] = 'web'
axios.defaults.headers.post['Appid'] = axios.defaults.headers.get['Appid'] = 'ironman'
let accessToken = config.getCookie('accessToken')
axios.defaults.headers.get['accessToken'] = axios.defaults.headers.post['accessToken'] = accessToken
// 获取

// 注册一个全局自定义指令 v-focus
Vue.directive('focus', {
  // 当绑定元素插入到 DOM 中。
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})
// 注册一个全局自定义用于元素可拖拽的指令
Vue.directive('drag', {
  inserted: function (el) {
    // 聚焦元素
    el.onmousedown = function (ev) {
      var x = ev.pageX - el.offsetLeft
      var y = ev.pageY - el.offsetTop
      document.onmousemove = function (ev) {
        var l = ev.pageX - x
        var t = ev.pageY - y
        el.style.left = l + 'px'
        el.style.top = t + 'px'
      }
      document.onmouseup = function () {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
