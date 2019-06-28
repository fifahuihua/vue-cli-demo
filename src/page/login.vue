<template>
  <div class="login_page" :style="{height}">
    <transition name="form-fade" mode="in-out">
      <section class="form_contianer" v-show="showLogin">
        <div class="manage_tip">
          <p>用户登录</p>
        </div>
        <el-form :model="loginForm" :rules="rules" ref="loginForm" @keyup.enter.native="submitForm('loginForm')">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" placeholder="密码" v-model="loginForm.password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('loginForm')" class="submit_btn">登陆</el-button>
          </el-form-item>
        </el-form>
      </section>
    </transition>
  </div>
</template>

<script>
import UserGw from '@/api/user.client.gw';
import { mapActions, mapState } from 'vuex';

export default {
  data() {
    return {
      height: '200px',
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      showLogin: false
    };
  },
  mounted: async function() {
    this.height = window.innerHeight + 'px';
    const _this = this;
    window.addEventListener('resize', function() {
      _this.height = window.innerHeight + 'px';
    });
    this.showLogin = true;
  },
  computed: {
    ...mapState(['loginUser'])
  },
  methods: {
    ...mapActions(['saveUserInfo']),
    async submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            const res = await UserGw.login({ username: this.loginForm.username, password: this.loginForm.password });
            if (res.data && res.data.username) {
              this.$message({
                type: 'success',
                message: '登录成功'
              });
              // console.log('login success!!!!!!!!' + ', res.data.status = ' + res.data.status);
              this.saveUserInfo(res.data);
              this.$router.push('/');
            } else {
              this.$message({
                type: 'error',
                message: '用户名不存在或者密码错误'
              });
            }
          } catch (error) {
            this.$message({
              type: 'error',
              message: '用户名不存在或者密码错误'
            });
          }
        }
      });
    }
  },
  watch: {
    adminInfo: function(newValue) {
      if (newValue.id) {
        this.$message({
          type: 'success',
          message: '检测到您之前登录过，将自动登录'
        });
        this.$router.push('/');
      }
    }
  }
};
</script>

<style lang="less" scoped>
.login_page {
  background-color: #2f5590;
  height: 100%;
}
.manage_tip {
  position: absolute;
  width: 100%;
  top: -100px;
  left: 0;
  p {
    font-size: 34px;
    color: #fff;
  }
}
.form_contianer {
  width: 320px;
  height: 210px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -120px;
  margin-left: -185px;
  padding: 25px;
  border-radius: 5px;
  text-align: center;
  background-color: #fff;
  .submit_btn {
    width: 100%;
    font-size: 16px;
  }
}
.tip {
  font-size: 12px;
  color: red;
}
.form-fade-enter-active,
.form-fade-leave-active {
  transition: all 1s;
}
.form-fade-enter,
.form-fade-leave-active {
  transform: translate3d(0, -50px, 0);
  opacity: 0;
}
</style>
