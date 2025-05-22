import { Box, Button, Heading, Input, VStack, Text, useToast, FormControl, FormLabel } from '@chakra-ui/react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabase'

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const toast = useToast()
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          router.replace('/app/dashboard')
        }
      } catch (error) {
        console.error('Error checking auth:', error)
      } finally {
        setIsCheckingAuth(false)
      }
    }

    checkUser()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          toast({
            title: 'Erro',
            description: error.message,
            status: 'error',
            duration: 3000,
            isClosable: true,
          })
          return
        }

        toast({
          title: 'Login realizado com sucesso!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        router.replace('/app/dashboard')
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })

        if (error) {
          toast({
            title: 'Erro',
            description: error.message,
            status: 'error',
            duration: 3000,
            isClosable: true,
          })
          return
        }

        toast({
          title: 'Cadastro realizado com sucesso!',
          description: 'Verifique seu email para confirmar o cadastro.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
        router.replace('/app/dashboard')
      }
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Mostra nada enquanto verifica a autenticação
  if (isCheckingAuth) {
    return null
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={6} p={4}>
      <VStack spacing={8} w="full" maxW="400px" bg="white" p={8} borderRadius="lg" boxShadow="lg">
        <Heading size="lg">{isLogin ? 'Login' : 'Cadastro'}</Heading>
        
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <VStack spacing={4} w="full">
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Senha</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              w="full"
              isLoading={isLoading}
            >
              {isLogin ? 'Entrar' : 'Cadastrar'}
            </Button>
          </VStack>
        </form>

        <Text>
          {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}{' '}
          <Button
            variant="link"
            colorScheme="blue"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Cadastre-se' : 'Faça login'}
          </Button>
        </Text>

        <Button as={Link} href="/" variant="ghost" colorScheme="blue">
          Voltar para Home
        </Button>
      </VStack>
    </Box>
  )
} 