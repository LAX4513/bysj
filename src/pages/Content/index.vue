<template>
  <div class='article-page'>
    <!-- 筛选区域 -->
    <el-card>
      <div slot="header">
        <!-- my-bread 自己封装的组件 -->
        <my-bread>内容管理</my-bread>
      </div>
      <!-- 表单 -->
      <el-form label-width="80px" size="small">
        <el-form-item label="状态：">
          <el-radio-group v-model="reqParams.status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道：">
          <!-- 使用my-channel.vue组件 -->
          <!-- <my-channel :value="reqParams.channel_id" @input="reqParams.channel_id=$event"></my-channel> -->
          <my-channel v-model="reqParams.channel_id"></my-channel>
        </el-form-item>
        <el-form-item label="日期：">
          <el-date-picker
           @change="changeDate"
           value-format="yyyy-MM-dd"
            v-model="dateArr"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="filterArticles()">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 结果区域 -->
    <el-card style="margin-top:20px">
      <div slot="header">根据筛选条件共查询到 {{total}} 条结果：</div>
      <!-- 表格 -->
      <el-table :data="articles">
        <el-table-column label="封面">
          <template slot-scope="scope">
            <el-image :src="scope.row.cover.images[0]" style="width:200px;height:150px">
              <div slot="error" class="image-slot">
                <img src="@/assets/image/error.gif" alt="" width="200px" height="150px">
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="标题" prop="title" width="400px"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status===0" type="info">草稿</el-tag>
            <el-tag v-if="scope.row.status===1">待审核</el-tag>
            <el-tag v-if="scope.row.status===2" type="success">审核通过</el-tag>
            <el-tag v-if="scope.row.status===3" type="warning">审核失败</el-tag>
            <el-tag v-if="scope.row.status===4" type="danger">已删除</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" prop="pubdate"></el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope">
            <el-button @click="editArticle(scope.row.id)" type="primary" icon="el-icon-edit" circle plain></el-button>
            <el-button @click="deleteArticle(scope.row.id)" type="danger" icon="el-icon-delete" circle plain></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        style="margin-top:20px"
        background
        layout="prev, pager, next"
        @current-change="togglePage"
        :current-page="reqParams.page"
        :page-size="reqParams.per_page"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'ArticlePage',
  data () {
    return {
      // 提交给后台的参数
      reqParams: {
        // 默认值为null，使用axios提交的时候null值是不会传递的。
        status: null,
        channel_id: null,
        begin_pubdate: null,
        end_pubdate: null,
        page: 1,
        per_page: 20
      },
      // 日期范围 [起始时间，结束时间]
      dateArr: [],
      // 文章列表
      articles: [],
      // 总条数
      total: 0
    }
  },
  created () {
    this.getArticles()
  },
  methods: {
    async getArticles () {
      const { data: { data } } = await this.$http.get('/mp/v1_0/articles', { params: this.reqParams })
      this.articles = data.results
      this.total = data.total_count
    },
    togglePage (changedPage) {
      this.reqParams.page = changedPage
      this.getArticles()
    },
    filterArticles () {
      this.reqParams.page = 1
      this.getArticles()
    },
    changeDate (changedDate) {
      // 日期访问改变后给reqParams中的日期赋值
      // changedDate 选择日期后 [start,end]
      // changedDate 用户做清空 null
      if (changedDate) {
        this.reqParams.begin_pubdate = changedDate[0]
        this.reqParams.end_pubdate = changedDate[1]
      } else {
        this.reqParams.begin_pubdate = null
        this.reqParams.end_pubdate = null
      }
    },
    editArticle (id) {
      this.$router.push({ path: '/post', query: { id } })
      // { path: '/post', query: { id } }
      // 等价
      // `/post?id=${id}`
    },
    deleteArticle (id) {
      this.$confirm('此操作将永久删除该文章, 是否继续?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 发送删除请求
        await this.$http.delete(`/mp/v1_0/articles/${id}`)
        // 删除成功
        this.$message.success('删除文章成功')
        this.getArticles()
      }).catch(() => {
        // 取消不做任何事情
      })
    }
  }
}
</script>

<style scoped lang='less'></style>
