<template>
  <div>
    头条首页
    <!-- 作用域插槽测试 -->
    <!-- <my-test>
      <div slot="main" slot-scope="scope">
      <template #main="scope">
        内容 {{scope.age}}
        <ul>
          <li v-for="item in scope.list" :key="item.name">{{item.name}}</li>
        </ul>
      </template>
      <div slot="footer">底部</div>
    </my-test> -->
    <!-- 测试侦听器 -->
    <!-- <h1> <el-button @click="count++">累加</el-button> {{count}}</h1>
    <button @click="user.age=20">修改user.age</button> {{user.age}}
    <hr>
    <div><com-a></com-a></div>
    <com-b></com-b> -->
  </div>
</template>

<script>
// @是路径别名，代表src路径
// import MyTest from '@/components/my-test.vue'
// import ComA from '@/components/com-a.vue'
// import ComB from '@/components/com-b.vue'
export default {
  // components: { MyTest, ComA, ComB },
  async created () {
    // 1. 发请求拿数据
    // 2. 使用数据

    await this.sleep()
    console.log('ok')
  },
  methods: {
    // 定时函数
    sleep (duration = 2000) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('定时结束')
          resolve()
        }, duration)
      })
    }
  },
  data () {
    return {
      count: 0,
      user: {
        name: 'xxx',
        age: '10'
      }
    }
  },
  watch: {
    // 情况1：data中第一层数据 count
    // count (newVal, oldVal) {
    //   console.log('count变了')
    //   console.log(newVal, oldVal)
    // },
    // 情况2：data中的第二层数据 user.age
    // 'user.age': function () {
    //   console.log('user.age变了')
    // }
    // 情况3 监听data中的复杂数据类型 对象 数组，如果监听不到开启深度监听
    // user: {
    //   handler () {
    //     console.log('user变了')
    //   },
    //   deep: true
    // }
    // 情况4：默认只在数据变化触发，侦听器初始化就触发。
    count: {
      handler () {
        console.log('count变了')
      },
      immediate: true
    }
  }
}
</script>

<style scoped>

</style>
