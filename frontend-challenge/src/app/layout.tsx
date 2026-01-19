import type { Metadata } from 'next'
import Providers from './providers'


export const metadata: Metadata = {
  title: 'Gestão de Eventos',
  description: 'Plataforma de gerenciamento de eventos'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className=''>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
