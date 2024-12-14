<template>
  <div class="register-container">
    <div class="register-box">
      <h2>注册</h2>
      <form @submit.prevent="handleRegister">
        <div class="input-group">
          <label for="username">用户名:</label>
          <input v-model="username" id="username" type="text" required placeholder="请输入用户名" />
        </div>
        <div class="input-group">
          <label for="password">密码:</label>
          <input v-model="password" id="password" type="password" required placeholder="请输入密码" />
        </div>
        <div class="input-group">
          <label for="role">角色:</label>
          <select v-model="role" id="role" required>
            <option value="student">学生</option>
            <option value="teacher">教师</option>
            <option value="admin">管理员</option>
          </select>
        </div>
        <button type="submit" class="register-btn">注册</button>
      </form>

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

      <p class="login-link">
        已有账号？<router-link to="/">点击登录</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'RegisterVue',
  data() {
    return {
      username: '',
      password: '',
      role: 'student',
      errorMessage: ''
    };
  },
  methods: {
    async handleRegister() {
      try {
        const response = await axios.post('http://localhost:5000/api/register', {
          username: this.username,
          password: this.password,
          role: this.role
        });
        alert(response.data.message);  // 显示注册成功的消息
        this.username = '';
        this.password = '';
        this.role = 'student';
      } catch (error) {
        this.errorMessage = error.response.data.message || '注册失败，请重试';
      }
    }
  }
};
</script>

<style scoped>
/* 你可以根据需求自定义样式 */
</style>
