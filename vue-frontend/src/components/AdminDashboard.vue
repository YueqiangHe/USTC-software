<template>
  <div class="admin-dashboard">
    <h2>管理员界面</h2>
    <p>欢迎，{{ username }}！</p>

    <!-- 查看学生和老师统计数据 -->
    <div>
      <h3>统计数据</h3>
      <button @click="goToStatisticsPage">查看学生和老师统计数据</button>
    </div>

    <!-- 管理成员 -->
    <div>
      <h3>成员管理</h3>
      <button @click="goToManageUsersPage">管理成员</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "管理员", // 示例数据
    };
  },
  methods: {
    goToStatisticsPage() {
      this.$router.push("/statistics");
    },
    goToManageUsersPage() {
      this.$router.push("/manage-users");
    },
  },
};
</script>

<style scoped>
button {
  margin-top: 10px;
}
</style>
