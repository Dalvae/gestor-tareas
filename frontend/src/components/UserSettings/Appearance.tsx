import { Container, Heading, Stack } from "@chakra-ui/react"
import { useTheme } from "next-themes"

import { Radio, RadioGroup } from "@/components/ui/radio"

const Appearance = () => {
  const { theme, setTheme } = useTheme()

  return (
    <>
      <Container maxW="full">
        <Heading size="sm" py={4}>
          Apariencia
        </Heading>

        <RadioGroup
          onValueChange={(e) => setTheme(e.value as string)}
          value={theme}
          colorPalette="teal"
        >
          <Stack>
            <Radio value="system">Sistema</Radio>
            <Radio value="light">Modo Claro</Radio>
            <Radio value="dark">Modo Oscuro</Radio>
          </Stack>
        </RadioGroup>
      </Container>
    </>
  )
}
export default Appearance
