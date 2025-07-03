import { Skeleton, Table } from "@chakra-ui/react"

const PendingUsers = () => (
  <Table.Root size={{ base: "sm", md: "md" }}>
    <Table.Header>
      <Table.Row>
        <Table.ColumnHeader w="20%">Nombre completo</Table.ColumnHeader>
        <Table.ColumnHeader w="25%">Correo electrónico</Table.ColumnHeader>
        <Table.ColumnHeader w="15%">Rol</Table.ColumnHeader>
        <Table.ColumnHeader w="20%">Estado</Table.ColumnHeader>
        <Table.ColumnHeader w="20%">Acciones</Table.ColumnHeader>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {[...Array(5)].map((_, index) => (
        <Table.Row key={index}>
          <Table.Cell>
            <Skeleton h="20px" />
          </Table.Cell>
          <Table.Cell>
            <Skeleton h="20px" />
          </Table.Cell>
          <Table.Cell>
            <Skeleton h="20px" />
          </Table.Cell>
          <Table.Cell>
            <Skeleton h="20px" />
          </Table.Cell>
          <Table.Cell>
            <Skeleton h="20px" />
          </Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table.Root>
)

export default PendingUsers
