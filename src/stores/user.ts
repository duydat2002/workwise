import { getNotifications, getUser, readNotification } from "@/services/user";
import { INotification, IUser } from "@/types";
import { defineStore } from "pinia";

interface IState {
  user: IUser | null;
  notifications: INotification[];
}

export const useUserStore = defineStore("user", {
  state: (): IState => ({
    user: null,
    notifications: [],
  }),
  actions: {
    getUser() {
      return this.user;
    },
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
    async fetchNotification() {
      const data = await getNotifications();

      if (data.success) {
        this.notifications = data.result!.notifications;
      } else {
        this.notifications = [];
      }
    },
    addNotification(notification: INotification) {
      this.notifications.unshift(notification);
    },
    updateNotification(notification: INotification) {
      let notificationObj = this.notifications.find(
        (n) => n.id == notification.id
      );
      if (notificationObj) {
        Object.assign(notificationObj, notification);
      }
    },
    readAllNotifications() {
      this.notifications.forEach((n) => n.readBy.push(this.user?.id ?? "0"));
    },
  },
  persist: true,
});
