<template>
    <div class="admin-dashboard">
      <h2>管理员界面</h2>
      <p>欢迎，{{ username }}！</p>
      <!-- 管理员特有的功能或信息展示 -->
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        username: '管理员'  // 这里是一个示例，可以从后端获取用户信息
      }
    }
  }
  </script>
  
  <style scoped>
  /* 样式代码 */
  </style>
  