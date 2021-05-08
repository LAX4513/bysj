import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入 组件(路由懒加载写法)
const Login = () => import('../pages/Login')
const Layout = () => import('../pages/Layout')
const Home = () => import('../pages/Home')
const Content = () => import('../pages/Content')
const Image = () => import('../pages/Image')
const Post = () => import('../pages/Post')
const Comment = () => import('../pages/Comment')
const Fan = () => import('../pages/Fan')
const Setting = () => import('../pages/Setting')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    // name: 'layout',
    // 一级路由
    component: Layout,
    // 嵌套路由(二级路由)
    children: [
      {
        path: '/',
        name: 'home',
        component: Home
      },
      {
        path: 'articles',
        name: 'content',
        component: Content
      },
      {
        path: 'image',
        name: 'image',
        component: Image
      },
      {
        path: 'post',
        name: 'post',
        component: Post
      },
      {
        path: 'comment',
        name: 'comment',
        component: Comment
      },
      {
        path: 'fans',
        name: 'fan',
        component: Fan
      },
      {
        path: 'settings',
        name: 'setting',
        component: Setting
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  }
]

const router = new VueRouter({
  routes
})
// 不需要权限的路由
const unAuthPageList = ['/login']
router.beforeEach((to, from, next) => {
  if (unAuthPageList.includes(to.path)) { // 如果 要去 的路径 不需要 权限
    next() // 直接 放行
  } else {
    // 获取token
    const token = window.localStorage.getItem('token')
    if (token) { // 如果有 token， 直接放行
      next()
    } else { // 没有 token
      // 滚到登陆 去 ，并且 记录下来 它 从何处来，然后登陆成功，跳转 回去
      next('/login?redirect=' + to.path)
    }
  }
})

export default router
