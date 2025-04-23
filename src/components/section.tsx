import { Grid, Typography, Box, Link as MuiLink, Divider } from '@mui/material'
import { splitTitle } from '../utils/split-title'
import type { CMSSection } from '../@types/types'
import { CtaLink } from '../pages/home/components/cta-link'

interface CMSSectionProps {
  data: CMSSection
  index: number
}

export function CMSSection({ data, index }: CMSSectionProps) {
  const isEven = index % 2 === 0
  const { firstHalf, secondHalf } = splitTitle(data.title)

  return (
    <>
      <Grid
        component={'section'}
        key={data.id}
        alignItems="center"
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', lg: isEven ? 'row' : 'row-reverse' },
          gap: { xs: '16px', lg: '96px' },
          mb: '56px',
          border: { lg: '1px solid #F3EDEA' },
          borderRadius: { lg: '16px' },
          width: '100%',
        }}
      >
        {/* IMAGE - ASIDE */}
        <Box
          component="aside"
          sx={{
            display: 'relative',
            padding: { lg: isEven ? '32px 0px 32px 26px' : '32px 26px 32px 0px' },
            width: '100%',
            minWidth: { lg: '584px' },
            maxWidth: '584px',
          }}
        >
          <Box
            sx={{
              position: 'relative',
              height: '480px', // altura fixa
              width: '100%', // largura responsiva
              maxWidth: '584px', // limite máximo de largura
            }}
          >
            <Box
              component="img"
              src={data.image}
              alt={data.title}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: { lg: '12px' },
              }}
            />
          </Box>
        </Box>

        {/* INFO'S - MAIN */}
        <Box
          component="main"
          sx={{
            maxWidth: '600px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'left',
            gap: '24px',
            padding: { xs: '20px', lg: '0px' },
            paddingLeft: { lg: !isEven ? '40px' : '0px' },
            paddingRight: { lg: isEven ? '40px' : '0px' },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'column' },
                alignItems: { xs: 'center', lg: 'start' },
                gap: '24px',
              }}
            >
              <img
                src={data.sectionIcon}
                style={{ width: '52px', height: '52px' }}
                alt={'ícones de engenharia'}
              />

              <Typography
                variant="h4"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: { xs: 'center', md: 'left' },
                }}
              >
                <Box component="span" sx={{ color: '#757575', fontWeight: '600' }}>
                  {firstHalf}
                </Box>

                <Box component="span" sx={{ color: '#33333', fontWeight: '600' }}>
                  {secondHalf}
                </Box>
              </Typography>
            </Box>

            {data.paragraph && (
              <Typography sx={{ fontSize: '24px', color: '#4B4B4B' }}>{data.paragraph}</Typography>
            )}

            {data.topics && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: { xs: 'center', lg: 'start' },
                  justifyContent: { xs: 'center', lg: 'start' },
                }}
              >
                <ul
                  style={{
                    padding: '0px 0px 0px 18px',
                    margin: '0px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  {data.topics.map((topic, i) => (
                    <li key={i}>
                      <Typography sx={{ color: '', fontWeight: '500', fontSize: '1.375rem' }}>
                        {topic}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </Box>
            )}

            <Divider />
          </Box>

          <CtaLink data={data.link} />
        </Box>
      </Grid>
    </>
  )
}
