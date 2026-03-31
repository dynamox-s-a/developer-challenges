import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 100 }, // ramp up to 100 users
    { duration: '1m', target: 100 },  // stay at 100 users
    { duration: '10s', target: 0 },   // ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<350'], // 95% of requests must be below 350ms
  },
};

const BASE_URL = 'http://localhost:3000/api/time-series';

export default function () {
  // First, post some data
  const payload = JSON.stringify({
    name: 'accelerationRms/x',
    sensorId: `sensor-${__VU}`,
    sampleRate: 1000,
    unit: 'g',
    data: [
      { datetime: new Date().toISOString(), value: Math.random() },
    ],
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const resPost = http.post(BASE_URL, payload, params);
  check(resPost, { 'status is 201': (r) => r.status === 201 });

  // Then, retrieve metrics for the sensor
  const resMetrics = http.get(`${BASE_URL}/sensor-${__VU}/metrics`);
  check(resMetrics, { 'status is 200': (r) => r.status === 200 });

  sleep(1);
}
