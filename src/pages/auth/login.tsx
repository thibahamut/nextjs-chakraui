import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Container,
  Heading,
  Link,
  HStack,
  FormHelperText,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import Image from 'next/image'
import { api } from '@/lib/api'
import { toast } from '@/lib/toast'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const { error } = await api.auth.me()
      if (!error) {
        router.push('/app')
      }
    } catch {
      // Não faz nada, usuário não autenticado
    } finally {
      setIsCheckingAuth(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await api.auth.login(email, password)

      if (error) {
        throw new Error(error)
      }

      toast({
        title: 'Login com sucesso',
        description: 'Bem-vindo de volta!',
        status: 'success',
      })

      router.push('/app')
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

  if (isCheckingAuth) {
    return null
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
              Login
            </Heading>
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

                <FormControl isRequired>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <FormHelperText textAlign="right">
                    <Link as={NextLink} href="/auth/forgot-password" color="blue.500">
                      Esqueceu sua senha?
                    </Link>
                  </FormHelperText>
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  width="100%"
                  isLoading={loading}
                >
                  Login
                </Button>

                <HStack spacing={4} width="100%" justify="center">
                  <Link as={NextLink} href="/auth/register" color="blue.500">
                    Não tem conta? Registre-se
                  </Link>
                </HStack>
              </VStack>
            </form>
          </Box>

          <Button
            as={NextLink}
            href="/"
            variant="ghost"
            colorScheme="blue"
          >
            Return to Home
          </Button>
        </VStack>
      </Container>
    </Box>
  )
} 