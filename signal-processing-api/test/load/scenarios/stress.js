import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '20s', target: 50 },  // ramp up to 50 users
    { duration: '40s', target: 100 }, // ramp up to 100 users
    { duration: '40s', target: 200 }, // ramp up to 200 users (stress)
    { duration: '60s', target: 200 }, // stay at 200 to test stability under stress
    { duration: '30s', target: 0 },   // scale down properly
  ],
  thresholds: {
    http_req_duration: ['p(95)<350', 'p(99)<500'],
    http_req_failed: ['rate<0.05'], // Acceptable failure rate during peak stress
  },
};

const BASE_URL = 'http://localhost:3000/api/time-series';

export default function () {
  const payload = JSON.stringify({
    name: 'stressTestSensor/y',
    sensorId: `stress-sensor-${__VU}`,
    sampleRate: 1000,
    unit: 'g',
    data: [{ datetime: new Date().toISOString(), value: Math.random() }],
  });

  const params = { headers: { 'Content-Type': 'application/json' } };

  const resPost = http.post(BASE_URL, payload, params);
  check(resPost, { 'stress POST status is 201': (r) => r.status === 201 });

  const resMetrics = http.get(`${BASE_URL}/stress-sensor-${__VU}/metrics`);
  check(resMetrics, { 'stress GET metrics status is 200': (r) => r.status === 200 });

  sleep(1); // 1 iteration per second per VU
}
