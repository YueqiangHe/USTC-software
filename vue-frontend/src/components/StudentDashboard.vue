<template>
  <div class="student-dashboard">
    <h2>学生界面</h2>
    <p>欢迎，{{ username }}！</p>

    <!-- 修改密码按钮 -->
    <button class="password-btn" @click="showChangePassword = true">修改密码</button>

    <!-- 修改密码弹窗 -->
    <ChangePassword v-if="showChangePassword" :show="showChangePassword" @close="showChangePassword = false" />

    <!-- 表单容器 -->
    <div class="form-container">
      <div class="form-group">
        <label for="course">选择一个课程：</label>
        <select id="course" v-model="selectedCourse" class="input-field">
          <option value="math">数学</option>
          <option value="science">科学</option>
          <option value="history">历史</option>
        </select>
      </div>

      <div class="form-group">
        <label for="emoji">选择一个Emoji：</label>
        <select id="emoji" v-model="selectedEmoji" class="input-field">
          <option value="smile">😊</option>
          <option value="laugh">😂</option>
          <option value="thumbs_up">👍</option>
          <option value="party">🎉</option>
          <option value="heart">❤️</option>
        </select>
      </div>

      <!-- 将按钮放在选择框下面 -->
      <button class="action-button" @click="sendFeedback">发送反馈</button>
    </div>

    <!-- 已发送反馈 -->
    <div class="feedback-section">
      <h3>已发送的反馈</h3>
      <!-- 如果有反馈数据，显示表格 -->
      <div v-if="feedbackHistory.length > 0">
        <table>
          <thead>
            <tr>
              <th>课程</th>
              <th>表情</th>
              <th>发送时间</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(feedback, index) in feedbackHistory" :key="index">
              <td>{{ feedback.course }}</td>
              <td>
                <span v-if="feedback.emoji === 'smile'">😊</span>
                <span v-else-if="feedback.emoji === 'laugh'">😂</span>
                <span v-else-if="feedback.emoji === 'thumbs_up'">👍</span>
                <span v-else-if="feedback.emoji === 'party'">🎉</span>
                <span v-else-if="feedback.emoji === 'heart'">❤️</span>
                <span v-else>{{ feedback.emoji }}</span>
              </td>
              <td>{{ formatDate(feedback.submission_date) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 如果没有反馈数据，显示提示 -->
      <p v-else>暂无反馈数据。</p>
    </div>
  </div>
</template>


<script>
import axios from 'axios';
import ChangePassword from './ChangePassword.vue';

export default {
  components: {
    ChangePassword, // 注册修改密码组件
  },
  data() {
    return {
      username: localStorage.getItem('username') || '', // 从 localStorage 获取用户名
      selectedCourse: 'math', // 默认选择一个课程
      selectedEmoji: 'smile', // 默认选择一个 Emoji
      feedbackHistory: [], // 存储已发送的反馈
      showChangePassword: false, // 控制修改密码弹窗显示
    };
  },
  mounted() {
    // 获取已发送的反馈
    this.getFeedbackHistory();
  },
  methods: {
    async sendFeedback() {
      if (!this.selectedCourse || !this.selectedEmoji) {
        alert('请选择课程和表情！');
        return;
      }

      try {
        const response = await axios.post('http://localhost:5000/api/feedback', {
          username: this.username,
          course: this.selectedCourse,
          emoji: this.selectedEmoji,
          submission_date: new Date().toISOString().slice(0, 19).replace('T', ' '), // 转换为 MySQL 格式
        });

        // 成功后添加到反馈列表
        if (response.status === 200) {
          this.feedbackHistory.push({
            emoji: this.selectedEmoji,
            course: this.selectedCourse,
            submission_date: new Date().toISOString(),
          });
          alert('反馈已提交!');
        }
      } catch (error) {
        console.error('反馈提交失败', error);
        alert('提交反馈时出错');
      }
    },

    async getFeedbackHistory() {
      try {
        // 获取已发送的反馈
        const response = await axios.get('http://localhost:5000/api/feedback', {
          params: { username: this.username }, // 根据用户名获取反馈
        });

        if (response.data && response.data.length) {
          this.feedbackHistory = response.data.map(feedback => ({
            ...feedback,
            submission_date: feedback.submission_date,
          }));
        }
      } catch (error) {
        console.error('获取反馈历史失败', error);
      }
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    },
    openChangePassword() {
      this.showChangePassword = true; // 打开修改密码弹窗
    },
    closeChangePassword() {
      this.showChangePassword = false; // 关闭修改密码弹窗
    },
  },
};
</script>


<style scoped>
/* 你的样式 */
.student-dashboard{
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

select {
  width: 200px; /* 设置选择框的宽度 */
  height: 40px; /* 设置选择框的高度 */
  padding: 5px; /* 内边距 */
  font-size: 16px; /* 字体大小 */
  border: 1px solid #ccc; /* 边框颜色 */
  border-radius: 8px; /* 圆角 */
  outline: none; /* 去掉聚焦时的默认样式 */
}

select:focus {
  border-color: #5cb85c; /* 聚焦时边框颜色 */
  box-shadow: 0 0 4px rgba(92, 184, 92, 0.5); /* 聚焦时阴影效果 */
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

thead {
  background-color: #f9f9f9;
}

th,
td {
  padding: 10px;
  text-align: center;
  border: 1px solid #ddd;
}

.feedback-section p {
  text-align: center;
  color: #666;
  font-style: italic;
  margin-top: 20px;
}

</style>
