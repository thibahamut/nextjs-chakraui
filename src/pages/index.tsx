import Head from "next/head";
// import { Image as Img} from "next/image";
import { Button, Image } from '@chakra-ui/react';
import Link from 'next/link';

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
        <title>Login</title>
        <meta name="description" content="Login page" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={{
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        gap: '2rem'
      }}>
        <Image
          src="/graphics/vw-logo-home.png"
          alt="Logo"
          width={100}
        />
        <Button as={Link} href="/login" colorScheme="blue" size="lg">
          Ir para Login 123
        </Button>
      </div>
    </>
  );
}
