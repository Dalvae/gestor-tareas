import { Button, DialogTitle, Flex, Input, Text, Textarea } from "@chakra-ui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { SubmitHandler, useForm } from "react-hook-form"
import { useState } from "react"
import { FiEdit } from "react-icons/fi"

import { TasksService, type TaskPublic, type TaskUpdate } from "@/client"
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
import { MenuItem } from "@/components/ui/menu"
import useCustomToast from "@/hooks/useCustomToast"

interface EditTaskProps {
  task: TaskPublic
}

interface TaskUpdateForm {
  title: string
  description?: string
  due_date?: string
  status?: string
  priority?: string
}

const EditTask = ({ task }: EditTaskProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()
  const { showSuccessToast, showErrorToast } = useCustomToast()
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<TaskUpdateForm>({
    defaultValues: {
      ...task,
      due_date: task.due_date ? new Date(task.due_date).toISOString().split("T")[0] : undefined,
      description: task.description ?? undefined,
    },
  })

  const mutation = useMutation({
    mutationFn: (data: TaskUpdate) => TasksService.updateTask({ id: task.id, requestBody: data }),
    onSuccess: () => {
      showSuccessToast("Task updated successfully.")
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

  const onSubmit: SubmitHandler<TaskUpdateForm> = async (data) => {
    mutation.mutate(data)
  }

  return (
    <DialogRoot open={isOpen} onOpenChange={({ open }) => setIsOpen(open)}>
      <DialogTrigger asChild>
        <MenuItem onClick={() => setIsOpen(true)} value="edit-task">
          <FiEdit fontSize="16px" />
          Edit Task
        </MenuItem>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Text mb={4}>Update the task details below.</Text>
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
                <Input type="text" {...register("priority")}
                  placeholder="medium" />
              </Field>
            </Flex>
          </DialogBody>

          <DialogFooter gap={2}>
            <DialogActionTrigger asChild>
              <Button
                variant="subtle"
                colorPalette="gray"
                disabled={isSubmitting}
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
            </DialogActionTrigger>
            <Button
              variant="solid"
              colorPalette="blue"
              type="submit"
              loading={isSubmitting}
            >
              Save
            </Button>
          </DialogFooter>
          <DialogCloseTrigger onClick={() => setIsOpen(false)} />
        </form>
      </DialogContent>
    </DialogRoot>
  )
}

export default EditTask
