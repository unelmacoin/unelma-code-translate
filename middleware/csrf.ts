import { NextApiRequest, NextApiResponse } from 'next';

export function validateCSRF(handler: any) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const csrfToken = req.headers['x-csrf-token'] || req.body?.csrfToken;
    
    if (!csrfToken || typeof csrfToken !== 'string') {
      return res.status(403).json({ error: 'Invalid CSRF token' });
    }

    return handler(req, res);
  };
}
