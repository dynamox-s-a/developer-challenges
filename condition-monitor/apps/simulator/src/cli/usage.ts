import { DEFAULTS } from './parse-args';

export const USAGE = `Condition Monitor sensor simulator

Usage:
  simulator backfill [options]   send a history of telemetry and exit
  simulator live [options]       send current telemetry at a fixed interval
  simulator help                 show this help

Options:
  --serial <number>     simulate only this sensor; repeat for several.
                        Default: every installed sensor, discovered through the API.
  --interval <minutes>  time between readings. Default: ${DEFAULTS.intervalMinutes}.
  --seed <integer>      seed of the noise; the same seed gives the same values.
                        Default: ${DEFAULTS.seed}.
  --days <days>         backfill only: days of history. Default: ${DEFAULTS.days}.
                        A series holds at most 50,000 readings: 347 days at 10 minutes.
  --api-url <url>       Default: ${DEFAULTS.apiUrl}.
  --degrade <number>    make this sensor degrade: vibration rises 1.5 % and temperature
                        0.1 °C per day; repeat for several. Needs --degrade-since.
  --degrade-since <YYYY-MM-DD>
                        the day (UTC) the degradation starts. Keep it the same between
                        runs, or the same instants would get other values.
  -h, --help            show this help

Environment (read from .env when present):
  SIMULATOR_EMAIL, SIMULATOR_PASSWORD   the account to log in with.

Exit codes: 0 done, 1 could not send, 2 wrong command line.
`;
