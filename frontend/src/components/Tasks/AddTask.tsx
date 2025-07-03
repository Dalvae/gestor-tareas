import { Button, DialogTitle, Flex, Input, Text, Textarea } from "@chakra-ui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { SubmitHandler, useForm } from "react-hook-form"

import { TasksService, type TaskCreate } from "@/client"
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field } from "@/components/ui/field"
import useCustomToast from "@/hooks/useCustomToast"

const AddTask = () => {
  const queryClient = useQueryClient()
  const { showSuccessToast, showErrorToast } = useCustomToast()
  const { register, handleSubmit, formState, reset } = useForm<TaskCreate>()

  const mutation = useMutation({
    mutationFn: (data: TaskCreate) => TasksService.createTask({ requestBody: data }),
    onSuccess: () => {
      showSuccessToast("Tarea creada exitosamente.")
      reset()
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
    <DialogRoot>
      <DialogTrigger asChild>
        <Button value="add-task" my={4}>
          Añadir Tarea
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Añadir Tarea</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Text mb={4}>Rellena los detalles para añadir una nueva tarea.</Text>
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
              <Field label="Estado">
                <Input type="text" {...register("status")} placeholder="pendiente" />
              </Field>
              <Field label="Prioridad">
                <Input type="text" {...register("priority")} placeholder="media" />
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
          <DialogCloseTrigger />
        </form>
      </DialogContent>
    </DialogRoot>
  )
}

export default AddTask