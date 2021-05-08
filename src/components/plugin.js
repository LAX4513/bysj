import MyBread from '@/components/my-bread'
import MyChannel from '@/components/my-channel'
import MyCover from '@/components/my-cover'

export default {
  // 在main导入后，Vue.use()后执行，会传入Vue对象
  install (Vue) {
    // 扩展vue的原有功能，全局组件，全局指令，全局过滤器，原型方法
    Vue.component(MyBread.name, MyBread)
    Vue.component(MyChannel.name, MyChannel)
    Vue.component(MyCover.name, MyCover)
  }
}
