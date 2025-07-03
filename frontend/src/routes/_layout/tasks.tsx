import { Container, Heading, Flex, Table, Text, Badge } from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { z } from "zod"

import { TasksService } from "@/client"
import AddTask from "@/components/Tasks/AddTask"
import { TaskActionsMenu } from "@/components/Common/TaskActionsMenu"
import PendingTasks from "@/components/Pending/PendingTasks"
import {
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination"

const tasksSearchSchema = z.object({
  page: z.number().catch(1),
})

const PER_PAGE = 5

function getTasksQueryOptions({ page }: { page: number }) {
  return {
    queryFn: () =>
      TasksService.readTasks({ skip: (page - 1) * PER_PAGE, limit: PER_PAGE }),
    queryKey: ["tasks", { page }],
  }
}

export const Route = createFileRoute("/_layout/tasks")({
  component: Tasks,
  validateSearch: (search) => tasksSearchSchema.parse(search),
})

function TasksTable() {
  const navigate = useNavigate({ from: Route.fullPath })
  const { page } = Route.useSearch()

  const { data, isLoading, isPlaceholderData } = useQuery({
    ...getTasksQueryOptions({ page }),
    placeholderData: (prevData) => prevData,
  })

  const setPage = (page: number) =>
    navigate({
      search: (prev: { [key: string]: string }) => ({ ...prev, page }),
    })

  const tasks = data?.data.slice(0, PER_PAGE) ?? []
  const count = data?.count ?? 0

  if (isLoading) {
    return <PendingTasks />
  }

  if (tasks.length === 0) {
    return (
      <Flex direction="column" align="center" justify="center" h="50vh">
        <Text fontSize="xl" fontWeight="bold">
          Aún no tienes tareas
        </Text>
        <Text mt={2}>
          Añade una nueva tarea para empezar
        </Text>
      </Flex>
    )
  }

  return (
    <>
      <Table.Root size={{ base: "sm", md: "md" }}>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader w="20%">Título</Table.ColumnHeader>
            <Table.ColumnHeader w="30%">Descripción</Table.ColumnHeader>
            <Table.ColumnHeader w="15%">Fecha de Vencimiento</Table.ColumnHeader>
            <Table.ColumnHeader w="10%">Estado</Table.ColumnHeader>
            <Table.ColumnHeader w="10%">Prioridad</Table.ColumnHeader>
            <Table.ColumnHeader w="15%">Acciones</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {tasks?.map((task) => (
            <Table.Row key={task.id} opacity={isPlaceholderData ? 0.5 : 1}>
              <Table.Cell w="20%">{task.title}</Table.Cell>
              <Table.Cell w="30%" color={!task.description ? "gray" : "inherit"}>
                {task.description || "N/A"}
              </Table.Cell>
              <Table.Cell w="15%">
                {task.due_date ? new Date(task.due_date).toLocaleDateString() : "N/A"}
              </Table.Cell>
              <Table.Cell w="10%">
                <Badge colorScheme={task.status === "completed" ? "green" : "orange"}>
                  {task.status}
                </Badge>
              </Table.Cell>
              <Table.Cell w="10%">
                <Badge colorScheme={task.priority === "high" ? "red" : task.priority === "medium" ? "yellow" : "blue"}>
                  {task.priority}
                </Badge>
              </Table.Cell>
              <Table.Cell w="15%">
                <TaskActionsMenu task={task} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      <Flex justifyContent="flex-end" mt={4}>
        <PaginationRoot
          count={count}
          pageSize={PER_PAGE}
          onPageChange={({ page }) => setPage(page)}
        >
          <Flex>
            <PaginationPrevTrigger />
            <PaginationNextTrigger />
          </Flex>
        </PaginationRoot>
      </Flex>
    </>
  )
}

function Tasks() {
  return (
    <Container maxW="full">
      <Heading size="lg" pt={12}>
        Gestión de Tareas
      </Heading>

      <AddTask />
      <TasksTable />
    </Container>
  )
}