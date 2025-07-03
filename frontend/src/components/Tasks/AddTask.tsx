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
      showSuccessToast("Task created successfully.")
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
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add Task</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Text mb={4}>Fill in the details to add a new task.</Text>
            <Flex direction={{ base: "column", md: "row" }} gap={4}>
              <Field required label="Title">
                <Input
                  type="text"
                  {...register("title", { required: "Title is required" })}
                  placeholder="Task title"
                />
              </Field>
              <Field label="Description">
                <Textarea
                  {...register("description")}
                  placeholder="Task description"
                />
              </Field>
            </Flex>
            <Flex direction={{ base: "column", md: "row" }} gap={4} mt={4}>
              <Field label="Due Date">
                <Input type="date" {...register("due_date")} />
              </Field>
              <Field label="Status">
                <Input type="text" {...register("status")} placeholder="pending" />
              </Field>
              <Field label="Priority">
                <Input type="text" {...register("priority")} placeholder="medium" />
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
                Cancel
              </Button>
            </DialogActionTrigger>
            <Button
              variant="solid"
              colorPalette="blue"
              type="submit"
              loading={formState.isSubmitting}
            >
              Add
            </Button>
          </DialogFooter>
          <DialogCloseTrigger />
        </form>
      </DialogContent>
    </DialogRoot>
  )
}

export default AddTask