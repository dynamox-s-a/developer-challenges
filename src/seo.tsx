import { Helmet } from 'react-helmet-async'

interface SeoProps {
  title?: string
  description?: string
  image?: string
  canonicalUrl?: string
}

export function Seo({
  title = 'Dynamox | Monitoramento Preditivo Industrial',
  description = 'Soluções em vibração, temperatura e condição de máquinas para indústria 4.0',
  image = 'https://www.dynamox.net/og-image.jpg',
  canonicalUrl = 'https://www.dynamox.net',
}: SeoProps) {
  return (
    <Helmet>
      {/* Título com fallback */}
      <title>{title}</title>

      {/* Meta tags básicas */}
      <meta name="description" content={description} />
      <meta
        name="keywords"
        content="monitoramento preditivo, vibração industrial, industria 4.0, dynamox, manutenção de máquinas"
      />

      {/* Open Graph (Facebook/LinkedIn) */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="pt_BR" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Canonical URL para evitar conteúdo duplicado */}
      <link rel="canonical" href={canonicalUrl} />
    </Helmet>
  )
}
