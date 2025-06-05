import { NextApiRequest, NextApiResponse } from 'next';
import { swaggerSpec } from '@/utils/swagger';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('Request headers:', req.headers);
    console.log('Request URL:', req.url);
    
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle OPTIONS method for CORS preflight
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Set content type to JSON
    res.setHeader('Content-Type', 'application/json');
    
    // Send the Swagger spec
    console.log('Sending Swagger spec');
    res.status(200).send(swaggerSpec);
  } catch (error) {
    console.error('Error generating Swagger spec:', error);
    res.status(500).json({ error: 'Failed to generate Swagger documentation' });
  }
}
