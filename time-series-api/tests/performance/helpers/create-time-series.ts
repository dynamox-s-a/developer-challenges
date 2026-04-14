import http from 'http';

interface CreateTimeSeriesResponse {
  id: string;
}

export function createTimeSeries(baseUrl: string): Promise<string> {
  const now = Date.now();

  const payload = JSON.stringify({
    name: 'load-test-sensor',
    samples: Array.from({ length: 200 }, (_, index) => ({
      timestamp: new Date(now - (200 - index) * 1000).toISOString(),
      value: Math.round((Math.random() * 100 + Number.EPSILON) * 100) / 100,
    })),
  });

  return new Promise((resolve, reject) => {
    const url = new URL('/time-series', baseUrl);

    const req = http.request(
      {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
      },
      (res) => {
        let body = '';

        res.on('data', (chunk) => {
          body += chunk;
        });

        res.on('end', () => {
          if (res.statusCode !== 201) {
            reject(
              new Error(
                `Failed to create time series. Status: ${res.statusCode}. Body: ${body}`
              )
            );
            return;
          }

          try {
            const parsed = JSON.parse(body) as CreateTimeSeriesResponse;
            resolve(parsed.id);
          } catch (error) {
            reject(error);
          }
        });
      }
    );

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}