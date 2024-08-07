<script setup lang="ts">
import Avatar from "@/components/Common/Avatar.vue";
import { findDifferences, formatDate } from "@/helpers";
import { IActivity, IProject, ITask, ITaskGroup } from "@/types";
import { h, ref, onMounted, render, defineComponent, onUnmounted } from "vue";
import { RouterLink, useRouter } from "vue-router";

const props = defineProps<{
  activity: IActivity;
}>();

const router = useRouter();

const content = ref<any>("");
const updated = ref("");

const linkRender = (link: string, content: string = "") => {
  return `<a class='link' href='${link}'>${content}</a>`;
};

const boldRender = (content: string = "") => {
  return `<span class='font-semibold'>${content}</span>`;
};

(window as any).projectRoute = (projectId: string) => {
  router.push({
    name: "Project",
    params: { projectId },
  });
};

const projectRender = (project: IProject) => {
  const projectId = project._id ?? project.id;
  return `<span class='link' onclick="projectRoute('${projectId}')" >${project.name}</span>`;
};

(window as any).taskRoute = (projectId: string, taskId: string) => {
  router.push({
    name: "Project",
    params: { projectId },
    query: { taskSelected: taskId },
  });
};

const taskRender = (project: IProject, task: ITask) => {
  const projectId = project._id ?? project.id;
  const taskId = task._id ?? task.id;
  return `<span class='link' onclick="taskRoute('${projectId}', '${taskId}')" >${task.name}</span>`;
};

onMounted(() => {
  const projectActivity = props.activity.project;
  let member,
    project,
    taskGroup,
    task,
    oldTask,
    newTask,
    comment,
    attachment,
    oldAssignee,
    newAssignee,
    approval: { reviewedBy: string | undefined };
  switch (props.activity.type) {
    case "update_project":
      content.value = `đã cập nhập dự án này.`;

      if (props.activity.datas.oldProject && props.activity.datas.newProject) {
        const diff = findDifferences(
          props.activity.datas.oldProject,
          props.activity.datas.newProject,
          ["name", "background", "description", "startDate", "dueDate"]
        );

        let updatedHtml = "";
        Object.keys(diff).forEach((d) => {
          switch (d) {
            case "name":
              updatedHtml += `<span class='diff-item'>Tên: từ <span class='bold'>${
                diff[d].obj1 ?? "'null'"
              }</span> thành <span class='bold'>${
                diff[d].obj2 ?? "'null'"
              }</span></span>`;
              break;
            case "background":
              updatedHtml += `<span class='diff-item'>Ảnh bìa</span>`;
              break;
            case "description":
              updatedHtml += `<span class='diff-item'>Mô tả: từ <span class='bold'>${
                diff[d].obj1 && diff[d].obj1 != "" ? diff[d].obj1 : "'null'"
              }</span> thành <span class='bold'>${
                diff[d].obj2 && diff[d].obj2 != "" ? diff[d].obj2 : "'null'"
              }</span></span>`;
              break;
            case "startDate":
              updatedHtml += `<span class='diff-item'>Ngày bắt đầu: từ <span class='bold'>${
                diff[d].obj1 ? formatDate(diff[d].obj1) : "'null'"
              }</span> thành <span class='bold'>${
                diff[d].obj2 ? formatDate(diff[d].obj2) : "'null'"
              }</span></span>`;
              break;
            case "dueDate":
              updatedHtml += `<span class='diff-item'>Hạn chót: từ <span class='bold'>${
                diff[d].obj1 ? formatDate(diff[d].obj1) : "'null'"
              }</span> thành <span class='bold'>${
                diff[d].obj2 ? formatDate(diff[d].obj2) : "'null'"
              }</span></span>`;
              break;
            default:
              break;
          }
        });

        updated.value = updatedHtml;
      }
      break;
    case "archive_project":
      content.value = `đã lưu trữ dự án này.`;
      break;
    case "unarchive_project":
      content.value = `đã khôi phục dự án này.`;
      break;
    case "complete_project":
      content.value = `đã hoàn thành dự án này.`;
      break;
    case "reopen_project":
      content.value = `đã mở lại dự án này.`;
      break;
    case "member_join_project":
      content.value = `đã tham gia vào dự án này.`;
      break;
    case "member_left_project":
      content.value = `đã rời khỏi dự án này.`;
      break;
    case "change_role_member_project":
      member = props.activity.datas.member;
      content.value = `đã chỉ định ${boldRender(member.fullname)} là ${
        member.role == "admin" ? "quản lý" : "thành viên"
      } của dự án này.`;
      break;
    case "remove_member_project":
      member = props.activity.datas.member;
      content.value = `đã xóa ${boldRender(member.fullname)} khỏi dự án này.`;
      break;
    case "create_taskgroup":
      taskGroup = props.activity.datas.taskGroup;
      content.value = `đã tạo nhóm công việc ${boldRender(taskGroup?.name)}`;
      break;
    case "update_taskgroup":
      const oldTaskGroup = props.activity.datas.oldTaskGroup as ITaskGroup;
      const newTaskGroup = props.activity.datas.newTaskGroup as ITaskGroup;
      content.value = `đã cập nhật nhóm công việc ${boldRender(
        newTaskGroup?.name
      )}`;

      if (oldTaskGroup && newTaskGroup) {
        const diff = findDifferences(oldTaskGroup, newTaskGroup, [
          "name",
          "color",
        ]);

        let updatedHtml = "";
        Object.keys(diff).forEach((d) => {
          switch (d) {
            case "name":
              updatedHtml += `<span class='diff-item'>Tên: từ <span class='bold'>${
                diff[d].obj1 ?? "'null'"
              }</span> thành <span class='bold'>${
                diff[d].obj2 ?? "'null'"
              }</span></span>`;
              break;
            case "color":
              updatedHtml += `<span class='diff-item flex item-center'>Màu: từ <span class="inline-block w-8 h-4 mx-1" style="background: ${
                diff[d].obj1 ?? "'#fff'"
              }"></span>
              thành <span class="inline-block w-8 h-4 mx-1" style="background: ${
                diff[d].obj2 ?? "'#fff'"
              }"></span></span>`;
              break;
            default:
              break;
          }
        });

        updated.value = updatedHtml;
      }
      break;
    case "archive_taskgroup":
      taskGroup = props.activity.datas.taskGroup;
      content.value = `đã lưu trữ nhóm công việc ${boldRender(
        taskGroup?.name
      )}.`;
      break;
    case "unarchive_taskgroup":
      taskGroup = props.activity.datas.taskGroup;
      content.value = `đã khôi phục nhóm công việc ${linkRender(
        "",
        taskGroup?.name
      )}.`;
      break;
    case "remove_taskgroup":
      taskGroup = props.activity.datas.taskGroup;
      content.value = `đã xóa nhóm công việc ${boldRender(taskGroup?.name)}.`;
      break;
    case "create_task":
      taskGroup = props.activity.datas.taskGroup;
      task = props.activity.task;
      content.value = `đã tạo công việc ${taskRender(
        projectActivity,
        task as ITask
      )} trong nhóm công việc ${boldRender(taskGroup?.name)}.`;
      break;
    case "update_task":
      oldTask = props.activity.datas.oldTask as ITask;
      newTask = props.activity.datas.newTask as ITask;

      content.value = `đã cập nhật công việc ${taskRender(
        projectActivity,
        newTask
      )}`;

      const diffNormal = (name: string, d1: any, d2: any) => {
        return `<span class='diff-item'>${name}: từ <span class='bold'>${
          d1 ?? "'null'"
        }</span> thành <span class='bold'>${d2 ?? "'null'"}</span></span>`;
      };

      const diff = findDifferences(oldTask, newTask, [
        "name",
        "description",
        "priority",
        "labels",
        "startDate",
        "dueDate",
        "status",
        "progress",
      ]);

      let updatedHtml = "";
      Object.keys(diff).forEach((d) => {
        switch (d) {
          case "name":
            updatedHtml += diffNormal("Tên", diff[d].obj1, diff[d].obj2);
            break;
          case "description":
            updatedHtml += diffNormal("Mô tả", diff[d].obj1, diff[d].obj2);
            break;
          case "priority":
            updatedHtml += diffNormal("Độ ưu tiên", diff[d].obj1, diff[d].obj2);
            break;
          case "status":
            updatedHtml += diffNormal("Trạng thái", diff[d].obj1, diff[d].obj2);
            break;
          case "progress":
            updatedHtml += diffNormal("Tiến độ", diff[d].obj1, diff[d].obj2);
            break;
          case "labels":
            updatedHtml += `<span class='diff-item'>Nhãn</span>`;
            break;
          case "startDate":
            updatedHtml += diffNormal(
              "Ngày bắt đầu",
              diff[d].obj1 ? formatDate(diff[d].obj1) : null,
              diff[d].obj2 ? formatDate(diff[d].obj2) : null
            );
            break;
          case "dueDate":
            updatedHtml += diffNormal(
              "Ngày bắt đầu",
              diff[d].obj1 ? formatDate(diff[d].obj1) : null,
              diff[d].obj2 ? formatDate(diff[d].obj2) : null
            );
            break;
          default:
            break;
        }
      });

      updated.value = updatedHtml;
      break;
    case "archive_task":
      task = props.activity.task;
      content.value = `đã lưu trữ công việc ${taskRender(
        projectActivity,
        task as ITask
      )}.`;
      break;
    case "unarchive_task":
      task = props.activity.task;
      content.value = `đã khôi phục công việc ${taskRender(
        projectActivity,
        task as ITask
      )}.`;
      break;
    case "remove_task":
      task = props.activity.datas.task;
      content.value = `đã xóa công việc ${taskRender(
        projectActivity,
        task as ITask
      )}.`;
      break;
    case "assign_task":
      task = props.activity.task;
      newAssignee = props.activity.datas.newAssignee;
      content.value = `đã giao công việc ${taskRender(
        projectActivity,
        task as ITask
      )} cho ${boldRender(newAssignee?.fullname)}.`;
      break;
    case "unassign_task":
      task = props.activity.task;
      oldAssignee = props.activity.datas.oldAssignee;
      content.value = `đã loại ${boldRender(
        oldAssignee?.fullname
      )} khỏi công việc ${taskRender(projectActivity, task as ITask)}.`;
      break;
    case "create_approval_task":
      task = props.activity.task;
      approval = props.activity.datas.approval;
      const reviewer = props.activity.project?.members?.find(
        (m) => m.user.id == approval?.reviewedBy
      );

      content.value = `đã gửi yêu cầu phê duyệt công việc ${taskRender(
        projectActivity,
        task as ITask
      )} cho ${boldRender(reviewer?.user.fullname)}.`;
      break;
    case "update_approval_task":
      task = props.activity.task;
      content.value = `đã sửa yêu cầu phê duyệt công việc ${taskRender(
        projectActivity,
        task as ITask
      )}.`;
      break;
    case "accept_approval_task":
      task = props.activity.task;

      content.value = `đã phê duyệt công việc ${taskRender(
        projectActivity,
        task as ITask
      )}.`;
      break;
    case "reject_approval_task":
      task = props.activity.task;

      content.value = `đã từ chối phê duyệt công việc ${taskRender(
        projectActivity,
        task as ITask
      )}.`;
      break;
    case "revoked_approval_task":
      task = props.activity.task;

      content.value = `đã hủy yêu cầu phê duyệt công việc ${taskRender(
        projectActivity,
        task as ITask
      )}.`;
      break;
    case "comment_task":
      task = props.activity.task;
      comment = props.activity.datas.comment;

      content.value = `đã bình luận ở công việc ${taskRender(
        projectActivity,
        task as ITask
      )}.`;
      updated.value = `<span class='comment'>${comment.content}</span>`;
      break;
    case "add_attachment_task":
      task = props.activity.task;
      attachment = props.activity.datas.attachment;

      content.value = `đã đính kèm tài liệu ${boldRender(
        attachment?.name
      )} cho công việc ${taskRender(projectActivity, task as ITask)}.`;
      break;
    case "remove_attachment_task":
      task = props.activity.task;
      attachment = props.activity.datas.attachment;

      content.value = `đã xóa tài liệu ${boldRender(
        attachment?.name
      )} của công việc ${taskRender(projectActivity, task as ITask)}.`;
      break;
    default:
      return props.activity.type;
      break;
  }
});

onUnmounted(() => {
  delete (window as any).taskRoute;
});
</script>

<template>
  <div class="flex">
    <div
      class="mr-2"
      @click="
        () => {
          console.log(activity);
        }
      "
    >
      <Avatar :avatarUrl="activity.user.avatar" class="w-8" />
    </div>
    <div class="flex flex-col">
      <div class="text-sm text-textColor-primary">
        <span class="font-semibold mr-1">{{ activity.user.fullname }}</span>
        <div class="" v-html="content != '' ? content : activity.type"></div>
      </div>
      <div
        class="flex flex-col text-sm text-textColor-secondary"
        v-html="updated"
      ></div>
      <span class="text-xs text-textColor-secondary">{{
        formatDate(activity.createdAt)
      }}</span>
    </div>
  </div>
</template>

<style scoped>
:deep(.bold) {
  font-weight: 700;
}

:deep(.link) {
  color: var(--link-color);
  cursor: pointer;
}

:deep(.link:hover) {
  text-decoration: underline;
}

:deep(.comment) {
  padding: 4px;
  border-radius: 4px;
  background: var(--secondary-bg-color);
}
</style>
