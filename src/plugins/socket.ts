import { useProjectStore, useUserStore } from "@/stores";
import { INotification, IProject, ITask, ITaskGroup, IUser } from "@/types";
import { Pinia } from "pinia";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_BASE_URL);

export function initializeSocket(pinia: Pinia) {
  const projectStore = useProjectStore(pinia);
  const userStore = useUserStore(pinia);

  socket.on("connect", () => {
    console.log("connect");
  });

  socket.on("disconnect", () => {
    console.log("disconnect");
  });

  // User
  socket.on("user:updated", (user: IUser) => {
    console.log("user:updated");
    projectStore.updateUserProjectStore(user);
  });

  // Project
  socket.on("project:created", (project: IProject) => {
    console.log("project:created");
    projectStore.addProjectStore(project);
    socket.emit("project:join", project.id);
  });

  socket.on("project:updated", (project: IProject) => {
    console.log("project:updated", project);
    projectStore.updateProjectStore(project);
  });

  socket.on("project:deleted", (projectId: string) => {
    console.log("project:deleted");
    projectStore.deleteProjectStore(projectId);
    socket.emit("project:leave", projectId);
  });

  // Task Group
  socket.on("taskgroup:created", (taskGroup: ITaskGroup) => {
    console.log("taskgroup:created");
    projectStore.addTaskGroupStore(taskGroup);
  });

  socket.on(
    "taskgroup:ordered",
    (projectId: string, taskGroups: ITaskGroup[]) => {
      console.log("taskgroup:ordered");
      projectStore.reorderTaskGroupStore(projectId, taskGroups);
    }
  );

  socket.on("taskgroup:updated", (taskGroup: ITaskGroup) => {
    console.log("taskgroup:updated", taskGroup);
    projectStore.updateTaskGroupStore(taskGroup);
  });

  socket.on("taskgroup:deleted", (projectId: string, taskGroupId: string) => {
    console.log("taskgroup:deleted");
    projectStore.deleteTaskGroupStore(projectId, taskGroupId);
  });

  // Task
  socket.on("task:created", (task: ITask) => {
    console.log("task:created");
    projectStore.addTaskStore(task);
  });

  socket.on(
    "task:ordered",
    (fromTaskGroup: ITaskGroup | null, toTaskGroup: ITaskGroup) => {
      console.log("task:ordered", fromTaskGroup, toTaskGroup);
      projectStore.reorderTaskStore(fromTaskGroup, toTaskGroup);
    }
  );

  socket.on("task:updated", (task: ITask) => {
    console.log("task:updated", task);
    projectStore.updateTaskStore(task);
  });

  socket.on(
    "task:deleted",
    (projectId: string, taskGroupId: string, taskId: string) => {
      console.log("task:deleted");
      projectStore.deleteTaskStore(projectId, taskGroupId, taskId);
    }
  );

  // Notification
  socket.on("notification:new-notification", (notification: INotification) => {
    console.log("notification:new-notification");
    userStore.addNotification(notification);
  });

  socket.on("notification:updated", (notification: INotification) => {
    console.log("notification:updated");
    userStore.updateNotification(notification);
  });

  socket.on("notification:read-all", () => {
    console.log("notification:read-all");
    userStore.readAllNotifications();
  });
}

export { socket };
