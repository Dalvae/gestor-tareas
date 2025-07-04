import {
  Badge,
  Button,
  ButtonGroup,
  Container,
  Flex,
  Heading,
  Table,
  Text,
} from "@chakra-ui/react";
import { Select, createListCollection } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { FaCalendarAlt, FaList } from "react-icons/fa";
import { z } from "zod";

import { TasksService } from "@/client";
import { TaskActionsMenu } from "@/components/Common/TaskActionsMenu";
import PendingTasks from "@/components/Pending/PendingTasks";
import AddTask from "@/components/Tasks/AddTask";
import TaskCalendar from "@/components/Tasks/TaskCalendar";
import {
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination";
import { Field } from "@/components/ui/field";
import { TASK_STATUS_OPTIONS, TASK_PRIORITY_OPTIONS } from "@/utils/taskOptions";

const tasksSearchSchema = z.object({
  page: z.number().catch(1),
  status: z.enum(["all", "pending", "in_progress", "completed", "cancelled"]).catch("all"),
  priority: z.enum(["all", "low", "medium", "high"]).catch("all"),
});

const PER_PAGE = 5;

function getTasksQueryOptions({
  page,
  status,
  priority,
}: { page: number; status: string; priority: string }) {
  return {
    queryFn: () =>
      TasksService.readTasks({ skip: (page - 1) * PER_PAGE, limit: 100 }), // Fetch more to allow frontend filtering
    queryKey: ["tasks", { page, status, priority }],
  };
}

export const Route = createFileRoute("/_layout/tasks")({
  component: Tasks,
  validateSearch: (search) => tasksSearchSchema.parse(search),
});

function TasksTable() {
  const navigate = useNavigate({ from: Route.fullPath });
  const { page, status, priority } = Route.useSearch();

  const { data, isLoading, isPlaceholderData } = useQuery({
    ...getTasksQueryOptions({ page, status, priority }),
    placeholderData: (prevData) => prevData,
  });

  const setPage = (page: number) =>
    navigate({
      search: (prev: { [key: string]: string }) => ({ ...prev, page }),
    });

  const filteredTasks = data?.data.filter((task) => {
    const matchesStatus = status === "all" || task.status === status;
    const matchesPriority = priority === "all" || task.priority === priority;
    return matchesStatus && matchesPriority;
  }) ?? [];

  const tasks = filteredTasks.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const count = filteredTasks.length;

  if (isLoading) {
    return <PendingTasks />;
  }

  if (tasks.length === 0) {
    return (
      <Flex direction="column" align="center" justify="center" h="50vh">
        <Text fontSize="xl" fontWeight="bold">
          No tasks found with the selected filters.
        </Text>
        <Text mt={2}>Try adjusting your filters or adding new tasks.</Text>
      </Flex>
    );
  }

  return (
    <>
      <Table.Root size={{ base: "sm", md: "md" }}>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader w="20%">Title</Table.ColumnHeader>
            <Table.ColumnHeader w="30%">Description</Table.ColumnHeader>
            <Table.ColumnHeader w="15%">Due Date</Table.ColumnHeader>
            <Table.ColumnHeader w="10%">Status</Table.ColumnHeader>
            <Table.ColumnHeader w="10%">Priority</Table.ColumnHeader>
            <Table.ColumnHeader w="15%">Actions</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {tasks?.map((task) => (
            <Table.Row key={task.id} opacity={isPlaceholderData ? 0.5 : 1}>
              <Table.Cell w="20%">{task.title}</Table.Cell>
              <Table.Cell
                w="30%"
                color={!task.description ? "gray" : "inherit"}
              >
                {task.description || "N/A"}
              </Table.Cell>
              <Table.Cell w="15%">
                {task.due_date
                  ? new Date(task.due_date).toLocaleDateString()
                  : "N/A"}
              </Table.Cell>
              <Table.Cell w="10%">
                <Badge
                  colorScheme={task.status === "completed" ? "green" : "orange"}
                >
                  {task.status}
                </Badge>
              </Table.Cell>
              <Table.Cell w="10%">
                <Badge
                  colorScheme={
                    task.priority === "high"
                      ? "red"
                      : task.priority === "medium"
                        ? "yellow"
                        : "blue"
                  }
                >
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
  );
}

function Tasks() {
  const [view, setView] = useState<"list" | "calendar">("list");
  const navigate = useNavigate({ from: Route.fullPath });
  const { status, priority } = Route.useSearch();

  const setStatus = (newStatus: string) => {
    navigate({
      search: (prev: { [key: string]: string }) => ({
        ...prev,
        status: newStatus,
        page: 1, // Reset page when filter changes
      }),
    });
  };

  const setPriority = (newPriority: string) => {
    navigate({
      search: (prev: { [key: string]: string }) => ({
        ...prev,
        priority: newPriority,
        page: 1, // Reset page when filter changes
      }),
    });
  };

  return (
    <Container maxW="full">
      <Flex justify="space-between" align="center" pt={8}>
        <Heading size="lg">Task Management</Heading>
        <ButtonGroup attached variant="outline">
          <Button
            onClick={() => setView("list")}
            colorScheme={view === "list" ? "blue" : "gray"}
          >
            <Flex align="center" gap={2}>
              <FaList />
              List
            </Flex>
          </Button>
          <Button
            onClick={() => setView("calendar")}
            colorScheme={view === "calendar" ? "blue" : "gray"}
          >
            <Flex align="center" gap={2}>
              <FaCalendarAlt />
              Calendar
            </Flex>
          </Button>
        </ButtonGroup>
      </Flex>

      <Flex mt={4} gap={4} wrap="wrap" align="flex-end">
        <AddTask />
        <Field label="Status">
          <Select.Root
            collection={createListCollection({ items: TASK_STATUS_OPTIONS })}
            value={[status || "all"]}
            onValueChange={(details) => setStatus(details.value[0])}
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
        </Field>

        <Field label="Priority">
          <Select.Root
            collection={createListCollection({ items: TASK_PRIORITY_OPTIONS })}
            value={[priority || "all"]}
            onValueChange={(details) => setPriority(details.value[0])}
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
        </Field>
      </Flex>

      {view === "list" ? <TasksTable /> : <TaskCalendar />}
    </Container>
  );
}