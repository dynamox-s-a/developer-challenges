import autocannon, { Result } from 'autocannon';

const BASE_URL = process.env.LOAD_TEST_BASE_URL || 'http://localhost:3000';

function printSummary(result: Result): void {
  console.log('\n=== Load Test Summary: GET /time-series/count ===');
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
  const result = await autocannon({
    url: `${BASE_URL}/time-series/count`,
    method: 'GET',
    connections: 30,
    duration: 15,
    pipelining: 1,
  });

  printSummary(result);
}

run().catch((error) => {
  console.error('Load test failed:', error);
  process.exit(1);
});