import { Box, Typography, useTheme, Link as MuiLink } from '@mui/material'
import dynamoxWhiteLogoFooter from '/dynamox-logo-white-footer.svg'
import { CMS_FOOTER_LINKS, CMS_SOCIAL_MEDIA_DATA } from '../constants/CMS_DATA'

export function Footer() {
  const theme = useTheme()

  return (
    <Box
      component={'footer'}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.palette.primary.main,
        margin: { xs: '0px', lg: '16px 24px' },
        padding: '48px',
        borderRadius: { xs: '0px', lg: '16px' },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          flexDirection: { xs: 'column', lg: 'row' },
          alignItems: ' center',
          justifyContent: { xs: 'center', lg: 'space-between' },
          gap: '48px',
        }}
      >
        <img src={dynamoxWhiteLogoFooter} alt={'Logomarca Dynamox branca no footer'} />

        <Box sx={{ display: 'flex', gap: '16px' }}>
          {Object.entries(CMS_SOCIAL_MEDIA_DATA).map(([key, data]) => {
            return (
              <MuiLink key={key} href={data.link} target={'_blank'}>
                <img src={data.src} />
              </MuiLink>
            )
          })}
        </Box>
      </Box>

      <Box
        sx={{ my: 2, width: '100%', height: '0.4px', background: theme.palette.background.default }}
      />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: '24px',
          flexWrap: 'wrap',
          justifyContent: { xs: 'center', md: 'space-between' },
          width: '100%',
          color: theme.palette.background.default,
        }}
      >
        <Typography sx={{ fontSize: '12px', fontWeight: 500 }}>
          @2024 Dynamox. All Rights Reserved
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignContent: 'center',
            justifyContent: 'center',
            gap: '11px',
            alignItems: 'center',
          }}
        >
          {CMS_FOOTER_LINKS.map((link, index) => {
            const isLastItem = CMS_FOOTER_LINKS.length === index + 1

            return (
              <MuiLink
                key={link.id}
                href={link.link}
                target={'_blank'}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '11px',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: theme.palette.background.default,
                  }}
                >
                  {link.name}

                  {!isLastItem && (
                    <Box
                      component={'span'}
                      sx={{
                        height: '4px',
                        width: '4px',
                        background: theme.palette.background.default,
                        borderRadius: '100%',
                        alignSelf: 'center',
                      }}
                    />
                  )}
                </Typography>
              </MuiLink>
            )
          })}
        </Box>
      </Box>
    </Box>
  )
}
