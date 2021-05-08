// 对 axios 做 二次 封装
/*
  封装的目的 是为了解决 痛点的：
  1. 不用 每次 请求的时候，都要 导入 axios
  2. 请求 的 url 地址， 想基地址只写一次
*/

import Vue from 'vue'
import axios from 'axios'
import router from '@/router'
import { Message } from 'element-ui'
import JSONBIG from 'json-bigint'
// 创建 axios 实例，创建的 这个 实例 与 axios 功能、用法 完全 一样

// 文件     http://xxx.com
// 购物车   http://aaa.com
const instance = axios.create({
  // 基地址
  baseURL: 'http://api-toutiao-web.itheima.net',
  // 设置 超时  时间 ，5000毫秒
  timeout: 5000,
  // 转换响应数据格式(覆盖默认转换方式) transformResponse执行 ===> 响应拦截器  ===>  then和catch
  transformResponse: [data => {
    // data 其实就是原始的json字符串，删除的时候后台无响应，data === null
    try {
      const jsonObject = JSONBIG.parse(data)
      return jsonObject
    } catch (e) {
      return data
    }
  }]
})

// 请求拦截器  所有请求 发出去 之后 必须 经过 请求 拦截器，才能 到达 服务器
instance.interceptors.request.use(config => {
  // 在这里 做 统一 的 token 处理
  // 1. 先 取出 token
  const token = window.localStorage.getItem('token')
  if (token) {
    // 2. 在请求头中 携带 给 后端
    config.headers.Authorization = `Bearer ${token}`
  }
  // 必须 return 出去，这个 请求 才能 发给 后端，否则 传不过去
  return config
})

// 响应拦截器，所有的响应结束会经过这个拦截器
instance.interceptors.response.use(res => res, err => {
  // 对响应错误做点什么，如果是401状态码跳转登录页面
  if (err.response && err.response.status === 401) {
    // 清除无效token
    window.localStorage.removeItem('token')
    // 跳转登录页面
    // this.$router.push('/login') 通过vue实例调用router对象的push进行跳转
    // 这里的this不是vue实例，但是可以想办法拿到router对象，去调用push进行跳转
    router.push('/login')
    // this.$message() this不是vue实例，所以不能这么用
    Message({ message: '登录失效', type: 'error' })
  }
  return Promise.reject(err)
})

// 把 axios实例 挂载到 Vue 原型 上，今后 在 组件中 直接 通过 this.$http 直接 调用 请求 方法
Vue.prototype.$http = instance
