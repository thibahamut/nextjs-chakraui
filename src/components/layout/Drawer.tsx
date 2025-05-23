import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  Button,
  Icon,
  Divider,
  Box,
  useBreakpointValue,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import {
  FiHome,
  FiUser,
  FiSettings,
  FiFileText,
  FiCalendar,
  FiLayout,
  FiImage,
  FiCoffee,
  FiGift,
  FiServer,
} from 'react-icons/fi'

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  user: {
    id: string
    email: string
  }
}

export function AppDrawer({ isOpen, onClose, user }: DrawerProps) {
  const router = useRouter()
  const isLargeScreen = useBreakpointValue({ base: false, lg: true })

  const handleNavigation = (path: string) => {
    if (!isLargeScreen) {
      onClose()
    }
    router.push(path)
  }

  const NavigationContent = () => (
    <VStack spacing={4} align="stretch">

      <Button
        variant="ghost"
        justifyContent="flex-start"
        onClick={() => handleNavigation('/app/profile')}
        leftIcon={<Icon as={FiUser} />}
      >
        Perfil
      </Button>
      
      <Divider my={2} />
      
      <Button
        variant="ghost"
        justifyContent="flex-start"
        onClick={() => handleNavigation('/app/regulations')}
        leftIcon={<Icon as={FiFileText} />}
      >
        Regulamento
      </Button>

      <Button
        variant="ghost"
        justifyContent="flex-start"
        onClick={() => handleNavigation('/app/format-options')}
        leftIcon={<Icon as={FiCalendar} />}
      >
        Opções de Formato
      </Button>

      <Button
        variant="ghost"
        justifyContent="flex-start"
        onClick={() => handleNavigation('/app/structure')}
        leftIcon={<Icon as={FiLayout} />}
      >
        Estrutura
      </Button>

      <Button
        variant="ghost"
        justifyContent="flex-start"
        onClick={() => handleNavigation('/app/visual-communication')}
        leftIcon={<Icon as={FiImage} />}
      >
        Comunicação Visual
      </Button>

      <Button
        variant="ghost"
        justifyContent="flex-start"
        onClick={() => handleNavigation('/app/menu')}
        leftIcon={<Icon as={FiCoffee} />}
      >
        Cardápio
      </Button>

      <Button
        variant="ghost"
        justifyContent="flex-start"
        onClick={() => handleNavigation('/app/services')}
        leftIcon={<Icon as={FiServer} />}
      >
        Serviços
      </Button>

      <Button
        variant="ghost"
        justifyContent="flex-start"
        onClick={() => handleNavigation('/app/giftout')}
        leftIcon={<Icon as={FiGift} />}
      >
        Giftout
      </Button>

      <Divider my={2} />

      <Button
        variant="ghost"
        justifyContent="flex-start"
        onClick={() => handleNavigation('/app/settings')}
        leftIcon={<Icon as={FiSettings} />}
      >
        Configurações
      </Button>
    </VStack>
  )

  if (isLargeScreen) {
    return (
      <Box p={4} borderRightWidth={1} h="100%">
        <NavigationContent />
      </Box>
    )
  }

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      w="full"
      h="full"
      bg="white"
      zIndex={20}
      transform={isOpen ? 'translateX(0)' : 'translateX(-100%)'}
      transition="transform 0.2s"
      p={4}
    >
      <NavigationContent />
    </Box>
  )
} 