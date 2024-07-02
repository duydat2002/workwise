import { auth } from "@/plugins/firebase";
import routes from "./routes.ts";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: "link-active",
  linkExactActiveClass: "exact-link-active",
  routes: routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      if (to.name == from.name || to.matched[0] != from.matched[0]) {
        return {
          top: 0,
        };
      }
    }
  },
});

const authPath = ["/signin", "/signup"];

router.beforeEach(async (to, _) => {
  if (to.name == "VerifyEmail") {
    if (!auth.currentUser) return "/signin";
    if (auth.currentUser.emailVerified) return "/";
    return;
  }
  if (authPath.includes(to.path) && auth.currentUser?.emailVerified) {
    return "/";
  }
  if (to.meta.requiresAuth && !auth.currentUser?.emailVerified) {
    return "/signin";
  }
  return;
});

export default router;
