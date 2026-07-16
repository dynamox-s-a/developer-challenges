import { OpenAPIHandler } from '@orpc/openapi/fetch';
import { OpenAPIReferencePlugin } from '@orpc/openapi/plugins';
import { CORSPlugin } from '@orpc/server/plugins';
import { ZodSmartCoercionPlugin } from '@orpc/zod';
import { ZodToJsonSchemaConverter } from '@orpc/zod/zod4';

import { router } from './router';

const PORT = Number(process.env.PORT ?? 3333);
const CORS_ORIGIN = (process.env.CORS_ORIGIN ?? 'http://localhost:3000').split(',');

const handler = new OpenAPIHandler(router, {
  plugins: [
    new CORSPlugin({ origin: CORS_ORIGIN, allowMethods: ['GET', 'OPTIONS'] }),
    new ZodSmartCoercionPlugin(),
    new OpenAPIReferencePlugin({
      docsProvider: 'scalar',
      docsPath: '/docs',
      schemaConverters: [new ZodToJsonSchemaConverter()],
      specGenerateOptions: {
        info: { title: 'Dynamox Sensors API', version: '1.0.0' },
      },
    }),
  ],
});

Bun.serve({
  port: PORT,
  async fetch(request) {
    const { matched, response } = await handler.handle(request, { prefix: '/api' });

    return matched ? response : Response.json({ message: 'Not found' }, { status: 404 });
  },
});

console.log(`API em http://localhost:${PORT}/api  •  docs em http://localhost:${PORT}/api/docs`);
