<template>
	<el-container style="border: 0;" :style="{height: height}">
		<el-aside style="background-color:#324057; height: 100%; transition: width 0.5s;" :style="{width: isCollapse ? '67px':'200px'}">
			<el-menu class="custom-menu" :default-active="defaultActive" :collapse="isCollapse" background-color="#324057" text-color="#e6e6e6" active-text-color="#ffd04b" style="border-right: 0;" router>
				<el-menu-item index="/">
					<i class="el-icon-menu"></i>
					<template slot="title">首页</template>
				</el-menu-item>
				<el-submenu index="2">
					<template slot="title">
						<i class="el-icon-document"></i>
						<span>用户管理</span>
					</template>
					<el-menu-item index="userList">用户列表</el-menu-item>
				</el-submenu>
			</el-menu>
		</el-aside>
		<el-container>
			<el-header style="padding-left: 0; padding-right: 0;">
				<div class="header_container">
					<i class="menu-icon" :class="isCollapse ? 'el-icon-d-arrow-right' : 'el-icon-d-arrow-left'" @click="isCollapse = !isCollapse"></i>
					<el-breadcrumb separator="/" style="width: 100%; padding-left: 10px;">
						<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
						<el-breadcrumb-item v-for="(item, index) in $route.meta" :key="index">{{item}}</el-breadcrumb-item>
					</el-breadcrumb>
					<el-dropdown @command="handleCommand">
						<img src="/img/default.jpg" class="avator">
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item command="home">首页</el-dropdown-item>
							<el-dropdown-item command="singout">注销</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</div>
			</el-header>
			<el-main style="padding: 0;">
				<keep-alive>
					<router-view></router-view>
				</keep-alive>
			</el-main>
			<el-footer v-if="false">Footer</el-footer>
		</el-container>
	</el-container>
</template>

<script>
import UserGw from '@/api/user.client.gw';
import { mapActions, mapState } from 'vuex';

export default {
  data() {
    return {
      isCollapse: false,
      height: '200px'
    };
  },
  computed: {
    defaultActive: function() {
      return this.$route.path.replace('/', '');
    }
  },
  methods: {
    ...mapActions(['saveUserInfo']),
    async handleCommand(command) {
      if (command == 'home') {
        this.$router.push('/');
      } else if (command == 'singout') {
        const res = await UserGw.signout();
        if (res.data.status == 1) {
          this.$message({
            type: 'success',
            message: '退出成功'
          });
          this.saveUserInfo(null);
          this.$router.push('/login');
        } else {
          this.$message({
            type: 'error',
            message: res.data.message
          });
        }
      }
    }
  },
  mounted() {
    this.height = window.innerHeight + 'px';
    const _this = this;
    window.addEventListener('resize', function() {
      _this.height = window.innerHeight + 'px';
    });
  }
};
</script>

<style scoped>
.header_container {
  background-color: #eff2f7;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
}

.custom-menu:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.menu-icon:hover {
  color: rgb(64, 158, 255);
  cursor: pointer;
}

.avator {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 37px;
}
</style>