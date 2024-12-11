<template>
  <div class="register">
    <h2>注册</h2>
    <form @submit.prevent="register">
      <div>
        <label for="username">用户名：</label>
        <input v-model="username" type="text" id="username" required />
      </div>
      <div>
        <label for="password">密码：</label>
        <input v-model="password" type="password" id="password" required />
      </div>
      <button type="submit">注册</button>
    </form>
    <p>已有账号？<router-link to="/">登录</router-link></p>
  </div>
</template>

<script>
export default {
  name: "UserRegister",  // 修改为多单词
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    // 处理注册逻辑
  }
}
</script>

<style scoped>
/* 样式 */
</style>
