import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 10 },  // slowly warm up
    { duration: '15s', target: 300 }, // massive spike to 300 users!
    { duration: '40s', target: 300 }, // hold the spike
    { duration: '20s', target: 10 },  // recover
    { duration: '10s', target: 0 },   // graceful stop
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // More lenient duration threshold for spike
    http_req_failed: ['rate<0.1'],    // Up to 10% failure is tolerated during spike shock
  },
};

const BASE_URL = 'http://localhost:3000/api/time-series';

export default function () {
  const payload = JSON.stringify({
    name: 'spikeTestSensor/z',
    sensorId: `spike-sensor-${__VU}`,
    sampleRate: 1000,
    unit: 'g',
    data: [{ datetime: new Date().toISOString(), value: Math.random() }],
  });

  const params = { headers: { 'Content-Type': 'application/json' } };

  const resPost = http.post(BASE_URL, payload, params);
  check(resPost, { 'spike POST status is 201': (r) => r.status === 201 });

  const resMetrics = http.get(`${BASE_URL}/spike-sensor-${__VU}/metrics`);
  check(resMetrics, { 'spike GET metrics status is 200': (r) => r.status === 200 });

  // Smaller sleep to generate maximum load during spikes: ~2 requests/second/VU
  sleep(0.5); 
}
