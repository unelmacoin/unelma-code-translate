import { NextApiRequest, NextApiResponse } from 'next';
import { swaggerSpec } from '@/utils/swagger';

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
}
