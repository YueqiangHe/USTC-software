import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import StudentDashboard from '../components/StudentDashboard.vue'
import TeacherDashboard from '../components/TeacherDashboard.vue'
import AdminDashboard from '../components/AdminDashboard.vue'
import StatisticsPage from "../components/StatisticsPage.vue";
import ManageUsersPage from "../components/ManageUsersPage.vue"; // 引入管理成员页面组件

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/student',
    name: 'StudentDashboard',
    component: StudentDashboard,
    meta: { requiresAuth: true, role: 'STUDENT' }
  },
  {
    path: '/teacher',
    name: 'TeacherDashboard',
    component: TeacherDashboard,
    meta: { requiresAuth: true, role: 'TEACHER' }
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, role: 'ADMIN' }
  },
  { 
    path: "/statistics", 
    component: StatisticsPage 
  },
  { 
    path: "/manage-users", 
    component: ManageUsersPage }, // 新增管理成员页面路由
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫，检查用户是否已经登录并具有权限
// router.beforeEach((to, from, next) => {
//   const userRole = localStorage.getItem('role')  // 假设登录信息保存在localStorage中
//   const isAuthenticated = !!localStorage.getItem('token')

//   if (to.meta.requiresAuth) {
//     if (!isAuthenticated) {
//       next({ name: 'Home' })  // 重定向到登录页面
//     } else if (to.meta.role && userRole !== to.meta.role) {
//       next({ name: 'Home' })  // 权限不足，重定向到登录页面
//     } else {
//       next()
//     }
//   } else {
//     next()
//   }
// })

export default router