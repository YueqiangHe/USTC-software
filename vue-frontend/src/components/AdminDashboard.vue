<template>
  <div class="admin-dashboard">
    <h2>管理员界面</h2>
    <p>欢迎，{{ username }}！</p>

    <!-- 修改密码按钮 -->
    <button class="password-btn" @click="showChangePassword = true">修改密码</button>

    <!-- 修改密码弹窗 -->
    <ChangePassword v-if="showChangePassword" :show="showChangePassword" @close="showChangePassword = false" />



    <!-- 查看学生和老师统计数据 -->
    <div>
      <h3>统计数据</h3>
      <button @click="goToManageUsersPage">管理用户</button>
      <button @click="goToStatisticsPage">查看学生和老师统计数据</button>
    </div>

    <!-- 查看历史数据 -->
    <div>
      <h3>查看历史数据</h3>
      <label for="startDate">开始日期：</label>
      <input type="date" v-model="startDate" id="startDate" />

      <label for="endDate">结束日期：</label>
      <input type="date" v-model="endDate" id="endDate" />

      <button @click="fetchFeedbackData">更新数据</button>
      <button @click="exportToCSV" v-if="feedbackData.length > 0">导出CSV</button>
    </div>

    <!-- 学生和老师数据柱状图 -->
    <div v-if="feedbackData.length > 0">
      <h3>反馈表情统计柱状图</h3>
      <div id="barChart" style="width: 100%; height: 400px;"></div>
    </div>

    <!-- 学生和老师数据饼图 -->
    <div v-if="feedbackData.length > 0">
      <h3>反馈表情统计饼图</h3>
      <div id="pieChart" style="width: 100%; height: 400px;"></div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import * as echarts from 'echarts';
import ChangePassword from './ChangePassword.vue';

export default {
  components: {
    ChangePassword, // 注册修改密码组件
  },
  data() {
    return {
      username: localStorage.getItem('username') || '',
      startDate: '',
      endDate: '',
      feedbackData: [],  // 存储获取到的反馈数据
      showChangePassword: false, // 控制修改密码弹窗显示
    };
  },
  methods: {
    async fetchFeedbackData() {
      if (!this.startDate || !this.endDate) {
        alert("请选择开始日期和结束日期！");
        return;
      }

      try {
        const response = await axios.get('/feedback', {
          params: {
            startDate: this.startDate,
            endDate: this.endDate
          }
        });
        this.feedbackData = response.data;
        this.processChartData();
      } catch (error) {
        console.error('数据获取失败', error);
      }
    },

    processChartData() {
      // 初始化表情统计数据
      const emojiCount = {
        '😊': 0,
        '😂': 0,
        '❤️': 0,
        '👍': 0,
        '🎉': 0
      };

      // 按照表情统计
      this.feedbackData.forEach(feedback => {
        if (emojiCount[feedback.emoji] !== undefined) {
          emojiCount[feedback.emoji]++;
        }
      });

      // 绘制图表
      this.drawCharts(emojiCount);
    },

    drawCharts(emojiCount) {
      // 确保每个图表容器的 canvas 元素已经渲染
      this.$nextTick(() => {
        // 绘制柱状图
        const barChart = echarts.init(document.getElementById('barChart'));
        barChart.setOption({
          tooltip: {},
          xAxis: {
            type: 'category',
            data: Object.keys(emojiCount)
          },
          yAxis: { type: 'value' },
          series: [{
            data: Object.values(emojiCount),
            type: 'bar'
          }]
        });

        // 绘制扇形图
        const pieChart = echarts.init(document.getElementById('pieChart'));
        pieChart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          series: [{
            name: '表情',
            type: 'pie',
            radius: '50%',
            data: Object.keys(emojiCount).map(key => ({
              name: key,
              value: emojiCount[key]
            }))
          }]
        });
      });
    },

    exportToCSV() {
      if (this.feedbackData.length === 0) {
        alert('没有数据可以导出！');
        return;
      }

      // 构造 CSV 数据的表头
      const csvHeaders = ['时间', '学科', 'ID', '用户名', '密码', '表情'];

      // 构造 CSV 数据内容
      const csvContent = [
        csvHeaders,
        ...this.feedbackData.map(feedback => [
          feedback.submission_date,
          feedback.course,
          feedback.id || 'N/A', // 如果 ID 存在，使用 ID，否则填 N/A
          feedback.username,
          feedback.password || 'N/A', // 如果密码存在，使用密码，否则填 N/A
          feedback.emoji,
        ])
      ]
        .map(row => row.join(',')) // 将每行数据用逗号分隔
        .join('\n'); // 每行数据换行

      // 创建 CSV 文件并触发下载
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' }); // 加上 '\uFEFF' 解决 BOM 问题
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'feedback_data.csv';
      link.click();
    },


    goToStatisticsPage() {
      this.$router.push("/statistics");
    },

    goToManageUsersPage() {
      this.$router.push("/manage-users");
    },

    openChangePassword() {
      this.showChangePassword = true; // 打开修改密码弹窗
    },
    closeChangePassword() {
      this.showChangePassword = false; // 关闭修改密码弹窗
    },
  }
};
</script>

<style scoped>
.admin-dashboard {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #eafaf1; /* 浅绿色背景 */
  font-family: Arial, sans-serif;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
}

.dashboard-title {
  text-align: center;
  margin-bottom: 20px;
  color: #2a7d46; /* 深绿色标题颜色 */
}

.welcome-message {
  text-align: center;
  margin-bottom: 20px;
  color: #3a3a3a;
  font-size: 16px;
}

.section {
  margin-bottom: 30px;
}

.date-form {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: center;
  margin-top: 10px;
}

.form-group {
  flex: 1;
  min-width: 200px;
}

.form-actions {
  display: flex;
  gap: 10px;
}

/* 通用按钮样式 */
.action-button {
  padding: 12px 24px;
  background-color: #4caf50; /* 默认绿色背景 */
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s ease; /* 动画过渡效果 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 按钮阴影 */
}

.action-button:hover {
  background-color: #388e3c; /* 鼠标悬停时的深绿色 */
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15); /* 增强阴影效果 */
  transform: translateY(-2px); /* 鼠标悬停时微微上移 */
}

.action-button:active {
  background-color: #2a7d46; /* 按下时的更深绿色 */
  box-shadow: inset 0 4px 6px rgba(0, 0, 0, 0.2); /* 内部阴影 */
  transform: translateY(2px); /* 按下时回到原位 */
}

/* 导出按钮特定样式 */
.export {
  background-color: #2196f3; /* 蓝色背景 */
}

.export:hover {
  background-color: #1976d2;
}

.chart-section {
  margin-top: 20px;
}

.chart {
  margin: 0 auto;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
}

/* 禁用按钮样式 */
.action-button:disabled {
  background-color: #c8c8c8; /* 灰色背景 */
  color: #6c6c6c;
  cursor: not-allowed; /* 禁用状态的鼠标指针样式 */
  box-shadow: none; /* 无阴影 */
  transform: none; /* 无交互效果 */
}

/* 表单按钮组的间距和对齐 */
.form-actions {
  display: flex;
  gap: 15px; /* 按钮之间的间距 */
  flex-wrap: wrap; /* 当屏幕较窄时，按钮换行 */
  justify-content: flex-start; /* 按钮靠左对齐 */
}

button {
  background-color: #6a8eb8; /* 按钮背景颜色 */
  color: white; /* 按钮文字颜色 */
  border: none; /* 去除边框 */
  border-radius: 8px; /* 圆角 */
  padding: 10px 20px; /* 内边距 */
  font-size: 16px; /* 字体大小 */
  cursor: pointer; /* 鼠标悬停显示指针 */
  transition: background-color 0.3s ease; /* 添加过渡效果 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 添加轻微阴影 */
}

button:hover {
  background-color: #4cae4c; /* 悬停时的背景颜色 */
}

button:active {
  background-color: #449d44; /* 点击时的背景颜色 */
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2); /* 点击时的内嵌阴影 */
}

button:disabled {
  background-color: #d4d4d4; /* 禁用时的背景颜色 */
  cursor: not-allowed; /* 禁用时的鼠标样式 */
}
</style>
