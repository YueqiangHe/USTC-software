<template>
    <div class="teacher-dashboard">
      <h2>教师界面</h2>
      <p>欢迎，{{ username }}！</p>
      <!-- 教师特有的功能或信息展示 -->
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        username: '教师'  // 这里是一个示例，可以从后端获取用户信息
      }
    }
  }
  </script>
  
  <style scoped>
  /* 样式代码 */
  </style>
  