import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';

/**
 * Trilha da investigação. Cada nível anterior é navegável e leva o mesmo recorte temporal
 * junto — subir um nível nunca deve significar recomeçar a investigação.
 */
export interface BreadcrumbStep {
  label: string;
  to?: string;
}

export function InvestigationBreadcrumbs({ steps }: { steps: BreadcrumbStep[] }): JSX.Element {
  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="Trilha da investigação"
      sx={{ mb: 1, '& .MuiBreadcrumbs-li': { fontSize: '0.72rem' } }}
    >
      {steps.map((step, index) =>
        step.to && index < steps.length - 1 ? (
          <Link
            key={`${step.label}-${index}`}
            component={RouterLink}
            to={step.to}
            underline="hover"
            color="inherit"
            sx={{ fontSize: '0.72rem' }}
          >
            {step.label}
          </Link>
        ) : (
          <Typography
            key={`${step.label}-${index}`}
            color="text.primary"
            sx={{ fontSize: '0.72rem', fontWeight: 700 }}
          >
            {step.label}
          </Typography>
        ),
      )}
    </Breadcrumbs>
  );
}
