import {
  Box,
  Container,
  Heading,
  VStack,
  Text,
  Button,
  Input,
  FormControl,
  FormLabel,
  HStack,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiUpload, FiTrash2, FiDownload } from 'react-icons/fi'
import { useRouter } from 'next/router'
import { FiArrowLeft } from 'react-icons/fi'
import { toast } from '@/lib/toast'


export default function RegulationsPage() {
  const [file, setFile] = useState<File | null>(null)
  const [currentFile, setCurrentFile] = useState<{ name: string; url: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchCurrentFile()
  }, [])

  const fetchCurrentFile = async () => {
    try {
      const res = await fetch('/api/storage/list', {
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao buscar arquivos')
      if (data.files && data.files.length > 0) {
        setCurrentFile({ name: data.files[0].name, url: data.files[0].url })
      } else {
        setCurrentFile(null)
      }
    } catch (error) {
      console.error('Error fetching current file:', error)
      toast({
        title: 'Erro ao buscar arquivo atual',
        description: 'Não foi possível carregar o arquivo atual.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

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

  const handleUpload = async () => {
    if (!file) return
    setIsLoading(true)
    try {
      // Se já existe arquivo, exclui antes
      if (currentFile) {
        const resDelete = await fetch('/api/storage/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ fileName: currentFile.name }),
        })
        if (!resDelete.ok) {
          const dataDelete = await resDelete.json()
          throw new Error(dataDelete.error || 'Erro ao excluir arquivo anterior')
        }
      }

      // Upload novo arquivo
      const formData = new FormData()
      formData.append('file', file)
      
      const resUpload = await fetch('/api/storage/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      if (!resUpload.ok) {
        const dataUpload = await resUpload.json()
        throw new Error(dataUpload.error || 'Erro ao fazer upload')
      }

      await fetchCurrentFile()
      setFile(null)
      toast({
        title: 'Upload realizado com sucesso',
        description: 'O arquivo foi atualizado com sucesso!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error: any) {
      console.error('Error uploading file:', error)
      toast({
        title: 'Erro ao fazer upload',
        description: error.message || 'Não foi possível fazer o upload do arquivo.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!currentFile) return
    setIsLoading(true)
    try {
      const res = await fetch('/api/storage/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ fileName: currentFile.name }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao excluir arquivo')
      setCurrentFile(null)
      toast({
        title: 'Arquivo excluído',
        description: 'O arquivo foi excluído com sucesso!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error: any) {
      console.error('Error deleting file:', error)
      toast({
        title: 'Erro ao excluir arquivo',
        description: error.message || 'Não foi possível excluir o arquivo.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
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
        
        {currentFile && (
          <Box p={4} borderWidth={1} borderRadius="md">
            <Text fontWeight="bold">Arquivo atual:</Text>
            <HStack mt={2} spacing={4}>
              <Text>{currentFile.name}</Text>
              <Button
                leftIcon={<FiDownload />}
                size="sm"
                onClick={() => window.open(currentFile.url, '_blank')}
              >
                Baixar
              </Button>
              <Button
                leftIcon={<FiTrash2 />}
                colorScheme="red"
                size="sm"
                onClick={handleDelete}
                isLoading={isLoading}
              >
                Excluir
              </Button>
            </HStack>
          </Box>
        )}

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
          isLoading={isLoading}
          size="lg"
        >
          {currentFile ? 'Substituir Arquivo' : 'Enviar Arquivo'}
        </Button>
      </VStack>
    </Container>
  )
} 