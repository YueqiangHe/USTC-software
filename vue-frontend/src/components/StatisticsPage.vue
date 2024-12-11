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
  import * as echarts from "echarts";
  
  export default {
    data() {
      return {
        studentCount: 150, // 示例学生总数，实际应从后端获取
        teacherCount: 20, // 示例老师总数，实际应从后端获取
      };
    },
    mounted() {
      this.renderBarChart();
      this.renderPieChart();
    },
    methods: {
      renderBarChart() {
        const chartDom = document.getElementById("barChart");
        const chart = echarts.init(chartDom);
  
        chart.setOption({
          xAxis: {
            type: "category",
            data: ["学生", "老师"],
          },
          yAxis: {
            type: "value",
          },
          series: [
            {
              data: [this.studentCount, this.teacherCount],
              type: "bar",
            },
          ],
        });
      },
      renderPieChart() {
        const chartDom = document.getElementById("pieChart");
        const chart = echarts.init(chartDom);
  
        chart.setOption({
          series: [
            {
              type: "pie",
              data: [
                { value: this.studentCount, name: "学生" },
                { value: this.teacherCount, name: "老师" },
              ],
            },
          ],
        });
      },
    },
  };
  </script>
  
  <style scoped>
  .statistics-page {
    padding: 20px;
  }
  
  h3 {
    margin-top: 20px;
  }
  </style>  