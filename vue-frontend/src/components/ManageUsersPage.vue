<template>
    <div class="admin-dashboard">
      <h2>管理员界面</h2>
      <p>欢迎，{{ username }}！</p>
  
      <!-- 用户信息表格 -->
      <div>
        <h3>用户管理</h3>
        <button @click="openAddUserDialog">新增用户</button>
        <table>
          <thead>
            <tr>
              <th>账号</th>
              <th>密码</th>
              <th>姓名</th>
              <th>角色</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in users" :key="index">
              <td>{{ user.username }}</td>
              <td>{{ user.password }}</td>
              <td>{{ user.name }}</td>
              <td>{{ user.role }}</td>
              <td>
                <button @click="openEditUserDialog(user)">编辑</button>
                <button @click="deleteUser(index)">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- 编辑用户弹窗 -->
      <div v-if="isEditUserDialogOpen" class="dialog">
        <div class="dialog-content">
          <h3>{{ isEditingNewUser ? '新增用户' : '编辑用户' }}</h3>
          <form @submit.prevent="saveUser">
            <div>
              <label for="username">账号：</label>
              <input v-model="editingUser.username" id="username" required />
            </div>
            <div>
              <label for="password">密码：</label>
              <input v-model="editingUser.password" id="password" required type="password" />
            </div>
            <div>
              <label for="name">姓名：</label>
              <input v-model="editingUser.name" id="name" required />
            </div>
            <div>
              <label for="role">角色：</label>
              <select v-model="editingUser.role" id="role">
                <option value="student">学生</option>
                <option value="teacher">教师</option>
                <option value="admin">管理员</option>
              </select>
            </div>
            <button type="submit">保存</button>
            <button type="button" @click="closeEditUserDialog">取消</button>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        username: "管理员", // 当前登录管理员的账号
        users: [
          { username: "user1", password: "123456", name: "张三", role: "student" },
          { username: "user2", password: "abcdef", name: "李四", role: "teacher" },
          { username: "admin", password: "admin123", name: "管理员", role: "admin" },
        ], // 用户列表
        isEditUserDialogOpen: false,
        editingUser: null,
        isEditingNewUser: false, // 用于区分是新增用户还是编辑现有用户
      };
    },
    methods: {
      openEditUserDialog(user) {
        this.editingUser = { ...user }; // 深拷贝用户数据，防止直接修改原数据
        this.isEditingNewUser = false;
        this.isEditUserDialogOpen = true;
      },
      openAddUserDialog() {
        this.editingUser = { username: "", password: "", name: "", role: "student" }; // 新用户默认值
        this.isEditingNewUser = true;
        this.isEditUserDialogOpen = true;
      },
      closeEditUserDialog() {
        this.isEditUserDialogOpen = false;
        this.editingUser = null;
      },
      saveUser() {
        if (this.isEditingNewUser) {
          this.users.push({ ...this.editingUser }); // 新增用户
        } else {
          const index = this.users.findIndex((user) => user.username === this.editingUser.username);
          if (index !== -1) {
            this.users.splice(index, 1, { ...this.editingUser }); // 更新用户数据
          }
        }
        this.closeEditUserDialog();
      },
      deleteUser(index) {
        if (confirm("确定要删除这个用户吗？")) {
          this.users.splice(index, 1);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  
  th, td {
    padding: 10px;
    border: 1px solid #ccc;
    text-align: left;
  }
  
  button {
    margin-right: 5px;
  }
  
  .dialog {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
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
  </style>
  