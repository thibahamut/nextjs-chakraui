import { Box, Button, Heading, Text, VStack, useToast } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const toast = useToast()

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.replace('/')
          return
        }
        setUser(user)
      } catch (error) {
        console.error('Error getting user:', error)
        router.replace('/')
      } finally {
        setIsLoading(false)
      }
    }

    getUser()
  }, [router])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      toast({
        title: 'Logout realizado com sucesso!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      router.replace('/')
    } catch (error) {
      toast({
        title: 'Erro ao fazer logout',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  if (isLoading) {
    return null
  }

  if (!user) {
    return null
  }

  return (
    <Box minH="100vh" p={8}>
      <VStack spacing={8} maxW="800px" mx="auto">
        <Heading>Dashboard</Heading>
        
        <Box w="full" p={6} bg="white" borderRadius="lg" boxShadow="lg">
          <VStack spacing={4} align="start">
            <Text fontSize="lg">
              <strong>Email:</strong> {user.email}
            </Text>
            <Text fontSize="lg">
              <strong>ID:</strong> {user.id}
            </Text>
            <Text fontSize="lg">
              <strong>Último login:</strong>{' '}
              {new Date(user.last_sign_in_at).toLocaleString()}
            </Text>
          </VStack>
        </Box>

        <Button colorScheme="red" onClick={handleLogout}>
          Sair
        </Button>
      </VStack>
    </Box>
  )
} 