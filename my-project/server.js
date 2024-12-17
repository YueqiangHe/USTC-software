// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // 引入 cors
const userRoutes = require('./routes/user');  // 引入用户路由

const app = express();
const port = 5000;

// 添加健康检查路由
app.get('/', (req, res) => {
  res.status(200).send('服务器运行中');
});

// 使用 CORS 中间件，允许来自 http://localhost:8080 的请求
app.use(cors({
  origin: 'http://localhost:8080',  // 允许的前端地址
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // 允许的请求方法
  allowedHeaders: ['Content-Type', 'Authorization']  // 允许的请求头
}));

// 解析请求体
app.use(bodyParser.json());

// 使用用户路由
app.use('/api', userRoutes);

// 启动服务
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// 导出 app 用于测试
module.exports = app;