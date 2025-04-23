import { Box } from '@mui/material'
import { CMSSection } from '../../components/section'

import { CMS_DATA_SECTIONS } from '../../constants/CMS_DATA'
import { Helmet } from 'react-helmet-async'

export function Home() {
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
