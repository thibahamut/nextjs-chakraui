import { Box, Text, Menu, MenuButton, MenuList, MenuItem, Button, Avatar } from '@chakra-ui/react'
import { FiUser, FiLogOut } from 'react-icons/fi'

interface HeaderProps {
  user: {
    id: string
    email: string
    last_sign_in_at: string
  }
  onLogout: () => void
}

export function Header({ user, onLogout }: HeaderProps) {
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
        </MenuButton>
        <MenuList>
          <MenuItem icon={<FiLogOut />} onClick={onLogout}>
            Sair
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
  )
} 