import { TaskPriority, TaskStatus } from "@/client/types.gen";

interface Option<T> {
  value: T;
  label: string;
}

export const TASK_STATUS_OPTIONS: Option<TaskStatus | "all">[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export const TASK_PRIORITY_OPTIONS: Option<TaskPriority | "all">[] = [
  { value: "all", label: "All" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];
