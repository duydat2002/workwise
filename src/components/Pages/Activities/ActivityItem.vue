<script setup lang="ts">
import Avatar from "@/components/Common/Avatar.vue";
import { findDifferences, formatDate } from "@/helpers";
import { IActivity, ITask, ITaskGroup } from "@/types";
import { ref, onMounted } from "vue";

const props = defineProps<{
  activity: IActivity;
}>();

const content = ref("");
const updated = ref("");

const linkRender = (link: string, content: string = "") => {
  return `<a class='link' href='${link}'>${content}</a>`;
};

const boldRender = (content: string = "") => {
  return `<span class='font-semibold'>${content}</span>`;
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
      content.value = `đã tạo nhóm công việc ${linkRender(
        "",
        taskGroup?.name
      )}`;
      break;
    case "update_taskgroup":
      const oldTaskGroup = props.activity.datas.oldTaskGroup as ITaskGroup;
      const newTaskGroup = props.activity.datas.newTaskGroup as ITaskGroup;
      content.value = `đã cập nhật nhóm công việc ${linkRender(
        "",
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
      content.value = `đã tạo công việc ${linkRender(
        "",
        task?.name
      )} trong nhóm công việc ${boldRender(taskGroup?.name)}.`;
      break;
    case "update_task":
      oldTask = props.activity.datas.oldTask as ITask;
      newTask = props.activity.datas.newTask as ITask;
      content.value = `đã cập nhật công việc ${linkRender("", newTask?.name)}`;
      break;
    case "archive_task":
      task = props.activity.task;
      content.value = `đã lưu trữ công việc ${boldRender(task?.name)}.`;
      break;
    case "unarchive_task":
      task = props.activity.task;
      content.value = `đã khôi phục công việc ${boldRender(task?.name)}.`;
      break;
    case "remove_task":
      task = props.activity.datas.task;
      content.value = `đã xóa công việc ${boldRender(task?.name)}.`;
      break;
    case "assign_task":
      task = props.activity.task;
      newAssignee = props.activity.datas.newAssignee;
      content.value = `đã giao công việc ${boldRender(
        task?.name
      )} cho ${boldRender(newAssignee?.fullname)}.`;
      break;
    case "unassign_task":
      task = props.activity.task;
      oldAssignee = props.activity.datas.oldAssignee;
      content.value = `đã loại ${boldRender(
        oldAssignee?.fullname
      )} khỏi công việc ${boldRender(task?.name)}.`;
      break;
    case "create_approval_task":
      task = props.activity.task;
      approval = props.activity.datas.approval;
      const reviewer = props.activity.project?.members?.find(
        (m) => m.user.id == approval?.reviewedBy
      );

      content.value = `đã gửi yêu cầu phê duyệt công việc ${boldRender(
        task?.name
      )} cho ${boldRender(reviewer?.user.fullname)}.`;
      break;
    case "update_approval_task":
      task = props.activity.task;
      content.value = `đã sửa yêu cầu phê duyệt công việc ${boldRender(
        task?.name
      )}.`;
      break;
    case "accept_approval_task":
      task = props.activity.task;

      content.value = `đã phê duyệt công việc ${boldRender(task?.name)}.`;
      break;
    case "reject_approval_task":
      task = props.activity.task;

      content.value = `đã từ chối phê duyệt công việc ${boldRender(
        task?.name
      )}.`;
      break;
    case "revoked_approval_task":
      task = props.activity.task;

      content.value = `đã hủy yêu cầu phê duyệt công việc ${boldRender(
        task?.name
      )}.`;
      break;
    case "comment_task":
      task = props.activity.task;
      comment = props.activity.datas.comment;

      content.value = `đã bình luận ở công việc ${boldRender(task?.name)}.`;
      updated.value = `<span class='comment'>${comment.content}</span>`;
      break;
    case "add_attachment_task":
      task = props.activity.task;
      attachment = props.activity.datas.attachment;

      content.value = `đã đính kèm tài liệu ${boldRender(
        attachment?.name
      )} cho công việc ${boldRender(task?.name)}.`;
      break;
    case "remove_attachment_task":
      task = props.activity.task;
      attachment = props.activity.datas.attachment;

      content.value = `đã xóa tài liệu ${boldRender(
        attachment?.name
      )} của công việc ${boldRender(task?.name)}.`;
      break;
    default:
      return props.activity.type;
      break;
  }
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
        <span class="" v-html="content != '' ? content : activity.type"></span>
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
