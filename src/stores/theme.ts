import { defineStore } from "pinia";

interface IState {
  theme: "light" | "dark" | "system";
  isDark: boolean;
}

export const useThemeStore = defineStore("theme", {
  state: (): IState => ({
    theme: "system",
    isDark: false,
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
        this.isDark = false;
      } else if (this.theme === "dark") {
        root.classList.add("dark");
        this.isDark = true;
      } else {
        if (
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
        ) {
          root.classList.add("dark");
          this.isDark = true;
        } else {
          root.classList.remove("dark");
          this.isDark = false;
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
