import { Box, Text, Menu, MenuButton, MenuList, MenuItem, Button, VStack } from '@chakra-ui/react'
import { FiUser, FiLogOut, FiEdit } from 'react-icons/fi'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

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
    <MotionBox 
      as="header" 
      w="100%" 
      h="80px" 
      display="flex" 
      alignItems="center" 
      justifyContent="space-between"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{ opacity: 1 }}
    >

      <VStack gap={0} alignItems='flex-start' ml={4}>
        <Text fontSize="lg" fontWeight="bold">
          VWCO Cooperados
        </Text>
        <Text as="span" fontSize="lg" color="gray.500">
          2025
        </Text>
      </VStack>

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
    </MotionBox>
  )
} 