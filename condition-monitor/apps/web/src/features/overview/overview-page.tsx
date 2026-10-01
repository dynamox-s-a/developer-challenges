import type { Overview } from '@condition-monitor/shared';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useEffect, type ReactNode } from 'react';
import { Link as RouterLink } from 'react-router';
import { LoadingIndicator } from '../../components/loading-indicator';
import { RetryAlert } from '../../components/retry-alert';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchOverview } from './overview-slice';

const number = (value: number) => value.toLocaleString('en-US');

interface Card {
  label: string;
  value: number;
  to?: string;
  /** What the number alone does not say. */
  note?: string;
}

function cardsOf(counts: Overview): Card[] {
  return [
    { label: 'Sectors', value: counts.sectors, to: '/sectors' },
    { label: 'Machines', value: counts.machines, to: '/machines' },
    { label: 'Monitoring points', value: counts.monitoringPoints, to: '/monitoring-points' },
    {
      label: 'Sensors',
      value: counts.sensors,
      to: '/monitoring-points',
      // A count of sensors reads as coverage only next to the points it could cover.
      note:
        counts.monitoringPoints > 0
          ? `on ${number(counts.sensors)} of ${number(counts.monitoringPoints)} points`
          : undefined,
    },
    { label: 'Time-series', value: counts.timeSeries },
    { label: 'Readings', value: counts.readings, to: '/import' },
  ];
}

/** The next step when a count shows that something is still missing. */
function nextStep(counts: Overview): ReactNode {
  if (counts.monitoringPoints === 0) {
    return (
      <>
        No monitoring points yet.{' '}
        <Link component={RouterLink} to="/machines">
          Open a machine
        </Link>{' '}
        to add the positions where sensors are mounted.
      </>
    );
  }
  if (counts.sensors > 0 && counts.timeSeries === 0) {
    return (
      <>
        Sensors are installed but no reading is stored yet.{' '}
        <Link component={RouterLink} to="/import">
          Import a CSV file
        </Link>{' '}
        or run the simulator.
      </>
    );
  }
  return null;
}

/** What the user has stored, the number of time-series among it (challenge, section 7). */
export function OverviewPage() {
  const dispatch = useAppDispatch();
  const { counts, status, error } = useAppSelector((state) => state.overview);

  useEffect(() => {
    void dispatch(fetchOverview());
  }, [dispatch]);

  const step = counts ? nextStep(counts) : null;

  return (
    <>
      <Typography variant="h5" component="h1" sx={{ mb: 2 }}>
        Overview
      </Typography>

      {status === 'failed' && (
        <RetryAlert message={error} onRetry={() => void dispatch(fetchOverview())} sx={{ mb: 2 }} />
      )}
      {!counts && status !== 'failed' && <LoadingIndicator label="Loading overview" />}
      {counts && (
        <>
          <Box
            component="ul"
            aria-label="Stored counts"
            sx={{
              listStyle: 'none',
              m: 0,
              p: 0,
              display: 'grid',
              gap: 2,
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            }}
          >
            {cardsOf(counts).map((card) => (
              <Paper component="li" key={card.label} sx={{ p: 2 }}>
                <Typography variant="overline" color="text.secondary" component="p">
                  {card.to ? (
                    <Link component={RouterLink} to={card.to} underline="hover" color="inherit">
                      {card.label}
                    </Link>
                  ) : (
                    card.label
                  )}
                </Typography>
                <Typography variant="h4" component="p">
                  {number(card.value)}
                </Typography>
                {card.note && (
                  <Typography variant="body2" color="text.secondary">
                    {card.note}
                  </Typography>
                )}
              </Paper>
            ))}
          </Box>
          {step && (
            <Alert severity="info" sx={{ mt: 2 }}>
              {step}
            </Alert>
          )}
        </>
      )}
    </>
  );
}
