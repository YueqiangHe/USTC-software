const request = require('supertest');
const app = require('../server'); // 引入服务器入口文件

describe('Server Availability', () => {
  test('GET / - 服务器健康检查', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toMatch(/服务器运行中/);
  });
});
