import { IActivity } from "@/types";
import { defineStore } from "pinia";

interface IState {
  projectActivities: IActivity[];
  taskActivities: IActivity[];
}

export const useActivityStore = defineStore("activity", {
  state: (): IState => ({
    projectActivities: [],
    taskActivities: [],
  }),
  actions: {
    resetActivities() {
      this.projectActivities = [];
      this.taskActivities = [];
    },
  },
  persist: true,
});
