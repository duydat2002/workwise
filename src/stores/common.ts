import { defineStore } from "pinia";

interface IState {
  narrowSidebar: boolean;
  verifyEmail: {
    email?: string | null;
    lastResend?: Date | null;
  };
}

export const useCommonStore = defineStore("common", {
  state: (): IState => ({
    narrowSidebar: false,
    verifyEmail: {
      email: null,
      lastResend: null,
    },
  }),
  actions: {
    setVerifyEmail(email?: string | null, lastResend?: Date | null) {
      this.verifyEmail = {
        email,
        lastResend,
      };
    },
  },
  persist: {
    paths: ["verifyEmail"],
  },
});
