// db.js
const mysql = require('mysql2');

// 创建数据库连接池
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',   // 替换为你的数据库用户名
  password: 'new_password',  // 替换为你的数据库密码
  database: 'mydb',  // 替换为你的数据库名称
});

// 使用 Promise 风格的连接
const promisePool = pool.promise();

module.exports = promisePool;
