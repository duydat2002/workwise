import { getUser } from "@/services/user";
import { IUser } from "@/types";
import { defineStore } from "pinia";

interface IState {
  user: IUser | null;
}

export const useUserStore = defineStore("user", {
  state: (): IState => ({
    user: null,
  }),
  actions: {
    setUser(user: IUser | null) {
      this.user = user;
    },
    async fetchUser() {
      const data = await getUser();

      if (data.success) {
        this.user = data.result!.user;
      } else {
        this.user = null;
      }
    },
  },
  persist: true,
});
