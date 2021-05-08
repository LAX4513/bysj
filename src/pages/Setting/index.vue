<template>
  <div class='settings-page'>
    <el-card>
      <div slot="header">
        <my-bread>个人设置</my-bread>
      </div>
      <!-- 栅格 -->
      <el-row>
        <el-col :span="12">
          <!-- 信息表单 -->
          <el-form label-width="120px">
            <el-form-item label="编号：">{{user.id}}</el-form-item>
            <el-form-item label="手机：">{{user.mobile}}</el-form-item>
            <el-form-item label="媒体名称：">
              <el-input v-model="user.name" placeholder="请输入媒体名称"></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍：">
              <el-input v-model="user.intro" type="textarea" :rows="3" placeholder="请输入媒体介绍"></el-input>
            </el-form-item>
            <el-form-item label="邮箱：">
              <el-input v-model="user.email" placeholder="请输入邮箱"></el-input>
            </el-form-item>
            <el-form-item label="">
              <el-button @click="submit()" type="primary">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <!-- 修改头像 -->
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :http-request="uploadAvatar"
            :show-file-list="false">
            <img v-if="user.photo" :src="user.photo" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <p class="text">修改头像</p>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import eventBus from '@/common/eventBus'
export default {
  name: 'SettingsPage',
  data () {
    return {
      // 用户信息
      user: {
        id: '',
        name: '',
        intro: '',
        photo: '',
        email: '',
        mobile: ''
      }
    }
  },
  created () {
    this.getUserProfile()
  },
  methods: {
    // 修改头像
    async uploadAvatar (result) {
      try {
        // 1. 获取file对象  result.file
        // 2. 包装成formdata
        const fd = new FormData()
        fd.append('photo', result.file)
        // 3. 通过axios进行提交
        const { data: { data } } = await this.$http.patch('/mp/v1_0/user/photo', fd)
        this.$message.success('修改头像成功')
        this.user.photo = data.photo
        // 更新layout组件的头像
        eventBus.$emit('updateUserPhoto', data.photo)
      } catch (e) {
        this.$message.error('修改头像失败')
      }
    },
    // 获取用户信息
    async getUserProfile () {
      const { data: { data } } = await this.$http.get('/mp/v1_0/user/profile')
      this.user = data
    },
    // 保存设置
    async submit () {
      const { name, intro, email } = this.user
      try {
        // (规范)put和patch都是做修改的请求方式，put是完整修改，patch是局部修改。
        await this.$http.patch('/mp/v1_0/user/profile', { name, intro, email })
        // 设置成功
        this.$message.success('保存设置成功')
        // 传用户名称给Layout组件
        eventBus.$emit('updateUserName', name)
      } catch (e) {
        this.$message.error('保存设置失败')
      }
    }
  }
}
</script>

<style scoped lang='less'>
.text {
  font-size: 12px;
  text-align: center;
}
</style>
