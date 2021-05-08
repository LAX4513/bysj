<template>
  <div class='my-cover'>
    <!-- 封面按钮 -->
    <div class="cover-btn" @click="openDialog()">
      <img :src="value||coverImage" alt="">
    </div>
    <!-- 对话框 -->
    <el-dialog append-to-body :visible.sync="dialogVisible" width="740px">
      <!-- tabs组件 -->
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="素材列表" name="images">
          <!-- 切换按钮 -->
          <el-radio-group @change="changeCollect" v-model="reqParams.collect" size="small">
            <el-radio-button :label="false">全部</el-radio-button>
            <el-radio-button :label="true">收藏</el-radio-button>
          </el-radio-group>
          <!-- 素材列表 -->
          <ul class="img-list">
            <li
              :class="{active:selectedImgUrl===item.url}"
              @click="selectImg(item.url)"
              v-for="item in images"
              :key="item.id"
             >
              <img :src="item.url" alt="">
            </li>
          </ul>
          <!-- 分页组件 -->
          <el-pagination
            background
            layout="prev, pager, next"
            @current-change="changePager"
            :current-page="reqParams.page"
            :page-size="reqParams.per_page"
            :total="total">
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="上传图片" name="upload">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :headers="uploadHeaders"
            name="image"
            :show-file-list="false"
            :on-success="handleUploadSuccess">
            <img v-if="uploadImgUrl" :src="uploadImgUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmImage()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import img from '@/assets/image/default.png'
export default {
  name: 'MyCover',
  props: ['value'],
  data () {
    return {
      // 控制对话框显示隐藏
      dialogVisible: false,
      // 当前激活tab的name
      activeName: 'images',
      // 获取素材请求参数
      reqParams: {
        collect: false,
        page: 1,
        per_page: 8
      },
      // 素材列表数据
      images: [],
      total: 0,
      // 当前选中的素材
      selectedImgUrl: null,
      // 上传图片接口地址
      uploadUrl: this.$http.defaults.baseURL + '/mp/v1_0/user/images',
      // 上传图片请求头
      uploadHeaders: {
        Authorization: 'Bearer ' + window.localStorage.getItem('token')
      },
      // 上传成功的图片
      uploadImgUrl: null,
      // 封面按钮
      coverImage: img
    }
  },
  methods: {
    // 确认图片
    confirmImage () {
      if (this.activeName === 'images') {
        // 激活素材列表，判断是否选中素材
        if (!this.selectedImgUrl) {
          this.$message.warning('请选择一张图片')
          return false
        } else {
          // 确认图片
          // this.coverImage = this.selectedImgUrl
          this.$emit('input', this.selectedImgUrl)
        }
      }
      if (this.activeName === 'upload') {
        // 激活上传图片，判断是否上传图片
        if (!this.uploadImgUrl) {
          this.$message.warning('请上传一张图片')
          return false
        } else {
          // 确认图片
          // this.coverImage = this.uploadImgUrl
          this.$emit('input', this.uploadImgUrl)
        }
      }
      // 触发确认图片自定义事件
      this.$emit('on-confirm')
      // 关闭对话框
      this.dialogVisible = false
    },
    // 上传素材
    handleUploadSuccess (res) {
      this.$message.success('上传图片成功')
      this.uploadImgUrl = res.data.url
    },
    // 选择素材
    selectImg (url) {
      this.selectedImgUrl = url
    },
    openDialog () {
      this.dialogVisible = true
      // 获取素材列表数据
      this.activeName = 'images'
      this.selectedImgUrl = null
      this.uploadImgUrl = null
      this.reqParams.page = 1
      this.getImages()
    },
    async getImages () {
      const { data: { data } } = await this.$http.get('/mp/v1_0/user/images', { params: this.reqParams })
      this.images = data.results
      this.total = data.total_count
    },
    changePager (newPage) {
      this.reqParams.page = newPage
      this.getImages()
    },
    changeCollect () {
      this.reqParams.page = 1
      this.getImages()
    }
  }
}
</script>

<style scoped lang='less'>
::v-deep .el-dialog__body {
  padding-bottom: 0;
}
.my-cover {
  display: inline-block;
  margin-right: 20px;
  margin-top: 10px;
  .cover-btn {
    width: 150px;
    height: 150px;
    border: 1px dashed #ddd;
    img {
      width: 100%;
      height: 100%;
      display: block;
    }
  }
}
.img-list {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  padding: 0;
  margin: 0;
  margin-top: 20px;
  li {
    width: 150px;
    height: 120px;
    margin-right: 20px;
    margin-bottom: 20px;
    border: 1px dashed #ddd;
    position: relative;
    &.active {
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,.4) url(../assets/image/selected.png) no-repeat center / 50px 50px;
      }
    }
    img {
      width: 100%;
      height: 100%;
      display: block;
    }
  }
}
</style>
