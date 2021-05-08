<template>
  <div class="comment-page">
    <el-card>
      <div slot="header">
        <my-bread>评论管理</my-bread>
      </div>
      <!-- 表格 -->
      <el-table :data="articles">
        <el-table-column label="文章标题" width="500px" prop="title"></el-table-column>
        <el-table-column label="总评论数" prop="total_comment_count"></el-table-column>
        <el-table-column label="粉丝评论数" prop="fans_comment_count"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            {{scope.row.comment_status?'已打开':'已关闭'}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope">
            <el-button @click="toggleStatus(scope.row)" size="small" type="danger" v-if="scope.row.comment_status">关闭评论</el-button>
            <el-button @click="toggleStatus(scope.row)" size="small" type="success" v-else>打开评论</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        style="margin-top:20px"
        background layout="prev, pager, next"
        :total="total"
        :page-size="reqParams.per_page"
        :current-page="reqParams.page"
        @current-change="changePager"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'CommentPage',
  data () {
    return {
      articles: [],
      total: 0,
      // 请求参数对象
      reqParams: {
        page: 1,
        per_page: 20,
        response_type: 'comment'
      }
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
    changePager (np) {
      this.reqParams.page = np
      this.getArticles()
    },
    // 切换文章评论状态
    toggleStatus (row) {
      const text1 = '此操作会关闭该文章的评论功能，关闭后用户将无法对该文章进行评论，您确认吗？'
      const text2 = '此操作会开启该文章的评论功能，您确认吗？'
      this.$confirm(row.comment_status ? text1 : text2, '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          // 请求
          // 当query传参很多个（url?a=10&b=20），也有请求体传参body
          const { data: { data } } = await this.$http({
            url: '/mp/v1_0/comments/status',
            method: 'put',
            // query传参
            params: { article_id: row.id.toString() },
            // 请求体传参
            data: { allow_comment: !row.comment_status }
          // 请求头传参 headers
          })
          // 操作成功
          this.$message.success(data.allow_comment ? '打开评论成功' : '关闭评论成功')
          row.comment_status = data.allow_comment
        } catch (e) {
          this.$message.success('操作失败')
        }
      }).catch(() => {})
    }
  }
}
</script>

<style scoped lang='less'></style>
