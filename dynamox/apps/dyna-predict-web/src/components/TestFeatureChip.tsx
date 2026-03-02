import { Tooltip } from '@mui/material';
import ScienceIcon from '@mui/icons-material/Science';

interface TestFeatureChipProps {
  tooltipText: string;
}

function TestFeatureChip({ tooltipText }: TestFeatureChipProps) {
  return (
    <Tooltip title={tooltipText} arrow placement="top">
      <ScienceIcon fontSize="small" color="warning" sx={{ cursor: 'help' }} />
    </Tooltip>
  );
}

export default TestFeatureChip;
