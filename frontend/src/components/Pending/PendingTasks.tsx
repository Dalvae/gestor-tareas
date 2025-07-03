import { Flex, Spinner, Text } from "@chakra-ui/react"

const PendingTasks = () => (
  <Flex direction="column" align="center" justify="center" h="50vh">
    <Spinner size="xl" color="blue.500" />
    <Text fontSize="xl" fontWeight="bold" mt={4}>
      Loading tasks...
    </Text>
  </Flex>
)

export default PendingTasks
