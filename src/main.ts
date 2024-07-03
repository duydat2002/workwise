import "./assets/style.css";
import "vue3-toastify/dist/index.css";

import App from "./App.vue";
import router from "./router";
import { createApp, nextTick, type App as AppType } from "vue";
import { createPinia } from "pinia";
import { registerSW } from "virtual:pwa-register";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./plugins/firebase";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { ClickOutside, ClickInside } from "./directives";
import Vue3TouchEvents, {
  type Vue3TouchEventsOptions,
} from "vue3-touch-events";
import Vue3Toasity, { type ToastContainerOptions } from "vue3-toastify";
import { useUserStore } from "./stores";

registerSW({
  onNeedRefresh() {
    console.log("onNeedRefresh");
  },
  onOfflineReady() {
    console.log("onOfflineReady");
  },
});

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

let app: AppType<Element> | null = null;

onAuthStateChanged(auth, async () => {
  if (!app) {
    app = createApp(App);

    app.use(pinia);
    app.use(router);
    app.directive("click-outside", ClickOutside);
    app.directive("click-inside", ClickInside);
    app.use<Vue3TouchEventsOptions>(Vue3TouchEvents, {
      disableClick: false,
    });
    app.use(Vue3Toasity, {
      autoClose: 2000,
      theme: "colored",
    } as ToastContainerOptions);

    app.mount("#app");
  }

  const { fetchUser } = useUserStore();
  nextTick(async () => {
    console.log(auth.currentUser);
    if (auth.currentUser) await fetchUser();
  });
});
