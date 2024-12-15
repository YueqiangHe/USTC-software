<template>
  <div class="teacher-dashboard">
    <h2>教师界面</h2>
    <p>欢迎，{{ username }}！</p>

    <!-- 修改密码按钮 -->
    <button class="password-btn" @click="showChangePassword = true">修改密码</button>

    <!-- 修改密码弹窗 -->
    <ChangePassword v-if="showChangePassword" :show="showChangePassword" @close="showChangePassword = false" />

    <!-- 时间范围选择 -->
    <div>
      <h3>查看表情统计数据</h3>
      <label for="startDate">开始日期：</label>
      <input type="date" v-model="startDate" id="startDate" />

      <label for="endDate">结束日期：</label>
      <input type="date" v-model="endDate" id="endDate" />

      <button @click="fetchFeedbackData">更新数据</button>
    </div>

    <!-- 原始表格数据 -->
    <div v-if="feedbackData.length > 0">
      <h3>学生反馈数据</h3>
      <ul>
        <li v-for="(feedback, index) in feedbackData" :key="index">
          <p><strong>学生用户:</strong> {{ feedback.username }}</p>
          <p><strong>课程:</strong> {{ feedback.course }}</p>
          <p><strong>表情:</strong> {{ feedback.emoji }}</p>
          <p><strong>提交时间:</strong> {{ feedback.submission_date }}</p>
          <hr />
        </li>
      </ul>
    </div>

    <!-- 图表展示 -->
    <div v-if="feedbackData.length > 0">
      <h3>表情总量柱状图</h3>
      <canvas id="barChart" width="600" height="400"></canvas>

      <h3>表情总量扇形图</h3>
      <canvas id="pieChart" width="600" height="400"></canvas>

      <h3>表情随时间变化折线图</h3>
      <canvas id="lineChart" width="600" height="400"></canvas>
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
      username: localStorage.getItem('username') || '',  // 可以从登录状态或 props 传入
      startDate: '',
      endDate: '',
      feedbackData: [],  // 用于存储反馈数据
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
          legend: {
            orient: 'vertical',
            left: 'left',
            data: Object.keys(emojiCount)
          },
          series: [{
            name: '表情',
            type: 'pie',
            radius: '50%',
            data: Object.keys(emojiCount).map(emoji => ({
              name: emoji,
              value: emojiCount[emoji]
            }))
          }]
        });

        // 绘制折线图
        const lineChart = echarts.init(document.getElementById('lineChart'));

        // 按照日期统计
        const dateCounts = {};
        this.feedbackData.forEach(feedback => {
          const date = feedback.submission_date.split('T')[0]; // 获取日期部分
          if (!dateCounts[date]) {
            dateCounts[date] = { '😊': 0, '😂': 0, '❤️': 0, '👍': 0, '🎉': 0 };
          }
          dateCounts[date][feedback.emoji]++;
        });

        const dates = Object.keys(dateCounts);
        const emojiData = ['😊', '😂', '❤️', '👍', '🎉'].map(emoji => {
          return dates.map(date => dateCounts[date][emoji] || 0);
        });

        lineChart.setOption({
          tooltip: { trigger: 'axis' },
          legend: {
            data: ['😊', '😂', '❤️', '👍', '🎉'],
          },
          xAxis: {
            type: 'category',
            data: dates,
            axisLabel: { rotate: 45 }
          },
          yAxis: { type: 'value' },
          series: emojiData.map((data, index) => ({
            name: ['😊', '😂', '❤️', '👍', '🎉'][index],
            type: 'line',
            data
          }))
        });
      });
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
/* 你的样式 */
.teacher-dashboard{
  background-color: #eafaf1; /* 浅绿色背景 */
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
  max-width: 800px; /* 限制内容宽度 */
  margin: 20px auto; /* 居中页面 */
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

/* 日期选择框的样式 */
input[type="date"] {
  width: 150px; /* 调整宽度 */
  height: 35px; /* 调整高度 */
  padding: 5px; /* 内边距 */
  font-size: 14px; /* 字体大小 */
  border: 1px solid #ccc; /* 边框颜色 */
  border-radius: 8px; /* 圆角边框 */
  background-color: #ffffff; /* 背景颜色 */
  outline: none; /* 去除点击时的默认边框 */
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1); /* 添加阴影 */
  transition: border-color 0.3s ease, box-shadow 0.3s ease; /* 过渡效果 */
}

/* 鼠标悬停时效果 */
input[type="date"]:hover {
  border-color: #5cb85c; /* 改变边框颜色 */
  box-shadow: 0 2px 6px rgba(92, 184, 92, 0.2); /* 改变阴影效果 */
}

/* 聚焦时效果 */
input[type="date"]:focus {
  border-color: #5cb85c; /* 聚焦时边框颜色 */
  box-shadow: 0 2px 8px rgba(92, 184, 92, 0.4); /* 聚焦时阴影效果 */
}

/* 配合按钮布局调整 */
button {
  margin-left: 10px; /* 增加与选择框的间距 */
}


</style>