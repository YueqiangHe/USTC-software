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

      <!-- 选择角色 -->
      <div>
        <label for="role">选择角色：</label>
        <select v-model="role" id="role" required>
          <option value="student">学生</option>
          <option value="teacher">教师</option>
          <option value="admin">管理员</option>
        </select>
      </div>

      <button type="submit">注册</button>
    </form>
    <p>已有账号？<router-link to="/">登录</router-link></p>
  </div>
</template>

<script>
export default {
  name: "UserRegister",
  data() {
    return {
      username: '',
      password: '',
      role: 'student'  // 默认选择学生角色
    }
  },
  methods: {
    register() {
      // 在这里处理注册逻辑，将角色信息与用户名、密码一起提交给后端
      const userData = {
        username: this.username,
        password: this.password,
        role: this.role
      }

      // 假设有一个注册的 API
      // 你可以调用后端 API 来提交这些数据
      console.log('注册用户:', userData)

      // 假设成功注册后跳转到登录页面
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
/* 样式 */
</style>
