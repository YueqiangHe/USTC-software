<template>
    <div class="student-dashboard">
      <h2>学生界面</h2>
      <p>欢迎，{{ username }}！</p>
      <!-- 学生特有的功能或信息展示 -->
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        username: '学生'  // 这里是一个示例，可以从后端获取用户信息
      }
    }
  }
  </script>
  
  <style scoped>
  /* 样式代码 */
  </style>  