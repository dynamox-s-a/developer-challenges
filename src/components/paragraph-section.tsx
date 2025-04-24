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
              <Typography variant="h3" sx={{ fontWeight: 600 }}>
                <span style={{ color: '#333333' }}>{firstWord}</span>{' '}
                <span style={{ color: '#757575' }}>{rest}</span>
              </Typography>
            </Box>

            <Box component="main" sx={{ width: '100%' }}>
              {section.paragraph.map((p) => (
                <Typography
                  key={p.id}
                  sx={{
                    fontSize: '20px',
                    lineHeight: '32px',
                    marginBottom: '24px',
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
