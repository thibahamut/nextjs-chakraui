import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  Link,
  Icon,
  Text,
} from '@chakra-ui/react'
import { FiHome, FiUser, FiSettings } from 'react-icons/fi'

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function AppDrawer({ isOpen, onClose }: DrawerProps) {
  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Menu</DrawerHeader>

        <DrawerBody>
          <VStack spacing={4} align="stretch">
            <Link display="flex" alignItems="center" gap={2}>
              <Icon as={FiHome} />
              <Text>Início</Text>
            </Link>
            <Link display="flex" alignItems="center" gap={2}>
              <Icon as={FiUser} />
              <Text>Perfil</Text>
            </Link>
            <Link display="flex" alignItems="center" gap={2}>
              <Icon as={FiSettings} />
              <Text>Configurações</Text>
            </Link>
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
} 