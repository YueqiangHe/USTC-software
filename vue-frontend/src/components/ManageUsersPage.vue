<template>
  <div class="admin-dashboard">
    <h2>管理员界面</h2>
    <p>欢迎，{{ username }}！</p>

    <!-- 用户信息表格 -->
    <div>
      <h3>用户管理</h3>
      <table class="user-table">
        <thead>
          <tr>
            <th>id</th>
            <th>密码</th>
            <th>账号</th>
            <th>角色</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in users" :key="index">
            <td>{{ user.id }}</td>
            <td>{{ user.password }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.role }}</td>
            <td>
              <button class="delete-btn" @click="deleteUser(user.id, index)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '管理员', // 当前登录用户名
      users: [], // 用户数据
      isEditUserDialogOpen: false, // 编辑用户弹窗是否打开
      editingUser: null, // 当前编辑的用户对象
      isEditingNewUser: false, // 是否是新增用户
    };
  },
  mounted() {
    this.fetchUsers(); // 获取所有用户
  },
  methods: {
    // 获取用户数据
    async fetchUsers() {
      try {
        const response = await fetch('http://localhost:5000/api/getall');
        const data = await response.json();
        this.users = data; // 更新用户数据
      } catch (error) {
        console.error('获取用户数据失败:', error);
      }
    },
    // 打开新增用户弹窗
    openAddUserDialog() {
      this.isEditUserDialogOpen = true;
      this.isEditingNewUser = true;
      this.editingUser = { id: '', username: '', password: '', role: '' };
    },
    // 打开编辑用户弹窗
    openEditUserDialog(user) {
      this.isEditUserDialogOpen = true;
      this.isEditingNewUser = false;
      this.editingUser = { ...user }; // 深拷贝用户数据
    },
    // 删除用户
    async deleteUser(userId, index) {
      if (confirm('确定删除此用户吗?')) {
        await fetch(`http://localhost:5000/api/rm/${userId}`, { method: 'DELETE' });
        this.users.splice(index, 1); // 从本地删除
      }
    },
  },
};
</script>

<style scoped>
.admin-dashboard {
  background-color: #eafaf1; /* 浅绿色背景 */
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
  max-width: 1000px; /* 限制内容宽度 */
  margin: 20px auto; /* 居中页面 */
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

button {
  padding: 8px 16px;
  margin: 5px;
  cursor: pointer;
}

.add-user-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  font-size: 14px;
}

.edit-btn {
  background-color: #FFA500;
  color: white;
  border: none;
}

.delete-btn {
  background-color: #f44336;
  color: white;
  border: none;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  padding: 12px;
  text-align: center;
  border: 1px solid #ddd;
}

th {
  background-color: #4CAF50;
  color: white;
}

td {
  background-color: #f9f9f9;
}

tr:hover {
  background-color: #f1f1f1;
}

.dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
}

.dialog-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.dialog-actions button {
  padding: 8px 16px;
  border: none;
  cursor: pointer;
}

.dialog-actions button:first-child {
  background-color: #4CAF50;
  color: white;
}

.dialog-actions button:last-child {
  background-color: #f44336;
  color: white;
}
</style>
