<script setup lang="ts">
import XIcon from "@icons/x.svg";
import CheckIcon from "@icons/check.svg";
import SearchIcon from "@icons/search.svg";
import FilterIcon from "@icons/filter.svg";
import PriorityLowestIcon from "@icons/priority-lowest.svg";
import PriorityLowIcon from "@icons/priority-low.svg";
import PriorityMediumIcon from "@icons/priority-medium.svg";
import PriorityHighIcon from "@icons/priority-high.svg";
import MoreIcon from "@icons/more.svg";
import Avatar from "@/components/Common/Avatar.vue";
import { useProjectStore, useUserStore } from "@/stores";
import { storeToRefs } from "pinia";
import { computed, ref, shallowRef, watch } from "vue";
import Popper from "vue3-popper";
import UInput from "@/components/UI/UInput.vue";
import { cloneDeep } from "lodash";

const emit = defineEmits(["filter"]);

const { user } = storeToRefs(useUserStore());
const { project } = storeToRefs(useProjectStore());

const taskCount = ref(0);
const search = ref("");
const assigneeSelected = ref<string[]>([]);
const labelSelected = ref<string[]>([]);
const prioritySelected = ref<string[]>([]);
const statusSelected = ref<string[]>([]);
const searchAssignee = ref("");
const searchLabel = ref("");
const showFilter = ref(false);
const showAssigneeDropdown = ref(false);
const showLabelDropdown = ref(false);

const priorities = shallowRef([
  { id: "high", name: "Cao", icon: PriorityHighIcon },
  { id: "medium", name: "Trung bình", icon: PriorityMediumIcon },
  { id: "low", name: "Thấp", icon: PriorityLowIcon },
  { id: "none", name: "Không", icon: PriorityLowestIcon },
]);

const labelSearch = computed(() => {
  return project.value?.createdTaskLabels.filter((l) =>
    l.name.toLowerCase().includes(searchLabel.value.toLowerCase())
  );
});

const members = computed(() => {
  return project.value?.members.filter((m) => m.status == "accepted");
});

const memberSearch = computed(() => {
  return members.value?.filter(
    (m) =>
      m.user.fullname
        .toLowerCase()
        .includes(searchAssignee.value.toLowerCase()) &&
      m.user.email.toLowerCase().includes(searchAssignee.value.toLowerCase())
  );
});

const countFilters = computed(() => {
  return (
    assigneeSelected.value.length +
    labelSelected.value.length +
    prioritySelected.value.length +
    statusSelected.value.length
  );
});

const handleChooseAssignee = (id: string) => {
  if (!assigneeSelected.value.includes(id)) {
    assigneeSelected.value.push(id);
  } else {
    const index = assigneeSelected.value.findIndex((s) => s == id);
    assigneeSelected.value.splice(index, 1);
  }
};

const handleChooseLabel = (id: string) => {
  if (!labelSelected.value.includes(id)) {
    labelSelected.value.push(id);
  } else {
    const index = labelSelected.value.findIndex((s) => s == id);
    labelSelected.value.splice(index, 1);
  }
};

const handleChoosePriority = (id: string) => {
  if (!prioritySelected.value.includes(id)) {
    prioritySelected.value.push(id);
  } else {
    const index = prioritySelected.value.findIndex((s) => s == id);
    prioritySelected.value.splice(index, 1);
  }
};

const handleChooseStatus = (id: string) => {
  if (!statusSelected.value.includes(id)) {
    statusSelected.value.push(id);
  } else {
    const index = statusSelected.value.findIndex((s) => s == id);
    statusSelected.value.splice(index, 1);
  }
};

const handleClearAllFilter = () => {
  assigneeSelected.value = [];
  labelSelected.value = [];
  prioritySelected.value = [];
  statusSelected.value = [];
};

watch(
  [search, assigneeSelected, labelSelected, prioritySelected, statusSelected],
  () => {
    taskCount.value = 0;

    const temp = cloneDeep(project.value);
    temp?.taskGroups.forEach((g) => {
      g.tasks.forEach((t) => {
        const matchesSearch = t.name
          .toLowerCase()
          .includes(search.value.toLowerCase());
        const matchesAssignee =
          assigneeSelected.value.length == 0 ||
          assigneeSelected.value.includes(t.assignee?.id ?? "unassign");
        const matchesLabel =
          labelSelected.value.length == 0 ||
          t.labels.some((label) => labelSelected.value.includes(label.id));
        const matchesPriority =
          prioritySelected.value.length == 0 ||
          prioritySelected.value.includes(t.priority);
        const matchesStatus =
          statusSelected.value.length == 0 ||
          statusSelected.value.includes(t.status);

        if (
          matchesSearch &&
          matchesAssignee &&
          matchesLabel &&
          matchesPriority &&
          matchesStatus
        ) {
          taskCount.value++;
          t.isHidden = false;
        } else {
          t.isHidden = true;
        }
      });
    });

    emit("filter", temp);
  },
  { deep: true, immediate: true }
);
</script>

<template>
  <div class="flex flex-wrap px-5 gap-3 pb-3">
    <div class="">
      <UInput
        class="w-[250px]"
        name="search_project"
        v-model:propValue="search"
        placeholder="Tìm kiếm công việc"
      >
        <template #left>
          <SearchIcon class="w-4 fill-textColor-secondary" />
        </template>
      </UInput>
    </div>
    <div
      class="relative h-full"
      v-click-outside.short="
        () => {
          showFilter = false;
        }
      "
    >
      <div
        class="flex items-center h-full px-2 py-1 rounded-md bg-bgColor-secondary hover:bg-hover cursor-pointer"
        @click="
          () => {
            showFilter = !showFilter;
          }
        "
      >
        <FilterIcon class="w-4 fill-textColor-primary mr-1" />
        <span class="text-sm font-semibold text-textColor-primary">{{
          countFilters != 0 ? `Đã áp dụng ${countFilters} bộ lọc` : "Bộ lọc"
        }}</span>
      </div>
      <div
        v-if="showFilter"
        class="absolute top-full left-0 min-w-full w-max pt-1 z-10"
      >
        <div
          class="flex flex-col px-3 py-2 w-[320px] bg-bgColor-primary rounded-md shadow overflow-visible z-10"
        >
          <div
            class="flex items-center justify-between border-b border-borderColor pb-2 mb-2"
          >
            <div class="">
              <span class="text-base text-textColor-primary font-semibold"
                >Lọc
              </span>
              <span class="text-xs text-textColor-secondary"
                >Tìm được ({{ taskCount }}) kết quả</span
              >
            </div>
            <span
              class="text-xs text-textColor-secondary hover:text-primary active:text-primary hover:underline cursor-pointer"
              @click="handleClearAllFilter"
              >Bỏ lọc</span
            >
          </div>
          <div class="flex flex-col not-lastchild:mb-3 mb-2">
            <div class="flex flex-col">
              <div class="flex items-center mb-2">
                <span
                  class="uppercase text-xs font-semibold text-textColor-secondary"
                  >Người thực hiện ({{ assigneeSelected.length }})</span
                >
                <Popper
                  hover
                  offsetDistance="8"
                  content="Bỏ lọc"
                  openDelay="300"
                >
                  <XIcon
                    v-if="assigneeSelected.length > 0"
                    class="w-[10px] fill-textColor-secondary ml-2 cursor-pointer hover:fill-error active:error"
                    @click="
                      () => {
                        assigneeSelected = [];
                      }
                    "
                  />
                </Popper>
              </div>
              <div class="flex flex-wrap gap-1">
                <Popper hover offsetDistance="4" content="Không chỉ định">
                  <div
                    class="w-8 h-8 rounded-full border-2 cursor-pointer"
                    :class="
                      assigneeSelected.includes('unassign')
                        ? 'border-primary'
                        : 'border-transparent'
                    "
                    @click="handleChooseAssignee('unassign')"
                  >
                    <Avatar class="w-full grayscale" />
                  </div>
                </Popper>
                <template v-for="member in members" :key="member.id">
                  <Popper
                    hover
                    offsetDistance="4"
                    :content="`${member.user.fullname} (${member.user.email})`"
                  >
                    <div
                      class="w-8 h-8 rounded-full border-2 border-primary cursor-pointer"
                      :class="
                        assigneeSelected.includes(member.user.id)
                          ? 'border-primary'
                          : 'border-transparent'
                      "
                      @click="handleChooseAssignee(member.user.id)"
                    >
                      <Avatar class="w-full" :avatarUrl="member.user.avatar" />
                    </div>
                  </Popper>
                </template>
                <div
                  class="relative"
                  v-click-outside.short="
                    () => {
                      showAssigneeDropdown = false;
                    }
                  "
                >
                  <div
                    class="w-8 h-8 flex flex-center rounded-full bg-bgColor-secondary border-2 border-transparent cursor-pointer hover:bg-hover active:hover"
                    @click="
                      () => {
                        showAssigneeDropdown = !showAssigneeDropdown;
                      }
                    "
                  >
                    <MoreIcon class="w-4 fill-textColor-primary" />
                  </div>
                  <div
                    v-if="showAssigneeDropdown"
                    class="absolute top-full left-0 min-w-full w-[250px] pt-2 z-10"
                  >
                    <div
                      class="flex flex-col p-2 bg-bgColor-primary rounded-md shadow overflow-hidden z-10"
                    >
                      <UInput
                        v-model:propValue="searchAssignee"
                        placeholder="Tìm người thực hiện"
                        padding="px-2 py-1 min-h-auto"
                      >
                        <template #left>
                          <SearchIcon
                            class="w-4 flex-shrink-0 fill-textColor-secondary"
                          />
                        </template>
                      </UInput>
                      <div
                        class="flex flex-col max-h-[200px] overflow-y-auto scroll-vert mt-2"
                      >
                        <div
                          class="flex items-center px-2 py-1 rounded hover:bg-hover active:bg-hover cursor-pointer"
                          @click="handleChooseAssignee('unassign')"
                        >
                          <div class="flex-shrink-0 mr-2">
                            <Avatar class="w-6 grayscale" />
                          </div>
                          <span
                            class="flex-1 text-dots overflow-hidden font-medium"
                          >
                            Không chỉ định
                          </span>
                          <div class="flex-shrink-0">
                            <CheckIcon
                              v-if="assigneeSelected.includes('unassign')"
                              class="w-3 fill-primary"
                            />
                          </div>
                        </div>
                        <div
                          v-for="member in memberSearch"
                          :key="member.id"
                          class="flex items-center px-2 py-1 rounded hover:bg-hover active:bg-hover cursor-pointer"
                          @click="handleChooseAssignee(member.user.id)"
                        >
                          <div class="flex-shrink-0 mr-2">
                            <Avatar
                              class="w-6"
                              :avatarUrl="member.user.avatar"
                            />
                          </div>
                          <div class="flex flex-col overflow-hidden flex-1">
                            <span
                              class="text-sm text-textColor-primary font-medium text-dots"
                              >{{ member.user.fullname
                              }}{{
                                user!.id == member.user.id ? " (bạn)" : ""
                              }}</span
                            >
                            <span
                              class="text-sm text-textColor-secondary text-dots"
                              >{{ member.user.email }}</span
                            >
                          </div>
                          <div class="flex-shrink-0">
                            <CheckIcon
                              v-if="assigneeSelected.includes(member.user.id)"
                              class="w-3 fill-primary"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex flex-col">
              <div class="flex items-center mb-2">
                <span
                  class="uppercase text-xs font-semibold text-textColor-secondary"
                  >Nhãn ({{ labelSelected.length }})</span
                >
                <Popper
                  hover
                  offsetDistance="8"
                  content="Bỏ lọc"
                  openDelay="300"
                >
                  <XIcon
                    v-if="labelSelected.length > 0"
                    class="w-[10px] fill-textColor-secondary ml-2 cursor-pointer hover:fill-error active:error"
                    @click="
                      () => {
                        labelSelected = [];
                      }
                    "
                  />
                </Popper>
              </div>
              <div class="flex flex-wrap gap-1">
                <div class="flex items-center flex-wrap gap-1">
                  <template
                    v-for="label in project?.createdTaskLabels"
                    :key="label.id"
                  >
                    <div
                      class="px-2 py-1 rounded cursor-pointer border-2 text-xs text-[#44546f] transition-all duration-200"
                      :class="
                        labelSelected.includes(label.id)
                          ? 'border-primary'
                          : 'border-transparent'
                      "
                      @click="handleChooseLabel(label.id)"
                      :style="{
                        background: label.color,
                      }"
                    >
                      <span class="font-medium">
                        {{ label.name }}
                      </span>
                    </div>
                  </template>
                </div>
                <div
                  class="relative"
                  v-click-outside.short="
                    () => {
                      showLabelDropdown = false;
                    }
                  "
                >
                  <div
                    class="w-8 h-8 flex flex-center rounded-full bg-bgColor-secondary border-2 border-transparent cursor-pointer hover:bg-hover active:hover"
                    @click="
                      () => {
                        showLabelDropdown = !showLabelDropdown;
                      }
                    "
                  >
                    <MoreIcon class="w-4 fill-textColor-primary" />
                  </div>
                  <div
                    v-if="showLabelDropdown"
                    class="absolute top-full left-0 min-w-full w-[250px] pt-2 z-10"
                  >
                    <div
                      class="flex flex-col p-2 bg-bgColor-primary rounded-md shadow overflow-hidden z-10"
                    >
                      <UInput
                        v-model:propValue="searchLabel"
                        placeholder="Tìm nhãn"
                        padding="px-2 py-1 min-h-auto"
                      >
                        <template #left>
                          <SearchIcon
                            class="w-4 flex-shrink-0 fill-textColor-secondary"
                          />
                        </template>
                      </UInput>
                      <div
                        class="flex flex-col max-h-[200px] overflow-y-auto scroll-vert not-lastchild:mb-2 mt-2"
                      >
                        <div
                          v-if="labelSearch && labelSearch.length > 0"
                          v-for="label in labelSearch"
                          :key="label.id"
                          class="flex-1 px-3 mx-2 rounded border-2 text-[#44546f] font-medium leading-8 cursor-pointer"
                          :class="
                            labelSelected.includes(label.id)
                              ? 'border-primary'
                              : 'border-transparent'
                          "
                          @click="handleChooseLabel(label.id)"
                          :style="{ background: label.color }"
                        >
                          <span>{{ label.name }}</span>
                        </div>
                        <div v-else class="text-textColor-secondary p2">
                          Không tìm thấy nhãn.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex flex-col">
              <div class="flex items-center mb-2">
                <span
                  class="uppercase text-xs font-semibold text-textColor-secondary"
                  >Độ ưu tiên ({{ prioritySelected.length }})</span
                >
                <Popper
                  hover
                  offsetDistance="8"
                  content="Bỏ lọc"
                  openDelay="300"
                >
                  <XIcon
                    v-if="prioritySelected.length > 0"
                    class="w-[10px] fill-textColor-secondary ml-2 cursor-pointer hover:fill-error active:error"
                    @click="
                      () => {
                        prioritySelected = [];
                      }
                    "
                  />
                </Popper>
              </div>
              <div class="flex flex-wrap gap-1">
                <template v-for="priority in priorities" :key="priority.id">
                  <Popper hover offsetDistance="4" :content="priority.name">
                    <div
                      class="w-8 h-8 rounded-full flex flex-center border-2 cursor-pointer"
                      :class="
                        prioritySelected.includes(priority.id)
                          ? 'border-primary'
                          : 'border-transparent'
                      "
                      @click="handleChoosePriority(priority.id)"
                    >
                      <component :is="priority.icon" class="w-4" />
                    </div>
                  </Popper>
                </template>
              </div>
            </div>
            <div class="flex flex-col">
              <div class="flex items-center mb-2">
                <span
                  class="uppercase text-xs font-semibold text-textColor-secondary"
                  >Trạng thái ({{ statusSelected.length }})</span
                >
                <Popper
                  hover
                  offsetDistance="8"
                  content="Bỏ lọc"
                  openDelay="300"
                >
                  <XIcon
                    v-if="statusSelected.length > 0"
                    class="w-[10px] fill-textColor-secondary ml-2 cursor-pointer hover:fill-error active:error"
                    @click="
                      () => {
                        statusSelected = [];
                      }
                    "
                  />
                </Popper>
              </div>
              <div class="flex flex-wrap gap-1">
                <div
                  class="text-xs font-semibold bg-hover text-textColor-primary px-1 py-[1px] rounded border-2 cursor-pointer"
                  :class="
                    statusSelected.includes('todo')
                      ? 'border-primary'
                      : 'border-transparent'
                  "
                  @click="handleChooseStatus('todo')"
                >
                  Cần thực hiện
                </div>
                <div
                  class="text-xs font-semibold bg-blue-200 text-blue-600 px-1 py-[1px] rounded border-2 cursor-pointer"
                  :class="
                    statusSelected.includes('inprogress')
                      ? 'border-primary'
                      : 'border-transparent'
                  "
                  @click="handleChooseStatus('inprogress')"
                >
                  Đang thực hiện
                </div>
                <div
                  class="text-xs font-semibold bg-green-200 text-green-600 px-1 py-[1px] rounded border-2 cursor-pointer"
                  :class="
                    statusSelected.includes('completed')
                      ? 'border-primary'
                      : 'border-transparent'
                  "
                  @click="handleChooseStatus('completed')"
                >
                  Đã hoàn thành
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
