<template>
    <div>
      <!-- 修改密码弹窗 -->
      <div v-if="show" class="modal">
        <div class="modal-content">
          <h3>修改密码</h3>
          <form @submit.prevent="handlePasswordChange">
            <!-- 旧密码输入框 -->
            <div class="input-group">
              <label for="old-password">旧密码:</label>
              <input v-model="oldPassword" id="old-password" type="password" required placeholder="请输入旧密码" />
            </div>
            <!-- 新密码输入框 -->
            <div class="input-group">
              <label for="new-password">新密码:</label>
              <input v-model="newPassword" id="new-password" type="password" required placeholder="请输入新密码" />
            </div>
            <div class="modal-actions">
              <button type="submit" class="submit-btn">提交</button>
              <button type="button" class="cancel-btn" @click="closeDialog">取消</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  
  <script>
import axios from 'axios';

export default {
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      oldPassword: '', // 新增旧密码字段
      newPassword: ''
    };
  },
  methods: {
    async handlePasswordChange() {
      if (!this.oldPassword || !this.newPassword) {
        alert("请填写所有字段");
        return;
      }

      try {
        const response = await axios.post('http://localhost:5000/api/change-password', {
          username: localStorage.getItem('username') || '', // 从父组件或全局状态中获取用户名
          oldPassword: this.oldPassword,
          newPassword: this.newPassword,
        });

        if (response.data.message === "密码修改成功") {
          alert("密码修改成功！");
          this.closeDialog(); // 关闭弹窗
        }
      } catch (error) {
        console.error("修改密码失败", error);
        alert(error.response?.data?.message || "修改密码失败");
      }
    },
    closeDialog() {
      this.$emit('close');
      this.oldPassword = ''; // 重置输入框
      this.newPassword = ''; // 重置输入框
    }
  }
};
</script>
  
  <style scoped>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
    width: 400px;
    text-align: center;
  }
  
  .modal-actions {
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
  }
  
  .submit-btn {
    background-color: #5cb85c;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 10px 20px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .submit-btn:hover {
    background-color: #4cae4c;
  }
  
  .cancel-btn {
    background-color: #d9534f;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 10px 20px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .cancel-btn:hover {
    background-color: #c9302c;
  }
  </style>
  