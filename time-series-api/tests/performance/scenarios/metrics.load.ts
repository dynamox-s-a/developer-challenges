import autocannon, { Result } from 'autocannon';
import { createTimeSeries } from '../helpers/create-time-series';

const BASE_URL = process.env.LOAD_TEST_BASE_URL || 'http://localhost:3000';

function printSummary(result: Result): void {
  console.log('\n=== Load Test Summary: GET /time-series/:id/metrics ===');
  console.log(`Average latency: ${result.latency.average.toFixed(2)} ms`);
  console.log(`Min latency: ${result.latency.min.toFixed(2)} ms`);
  console.log(`Max latency: ${result.latency.max.toFixed(2)} ms`);
  console.log(`Average req/sec: ${result.requests.average.toFixed(2)}`);
  console.log(`Total requests: ${result.requests.total}`);
  console.log(`Total errors: ${result.errors}`);
  console.log(`Total timeouts: ${result.timeouts}`);
  console.log(`Average throughput: ${result.throughput.average.toFixed(2)} bytes/sec`);
}

async function run(): Promise<void> {
  const id = await createTimeSeries(BASE_URL);

  const result = await autocannon({
    url: `${BASE_URL}/time-series/${id}/metrics`,
    method: 'GET',
    connections: 20,
    duration: 15,
    pipelining: 1,
  });

  printSummary(result);
}

run().catch((error) => {
  console.error('Load test setup failed:', error);
  process.exit(1);
});