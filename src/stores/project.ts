import { IProject } from "@/types";
import { defineStore } from "pinia";

interface IState {
  project: IProject | null;
}

export const useProjectStore = defineStore("project", {
  state: (): IState => ({
    project: null,
  }),
  actions: {
    setProject(project: IProject | null) {
      this.project = project;
    },
  },
  persist: true,
});
