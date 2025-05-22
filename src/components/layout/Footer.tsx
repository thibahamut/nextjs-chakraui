import { Box, Text } from '@chakra-ui/react'

export function Footer() {
  return (
    <Box as="footer" w="100%" p={4} borderTopWidth={1}>
      <Text textAlign="center">
        © {new Date().getFullYear()} VWCO Cooperados. Todos os direitos reservados.
      </Text>
    </Box>
  )
} 