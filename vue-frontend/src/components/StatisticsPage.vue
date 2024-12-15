<template>
  <div class="statistics-page">
    <h2>学生和老师统计数据</h2>

    <!-- 学生和老师总数 -->
    <div>
      <h3>总数统计</h3>
      <p>学生总数：{{ studentCount }}</p>
      <p>老师总数：{{ teacherCount }}</p>
    </div>

    <!-- 学生和老师数据柱状图 -->
    <div>
      <h3>学生和老师数据柱状图</h3>
      <div id="barChart" style="width: 100%; height: 400px;"></div>
    </div>

    <!-- 学生和老师数据饼图 -->
    <div>
      <h3>学生和老师数据饼图</h3>
      <div id="pieChart" style="width: 100%; height: 400px;"></div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import * as echarts from 'echarts';

export default {
  data() {
    return {
      studentCount: 0, // 学生数量
      teacherCount: 0, // 老师数量
    };
  },
  mounted() {
    this.fetchUserData();  // 在页面加载时获取用户数据
  },
  methods: {
    // 获取所有用户数据
    async fetchUserData() {
      try {
        const response = await axios.get('http://localhost:5000/api/users');  // 根据实际的后端地址修改
        const users = response.data;

        // 统计学生和老师数量
        this.studentCount = users.filter(user => user.role === 'student').length;
        this.teacherCount = users.filter(user => user.role === 'teacher').length;
        this.adminCount = users.filter(user => user.role === 'admin').length;

        // 渲染图表
        this.renderBarChart();
        this.renderPieChart();
      } catch (error) {
        console.error("获取用户数据失败:", error);
      }
    },

    // 渲染柱状图
    renderBarChart() {
      const chartDom = document.getElementById('barChart');
      const chart = echarts.init(chartDom);
      chart.setOption({
        xAxis: {
          type: 'category',
          data: ['学生', '老师', '管理员'],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: [this.studentCount, this.teacherCount, this.adminCount],
            type: 'bar',
          },
        ],
      });
    },

    // 渲染饼图
    renderPieChart() {
      const chartDom = document.getElementById('pieChart');
      const chart = echarts.init(chartDom);
      chart.setOption({
        series: [
          {
            type: 'pie',
            data: [
              { value: this.studentCount, name: '学生' },
              { value: this.teacherCount, name: '老师' },
              { value: this.adminCount, name: '管理员' },
            ],
          },
        ],
      });
    },
  },
};
</script>

<style scoped>
/* 为整个页面设置背景颜色 */
.statistics-page {
  background-color: #bedccb; /* 浅绿色背景 */
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
  max-width: 800px; /* 限制内容宽度 */
  margin: 20px auto; /* 居中页面 */
}

/* 标题样式 */
.dashboard-title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}

/* 欢迎消息样式 */
.welcome-message {
  text-align: center;
  font-size: 18px;
  color: #333;
  margin-bottom: 30px;
}

/* 按钮的样式已经在之前实现，可以保持一致 */

/* 表单部分优化样式 */
.date-form {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: center;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-start;
  margin-top: 15px;
}
</style>