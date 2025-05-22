import { Box, Button, Heading } from '@chakra-ui/react'
import Link from 'next/link'

export default function Login() {
  return (
    <Box minH="100vh" display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={6}>
      <Heading size="lg">Login</Heading>
      <Button as={Link} href="/" colorScheme="blue">
        Voltar para Home
      </Button>
    </Box>
  )
} 