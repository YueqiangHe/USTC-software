<template>
  <div class="student-dashboard">
    <h2>学生界面</h2>
    <p>欢迎，{{ username }}！</p>

    <!-- 修改密码 -->
    <div>
      <button @click="openChangePasswordDialog">修改密码</button>
    </div>

    <!-- 选择课程并发送 Emoji -->
    <div>
      <label for="course">选择课程：</label>
      <select v-model="selectedCourse" id="course">
        <option value="math">数学</option>
        <option value="english">英语</option>
        <option value="science">科学</option>
      </select>
    </div>

    <div>
      <label for="emoji">选择一个 Emoji：</label>
      <select v-model="selectedEmoji" id="emoji">
        <option value="😊">😊</option>
        <option value="😂">😂</option>
        <option value="👍">👍</option>
        <option value="❤️">❤️</option>
        <option value="🎉">🎉</option>
      </select>
      <button @click="sendEmoji">发送 Emoji</button>
    </div>

    <!-- 显示已发送的 Emoji -->
    <div>
      <p>已发送的 Emoji:</p>
      <ul>
        <li v-for="(emoji, index) in emojiHistory" :key="index">{{ emoji }}</li>
      </ul>
    </div>

    <!-- 时间范围选择 -->
    <div>
      <h3>查看表情统计数据</h3>
      <label for="startDate">开始日期：</label>
      <input type="date" v-model="startDate" id="startDate" />

      <label for="endDate">结束日期：</label>
      <input type="date" v-model="endDate" id="endDate" />

      <button @click="fetchEmojiData">更新数据</button>
    </div>

    <!-- 图表展示 -->
    <div v-if="chartData.length > 0">
      <h3>表情总量柱状图</h3>
      <div id="barChart" style="width: 100%; height: 400px;"></div>

      <h3>表情总量扇形图</h3>
      <div id="pieChart" style="width: 100%; height: 400px;"></div>

      <h3>表情随时间变化折线图</h3>
      <div id="lineChart" style="width: 100%; height: 400px;"></div>
    </div>

    <!-- 修改密码对话框 -->
    <div v-if="isChangePasswordDialogOpen" class="password-dialog">
      <div class="dialog-content">
        <h3>修改密码</h3>
        <label for="new-password">新密码：</label>
        <input v-model="newPassword" type="password" id="new-password" placeholder="请输入新密码" />
        <button @click="changePassword">确认修改</button>
        <button @click="closeChangePasswordDialog">取消</button>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  data() {
    return {
      username: "学生", // 示例数据，实际应从后端获取
      selectedCourse: "math",
      selectedEmoji: "😊",
      emojiHistory: [],
      newPassword: "",
      isChangePasswordDialogOpen: false,
      startDate: "", // 开始日期
      endDate: "", // 结束日期
      chartData: [], // 模拟表情数据
    };
  },
  methods: {
    // 打开修改密码对话框
    openChangePasswordDialog() {
      this.isChangePasswordDialogOpen = true;
    },
    // 关闭修改密码对话框
    closeChangePasswordDialog() {
      this.isChangePasswordDialogOpen = false;
      this.newPassword = ""; // 清空密码输入框
    },
    // 模拟修改密码操作
    changePassword() {
      if (this.newPassword) {
        alert(`密码已修改为：${this.newPassword}`);
        this.closeChangePasswordDialog();
      } else {
        alert("请输入新密码");
      }
    },
    // 发送 Emoji
    sendEmoji() {
      this.emojiHistory.push(this.selectedEmoji);
    },

    // 获取 Emoji 数据
    fetchEmojiData() {
      if (!this.startDate || !this.endDate) {
        alert("请选择时间范围");
        return;
      }

      // 模拟数据获取逻辑
      this.chartData = [
        { date: "2024-12-01", emoji: "😊", count: 5 },
        { date: "2024-12-02", emoji: "😂", count: 3 },
        { date: "2024-12-02", emoji: "❤️", count: 4 },
        { date: "2024-12-03", emoji: "😊", count: 8 },
        { date: "2024-12-03", emoji: "😂", count: 6 },
        { date: "2024-12-04", emoji: "🎉", count: 7 },
        { date: "2024-12-05", emoji: "😊", count: 9 },
      ];

      // 过滤数据
      const filteredData = this.chartData.filter(
        (item) => item.date >= this.startDate && item.date <= this.endDate
      );

      this.$nextTick(() => {
        this.updateBarChart(filteredData);
        this.updatePieChart(filteredData);
        this.updateLineChart(filteredData);
      });
    },

    updateBarChart(data) {
      const chart = echarts.init(document.getElementById("barChart"));
      const groupedData = this.groupByEmoji(data);

      chart.setOption({
        xAxis: {
          type: "category",
          data: Object.keys(groupedData),
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: Object.values(groupedData),
            type: "bar",
          },
        ],
      });
    },

    updatePieChart(data) {
      const chart = echarts.init(document.getElementById("pieChart"));
      const groupedData = this.groupByEmoji(data);

      chart.setOption({
        series: [
          {
            type: "pie",
            data: Object.entries(groupedData).map(([key, value]) => ({
              name: key,
              value,
            })),
          },
        ],
      });
    },

    updateLineChart(data) {
      const chart = echarts.init(document.getElementById("lineChart"));
      const groupedByDate = this.groupByDate(data);

      chart.setOption({
        xAxis: {
          type: "category",
          data: Object.keys(groupedByDate),
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: Object.values(groupedByDate),
            type: "line",
          },
        ],
      });
    },

    groupByEmoji(data) {
      return data.reduce((acc, curr) => {
        acc[curr.emoji] = (acc[curr.emoji] || 0) + curr.count;
        return acc;
      }, {});
    },

    groupByDate(data) {
      return data.reduce((acc, curr) => {
        acc[curr.date] = (acc[curr.date] || 0) + curr.count;
        return acc;
      }, {});
    },
  },
};
</script>

<style scoped>
.password-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
}

button {
  margin-top: 10px;
}
</style>