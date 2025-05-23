import { Box, Text, Menu, MenuButton, MenuList, MenuItem, Button } from '@chakra-ui/react'
import { FiUser, FiLogOut, FiEdit } from 'react-icons/fi'
import { useRouter } from 'next/router'

interface HeaderProps {
  user: {
    id: string
    email: string
    role?: string
  }
  onLogout: () => void
}

export function Header({ user, onLogout }: HeaderProps) {
  const router = useRouter()

  return (
    <Box as="header" w="100%" display="flex" alignItems="center" justifyContent="space-between">
      <Text fontSize="lg" fontWeight="bold">
        VWCO Cooperados
      </Text>

      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<FiUser />}
          variant="ghost"
          size="sm"
        >
          {user.email}
          {user.role && (
            <Text as="span" fontSize="xs" color="gray.500" ml={2}>
              ({user.role})
            </Text>
          )}
        </MenuButton>
        <MenuList>
          <MenuItem icon={<FiEdit />} onClick={() => router.push('/app/profile')}>
            Editar perfil
          </MenuItem>
          <MenuItem icon={<FiLogOut />} onClick={onLogout}>
            Sair
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
  )
} 