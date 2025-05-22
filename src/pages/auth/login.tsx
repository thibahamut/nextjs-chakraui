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
  const [isLogin, setIsLogin] = useState(true)
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
      const { error } = isLogin 
        ? await api.auth.login(email, password)
        : await api.auth.register(email, password)

      if (error) {
        throw new Error(error)
      }

      toast({
        title: isLogin ? 'Login com sucesso' : 'Registro com sucesso',
        description: isLogin ? 'Bem-vindo de volta!' : 'Por favor, verifique seu email para verificação.',
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
            {isLogin ? 'Login' : 'Register'}
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
                {isLogin && (
                  <FormHelperText textAlign="right">
                    <Link as={NextLink} href="/auth/forgot-password" color="blue.500">
                      Esqueceu sua senha?
                    </Link>
                  </FormHelperText>
                )}
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                width="100%"
                isLoading={loading}
              >
                {isLogin ? 'Login' : 'Register'}
              </Button>

              <HStack spacing={4} width="100%" justify="center">
                <Button
                  variant={isLogin ? "solid" : "outline"}
                  colorScheme="blue"
                  onClick={() => setIsLogin(true)}
                >
                  Login
                </Button>
                <Button
                  variant={!isLogin ? "solid" : "outline"}
                  colorScheme="blue"
                  onClick={() => setIsLogin(false)}
                >
                  Register
                </Button>
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
  )
} 