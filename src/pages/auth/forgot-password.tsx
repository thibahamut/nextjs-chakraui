import { useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Container,
  Heading,
  Text,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import Image from 'next/image'
import { api } from '@/lib/api'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const toast = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await api.auth.forgotPassword(email)

      if (error) {
        throw new Error(error)
      }

      toast({
        title: 'Email enviado',
        description: 'Verifique seu email para instruções de recuperação de senha.',
        status: 'success',
      })

      router.push('/auth/login')
    } catch (error) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Ocorreu um erro',
        status: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minH="100vh"
      gap={8}
      p={4}
    >
      <Container maxW="container.sm" py={10}>
        <VStack spacing={8}>
          <Box textAlign="center">
            <Box position="relative" width={200} height={100} mx="auto">
              <Image
                src="/images/vw-logo.png"
                alt="VW Logo"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </Box>
            <Heading mt={4} size="lg">
              Recuperar Senha
            </Heading>
            <Text mt={2} color="gray.600">
              Digite seu email para receber instruções de recuperação de senha
            </Text>
          </Box>

          <Box w="100%" p={8} borderWidth={1} borderRadius="lg">
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  width="100%"
                  isLoading={loading}
                >
                  Enviar instruções
                </Button>

                <Button
                  as={NextLink}
                  href="/auth/login"
                  variant="ghost"
                  colorScheme="blue"
                  width="100%"
                >
                  Voltar para o login
                </Button>
              </VStack>
            </form>
          </Box>
        </VStack>
      </Container>
    </Box>
  )
} 