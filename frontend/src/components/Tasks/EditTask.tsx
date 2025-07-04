import { type TaskPublic, type TaskUpdate, TasksService } from "@/client";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { MenuItem } from "@/components/ui/menu";
import useCustomToast from "@/hooks/useCustomToast";
import { Button, Flex, Input, Text, Textarea } from "@chakra-ui/react";
import { Select, createListCollection } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { FiEdit } from "react-icons/fi";

import {
  TASK_PRIORITY_OPTIONS,
  TASK_STATUS_OPTIONS,
} from "@/utils/taskOptions";

interface EditTaskProps {
  task: TaskPublic;
}

interface TaskUpdateForm {
  title: string;
  description?: string;
  due_date?: string;
  status?: "pending" | "in_progress" | "completed" | "cancelled" | null;
  priority?: "low" | "medium" | "high" | null;
}

const EditTask = ({ task }: EditTaskProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useCustomToast();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
    control,
  } = useForm<TaskUpdateForm>({
    defaultValues: {
      ...task,
      due_date: task.due_date
        ? new Date(task.due_date).toISOString().split("T")[0]
        : undefined,
      description: task.description ?? undefined,
      status: task.status ?? "pending",
      priority: task.priority ?? "medium",
    },
    shouldUnregister: true,
  });

  const mutation = useMutation({
    mutationFn: (data: TaskUpdate) =>
      TasksService.updateTask({ id: task.id, requestBody: data }),
    onSuccess: () => {
      showSuccessToast("Tarea actualizada exitosamente.");
      reset();
      setIsOpen(false);
    },
    onError: (err: any) => {
      showErrorToast(err.body.detail);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const onSubmit: SubmitHandler<TaskUpdateForm> = async (data) => {
    mutation.mutate(data);
  };

  return (
    <DialogRoot
      size={{ base: "xs", md: "md" }}
      placement="center"
      open={isOpen}
      onOpenChange={({ open }) => setIsOpen(open)}
    >
      <MenuItem
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(true);
        }}
        value="edit-task"
      >
        <FiEdit fontSize="16px" />
        Editar Tarea
      </MenuItem>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Editar Tarea</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Text mb={4}>
              Actualiza los detalles de la tarea a continuación.
            </Text>
            <Flex direction={{ base: "column", md: "row" }} gap={4}>
              <Field required label="Título">
                <Input
                  type="text"
                  {...register("title", { required: "El título es requerido" })}
                  placeholder="Título de la tarea"
                />
              </Field>
              <Field label="Descripción">
                <Textarea
                  {...register("description")}
                  placeholder="Descripción de la tarea"
                />
              </Field>
            </Flex>
            <Flex direction={{ base: "column", md: "row" }} gap={4} mt={4}>
              <Field
                label="Fecha de Vencimiento"
                errorText={errors.due_date?.message}
              >
                <Input
                  type="date"
                  {...register("due_date", {
                    validate: (value) => {
                      if (value && new Date(value) < new Date()) {
                        showErrorToast(
                          "La fecha de vencimiento debe ser en el futuro.",
                        );
                        return "La fecha de vencimiento debe ser en el futuro.";
                      }
                      return true;
                    },
                  })}
                />
              </Field>
              <Field label="Estado">
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select.Root
                      collection={createListCollection({
                        items: TASK_STATUS_OPTIONS,
                      })}
                      value={[field.value || "pending"]}
                      onValueChange={(details) =>
                        field.onChange(details.value[0])
                      }
                    >
                      <Select.Trigger>
                        <Select.ValueText />
                      </Select.Trigger>
                      <Select.Positioner>
                        <Select.Content>
                          {TASK_STATUS_OPTIONS.map((option) => (
                            <Select.Item key={option.value} item={option}>
                              <Select.ItemText>{option.label}</Select.ItemText>
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Select.Root>
                  )}
                />
              </Field>
              <Field label="Prioridad">
                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                    <Select.Root
                      collection={createListCollection({
                        items: TASK_PRIORITY_OPTIONS,
                      })}
                      value={[field.value || "medium"]}
                      onValueChange={(details) =>
                        field.onChange(details.value[0])
                      }
                    >
                      <Select.Trigger>
                        <Select.ValueText />
                      </Select.Trigger>
                      <Select.Positioner>
                        <Select.Content>
                          {TASK_PRIORITY_OPTIONS.map((option) => (
                            <Select.Item key={option.value} item={option}>
                              <Select.ItemText>{option.label}</Select.ItemText>
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Select.Root>
                  )}
                />
              </Field>
            </Flex>
          </DialogBody>

          <DialogFooter gap={2}>
            <DialogActionTrigger asChild>
              <Button
                variant="subtle"
                colorPalette="gray"
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
            </DialogActionTrigger>
            <Button
              variant="solid"
              colorPalette="blue"
              type="submit"
              loading={isSubmitting}
            >
              Guardar
            </Button>
          </DialogFooter>
          <DialogCloseTrigger onClick={() => setIsOpen(false)} />
        </form>
      </DialogContent>
    </DialogRoot>
  );
};

export default EditTask;
