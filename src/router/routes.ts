import AppLayout from "@/layouts/AppLayout.vue";
import BlankLayout from "@/layouts/BlankLayout.vue";
import { RouteRecordRaw } from "vue-router";

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/index.vue"),
    meta: { title: "Trang chủ", layout: AppLayout, requiresAuth: true },
  },
  {
    path: "/projects",
    name: "Projects",
    component: () => import("@/views/Project/index.vue"),
    meta: { title: "Dự án • WorkWise", layout: AppLayout, requiresAuth: true },
  },
  {
    path: "/projects/:projectId",
    name: "Project",
    redirect: { name: "Kanban" },
    component: () => import("@/views/Project/project.vue"),
    meta: { title: "Dự án • WorkWise", layout: AppLayout, requiresAuth: true },
    children: [
      {
        path: "",
        name: "Kanban",
        component: () => import("@/views/Project/Views/kanban.vue"),
      },
      {
        path: "list",
        name: "List",
        component: () => import("@/views/Project/Views/list.vue"),
      },
      {
        path: "calendar",
        name: "Calendar",
        component: () => import("@/views/Project/Views/list.vue"),
      },
      {
        path: "timeline",
        name: "Timeline",
        component: () => import("@/views/Project/Views/list.vue"),
      },
      {
        path: "attach",
        name: "Attach",
        component: () => import("@/views/Project/Views/list.vue"),
      },
    ],
  },
  {
    path: "/profile",
    name: "Profile",
    redirect: { name: "Info" },
    component: () => import("@/views/Profile/index.vue"),
    meta: {
      title: "Trang cá nhân • WorkWise",
      layout: AppLayout,
      requiresAuth: true,
    },
    children: [
      {
        path: "",
        name: "Info",
        component: () => import("@/views/Profile/profile.vue"),
      },
      {
        path: "change-password",
        name: "ChangePassword",
        component: () => import("@/views/Profile/changePassword.vue"),
      },
    ],
  },
  {
    path: "/signin",
    name: "Signin",
    component: () => import("@/views/Auth/Signin.vue"),
    meta: { title: "Đăng nhập • WorkWise", layout: BlankLayout },
  },
  {
    path: "/signup",
    name: "Signup",
    component: () => import("@/views/Auth/Signup.vue"),
    meta: { title: "Đăng ký • WorkWise", layout: BlankLayout },
  },
  {
    path: "/verify-email",
    name: "VerifyEmail",
    component: () => import("@/views/Auth/VerifyEmail.vue"),
    meta: {
      title: "Xác thực email • WorkWise",
      layout: BlankLayout,
      requiresAuth: true,
    },
  },
  {
    path: "/set-password",
    name: "SetPassword",
    component: () => import("@/views/Auth/SetPassword.vue"),
    meta: {
      title: "Đặt mật khẩu • WorkWise",
      layout: BlankLayout,
      requiresAuth: true,
    },
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: () => import("@/views/Auth/ForgotPassword.vue"),
    meta: {
      title: "Đặt lại mật khẩu • WorkWise",
      layout: BlankLayout,
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/notFound.vue"),
    meta: { title: "Không tìm thấy trang" },
  },
];

export default routes;
