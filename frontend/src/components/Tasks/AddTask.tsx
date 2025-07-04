import { type TaskCreate, TasksService } from "@/client"
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
} from "@/components/ui/dialog"
import { Field } from "@/components/ui/field"
import useCustomToast from "@/hooks/useCustomToast"
import { Button, Flex, Input, Text, Textarea } from "@chakra-ui/react"
import { Select, createListCollection } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { Controller, type SubmitHandler, useForm } from "react-hook-form"

import { TASK_PRIORITY_OPTIONS } from "@/utils/taskOptions";

const AddTask = () => {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()
  const { showSuccessToast, showErrorToast } = useCustomToast()

  const getTomorrowDate = () => {
    const today = new Date()
    today.setDate(today.getDate() + 1)
    return today.toISOString().split("T")[0]
  }

  const { register, handleSubmit, formState, reset, control } =
    useForm<TaskCreate>({
      defaultValues: {
        due_date: getTomorrowDate(),
        status: "pending",
        priority: "medium",
      },
      shouldUnregister: true,
    })

  const mutation = useMutation({
    mutationFn: (data: TaskCreate) =>
      TasksService.createTask({ requestBody: data }),
    onSuccess: () => {
      showSuccessToast("Tarea creada exitosamente.")
      reset()
      setIsOpen(false)
    },
    onError: (err: any) => {
      showErrorToast(err.body.detail)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
    },
  })

  const onSubmit: SubmitHandler<TaskCreate> = (data) => {
    mutation.mutate(data)
  }

  return (
    <DialogRoot
      size={{ base: "xs", md: "md" }}
      placement="center"
      open={isOpen}
      onOpenChange={({ open }) => setIsOpen(open)}
    >
      <DialogTrigger asChild>
        <Button value="add-task" my={4} onClick={() => setIsOpen(true)}>
          Añadir Tarea
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Añadir Tarea</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Text mb={4}>
              Rellena los detalles para añadir una nueva tarea.
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
              <Field label="Fecha de Vencimiento">
                <Input type="date" {...register("due_date")} />
              </Field>
              
              <Field label="Prioridad">
                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                    <Select.Root
                      collection={createListCollection({ items: TASK_PRIORITY_OPTIONS })}
                      value={[field.value || "medium"]}
                      onValueChange={(details) => field.onChange(details.value[0])}
                    >
                      <Select.Trigger>
                        <Select.ValueText />
                      </Select.Trigger>
                      <Select.Positioner>
                        <Select.Content>
                          {TASK_PRIORITY_OPTIONS.map((option) => (
                            <Select.Item
                              key={option.value}
                              item={option}
                            >
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
                disabled={formState.isSubmitting}
              >
                Cancelar
              </Button>
            </DialogActionTrigger>
            <Button
              variant="solid"
              colorPalette="blue"
              type="submit"
              loading={formState.isSubmitting}
            >
              Añadir
            </Button>
          </DialogFooter>
          <DialogCloseTrigger onClick={() => setIsOpen(false)} />
        </form>
      </DialogContent>
    </DialogRoot>
  )
}

export default AddTask
