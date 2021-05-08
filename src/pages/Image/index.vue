<template>
  <div class='image-page'>
    <el-card>
      <div slot="header">
        <my-bread>素材管理</my-bread>
      </div>
      <!-- 切换按钮 + 添加按钮 -->
      <el-radio-group @change="changeCollect"  v-model="reqParams.collect" size="small">
        <el-radio-button :label="false">全部</el-radio-button>
        <el-radio-button :label="true">收藏</el-radio-button>
      </el-radio-group>
      <el-button @click="openDialog()" style="float:right" type="success" size="small">添加素材</el-button>
      <!-- 图片列表 -->
      <ul class="img-list">
        <li class="img-item" v-for="item in images" :key="item.id">
          <img :src="item.url" alt="">
          <p class="action" v-if="!reqParams.collect">
            <span @click="toggleStatus(item)" class="el-icon-star-off" :class="{active:item.is_collected}"></span>
            <span @click="deleteImage(item.id)" class="el-icon-delete"></span>
          </p>
        </li>
      </ul>
      <!-- 分页组件 -->
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="togglePage"
        :current-page="reqParams.page"
        :page-size="reqParams.per_page"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 对话框 -->
    <el-dialog title="添加素材" append-to-body :visible.sync="dialogVisible" width="300px">
      <el-upload
        class="avatar-uploader"
        :action="uploadUrl"
        :headers="uploadHeaders"
        name="image"
        :show-file-list="false"
        :on-success="handleUploadSuccess">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ImagePage',
  data () {
    return {
      // 查询条件
      reqParams: {
        collect: false,
        page: 1,
        per_page: 12
      },
      // 图片列表+总体条数
      images: [],
      total: 0,
      // 控制对话框
      dialogVisible: false,
      // 预览图地址
      imageUrl: '',
      // 上传图片地址
      uploadUrl: this.$http.defaults.baseURL + '/mp/v1_0/user/images',
      // 上传图片请求头
      uploadHeaders: {
        Authorization: 'Bearer ' + window.localStorage.getItem('token')
      }
    }
  },
  created () {
    this.getImages()
  },
  methods: {
    // 上传成功
    handleUploadSuccess (result) {
      // 1. 预览 + 提示
      this.$message.success('上传素材成功')
      this.imageUrl = result.data.url
      // 2. 3s后关闭对话框，更新列表
      window.setTimeout(() => {
        this.dialogVisible = false
        this.getImages()
      }, 3000)
    },
    // 打开对话框
    openDialog () {
      // 清空预览图
      this.imageUrl = ''
      this.dialogVisible = true
    },
    // 删除素材
    deleteImage (id) {
      this.$confirm('此操作将永久删除该素材, 是否继续?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 确认，删除请求
        try {
          this.$http.delete(`/mp/v1_0/user/images/${id}`)
          this.$message.success('删除素材成功')
          this.getImages()
        } catch (e) {
          this.$message.error('删除素材失败')
        }
      }).catch(() => {
        // 取消，无操作
      })
    },
    // 添加收藏&取消收藏
    async toggleStatus (item) {
      try {
      // collect 你想修改的素材状态，和当前item.is_collected状态取反即可
        const { data: { data } } = await this.$http.put(`/mp/v1_0/user/images/${item.id}`, { collect: !item.is_collected })
        // 操作成功
        this.$message.success(data.collect ? '添加收藏成功' : '取消收藏成功')
        // 通过修改数据去驱动星星的颜色
        item.is_collected = data.collect
      } catch (e) {
        this.$message.error('操作失败')
      }
    },
    async getImages () {
      const { data: { data } } = await this.$http.get('/mp/v1_0/user/images', { params: this.reqParams })
      this.images = data.results
      this.total = data.total_count
    },
    togglePage (changedPage) {
      this.reqParams.page = changedPage
      this.getImages()
    },
    changeCollect () {
      // 切换全部与收藏
      this.reqParams.page = 1
      this.getImages()
    }
  }
}
</script>

<style scoped lang='less'>
.img-list {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  .img-item {
    width: 180px;
    height: 180px;
    margin-right: 60px;
    margin-bottom: 25px;
    border:1px dashed #ddd;
    position: relative;
    img {
      width: 100%;
      height: 100%;
    }
    .action {
      margin: 0;
      position: absolute;
      left: 0;
      bottom: 0;
      height: 30px;
      line-height: 30px;
      width: 100%;
      background: rgba(0,0,0,.3);
      color: #fff;
      text-align: center;
      span {
        margin: 0 20px;
        &.active {
          color: red;
        }
      }
    }
  }
}
</style>
