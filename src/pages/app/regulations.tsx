import {
  Box,
  Container,
  Heading,
  VStack,
  useToast,
  Text,
  Button,
  Input,
  FormControl,
  FormLabel,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiUpload } from 'react-icons/fi'
import { useRouter } from 'next/router'
import { FiArrowLeft } from 'react-icons/fi'

export default function RegulationsPage() {
  const [file, setFile] = useState<File | null>(null)
  const toast = useToast()
  const router = useRouter()

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0])
        toast({
          title: 'Arquivo selecionado',
          description: `O arquivo ${acceptedFiles[0].name} foi selecionado com sucesso.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      }
    },
  })

  const handleUpload = () => {
    if (file) {
      // Aqui você pode implementar a lógica de upload quando necessário
      toast({
        title: 'Upload simulado',
        description: 'O arquivo foi processado com sucesso!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Button
          leftIcon={<FiArrowLeft />}
          variant="ghost"
          onClick={() => router.back()}
          alignSelf="flex-start"
        >
          Voltar
        </Button>
        <Heading size="lg">Regulamento</Heading>
        
        <Box
          {...getRootProps()}
          p={10}
          border="2px dashed"
          borderColor={isDragActive ? 'blue.400' : 'gray.200'}
          borderRadius="md"
          textAlign="center"
          cursor="pointer"
          _hover={{ borderColor: 'blue.400' }}
        >
          <input {...getInputProps()} />
          <FiUpload size={48} style={{ margin: '0 auto 16px' }} />
          <Text>
            {isDragActive
              ? 'Solte o arquivo PDF aqui'
              : 'Arraste um arquivo PDF ou clique para selecionar'}
          </Text>
          {file && (
            <Text mt={2} color="blue.500">
              Arquivo selecionado: {file.name}
            </Text>
          )}
        </Box>

        <Button
          colorScheme="blue"
          onClick={handleUpload}
          isDisabled={!file}
          size="lg"
        >
          Enviar Arquivo
        </Button>
      </VStack>
    </Container>
  )
} 