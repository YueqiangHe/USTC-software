<template>
  <div class="login-container">
    <div class="login-box">
      
      <form @submit.prevent="handleLogin">
        <h2>登录</h2>
        <div class="input-group">
          <label for="username">用户名:</label>
          <input v-model="username" id="username" type="text" required placeholder="请输入用户名" />
        </div>
        <div class="input-group">
          <label for="password">密码:</label>
          <input v-model="password" id="password" type="password" required placeholder="请输入密码" />
        </div>
        <button type="submit" class="login-btn">登录</button>
      
      
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

      <p class="register-link">
        还没有账号？<router-link to="/register">点击注册</router-link>
      </p>
    </form>
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
          localStorage.setItem('token', response.data.token);
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
/* 整个页面居中布局 */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* 全屏高度 */
  background-color: #749682; /* 背景颜色 */
  margin: 0;
}

/* 登录框 */
.login-box {
  display: flex;
  width: 800px;
  height: 500px;
  background-color: #fdfdfd; /* 白色背景 */
  border-radius: 12px; /* 圆角 */
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2); /* 阴影效果 */
  overflow: hidden; /* 隐藏溢出内容 */
}

/* 左侧图片部分 */
.login-box::before {
  content: "";
  width: 50%; /* 左边一半宽度 */
  background-image: url('../assets/login.png'); /* 替换为自定义图片路径 */
  background-size: cover; /* 自动调整背景图片大小 */
  background-position: center; /* 居中显示 */
}

/* 右侧输入表单部分 */
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

input {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  outline: none;
}

input:focus {
  border-color: #5cb85c; /* 聚焦时的边框颜色 */
}

/* 登录按钮样式 */
.login-btn {
  background-color: #5cb85c;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.login-btn:hover {
  background-color: #4cae4c;
}

/* 错误信息提示 */
.error-message {
  color: #d9534f;
  text-align: center;
  margin-top: 15px;
}

/* 注册跳转链接样式 */
.register-link {
  margin-top: 15px; /* 增加顶部的间距 */
  font-size: 14px; /* 字体大小 */
}

form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch; /* 确保宽度一致 */
}

.register-link a {
  color: #5cb85c; /* 链接颜色 */
  text-decoration: none; /* 去掉下划线 */
}

.register-link a:hover {
  text-decoration: underline; /* 悬停时显示下划线 */
}

</style>
