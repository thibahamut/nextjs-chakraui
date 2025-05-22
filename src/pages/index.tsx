import { Box, Button, Image, VStack } from '@chakra-ui/react'
import Link from 'next/link'
import Head from 'next/head'

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export default function Home() {
  return (
    <>
      <Head>
        <title>VWCO Cooperados 2025</title>
        <meta name="description" content="Login page" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Box
        as="main"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minH="100vh"
        gap={8}
        p={4}
      >
        <Image
          src="/graphics/vw-logo-home.png"
          alt="Logo"
          width={100}
          height="auto"
        />

        <VStack spacing={4}>
          <Button as={Link} href="/login" colorScheme="blue" size="lg">
            Acessar Sistema
          </Button>
        </VStack>
      </Box>
    </>
  )
}
