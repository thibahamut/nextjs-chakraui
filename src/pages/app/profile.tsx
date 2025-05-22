import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { api } from '@/lib/api'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { toast } from '@/lib/toast'

interface ProfileData {
  id: string
  email: string
  first_name?: string
  last_name?: string
  phone_number?: string
  department?: string
  role?: string
  created_at?: string
  updated_at?: string
  is_active?: boolean
}

export default function Profile() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const { data, error } = await api.get<ProfileData>('/profile')
      if (error) throw new Error(error)
      if (data) {
        setProfile(data)
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao carregar perfil',
        status: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    setSaving(true)
    try {
      const { error } = await api.post('/profile', profile)
      if (error) throw new Error(error)

      toast({
        title: 'Sucesso',
        description: 'Perfil atualizado com sucesso',
        status: 'success',
      })
    } catch (error) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao salvar perfil',
        status: 'error',
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading || !profile) {
    return null
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header user={profile} onLogout={() => router.push('/')} />
      
      <Container maxW="container.md" py={10} flex="1">
        <VStack spacing={8} align="stretch">
          <Heading size="lg">Editar Perfil</Heading>

          <Box as="form" onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input value={profile.email} isReadOnly />
              </FormControl>

              <FormControl>
                <FormLabel>Nome</FormLabel>
                <Input
                  value={profile.first_name || ''}
                  onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Sobrenome</FormLabel>
                <Input
                  value={profile.last_name || ''}
                  onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Telefone</FormLabel>
                <Input
                  value={profile.phone_number || ''}
                  onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Departamento</FormLabel>
                <Input
                  value={profile.department || ''}
                  onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Cargo</FormLabel>
                <Input value={profile.role || ''} isReadOnly />
              </FormControl>

              <Box display="flex" gap={4} width="100%">
                <Button
                  type="button"
                  variant="outline"
                  width="100%"
                  onClick={() => router.push('/app')}
                >
                  Voltar
                </Button>

                <Button
                  type="submit"
                  colorScheme="blue"
                  width="100%"
                  isLoading={saving}
                >
                  Salvar Alterações
                </Button>
              </Box>
            </VStack>
          </Box>
        </VStack>
      </Container>

      <Footer />
    </Box>
  )
} 