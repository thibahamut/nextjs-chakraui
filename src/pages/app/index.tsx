import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Heading,
  IconButton,
  useDisclosure,
  Grid,
  GridItem,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { FiMenu } from 'react-icons/fi'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { AppDrawer } from '@/components/layout/Drawer'
import { api } from '@/lib/api'
import { toast } from '@/lib/toast'

interface DashboardUser {
  id: string
  email: string
  last_sign_in_at: string
}

export default function AppLayout() {
  const [user, setUser] = useState<DashboardUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const { data, error } = await api.auth.me()
      if (error || !data) {
        throw new Error(error || 'Not authenticated')
      }
      setUser(data.user)
    } catch {
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      const { error } = await api.auth.logout()
      if (error) {
        throw new Error(error)
      }

      toast({
        title: 'Deslogado com sucesso',
        status: 'success',
      })

      router.push('/')
    } catch (error: unknown) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Falha ao deslogar',
        status: 'error',
      })
    }
  }

  if (loading || !user) {
    return null
  }

  return (
    <Grid
      templateAreas={{
        base: `
          "header"
          "main"
          "footer"
        `,
        lg: `
          "header header"
          "nav main"
          "footer footer"
        `,
      }}
      gridTemplateRows={{
        base: 'auto 1fr auto',
        lg: 'auto 1fr auto',
      }}
      gridTemplateColumns={{
        base: '1fr',
        lg: '250px 1fr',
      }}
      h="100vh"
      gap="1"
    >
      <GridItem area="header">
        <Box display="flex" alignItems="center" px={4} py={2}>
          <IconButton
            aria-label="Open menu"
            icon={<FiMenu />}
            onClick={onOpen}
            display={{ base: 'flex', lg: 'none' }}
            mr={4}
          />
          <Header user={user} onLogout={handleLogout} />
        </Box>
      </GridItem>

      <GridItem area="nav" display={{ base: 'none', lg: 'block' }}>
        <Box p={4} borderRightWidth={1} h="100%">
          {/* Navigation content */}
        </Box>
      </GridItem>

      <GridItem area="main">
        <Container maxW="container.xl" py={10}>
          <Heading>Dashboard</Heading>
          {/* Main content */}
        </Container>
      </GridItem>

      <GridItem area="footer">
        <Footer />
      </GridItem>

      <AppDrawer isOpen={isOpen} onClose={onClose} />
    </Grid>
  )
} 