import { Box } from '@mui/material'
import { CMS_DATA_SECTIONS } from '../constants/CMS_DATA'
import { PurposeCard } from './purpose-card'

export function PurposeSection() {
  return (
    <Box
      component={'section'}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {CMS_DATA_SECTIONS.map((section, index) => {
        return <PurposeCard data={section} key={section.id} index={index} />
      })}
    </Box>
  )
}
