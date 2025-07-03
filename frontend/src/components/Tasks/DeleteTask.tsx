import { Button, DialogTitle, Text } from "@chakra-ui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { FiTrash2 } from "react-icons/fi"

import { TasksService } from "@/client"
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
import { MenuItem } from "@/components/ui/menu"
import useCustomToast from "@/hooks/useCustomToast"

const DeleteTask = ({ id }: { id: string }) => {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()
  const { showSuccessToast, showErrorToast } = useCustomToast()
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm()

  const deleteTask = async (id: string) => {
    await TasksService.deleteTask({ id: id })
  }

  const mutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      showSuccessToast("La tarea fue eliminada exitosamente")
      setIsOpen(false)
    },
    onError: () => {
      showErrorToast("Ocurrió un error al eliminar la tarea")
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
    },
  })

  const onSubmit = async () => {
    mutation.mutate(id)
  }

  return (
    <DialogRoot
      size={{ base: "xs", md: "md" }}
      placement="center"
      role="alertdialog"
      open={isOpen}
      onOpenChange={({ open }) => setIsOpen(open)}
    >
      <DialogTrigger asChild>
        <MenuItem onClick={() => setIsOpen(true)} value="delete-task">
          <FiTrash2 fontSize="16px" />
          Eliminar Tarea
        </MenuItem>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Eliminar Tarea</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Text mb={4}>
              Esta tarea se eliminará permanentemente. ¿Estás seguro? No podrás
              deshacer esta acción.
            </Text>
          </DialogBody>

          <DialogFooter gap={2}>
            <DialogActionTrigger asChild>
              <Button
                variant="subtle"
                colorPalette="gray"
                disabled={isSubmitting}
                onClick={() => setIsOpen(false)}
              >
                Cancelar
              </Button>
            </DialogActionTrigger>
            <Button
              variant="solid"
              colorPalette="red"
              type="submit"
              loading={isSubmitting}
            >
              Eliminar
            </Button>
          </DialogFooter>
          <DialogCloseTrigger onClick={() => setIsOpen(false)} />
        </form>
      </DialogContent>
    </DialogRoot>
  )
}

export default DeleteTask
