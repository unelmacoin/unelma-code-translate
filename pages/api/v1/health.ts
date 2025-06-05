import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * @openapi
 * /api/v1/health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the current status of the API
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: API is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: Translation API is running
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: 2023-01-01T12:00:00.000Z
 *       405:
 *         description: Method not allowed
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Method POST Not Allowed
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return res.status(200).json({ 
      status: 'ok', 
      message: 'Translation API is running',
      timestamp: new Date().toISOString()
    });
  }
  
  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
