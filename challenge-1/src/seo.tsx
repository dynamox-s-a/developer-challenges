// src/components/Seo.tsx
interface SeoProps {
  title?: string
  description?: string
  image?: string
  url?: string
}

export const Seo = ({
  title = 'Dynamox | Monitoramento Industrial Inteligente',
  description = 'Soluções em vibração e temperatura para manutenção preditiva',
  image = 'https://www.dynamox.net/og-image.jpg',
  url = 'https://www.dynamox.net',
}: SeoProps) => {
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </>
  )
}
