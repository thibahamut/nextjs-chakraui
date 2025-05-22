import dynamic from 'next/dynamic'
export default dynamic(() => import('./reset-password.client'), { ssr: false }) 