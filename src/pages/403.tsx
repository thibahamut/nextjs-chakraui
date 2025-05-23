import { Box, Heading, Text, Button, VStack, Container } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { FiLock } from 'react-icons/fi'

export default function Forbidden() {
  const router = useRouter()

  return (
    <Container maxW="container.md" py={20}>
      <VStack spacing={8} align="center">
        <Box color="red.500" fontSize="6xl">
          <FiLock />
        </Box>
        <Heading>Acesso Negado</Heading>
        <Text textAlign="center" color="gray.600">
          Você não tem permissão para acessar esta página.
        </Text>
        <Button
          colorScheme="blue"
          onClick={() => router.replace('/')}
        >
          Voltar para o Início
        </Button>
      </VStack>
    </Container>
  )
} 