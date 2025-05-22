import { extendTheme } from '@chakra-ui/react'

export const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  styles: {
    global: {
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
    },
  },
  components: {
    Link: {
      baseStyle: {
        textDecoration: "none",
        _hover: {
          textDecoration: "none",
        },
      },
    },
    Alert: {
      baseStyle: {
        container: {
          bg: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          color: 'white',
          minW: '300px',
          maxW: '400px',
          right: '42px',
          bottom: '60px',
        },
        title: {
          color: 'white',
          fontSize: '16px',
          fontWeight: '600',
          mb: '4px',
        },
        description: {
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '14px',
          fontWeight: '400',
        },
        icon: {
          color: 'white',
        },
        closeButton: {
          color: 'rgba(255, 255, 255, 0.5)',
          _hover: {
            color: 'white',
            bg: 'rgba(255, 255, 255, 0.1)',
          },
        },
      },
      variants: {        
        success: {
          container: {
            borderLeft: '4px solid #48BB78',
            bg: 'rgba(0, 0, 0, 0.8)',
          },
          icon: {
            color: '#48BB78',
          },
        },
        error: {
          container: {
            borderLeft: '4px solid #F56565',
            bg: 'rgba(0, 0, 0, 0.8)',
          },
          icon: {
            color: '#F56565',
          },
        },
        warning: {
          container: {
            borderLeft: '4px solid #ECC94B',
            bg: 'rgba(0, 0, 0, 0.8)',
          },
          icon: {
            color: '#ECC94B',
          },
        },
        info: {
          container: {
            borderLeft: '4px solid #4299E1',
            bg: 'rgba(0, 0, 0, 0.8)',
          },
          icon: {
            color: '#4299E1',
          },
        },
      },
    },
  },
}) 