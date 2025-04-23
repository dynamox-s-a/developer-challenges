import { Box, useTheme } from '@mui/material'
import { CMSSection } from '../../components/section'

import { CMS_DATA_SECTIONS } from '../../constants/CMS_DATA'
import { Helmet } from 'react-helmet-async'

export function Home() {
  const theme = useTheme()

  return (
    <>
      <Helmet title="Home" />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          background: theme.palette.background.default,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {CMS_DATA_SECTIONS.map((section, index) => {
            return <CMSSection data={section} key={section.id} index={index} />
          })}
        </Box>
      </Box>
    </>
  )
}
