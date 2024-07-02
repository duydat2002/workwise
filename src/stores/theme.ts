import { defineStore } from "pinia";

interface IState {
  theme: "light" | "dark" | "system";
}

export const useThemeStore = defineStore("theme", {
  state: (): IState => ({
    theme: "system",
  }),
  actions: {
    setTheme(theme: "light" | "dark" | "system") {
      this.theme = theme;
      this.applyTheme();
    },
    applyTheme() {
      const root = document.documentElement;
      if (this.theme === "light") {
        root.classList.remove("dark");
      } else if (this.theme === "dark") {
        root.classList.add("dark");
      } else {
        if (
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
        ) {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      }
    },
    initTheme() {
      this.applyTheme();
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", this.applyTheme);
    },
  },
  persist: true,
});
