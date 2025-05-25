import {
  VStack,
  Button,
  Icon,
  Divider,
  Box,
  useBreakpointValue,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import {
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
import { motion } from 'framer-motion'
import { useRoleCheck, UserRole } from '@/lib/roles'

const MotionVStack = motion(VStack)
const MotionButton = motion(Button)

const ANIMATION_CONFIG = {
  duration: 0.15,
  staggerDelay: 0.05,
  slideDistance: -30,
}

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  user: {
    id: string
    email: string
    role: UserRole
  }
}

export function AppDrawer({ isOpen, onClose, user }: DrawerProps) {
  const router = useRouter()
  const isLargeScreen = useBreakpointValue({ base: false, lg: true })
  const { hasRole } = useRoleCheck(user.role)

  const handleNavigation = (path: string) => {
    if (!isLargeScreen) {
      onClose()
    }
    router.push(path)
  }

  const NavigationContent = () => (
    <MotionVStack
      spacing={4}
      align="stretch"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: ANIMATION_CONFIG.duration }}
    >
      <MotionButton
        variant="ghost"
        justifyContent="flex-start"
        onClick={() => handleNavigation('/app/profile')}
        leftIcon={<Icon as={FiUser} />}
        initial={{ x: ANIMATION_CONFIG.slideDistance, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: ANIMATION_CONFIG.duration, delay: ANIMATION_CONFIG.staggerDelay }}
      >
        Perfil
      </MotionButton>
      
      <Divider my={2} />
      
      <MotionButton
        variant="ghost"
        justifyContent="flex-start"
        onClick={() => handleNavigation('/app/regulations')}
        leftIcon={<Icon as={FiFileText} />}
        initial={{ x: ANIMATION_CONFIG.slideDistance, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: ANIMATION_CONFIG.duration, delay: ANIMATION_CONFIG.staggerDelay * 2 }}
      >
        Regulamento
      </MotionButton>

      <MotionButton
        variant="ghost"
        justifyContent="flex-start"
        onClick={() => handleNavigation('/app/format-options')}
        leftIcon={<Icon as={FiCalendar} />}
        initial={{ x: ANIMATION_CONFIG.slideDistance, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: ANIMATION_CONFIG.duration, delay: ANIMATION_CONFIG.staggerDelay * 3 }}
      >
        Opções de Formato
      </MotionButton>

      <MotionButton
        variant="ghost"
        justifyContent="flex-start"
        onClick={() => handleNavigation('/app/structure')}
        leftIcon={<Icon as={FiLayout} />}
        initial={{ x: ANIMATION_CONFIG.slideDistance, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: ANIMATION_CONFIG.duration, delay: ANIMATION_CONFIG.staggerDelay * 4 }}
      >
        Estrutura
      </MotionButton>

      <MotionButton
        variant="ghost"
        justifyContent="flex-start"
        onClick={() => handleNavigation('/app/visual-communication')}
        leftIcon={<Icon as={FiImage} />}
        initial={{ x: ANIMATION_CONFIG.slideDistance, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: ANIMATION_CONFIG.duration, delay: ANIMATION_CONFIG.staggerDelay * 5 }}
      >
        Comunicação Visual
      </MotionButton>

      <MotionButton
        variant="ghost"
        justifyContent="flex-start"
        onClick={() => handleNavigation('/app/menu')}
        leftIcon={<Icon as={FiCoffee} />}
        initial={{ x: ANIMATION_CONFIG.slideDistance, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: ANIMATION_CONFIG.duration, delay: ANIMATION_CONFIG.staggerDelay * 6 }}
      >
        Cardápio
      </MotionButton>

      <MotionButton
        variant="ghost"
        justifyContent="flex-start"
        onClick={() => handleNavigation('/app/services')}
        leftIcon={<Icon as={FiServer} />}
        initial={{ x: ANIMATION_CONFIG.slideDistance, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: ANIMATION_CONFIG.duration, delay: ANIMATION_CONFIG.staggerDelay * 7 }}
      >
        Serviços
      </MotionButton>

      <MotionButton
        variant="ghost"
        justifyContent="flex-start"
        onClick={() => handleNavigation('/app/giftout')}
        leftIcon={<Icon as={FiGift} />}
        initial={{ x: ANIMATION_CONFIG.slideDistance, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: ANIMATION_CONFIG.duration, delay: ANIMATION_CONFIG.staggerDelay * 8 }}
      >
        Giftout
      </MotionButton>

      <Divider my={2} />

      {hasRole('super_admin') && (
        <MotionButton
          variant="ghost"
          justifyContent="flex-start"
          onClick={() => handleNavigation('/app/settings')}
          leftIcon={<Icon as={FiSettings} />}
          initial={{ x: ANIMATION_CONFIG.slideDistance, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: ANIMATION_CONFIG.duration, delay: ANIMATION_CONFIG.staggerDelay * 9 }}
        >
          Configurações
        </MotionButton>
      )}
    </MotionVStack>
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