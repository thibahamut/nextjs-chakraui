import { createStandaloneToast } from '@chakra-ui/react'

const { ToastContainer, toast: chakraToast } = createStandaloneToast({
    defaultOptions: {
        position: 'bottom-right',
        duration: 4000,        
        isClosable: true,
    },
})

const toast = (options: any) => {
    return chakraToast({
        ...options,
        variant: options.status
    })
}

export { toast, ToastContainer } 