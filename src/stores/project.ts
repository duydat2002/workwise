import { getProjects } from "@/services/project";
import { IProject, ITask, ITaskGroup } from "@/types";
import { defineStore } from "pinia";

interface IState {
  projects: IProject[];
  project: IProject | null;
  showProjectLabel: boolean;
  showCreateProject: boolean;
}

export const useProjectStore = defineStore("project", {
  state: (): IState => ({
    projects: [],
    project: null,
    showProjectLabel: false,
    showCreateProject: false,
  }),
  actions: {
    async fetchProjectStore() {
      const data = await getProjects();

      if (data.success) {
        this.projects = data.result!.projects;
      } else {
        this.projects = [];
      }
    },
    addProjectStore(project: IProject) {
      this.projects.push(project);
    },
    updateProjectStore(project: IProject) {
      let projectObj = this.projects.find((p) => p.id == project.id);
      if (projectObj) {
        Object.assign(projectObj, project);
      }
    },
    deleteProjectStore(projectId: string) {
      const index = this.projects.findIndex((p) => p.id == projectId);
      if (index != -1) {
        this.projects.splice(index, 1);
      }
    },

    addTaskGroupStore(taskGroup: ITaskGroup) {
      const project = this.projects.find((p) => p.id == taskGroup.projectId);
      if (project) {
        project.taskGroups.push(taskGroup);
      }
    },
    reorderTaskGroupStore(projectId: string, taskGroups: ITaskGroup[]) {
      const project = this.projects.find((p) => p.id == projectId);
      if (project) {
        project.taskGroups = taskGroups;
      }
    },
    updateTaskGroupStore(taskGroup: ITaskGroup) {
      const project = this.projects.find((p) => p.id == taskGroup.projectId);
      if (project) {
        const taskGroupObj = project.taskGroups.find(
          (g) => g.id == taskGroup.id
        );
        if (taskGroupObj) {
          Object.assign(taskGroupObj, taskGroup);
        }
      }
    },
    deleteTaskGroupStore(projectId: string, taskGroupId: string) {
      const project = this.projects.find((p) => p.id == projectId);
      if (project) {
        const index = project.taskGroups.findIndex((g) => g.id == taskGroupId);
        if (index != -1) {
          project.taskGroups.splice(index, 1);
        }
      }
    },

    addTaskStore(task: ITask) {
      const project = this.projects.find((p) => p.id == task.projectId);
      if (project) {
        const taskGroup = project.taskGroups.find(
          (g) => g.id == task.taskGroupId
        );
        if (taskGroup) {
          taskGroup.tasks.push(task);
        }
      }
    },
    reorderTaskStore(projectId: string, taskGroupId: string, tasks: ITask[]) {
      const project = this.projects.find((p) => p.id == projectId);
      if (project) {
        const taskGroup = project.taskGroups.find((g) => g.id == taskGroupId);
        if (taskGroup) {
          taskGroup.tasks = tasks;
        }
      }
    },
    updateTaskStore(task: ITask) {
      const project = this.projects.find((p) => p.id == task.projectId);
      if (project) {
        const taskGroup = project.taskGroups.find(
          (g) => g.id == task.taskGroupId
        );
        if (taskGroup) {
          const taskObj = taskGroup.tasks.find((t) => t.id == task.id);
          if (taskObj) {
            Object.assign(taskObj, task);
          }
        }
      }
    },
    deleteTaskStore(projectId: string, taskGroupId: string, taskId: string) {
      const project = this.projects.find((p) => p.id == projectId);
      if (project) {
        const taskGroup = project.taskGroups.find((g) => g.id == taskGroupId);
        if (taskGroup) {
          const index = taskGroup.tasks.findIndex((t) => t.id == taskId);
          if (index != -1) {
            taskGroup.tasks.splice(index, 1);
          }
        }
      }
    },
  },
  persist: true,
});
