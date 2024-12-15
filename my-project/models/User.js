// routes/user.js
const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');  // 引入数据库连接

const router = express.Router();

// 注册用户
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

    // 插入用户数据
    await db.execute('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hashedPassword, role]);

    res.status(201).json({ message: '用户注册成功' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 登录用户
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: '请填写所有字段' });
  }

  try {
    // 查找用户
    const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.status(400).json({ message: '用户名或密码错误' });
    }

    const user = rows[0];

    // 比较密码
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: '用户名或密码错误' });
    }

    res.status(200).json({ message: '登录成功' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 提交反馈
router.post('/feedback', async (req, res) => {
    const { username, course, emoji } = req.body;

    if (!username || !course || !emoji) {
        return res.status(400).json({ message: '请提供完整的反馈信息' });
    }

    try {
        const submissionDate = new Date(); // 获取当前日期和时间

        // 查找用户ID
        const [userRows] = await db.execute('SELECT id FROM users WHERE username = ?', [username]);
        
        if (userRows.length === 0) {
            return res.status(400).json({ message: '用户不存在' });
        }

        const studentId = userRows[0].id; // 获取用户的 ID

        // 插入反馈数据
        await db.execute(
            'INSERT INTO feedback (student_id, course, emoji, submission_date) VALUES (?, ?, ?, ?)',
            [studentId, course, emoji, submissionDate]
        );

        res.status(201).json({ message: '反馈提交成功' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '服务器错误，无法提交反馈' });
    }
});

// 获取所有用户数据，并统计学生、老师和管理员的数量
router.get('/users', async (req, res) => {
    try {
      // 查询所有用户
      const [users] = await db.execute('SELECT * FROM users');
  
      // 统计学生、老师、管理员的数量
      const studentCount = users.filter(user => user.role === 'student').length;
      const teacherCount = users.filter(user => user.role === 'teacher').length;
      const adminCount = users.filter(user => user.role === 'admin').length;
  
      // 返回统计信息
      res.status(200).json({
        studentCount,
        teacherCount,
        adminCount,
        users  // 如果你还想返回所有用户的数据
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '服务器错误' });
    }
  });
  

module.exports = router;
