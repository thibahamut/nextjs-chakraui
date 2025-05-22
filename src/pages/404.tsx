import { Box, Button, Heading, Text, VStack, Image } from '@chakra-ui/react'
import Link from 'next/link'
import Head from 'next/head'

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Página não encontrada | VWCO Cooperados 2025</title>
        <meta name="description" content="Página não encontrada" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box
        minH="100vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={8}
        p={4}
        bg="gray.50"
      >
        <VStack spacing={6} maxW="600px" textAlign="center">
          <Image
            src="/images/vw-logo.png"
            alt="Logo VW"
            width={120}
            height="auto"
          />

          <Heading size="2xl" color="gray.700">
            404
          </Heading>

          <Heading size="lg" color="gray.600">
            Página não encontrada
          </Heading>

          <Text fontSize="lg" color="gray.500">
            Desculpe, a página que você está procurando não existe ou foi movida.
          </Text>

          <VStack spacing={4} pt={4}>
            <Button
              as={Link}
              href="/"
              colorScheme="blue"
              size="lg"
              w="full"
            >
              Voltar para Home
            </Button>

            <Button
              as={Link}
              href="/auth/login"
              variant="outline"
              colorScheme="blue"
              size="lg"
              w="full"
            >
              Acessar Sistema
            </Button>
          </VStack>
        </VStack>
      </Box>
    </>
  )
} 