<template>
  <div class="login-container">
    <div class="login-box">
      <h2>登录</h2>
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label for="username">用户名:</label>
          <input v-model="username" id="username" type="text" required placeholder="请输入用户名" />
        </div>
        <div class="input-group">
          <label for="password">密码:</label>
          <input v-model="password" id="password" type="password" required placeholder="请输入密码" />
        </div>
        <button type="submit" class="login-btn">登录</button>
      </form>
      
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

      <p class="register-link">
        还没有账号？<router-link to="/register">点击注册</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LoginVue',
  data() {
    return {
      username: '',
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await axios.post('http://localhost:5000/api/login', {
          username: this.username,
          password: this.password
        });

        // 如果后端返回了数据并且没有错误
        if (response && response.data) {
          localStorage.setItem('token', response.data.token);  // 将 token 保存在本地存储
          localStorage.setItem('username', response.data.username);  // 保存用户名
          localStorage.setItem('role', response.data.role);  // 保存角色
          alert('登录成功!');
          if( response.data.role === 'student' ) {
            this.$router.push('/student');
          } else if( response.data.role === 'teacher' ){
            this.$router.push('/teacher');
          } else {
            this.$router.push('/admin');
          }
        } else {
          alert("登录失败，响应无数据");
        }
      } catch (error) {
        // 检查是否有 error.response
        if (error.response) {
          this.errorMessage = error.response.data.message || "登录失败，请重试";  // 显示后端返回的错误信息
        } else {
          this.errorMessage = "请求失败，请检查网络或稍后重试";  // 网络或请求错误
        }
      }
    }
  }
};
</script>

<style scoped>
/* 你可以根据需求自定义样式 */
</style>
