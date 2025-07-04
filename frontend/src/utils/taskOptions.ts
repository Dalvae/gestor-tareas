import { TaskPriority, TaskStatus } from "@/client/types.gen";

interface Option<T> {
  value: T;
  label: string;
}

export const TASK_STATUS_OPTIONS: Option<TaskStatus | "all">[] = [
  { value: "all", label: "Todas" },
  { value: "pending", label: "Pendiente" },
  { value: "in_progress", label: "En Progreso" },
  { value: "completed", label: "Completada" },
  { value: "cancelled", label: "Cancelada" },
];

export const TASK_PRIORITY_OPTIONS: Option<TaskPriority | "all">[] = [
  { value: "all", label: "Todas" },
  { value: "low", label: "Baja" },
  { value: "medium", label: "Media" },
  { value: "high", label: "Alta" },
];
