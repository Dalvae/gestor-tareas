import { Flex, Heading, Text } from "@chakra-ui/react"

const TaskCalendar = () => {
  return (
    <Flex direction="column" align="center" justify="center" h="50vh">
      <Heading size="lg">Vista de Calendario</Heading>
      <Text mt={4}>Aquí se mostrarán las tareas en un calendario.</Text>
    </Flex>
  )
}

export default TaskCalendar
