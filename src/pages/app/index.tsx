import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Heading,
  IconButton,
  useDisclosure,
  Grid,
  GridItem,
  useBreakpointValue,
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
  role?: string
}

interface ProfileData {
  id: string
  email: string
  role: string
  first_name?: string
  last_name?: string
  phone_number?: string
  department?: string
  created_at?: string
  updated_at?: string
  is_active?: boolean
}

export default function AppLayout() {
  const [user, setUser] = useState<DashboardUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const isLargeScreen = useBreakpointValue({ base: false, lg: true })

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      let { data: authData, error: authError } = await api.auth.me()
      
      // Se houver erro de autenticação
      if (authError) {
        // Se for erro de token expirado ou inválido, tenta refresh
        if (authError.includes('expired') || authError.includes('invalid')) {
          const { data: refreshData, error: refreshError } = await api.auth.me()
          
          // Se o refresh falhar, redireciona para home
          if (refreshError || !refreshData) {
            console.error('Token refresh failed:', refreshError)
            router.replace('/')
            return
          }
          
          authData = refreshData
        } else {
          // Se for outro tipo de erro, redireciona para home
          console.error('Auth error:', authError)
          router.replace('/')
          return
        }
      }

      // Se não houver dados de autenticação, redireciona para home
      if (!authData) {
        console.error('No auth data')
        router.replace('/')
        return
      }

      // Busca informações do perfil
      const { data: profileData, error: profileError } = await api.get<ProfileData>('/profile')
      if (profileError || !profileData) {
        console.error('Profile fetch error:', profileError)
        router.replace('/')
        return
      }

      setUser({
        ...authData.user,
        role: profileData.role,
      })
    } catch (error) {
      console.error('Auth check error:', error)
      router.replace('/')
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
        <AppDrawer isOpen={isOpen} onClose={onClose} user={user} />
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

    </Grid>
  )
} 