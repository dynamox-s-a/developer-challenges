#!/usr/bin/env node

import { performance } from 'perf_hooks';

const BASE_URL = 'http://localhost:3001';
const ENDPOINT = '/monitoring-points';
const REQUEST_COUNT = 100;
const CONCURRENT_REQUESTS = 10;

async function makeRequest() {
  const startTime = performance.now();
  
  try {
    const response = await fetch(`${BASE_URL}${ENDPOINT}?take=5&skip=0&sortBy=createdAt&sortOrder=desc`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return {
      success: true,
      responseTime,
      status: response.status,
    };
  } catch (error) {
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    
    return {
      success: false,
      responseTime,
      error: error.message,
    };
  }
}

async function runBenchmark() {
  console.log(`Starting benchmark: ${REQUEST_COUNT} requests to ${ENDPOINT}`);
  console.log(`Concurrent requests: ${CONCURRENT_REQUESTS}`);
  console.log('Measuring latency...\n');
  
  const results = [];
  
  // Execute requests in concurrent batches
  for (let i = 0; i < REQUEST_COUNT; i += CONCURRENT_REQUESTS) {
    const batch = [];
    const batchSize = Math.min(CONCURRENT_REQUESTS, REQUEST_COUNT - i);
    
    for (let j = 0; j < batchSize; j++) {
      batch.push(makeRequest());
    }
    
    const batchResults = await Promise.all(batch);
    results.push(...batchResults);
    
    // Progress indicator
    const progress = Math.round((i + batchSize) / REQUEST_COUNT * 100);
    process.stdout.write(`\rProgress: ${progress}% (${i + batchSize}/${REQUEST_COUNT} requests)`);
  }
  
  console.log('\n\nBenchmark Results:');
  console.log('=====================================');
  
  const successfulRequests = results.filter(r => r.success);
  const failedRequests = results.filter(r => !r.success);
  
  const responseTimes = successfulRequests.map(r => r.responseTime);
  const minTime = Math.min(...responseTimes);
  const maxTime = Math.max(...responseTimes);
  const avgTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
  
  // Calculate percentiles
  const sortedTimes = responseTimes.sort((a, b) => a - b);
  const p50 = sortedTimes[Math.floor(sortedTimes.length * 0.5)];
  const p95 = sortedTimes[Math.floor(sortedTimes.length * 0.95)];
  const p99 = sortedTimes[Math.floor(sortedTimes.length * 0.99)];
  
  console.log(`Successful requests: ${successfulRequests.length}/${REQUEST_COUNT}`);
  console.log(`Failed requests: ${failedRequests.length}/${REQUEST_COUNT}`);
  console.log(`Success rate: ${((successfulRequests.length / REQUEST_COUNT) * 100).toFixed(2)}%`);
  console.log('');
  console.log('Latency Statistics (ms):');
  console.log(`   Minimum: ${minTime.toFixed(2)}ms`);
  console.log(`   Maximum: ${maxTime.toFixed(2)}ms`);
  console.log(`   Average: ${avgTime.toFixed(2)}ms`);
  console.log(`   P50:    ${p50.toFixed(2)}ms`);
  console.log(`   P95:    ${p95.toFixed(2)}ms`);
  console.log(`   P99:    ${p99.toFixed(2)}ms`);
  console.log('');
  
  // Check if requirement is met
  if (p95 < 350) {
    console.log('RESULT: P95 < 350ms REQUIREMENT MET');
  } else {
    console.log('RESULT: P95 >= 350ms REQUIREMENT NOT MET');
  }
  
  console.log('\nNotes:');
  console.log('- Test executed locally');
  console.log(`- ${REQUEST_COUNT} total requests`);
  console.log(`- ${CONCURRENT_REQUESTS} concurrent requests per batch`);
  console.log(`- Endpoint: ${ENDPOINT}`);
  console.log(`- Observed P95: ${p95.toFixed(2)}ms`);
  
  // Save results to file
  const benchmarkData = {
    timestamp: new Date().toISOString(),
    config: {
      requestCount: REQUEST_COUNT,
      concurrentRequests: CONCURRENT_REQUESTS,
      endpoint: ENDPOINT,
      baseUrl: BASE_URL,
    },
    results: {
      successful: successfulRequests.length,
      failed: failedRequests.length,
      successRate: (successfulRequests.length / REQUEST_COUNT) * 100,
      latency: {
        min: minTime,
        max: maxTime,
        avg: avgTime,
        p50,
        p95,
        p99,
      },
    },
    requirement: {
      met: p95 < 350,
      threshold: 350,
      observed: p95,
    },
  };
  
  const fs = await import('fs/promises');
  await fs.writeFile('./benchmark-results.json', JSON.stringify(benchmarkData, null, 2));
  console.log('\nResults saved to: benchmark-results.json');
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch(`${BASE_URL}/monitoring-points?take=1`);
    if (!response.ok) {
      throw new Error('Server not responding correctly');
    }
    console.log('Server detected and responding\n');
    return true;
  } catch (error) {
    console.error('Error: Server is not running at', BASE_URL);
    console.error('Please start the server with: pnpm dev');
    process.exit(1);
  }
}

// Run benchmark
async function main() {
  await checkServer();
  await runBenchmark();
}

main().catch(console.error);
