<template>
  <el-select
    @change="changeChannel"
    :value="value"
    placeholder="请选择"
    clearable
  >
    <el-option
      v-for="item in channelOptions"
      :key="item.id"
      :label="item.name"
      :value="item.id"
    >
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'MyChannel',
  // props接收的数据，特点：只读
  props: ['value'],
  data () {
    return {
      // channelId: null,
      channelOptions: []
    }
  },
  created () {
    this.getChannelOptions()
  },
  methods: {
    changeChannel (changedChannelId) {
      // if (changedChannelId === '') this.channelId = null
      if (changedChannelId === '') changedChannelId = null
      // 通知父组件，频道ID已变化，你也需要改变
      this.$emit('input', changedChannelId)
    },
    async getChannelOptions () {
      const { data: { data } } = await this.$http.get('/mp/v1_0/channels')
      // res.data 后台给的所有数据  res.data.data === {channels:[]}
      this.channelOptions = data.channels
    }
  }
}
</script>

<style scoped lang='less'></style>
