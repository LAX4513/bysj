<template>
  <div class='com-a'>{{aData}}</div>
</template>

<script>
import eventBus from '@/common/eventBus'
export default {
  name: 'ComA',
  data () {
    return {
      aData: '-----'
    }
  },
  created () {
    // 接收
    eventBus.$on('b2a', (bData) => {
      this.aData = bData
    })
  }
}
</script>

<style scoped lang='less'></style>
