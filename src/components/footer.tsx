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
        <a
          href="/"
          aria-label="Voltar para página inicial"
          style={{ width: '167px', height: '70px' }}
        >
          <img
            src={dynamoxWhiteLogoFooter}
            alt="Dynamox - Soluções em monitoramento preditivo industrial"
            width="167"
            height="70"
            loading="lazy"
          />
        </a>

        <Box
          component="nav"
          aria-label="Redes sociais da Dynamox"
          sx={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
          }}
        >
          {Object.entries(CMS_SOCIAL_MEDIA_DATA).map(([key, data]) => (
            <MuiLink
              key={key}
              href={data.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${data.alt} da Dynamox`}
              sx={{
                display: 'inline-flex',
                '&:hover': {
                  transform: 'scale(1.1)',
                  transition: 'transform 0.2s ease-in-out',
                },
              }}
            >
              <img
                src={data.src}
                alt={`Ícone do ${data.alt}`}
                width={24}
                height={24}
                loading="lazy"
                decoding="async"
                style={{
                  width: '24px',
                  height: '24px',
                  objectFit: 'contain',
                }}
              />
            </MuiLink>
          ))}
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
          component="nav"
          aria-label="Consentimento de Cookies e Aviso de privacidade Dynamox"
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
