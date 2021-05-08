<template>
  <el-container class="layout-container">
    <el-aside :width="!isCollapse ? '200px' : '64px'" class="aside">
      <!-- 1. logo -->
      <div class="logo" :class="!isCollapse ? 'normal_logo' : 'mini_logo'"></div>
      <!-- 2. 菜单导航 -->
      <!-- 菜单区域
        router: 开启路由模式。点击菜单就会根据菜单项上的index进行路由跳转
      -->
      <el-menu
        router
        :default-active="$route.path"
        class="nav-menu"
        background-color="#002033"
        text-color="#fff"
        :collapse="isCollapse"
        active-text-color="#ffd04b"
        :collapse-transition="false"
      >
        <el-menu-item index="/">
          <i class="el-icon-s-home"></i>
          <span slot="title">头条首页</span>
        </el-menu-item>
        <el-menu-item index="/articles">
          <i class="el-icon-document"></i>
          <span slot="title">内容管理</span>
        </el-menu-item>
        <el-menu-item index="/image">
          <i class="el-icon-picture"></i>
          <span slot="title">素材管理</span>
        </el-menu-item>
        <el-menu-item index="/post">
          <i class="el-icon-s-promotion"></i>
          <span slot="title">发布文章</span>
        </el-menu-item>
        <el-menu-item index="/comment">
          <i class="el-icon-chat-dot-round"></i>
          <span slot="title">评论管理</span>
        </el-menu-item>
        <el-menu-item index="/fans">
          <i class="el-icon-setting"></i>
          <span slot="title">粉丝管理</span>
        </el-menu-item>
        <el-menu-item index="/settings">
          <i class="el-icon-user"></i>
          <span slot="title">个人设置</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
      <el-container>
        <el-header class="header">
          <div>
            <i :class="!isCollapse ? 'el-icon-s-fold' : 'el-icon-s-unfold'" @click="toggle"></i>
            <span>缤纷校园</span>
          </div>
          <el-dropdown :hide-on-click="false">
            <!-- 用户信息 -->
            <div class="avatar-wrap">
              <img
                class="avatar"
                @error="userInfo.photo=require('@/assets/image/avatar.jpg')"
                :src="userInfo.photo" alt="avatar">
              <span>{{ userInfo.name }}</span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </div>
            <!-- 下拉菜单 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>设置</el-dropdown-item>
              <el-dropdown-item @click.native="handleLogout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-header>
        <el-main class="main">
          <!-- 路由出口 -->
          <router-view></router-view>
        </el-main>
      </el-container>
  </el-container>
</template>

<script>
import eventBus from '@/common/eventBus'
export default {
  name: 'Layout',
  data () {
    return {
      // 当前 菜单的状态，false 表示 展开，true 表示 收起
      isCollapse: false,
      // 用户信息
      userInfo: {}
    }
  },
  // created () {
  //   // 发起 请求
  //   this.$http
  //     .get('/mp/v1_0/user/profile')
  //     .then(resp => {
  //       // 更新userIfno
  //       this.userInfo = resp.data.data
  //     })
  //     .catch(e => {
  //       console.log(e.message)
  //     })
  // },
  async created () {
    const res = await this.$http.get('/mp/v1_0/user/profile')
    this.userInfo = res.data.data
    // 接收Setting组件的出传的用户名称
    eventBus.$on('updateUserName', (name) => {
      this.userInfo.name = name
    })
    // 接收Setting组件的出传的用户头像
    eventBus.$on('updateUserPhoto', (photo) => {
      this.userInfo.photo = photo
    })
  },
  methods: {
    // 退出
    handleLogout () {
      // 确认框
      this.$confirm('确定退出么, 是否继续?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 点击了 【确定】 会执行 then
        // 1. 删除token
        window.localStorage.removeItem('token')
        // 2. 回到登陆页
        this.$router.push('/login')
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
      }).catch(() => {
        // 点击了 【取消】 会执行 catch
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    },
    toggle () {
      // 取反
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style lang="less">
.layout-container {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
.aside {
  background-color: #002033;
  .el-menu {
    border-right: none;
  }
  .logo {
    width: 100%;
    height: 60px;
    background: #002244 no-repeat center;
    &.normal_logo {
      // background-image:  url(../../assets/image/logo_admin.png);
      background-size: 140px auto;
    }
    &.mini_logo{
      // 覆盖background 的图片和大小，类写在logo的下方。
      // background-image: url(../../assets/image/logo_admin_01.png);
      background-size: 36px auto;
    }
  }
}
.nav-menu {
  .iconfont {
    margin-right: 10px;
    padding-left: 5px;
  }
}
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
  .avatar-box {
    display: flex;
    align-items: center;
    .avatar {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      margin-right: 10px;
    }
  }
}

.main {
  background-color: #e9eef3;
}

.el-menu__vertical:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
  .avatar-wrap {
    display: flex;
    align-items: center;
    .avatar {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      margin-right: 10px;
    }
  }
}
</style>
