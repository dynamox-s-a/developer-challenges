import { Inter } from 'next/font/google'
import Header from '@component/components/Header'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Header />
    </>
  )
}
