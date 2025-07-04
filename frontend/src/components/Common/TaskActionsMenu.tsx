import { useState } from "react";
import { MenuContent, MenuRoot, MenuTrigger } from "@/components/ui/menu";
import { IconButton } from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";

import type { TaskPublic } from "@/client";
import DeleteTask from "../Tasks/DeleteTask";
import EditTask from "../Tasks/EditTask";
import { FiEdit } from "react-icons/fi";
import { MenuItem } from "@/components/ui/menu";
import { FiTrash2 } from "react-icons/fi";

interface TaskActionsMenuProps {
  task: TaskPublic;
}

export const TaskActionsMenu = ({ task }: TaskActionsMenuProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      <MenuRoot>
        <MenuTrigger asChild>
          <IconButton variant="ghost" color="inherit" aria-label="Más opciones">
            <BsThreeDotsVertical />
          </IconButton>
        </MenuTrigger>
        <MenuContent>
          <MenuItem
            value="edit-task"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditDialogOpen(true);
            }}
          >
            <FiEdit fontSize="16px" />
            Editar Tarea
          </MenuItem>
          <MenuItem
            value="delete-task"
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleteDialogOpen(true);
            }}
          >
            <FiTrash2 fontSize="16px" />
            Eliminar Tarea
          </MenuItem>
        </MenuContent>
      </MenuRoot>
      
      <EditTask 
        task={task} 
        isOpen={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen} 
      />
      <DeleteTask 
        id={task.id} 
        isOpen={isDeleteDialogOpen} 
        onOpenChange={setIsDeleteDialogOpen} 
      />
    </>
  );
};
