import { auth } from "@/plugins/firebase";
import routes from "./routes.ts";
import { createRouter, createWebHistory } from "vue-router";
import { useAuth } from "@/composables/useAuth.ts";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user.ts";

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

const authPath = ["/signin", "/signup", "/forgot-password"];
const specialRoutePath = ["/set-password", "/verify-email"];

router.beforeEach(async (to, _) => {
  console.log(to.name);
  const { user } = storeToRefs(useUserStore());
  const { checkHasEmailAuth } = useAuth();

  const currentUser = auth.currentUser;
  const hasEmailAuth = checkHasEmailAuth();
  const hasVerifyEmail = user.value?.emailVerified;

  console.log(!!currentUser, hasEmailAuth, hasVerifyEmail);

  if (currentUser && !hasEmailAuth && to.path != "/set-password") {
    return "/set-password";
  }

  if (currentUser && !hasVerifyEmail && to.path != "/verify-email") {
    return "/verify-email";
  }

  if (currentUser && hasVerifyEmail) {
    if (authPath.includes(to.path)) return "/";
    if (specialRoutePath.includes(to.path) && hasEmailAuth) return "/";
  }

  if (to.meta.requiresAuth) {
    if (currentUser && !hasEmailAuth && to.path != "/set-password")
      return "/set-password";
    if (currentUser && !hasVerifyEmail && to.path != "/verify-email")
      return "/verify-email";
    if (!currentUser) return "/signin";
  }

  return;
});

export default router;
