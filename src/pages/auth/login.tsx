import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
  Container,
  Heading,
  Link,
  Switch,
  FormHelperText,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import Image from 'next/image'
import { api } from '@/lib/api'

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const router = useRouter()
  const toast = useToast()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const { error } = await api.auth.me()
      if (!error) {
        router.push('/app/dashboard')
      }
    } catch (error) {
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
        title: isLogin ? 'Login successful' : 'Registration successful',
        description: isLogin ? 'Welcome back!' : 'Please check your email for verification.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      router.push('/app/dashboard')
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
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
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                width="100%"
                isLoading={loading}
              >
                {isLogin ? 'Login' : 'Register'}
              </Button>

              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="is-login" mb="0">
                  {isLogin ? 'Need an account?' : 'Already have an account?'}
                </FormLabel>
                <Switch
                  id="is-login"
                  isChecked={isLogin}
                  onChange={() => setIsLogin(!isLogin)}
                />
              </FormControl>
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