<template>
  <div class='com-b'>{{bData}} <button @click="fn">b传值a</button></div>
</template>

<script>
import eventBus from '@/common/eventBus'
export default {
  name: 'ComB',
  data () {
    return {
      bData: 'B组件数据'
    }
  },
  methods: {
    fn () {
      // 传值
      eventBus.$emit('b2a', this.bData)
    }
  }
}
</script>

<style scoped lang='less'></style>
