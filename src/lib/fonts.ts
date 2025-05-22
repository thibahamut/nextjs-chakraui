import localFont from 'next/font/local'

export const vwHead = localFont({
  src: [
    {
      path: '../../public/fonts/VWHead-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/VWHead.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/VWHead-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/VWHead-ExtraBold.ttf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../../public/fonts/VWHead-Italic.ttf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../public/fonts/VWHead-BoldItalic.ttf',
      weight: '700',
      style: 'italic',
    },
  ],
  variable: '--font-vwhead',
  display: 'swap',
}) 