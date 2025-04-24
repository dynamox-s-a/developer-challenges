import { Box, Typography } from '@mui/material'
import { CMS_HISTORY_SECTION } from '../constants/CMS_DATA'
import { splitFirstWord } from '../utils/split-first-word'

export function HistorySection() {
  return (
    <>
      {CMS_HISTORY_SECTION.map((section) => {
        const { firstWord, rest } = splitFirstWord(section.title)

        return (
          <Box
            key={section.id}
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', lg: 'row' },
              gap: { xs: '8px', lg: '78px' },
            }}
          >
            <Box component="aside" sx={{ width: '100%' }}>
              <Typography sx={{ fontWeight: 700, fontSize: { xs: '40px', lg: '48px' } }}>
                <span style={{ color: '#333333' }}>{firstWord}</span>{' '}
                <span style={{ color: '#757575' }}>{rest}</span>
              </Typography>
            </Box>

            <Box component="main" sx={{ width: '100%' }}>
              {section.paragraph.map((p) => (
                <Typography
                  key={p.id}
                  sx={{
                    fontSize: { xs: '16px', lg: '20px' },
                    lineHeight: '32px',
                    marginBottom: '24px',
                    fontWeight: 500,
                  }}
                >
                  {p.text}
                </Typography>
              ))}
            </Box>
          </Box>
        )
      })}
    </>
  )
}
