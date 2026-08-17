import type { VercelRequest, VercelResponse } from '@vercel/node';

import data from './db.json';

export default function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      message: 'Method not allowed',
    });
  }

  return res.status(200).json(data);
}