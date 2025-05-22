import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const toast = useToast()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me', { credentials: 'include' })
      if (!response.ok) {
        throw new Error('Not authenticated')
      }
      const data = await response.json()
      setUser(data.user)
    } catch (error) {
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Logout failed')
      }

      toast({
        title: 'Logged out successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      router.push('/')
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to logout',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  if (loading) {
    return null
  }

  if (!user) {
    return null
  }

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={8}>
        <Heading>Dashboard</Heading>

        <Box w="100%" p={8} borderWidth={1} borderRadius="lg">
          <VStack spacing={4} align="stretch">
            <Text>
              <strong>Email:</strong> {user.email}
            </Text>
            <Text>
              <strong>ID:</strong> {user.id}
            </Text>
            <Text>
              <strong>Last Login:</strong>{' '}
              {new Date(user.last_sign_in_at).toLocaleString()}
            </Text>

            <Button colorScheme="red" onClick={handleLogout}>
              Logout
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  )
} 