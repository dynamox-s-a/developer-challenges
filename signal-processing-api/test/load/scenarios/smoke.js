import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1, 
  duration: '30s', // 30 seconds for smoke test

  thresholds: {
    http_req_duration: ['p(99)<350'], // 99% of requests must be < 350ms
    http_req_failed: ['rate<0.01'],   // 1% max failure rate
  },
};

const BASE_URL = 'http://localhost:3000/api/time-series';

export default function () {
  const payload = JSON.stringify({
    name: 'smokeTestSensor/x',
    sensorId: `smoke-sensor-${__VU}`,
    sampleRate: 1000,
    unit: 'g',
    data: [{ datetime: new Date().toISOString(), value: Math.random() }],
  });

  const params = { headers: { 'Content-Type': 'application/json' } };

  const resPost = http.post(BASE_URL, payload, params);
  check(resPost, { 'smoke POST status is 201': (r) => r.status === 201 });

  const resMetrics = http.get(`${BASE_URL}/smoke-sensor-${__VU}/metrics`);
  check(resMetrics, { 'smoke GET metrics status is 200': (r) => r.status === 200 });

  sleep(1);
}
