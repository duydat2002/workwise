import { IProject } from "@/types";
import { defineStore } from "pinia";

interface IState {
  projects: IProject[];
  project: IProject | null;
}

export const useProjectStore = defineStore("project", {
  state: (): IState => ({
    projects: [],
    project: null,
  }),
  actions: {
    setProject(project: IProject | null) {
      this.project = project;
    },
  },
  persist: true,
});
