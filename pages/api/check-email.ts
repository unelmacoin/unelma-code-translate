// filepath: /Users/ritabasnetsuyel/Desktop/unelma-code-translate/pages/api/check-email.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, cert, getApps } from 'firebase-admin/app';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Initialize Firebase Admin SDK on each request
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }

  try {
    console.log('Checking email:', email);
    await getAuth().getUserByEmail(email);
    console.log('User found for email:', email);
    return res.status(200).json({ exists: true });
  } catch (error: any) {
    console.error('Error in getUserByEmail:', error);
    if (error.code === 'auth/user-not-found') {
      console.log('User not found for email:', email);
      return res.status(200).json({ exists: false });
    }
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}