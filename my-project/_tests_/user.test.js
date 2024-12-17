const request = require('supertest');
const app = require('../server'); // 导入 server.js 的 app 实例
const db = require('../db'); // 导入数据库连接

beforeAll(async () => {
  // 初始化测试数据
  await db.execute('DELETE FROM users WHERE username = ?', ['testuser']);
  const hashedPassword = await require('bcrypt').hash('testpassword', 10);
  await db.execute('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', ['testuser', hashedPassword, 'student']);
});

afterAll(async () => {
  // 清理测试数据
  await db.execute('DELETE FROM users WHERE username = ?', ['testuser']);
  db.end();
});

describe('User API Endpoints', () => {
  test('POST /api/login - 成功登录', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({
        username: 'testuser',
        password: 'testpassword',
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('登录成功');
    expect(response.body.token).toBeDefined();
  });

  test('POST /api/login - 用户名或密码错误', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({
        username: 'testuser',
        password: 'wrongpassword',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('密码错误');
  });

  test('POST /api/change-password - 成功修改密码', async () => {
    const response = await request(app)
      .post('/api/change-password')
      .send({
        username: 'testuser',
        oldPassword: 'testpassword',
        newPassword: 'newpassword',
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('密码修改成功');
  });

  test('POST /api/change-password - 旧密码错误', async () => {
    const response = await request(app)
      .post('/api/change-password')
      .send({
        username: 'testuser',
        oldPassword: 'wrongpassword',
        newPassword: 'newpassword',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('旧密码不正确');
  });
});
