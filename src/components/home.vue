<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="3">
          <div class="grid-content bg-purple">
            <img src="@/assets/logo.png" alt>
          </div>
        </el-col>
        <el-col :span="19" class="middle">
          <h2>电商后台管理系统</h2>
        </el-col>
        <el-col :span="1" class="loginout">
          <a href="#" @click.prevent="handleLoginout()">退出</a>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px" class="aside">
        <el-menu router unique-opened default-active="2">
          <el-submenu :index="''+item.order" v-for="(item) in menus" :key="item.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item :index="item1.path" v-for="(item1) in item.children" :key="item1.id">
                <i class="el-icon-location"></i>
                {{item1.authName}}
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menus: []
    };
  },

  // 判断用户是否登录，未登录，请登录
  beforeCreate() {},
  created() {
    this.getMenus();
  },
  methods: {
    // 侧边栏权限管理
    async getMenus() {
      const res = await this.$http.get(`menus`);
      // console.log(res);
      this.menus = res.data.data;
    },

    // 退出登录
    handleLoginout() {
      // 清除token
      localStorage.clear();
      // 回到登录组件
      this.$router.push({
        name: "login"
      });
      // 提示
      this.$message.success("退出成功");
    }
  }
};
</script>

<style>
.container {
  height: 100%;
}
.container .header {
  background-color: #b3c0d1;
}
.middle {
  color: #fff;
  text-align: center;
  line-height: 60px;
}
.loginout a {
  line-height: 60px;
  text-decoration: none;
}
</style>
