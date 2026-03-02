import { Tooltip } from '@mui/material';
import ScienceIcon from '@mui/icons-material/Science';

interface ExperimentalFeatureBadgeProps {
  tooltipText: string;
}

function ExperimentalFeatureBadge({ tooltipText }: ExperimentalFeatureBadgeProps) {
  return (
    <Tooltip title={tooltipText} arrow placement="top">
      <ScienceIcon fontSize="small" color="warning" sx={{ cursor: 'help' }} />
    </Tooltip>
  );
}

export default ExperimentalFeatureBadge;
