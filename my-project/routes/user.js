const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');  // 引入数据库连接池

const router = express.Router();

// 注册 API
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ message: '请填写所有字段' });
  }

  try {
    // 检查用户是否已存在
    const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length > 0) {
      return res.status(400).json({ message: '用户名已存在' });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 插入新用户
    await db.execute('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hashedPassword, role]);

    res.status(201).json({ message: '用户注册成功' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 登录 API
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: '请填写所有字段' });
  }

  try {
    // 查找用户
    const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);

    if (rows.length === 0) {
      return res.status(400).json({ message: '用户不存在' });
    }

    const user = rows[0];  // 获取找到的用户

    // 验证密码
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: '密码错误' });
    }

    // 创建 JWT（JSON Web Token）
    const token = jwt.sign({ userId: user.id }, 'secretkey', { expiresIn: '1h' });

    // 返回用户名、角色和 token
    res.json({ 
      message: '登录成功', 
      token,
      username: user.username,  // 返回用户名
      role: user.role           // 返回角色
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 处理学生的反馈提交
// routes/feedback.js
router.post('/feedback', async (req, res) => {
    const { username, course, emoji, submission_date } = req.body;
  
    if (!username || !course || !emoji || !submission_date) {
      return res.status(400).json({ message: '缺少必要的反馈信息' });
    }
  
    try {
      // 转换日期格式为 MySQL 接受的格式
      const formattedDate = new Date(submission_date).toISOString().slice(0, 19).replace('T', ' ');
  
      // 将反馈数据插入数据库
      await db.execute('INSERT INTO feedback (username, course, emoji, submission_date) VALUES (?, ?, ?, ?)', 
        [username, course, emoji, formattedDate]);
  
      res.status(200).json({ message: '反馈提交成功' });
    } catch (error) {
      console.error("服务器错误:", error);
      res.status(500).json({ message: '服务器错误' });
    }
  });
  
  
  
  
  // 假设的代码
    router.get('/feedback', async (req, res) => {
        const { startDate, endDate } = req.query;
    
        if (!startDate || !endDate) {
        return res.status(400).json({ message: '请提供开始和结束日期' });
        }
    
        try {
        // 执行查询时确保没有传递 undefined
        const [rows] = await db.execute(
            'SELECT * FROM feedback WHERE submission_date BETWEEN ? AND ?',
            [startDate, endDate]
        );
    
        res.status(200).json(rows);
        } catch (err) {
        console.error(err);
        res.status(500).json({ message: '服务器错误' });
        }
    });


    // 在你后端的路由文件中
    router.get('/users', async (req, res) => {
        try {
        // 查询所有用户
        const [users] = await db.execute('SELECT * FROM users');
        res.status(200).json(users);  // 返回所有用户信息
        } catch (error) {
        console.error(error);
        res.status(500).json({ message: '服务器错误' });
        }
    });
  
    // 获取所有用户
router.get('/getall', async (req, res) => {
    try {
      const [rows] = await db.execute('SELECT * FROM users');
      res.status(200).json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '服务器错误' });
    }
  });
  
  // 新增用户
  router.post('/add', async (req, res) => {
    const { username, password, name, role } = req.body;
  
    if (!username || !password || !name || !role) {
      return res.status(400).json({ message: '请填写所有字段' });
    }
  
    try {
      // 检查用户是否已存在
      const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
      if (rows.length > 0) {
        return res.status(400).json({ message: '用户名已存在' });
      }
  
      // 加密密码
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // 插入新用户
      await db.execute('INSERT INTO users (username, password, name, role) VALUES (?, ?, ?, ?)', [username, hashedPassword, name, role]);
  
      res.status(201).json({ message: '用户新增成功' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: '服务器错误' });
    }
  });
  
  // 删除用户 API
    router.delete('/rm/:id', async (req, res) => {
        const userId = req.params.id;
    
        try {
        // 删除数据库中对应的用户
        const result = await db.execute('DELETE FROM users WHERE id = ?', [userId]);
    
        if (result.affectedRows > 0) {
            return res.status(200).json({ message: '用户删除成功' });
        } else {
            return res.status(404).json({ message: '用户未找到' });
        }
        } catch (error) {
        console.error(error);
        res.status(500).json({ message: '删除用户时发生错误' });
        }
    });

    router.post('/api/register', async (req, res) => {
        const { username, password, role } = req.body;
        
        try {
          // 对密码进行加密
          const hashedPassword = await bcrypt.hash(password, 10);
          
          // 插入到数据库
          await db.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hashedPassword, role]);
          res.status(200).json({ message: '注册成功！' });
        } catch (error) {
          console.error('注册失败:', error);
          res.status(500).json({ message: '注册失败，请稍后再试！' });
        }
      });

      router.post('/change-password', async (req, res) => {
        const { username, oldPassword, newPassword } = req.body;
      
        // 检查请求参数
        if (!username || !oldPassword || !newPassword) {
          return res.status(400).json({ message: '请求参数不完整' });
        }
      
        try {
          // 查询用户
          const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
          const user = rows[0];
      
          console.log('用户名:', username);
          console.log('从数据库查询的用户:', user);
          console.log('旧密码:', oldPassword);
          console.log('用户的哈希密码:', user ? user.password : '未找到');
      
          if (!user) {
            return res.status(404).json({ message: '用户不存在' });
          }
      
          // 验证旧密码
          const isMatch = await bcrypt.compare(oldPassword, user.password);
          if (!isMatch) {
            return res.status(400).json({ message: '旧密码不正确' });
          }
      
          // 加密新密码
          const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      
          // 更新密码
          await db.query('UPDATE users SET password = ? WHERE username = ?', [hashedNewPassword, username]);
          res.status(200).json({ message: '密码修改成功' });
        } catch (error) {
          console.error('修改密码出错:', error);
          res.status(500).json({ message: '服务器内部错误' });
        }
      });      

  

module.exports = router;
