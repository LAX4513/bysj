<template>
  <div class='fans-page'>
    <el-card>
      <div slot="header">
        <my-bread>粉丝管理</my-bread>
      </div>
      <!-- tabs组件 -->
      <el-tabs v-model="activeName" type="card" @tab-click="tabClick">
        <el-tab-pane label="粉丝列表" name="list">
          <!-- 列表 -->
          <ul class="fans-list">
            <li v-for="item in list" :key="item.id">
              <el-avatar :size="80" :src="item.photo">
                <!-- 默认插槽内容，加载失败显示 -->
                <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
              </el-avatar>
              <p>{{item.name}}</p>
              <el-button plain type="primary" size="small">+关注</el-button>
            </li>
          </ul>
          <!-- 分页 -->
          <el-pagination
            background layout="prev, pager, next"
            :total="total"
            :page-size="reqParams.per_page"
            :current-page="reqParams.page"
            @current-change="changePager"
          >
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="粉丝画像" name="pic">
          <div ref="wrapper" style="width:600px;height:400px"></div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
// :src="require('@/assets/image/avatar.jpg')"
// 等价  import img from '@/assets/image/avatar.jpg'  :src="img"
// import echarts from 'echarts'
const echarts = require('echarts')
export default {
  name: 'FansPage',
  data () {
    return {
      activeName: 'list',
      // 列表
      list: [],
      // 条数
      total: 0,
      // 请求参数
      reqParams: {
        page: 1,
        per_page: 24
      }
    }
  },
  created () {
    this.getFans()
  },
  methods: {
    // 初始化图表
    async initChart () {
      const myChart = echarts.init(this.$refs.wrapper)
      // 柱状图配置
      const option = {
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [],
          type: 'bar'
        }]
      }

      // 得到统计数据去修改option中的数据（xAxis.data series[0].data）
      // const { data: { data } } = await this.$http.get('/mp/v1_0/statistics/followers')
      // 目前接口问题，只能模拟data
      const data = [
        { name: '20岁以下', count: 100 },
        { name: '20-30岁', count: 300 },
        { name: '30-40岁', count: 400 },
        { name: '40-50岁', count: 200 },
        { name: '50岁以上', count: 100 }
      ]
      data.forEach(item => {
        option.xAxis.data.push(item.name)
        option.series[0].data.push(item.count)
      })

      myChart.setOption(option)
    },
    // 点击tab
    tabClick () {
      if (this.activeName === 'pic') {
        this.initChart()
      }
    },
    async getFans () {
      const { data: { data } } = await this.$http.get('/mp/v1_0/followers', { params: this.reqParams })
      this.list = data.results
      this.total = data.total_count
    },
    changePager (np) {
      this.reqParams.page = np
      this.getArticles()
    }
  }
}
</script>

<style scoped lang='less'>
.fans-list {
  list-style: none;
  margin: 0;
  padding: 0;
  flex-wrap: wrap;
  display: flex;
  li {
    width: 120px;
    height: 180px;
    border: 1px dashed #ddd;
    text-align: center;
    margin-right: 30px;
    margin-bottom: 20px;
    padding-top: 15px;
    p {
      margin: 10px;
    }
  }
}
</style>
