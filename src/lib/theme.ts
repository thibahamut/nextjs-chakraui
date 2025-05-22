import { extendTheme } from '@chakra-ui/react'

export const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  fonts: {
    heading: 'var(--font-vwhead)',
    body: 'var(--font-vwhead)',
  },
  styles: {
    global: {
      'html, body, *': {
        fontFamily: 'var(--font-vwhead) !important',
      },
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
  },
}) 