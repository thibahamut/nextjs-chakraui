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
}

export function AppDrawer({ isOpen, onClose }: DrawerProps) {
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
        onClick={() => handleNavigation('/app')}
        leftIcon={<Icon as={FiHome} />}
      >
        Início
      </Button>
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
        leftIcon={<Icon as={FiFileText} />}
      >
        Regulamento
      </Button>
      <Button
        variant="ghost"
        justifyContent="flex-start"
        leftIcon={<Icon as={FiCalendar} />}
      >
        Opções de Formato
      </Button>
      <Button
        variant="ghost"
        justifyContent="flex-start"
        leftIcon={<Icon as={FiLayout} />}
      >
        Estrutura
      </Button>
      <Button
        variant="ghost"
        justifyContent="flex-start"
        leftIcon={<Icon as={FiImage} />}
      >
        Comunicação Visual
      </Button>
      <Button
        variant="ghost"
        justifyContent="flex-start"
        leftIcon={<Icon as={FiCoffee} />}
      >
        Cardápio
      </Button>
      <Button
        variant="ghost"
        justifyContent="flex-start"
        leftIcon={<Icon as={FiServer} />}
      >
        Serviços
      </Button>
      <Button
        variant="ghost"
        justifyContent="flex-start"
        leftIcon={<Icon as={FiGift} />}
      >
        Giftout
      </Button>

      <Divider my={2} />

      <Button
        variant="ghost"
        justifyContent="flex-start"
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
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Menu</DrawerHeader>
        <DrawerBody>
          <NavigationContent />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
} 