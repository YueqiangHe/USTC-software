<template>
  <div class="register-container">
    <div class="register-box">
      
      <form @submit.prevent="handleRegister">
        <h2>注册</h2>
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
      

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

      <p class="login-link">
        已有账号？<router-link to="/">点击登录</router-link>
      </p>
    </form>
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
/* 页面居中布局 */
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* 全屏高度 */
  background-color: #7eb4f1; /* 背景颜色 */
  margin: 0;
}

/* 注册框样式 */
.register-box {
  display: flex;
  width: 800px;
  height: 500px;
  background-color: #ffffff; /* 白色背景 */
  border-radius: 12px; /* 圆角 */
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2); /* 阴影效果 */
  overflow: hidden; /* 隐藏溢出内容 */
}

/* 左侧图片部分 */
.register-box::before {
  content: "";
  width: 50%; /* 左边一半宽度 */
  background-image: url('../assets/register.png'); /* 替换为自定义图片路径 */
  background-size: cover; /* 自动调整背景图片大小 */
  background-position: center; /* 居中显示 */
}

/* 表单部分 */
form {
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

h2 {
  font-size: 24px;
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

/* 输入框组样式 */
.input-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

label {
  font-size: 14px;
  margin-bottom: 8px;
  color: #666;
}

input, select {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  outline: none;
}

input:focus, select:focus {
  border-color: #5cb85c; /* 聚焦时的边框颜色 */
}

/* 注册按钮样式 */
.register-btn {
  background-color: #5cb85c;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.register-btn:hover {
  background-color: #4cae4c;
}

/* 错误信息提示 */
.error-message {
  color: #d9534f;
  text-align: center;
  margin-top: 15px;
}

/* 登录跳转链接样式 */
.login-link {
  margin-top: 20px; /* 增加顶部的间距 */
  font-size: 14px; /* 字体大小 */
  text-align: center; /* 居中对齐 */
}

.login-link a {
  color: #5cb85c; /* 链接颜色 */
  text-decoration: none; /* 去掉下划线 */
}

.login-link a:hover {
  text-decoration: underline; /* 悬停时显示下划线 */
}

</style>
