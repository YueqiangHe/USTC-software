// main.js
import { createApp } from 'vue';  // 引入 Vue 3 中的 createApp
import App from './App.vue';  // 引入根组件
import router from './router';  // 引入路由配置
import axios from 'axios';

// 设置 Axios 默认的 API 路径
axios.defaults.baseURL = 'http://localhost:5000/api';

// 创建 Vue 应用实例
const app = createApp(App);

// 将路由传入 Vue 应用实例
app.use(router);

// 启动应用
app.mount('#app');
