import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 }, // Ramp up to 20 users
    { duration: '1m', target: 20 },  // Stay at 20 users
    { duration: '10s', target: 0 },  // Ramp down
  ],
};

const BASE_URL = 'http://localhost:3000'; // Or http://localhost:80 for LB

export default function () {
  // Login
  const loginPayload = JSON.stringify({
    email: 'test@example.com',
    password: 'password123',
  });

  const loginParams = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const loginRes = http.post(`${BASE_URL}/auth/login`, loginPayload, loginParams);

  check(loginRes, {
    'logged in successfully': (r) => r.status === 201 || r.status === 200,
  });

  const token = loginRes.json('access_token');

  if (token) {
    const authParams = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    // Get Machines
    const machinesRes = http.get(`${BASE_URL}/machines`, authParams);
    check(machinesRes, { 'machines status is 200': (r) => r.status === 200 });

    // Get Monitoring Points (if any machine exists, but just checking endpoint)
    // We might need a machine ID for some endpoints, but let's stick to listing
  }

  sleep(1);
}
