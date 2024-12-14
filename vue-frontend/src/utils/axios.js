// src/utils/axios.js

import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8080/api', // 根据后端地址调整
  headers: {
    'Content-Type': 'application/json'
  }
});

// 可添加拦截器，例如添加JWT token
// instance.interceptors.request.use(config => {
//   const token = localStorage.getItem('token');
//   if(token){
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default instance;