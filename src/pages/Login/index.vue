<template>
  <div class="login-container">
    <div class="login-form-wrap">
      <!-- logo区域 -->
      <div class="login-head">
        <div class="logo"></div>
      </div>
      <!-- 表单区域 -->
      <el-form
        :rules="rules"
        :model="form"
        ref="loginForm"
        class="login-form">
        <el-form-item prop="mobile">
          <el-input v-model="form.mobile" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="form.code" placeholder="密码" show-password></el-input>
          <!-- <el-input v-model="form.code" placeholder="密码" type="password"></el-input> -->
        </el-form-item>
        <el-form-item>
          <p>{{ form.isAgree }}</p>
          <el-checkbox label="我已阅读并同意用户协议和隐私条款" name="type" v-model="isAgree"></el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            class="login-btn"
            @click.prevent="handleLogin"
            :loading="isLoading">{{ !isLoading ? '登陆' : '登陆中...' }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    // 自定义 isAgree的 校验规则
    const validator = (rule, value, callback) => {
      if (!value) {
        // callback 传入 参数 就表示 有错
        callback(new Error('请同意用户协议~'))
        return
      }
      // 不传参数 表示 通过
      callback()
    }
    return {
      isAgree: false,
      // 表单数据
      form: {
        mobile: '13911111111',
        code: '246810'
      },
      // 定义 表单 的校验 规则
      rules: {
        mobile: [
          { required: true, message: '手机号必填', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不对', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '验证码必填', trigger: 'blur' },
          { pattern: /^\d{6}$/, message: '验证码不对', trigger: 'blur' }
        ],
        isAgree: [
          { validator: validator, trigger: 'change' }
        ]
      },
      // 登陆 按钮的状态， 表示 按钮 是否 处在 加载中的 状态，默认是 false，表示 没有在 加载中
      isLoading: false
    }
  },
  methods: {
    handleLogin () {
      if (!this.isAgree) {
        this.$message.warning('必须同意用户协议!')
        return
      }
      this.$refs.loginForm.validate(async valid => {
        // valid 是true 表示 校验 都通过了，如果是false，表示 至少 又一个 不通过
        if (valid) {
          this.isLoading = true
          console.log('axois')
          // 发请求
          // this.$http
          //   .post('/mp/v1_0/authorizations',
          //     this.form
          //   )
          //   .then(resp => {
          //     console.log(resp)
          //     this.$message.success('登陆成功~')

          //     // 登陆 成功 之后，需要 把 后端 返回的 token 存起来
          //     window.localStorage.setItem('token', resp.data.data.token)
          //     // 加载完毕
          //     this.isLoading = false
          //     // 去首页
          //     setTimeout(() => {
          //       // 跳转到 授权 之前 要去的 页面
          //       this.$router.push(this.$route.query.redirect || '/')
          //     })
          //   })
          //   .catch(e => {
          //     console.log(e)
          //     this.$message.error('登陆失败,' + e.message || '未知错误')
          //     // 加载完毕
          //     this.isLoading = false
          //   })

          // try{ 包裹可能出现报错代码 } catch(e){ try包裹代码报错会执行 }

          try {
            const res = await this.$http.post('/mp/v1_0/authorizations', this.form)
            // 代码走到这里，代表成功
            this.$message.success('登陆成功~')
            window.localStorage.setItem('token', res.data.data.token)
            this.isLoading = false
            this.$router.push(this.$route.query.redirect || '/')
          } catch (e) {
            // e 是错误对象，e.response 获取错误的响应，拿到后的错误信息
            // 请求报错，走这里
            this.$message.error('登陆失败,' + e.response.data.message || '未知错误')
            this.isLoading = false
          }
        }
      })
      // 1. 校验数据 todos
      // 2. 发请求
      // 将按钮的状态 变为 加载中 状态
    }
  }
}
</script>

<style lang="less">
.login-container {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction:column;
  justify-content: center;
  align-items: center;
  // background: url("../../assets/image/login_bg.jpg") no-repeat;
  background-size: cover;
  .login-form-wrap {
    min-width: 300px;
    padding: 30px 50px 10px;
    background-color: #fff;
    .login-head {
      display: flex;
      justify-content: center;
      .logo {
        width: 200px;
        height: 57px;
        // background: url("../../assets/image/logo_index.png") no-repeat;
        background-size: contain;
      }
    }
    .login-form {
      .login-btn {
        width: 100%;
      }
    }
  }
}
</style>
