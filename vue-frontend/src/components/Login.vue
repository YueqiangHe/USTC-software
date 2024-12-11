<template>
  <div class="login">
    <h2>登录</h2>
    <form @submit.prevent="login">
      <div>
        <label for="username">用户名：</label>
        <input v-model="username" type="text" id="username" required />
      </div>
      <div>
        <label for="password">密码：</label>
        <input v-model="password" type="password" id="password" required />
      </div>
      <button type="submit">登录</button>
    </form>
    <p>没有账号？<router-link to="/register">注册</router-link></p>
  </div>
</template>

<script>
export default {
  name: "UserLogin",  // 修改为多单词
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    // 处理登录逻辑
  }
}
</script>

<style scoped>
/* 样式 */
</style>