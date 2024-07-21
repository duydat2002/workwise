import { getProjectActivities, getProjects } from "@/services/project";
import { IActivity, IProject, ITask, ITaskGroup } from "@/types";
import { defineStore } from "pinia";

interface IState {
  projects: IProject[];
  project: IProject | null;
  task: ITask | null;
  activities: IActivity[];
  showProjectInfo: boolean;
  showProjectLabel: boolean;
  showTaskLabel: boolean;
  showCreateProject: boolean;
}

export const useProjectStore = defineStore("project", {
  state: (): IState => ({
    projects: [],
    project: null,
    task: null,
    activities: [],
    showProjectInfo: true,
    showProjectLabel: true,
    showTaskLabel: true,
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
        if (this.project?.id == projectId) {
          this.project = null;
        }
        if (this.task?.project.id == projectId) {
          this.task = null;
        }
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
      console.log(projectId, taskGroupId);
      const project = this.projects.find((p) => p.id == projectId);
      if (project) {
        const index = project.taskGroups.findIndex((g) => g.id == taskGroupId);
        if (index != -1) {
          project.taskGroups.splice(index, 1);
          if (this.task?.taskGroup.id == taskGroupId) {
            this.task = null;
          }
        }
      }
    },

    addTaskStore(task: ITask) {
      const project = this.projects.find((p) => p.id == task.project.id);
      if (project) {
        const taskGroup = project.taskGroups.find(
          (g) => g.id == task.taskGroup.id
        );
        if (taskGroup) {
          taskGroup.tasks.push(task);
        }
      }
    },
    reorderTaskStore(
      fromTaskGroup: ITaskGroup | null | undefined,
      toTaskGroup: ITaskGroup
    ) {
      if (fromTaskGroup) this.updateTaskGroupStore(fromTaskGroup);
      this.updateTaskGroupStore(toTaskGroup);
    },
    updateTaskStore(task: ITask) {
      const project = this.projects.find((p) => p.id == task.project.id);
      if (project) {
        const taskGroup = project.taskGroups.find(
          (g) => g.id == task.taskGroup.id
        );
        if (taskGroup) {
          const taskObj = taskGroup.tasks.find((t) => t.id == task.id);
          if (taskObj) {
            Object.assign(taskObj, task);

            if (this.task?.id == taskObj.id) {
              console.log("cập nhật task");
              this.task = taskObj;
            }
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
            if (this.task?.id == taskId) {
              this.task = null;
            }
          }
        }
      }
    },

    async fetchActivities(projectId: string) {
      const data = await getProjectActivities(projectId);
      console.log("lon");
      if (data.success) {
        this.activities = data.result!.activities;
      } else {
        this.activities = [];
      }
    },
  },
  persist: true,
});
