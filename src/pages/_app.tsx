import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { vwHead } from '@/lib/fonts'
import { theme } from '@/lib/theme'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={vwHead.variable}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </div>
  );
}
