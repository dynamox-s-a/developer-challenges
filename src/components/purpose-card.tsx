import { Grid, Typography, Box, Divider } from '@mui/material'
import { splitTitle } from '../utils/split-title'
import { PurposeCardData } from '../@types/types'
import { CtaLink } from '../pages/home/components/cta-link'

interface PurposeCardProps {
  data: PurposeCardData
  index: number
}

export function PurposeCard({ data, index }: PurposeCardProps) {
  const isEven = index % 2 === 0
  const { firstHalf, secondHalf } = splitTitle(data.title)

  // Configurações de otimização de imagem
  const getOptimizedImageUrl = (url: string, width: number, height?: number) => {
    const params = new URLSearchParams({
      w: width.toString(),
      q: '80', // Qualidade 80%
      fm: 'webp', // Forçar WebP
      fit: 'cover', // Manter proporção
      auto: 'format', // Otimização automática
    })
    if (height) params.set('h', height.toString())
    return `${url}?${params.toString()}`
  }

  // URLs otimizadas
  const mainImage = {
    src: getOptimizedImageUrl(data.image, 584, 480),
    srcSet: [
      getOptimizedImageUrl(data.image, 584, 480) + ' 1x',
      getOptimizedImageUrl(data.image, 1168, 960) + ' 2x',
    ].join(', '),
  }

  const iconImage = getOptimizedImageUrl(data.sectionIcon, 52)

  return (
    <Grid
      container
      alignItems="center"
      sx={{
        flexDirection: { xs: 'column', lg: isEven ? 'row' : 'row-reverse' },
        gap: { xs: 2, lg: 12 },
        mb: 7,
        border: { lg: '1px solid #F3EDEA' },
        borderRadius: { lg: 2 },
      }}
    >
      {/* Seção da Imagem */}
      <Box
        component="aside"
        sx={{
          p: { lg: isEven ? '32px 0 32px 26px' : '32px 26px 32px 0' },
          width: '100%',
          minWidth: { lg: 584 },
          maxWidth: { lg: 584 },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            height: 480,
            width: '100%',
            maxWidth: 584,
          }}
        >
          <Box
            component="img"
            src={mainImage.src}
            srcSet={mainImage.srcSet}
            alt={data.title}
            loading="lazy"
            decoding="async"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: { lg: 1.5 },
            }}
          />
        </Box>
      </Box>

      {/* Seção de Conteúdo */}
      <Box
        component="article"
        sx={{
          maxWidth: 600,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          p: { xs: 2.5, lg: 0 },
          pl: { lg: !isEven ? 5 : 0 },
          pr: { lg: isEven ? 5 : 0 },
        }}
      >
        <Box display="flex" flexDirection="column" gap={3}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems={{ xs: 'center', lg: 'flex-start' }}
            gap={3}
          >
            <img
              src={iconImage}
              width={52}
              height={52}
              alt="Ícone de seção"
              loading="lazy"
              decoding="async"
            />

            <Typography variant="h4" textAlign={{ xs: 'center', md: 'left' }}>
              <Box component="span" sx={{ color: '#757575', fontWeight: 600 }}>
                {firstHalf}
              </Box>
              <Box component="span" sx={{ color: '#333', fontWeight: 600 }}>
                {secondHalf}
              </Box>
            </Typography>
          </Box>

          {data.paragraph && (
            <Typography component="p" variant="h6" color="#4B4B4B">
              {data.paragraph}
            </Typography>
          )}

          {data.topics && (
            <Box
              display="flex"
              alignItems={{ xs: 'center', lg: 'flex-start' }}
              justifyContent={{ xs: 'center', lg: 'flex-start' }}
            >
              <Box
                component="ul"
                sx={{ pl: 2.25, m: 0, display: 'flex', flexDirection: 'column', gap: 1 }}
              >
                {data.topics.map((topic, i) => (
                  <Box component="li" key={i}>
                    <Typography fontWeight={500} fontSize="1.375rem">
                      {topic}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          <Divider />
        </Box>

        <CtaLink data={data.link} />
      </Box>
    </Grid>
  )
}
