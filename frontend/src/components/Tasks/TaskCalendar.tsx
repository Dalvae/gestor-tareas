import { Flex, Heading, Text, Box } from "@chakra-ui/react"
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { useQuery } from "@tanstack/react-query"
import { TasksService } from "@/client"
import { useEffect, useState } from "react"

const localizer = momentLocalizer(moment)

const TaskCalendar = () => {
  const { data, isLoading } = useQuery({
    queryFn: () => TasksService.readTasks({ skip: 0, limit: 100 }),
    queryKey: ["tasks"],
  })

  const [events, setEvents] = useState([])

  useEffect(() => {
    if (data?.data) {
      const formattedEvents = data.data.map((task) => ({
        title: task.title,
        start: moment(task.due_date).toDate(),
        end: moment(task.due_date).add(1, 'day').toDate(), // End date is exclusive for allDay events
        allDay: true,
      }))
      setEvents(formattedEvents)
    }
  }, [data])

  if (isLoading) {
    return (
      <Flex direction="column" align="center" justify="center" h="50vh">
        <Heading size="lg">Cargando Calendario...</Heading>
      </Flex>
    )
  }

  return (
    <Flex direction="column" w="100%">
      <Heading size="lg">Vista de Calendario</Heading>
      <Text mt={4}>Aquí se mostrarán las tareas en un calendario.</Text>
      <Box mt={8} h="600px" w="100%">
        {events.length > 0 ? (
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            defaultView="agenda"
            style={{ height: "100%" }}
            messages={{
              next: "Siguiente",
              previous: "Anterior",
              today: "Hoy",
              month: "Mes",
              week: "Semana",
              day: "Día",
              agenda: "Agenda",
              date: "Fecha",
              time: "Hora",
              event: "Evento",
              noEventsInRange: "No hay eventos en este rango.",
            }}
          />
        ) : (
          <Flex direction="column" align="center" justify="center" h="100%">
            <Text fontSize="xl" fontWeight="bold">
              No hay tareas para mostrar en el calendario.
            </Text>
            <Text mt={2}>
              Añade una tarea con fecha de vencimiento para verla aquí.
            </Text>
          </Flex>
        )}
      </Box>
    </Flex>
  )
}

export default TaskCalendar