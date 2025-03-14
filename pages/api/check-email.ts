import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { validateCSRF } from '../../middleware/csrf';

// Utility function to initialize Firebase Admin SDK
function initializeFirebase() {
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validate environment variables
  if (!process.env.FIREBASE_PROJECT_ID || 
      !process.env.FIREBASE_CLIENT_EMAIL || 
      !process.env.FIREBASE_PRIVATE_KEY) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const { email: rawEmail } = req.body;
  const email = rawEmail ? rawEmail.trim().toLowerCase() : '';
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Initialize Firebase Admin SDK
  initializeFirebase();

  try {
    await getAuth().getUserByEmail(email);
    return res.status(200).json({ exists: true });
  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      return res.status(200).json({ exists: false });
    }
    console.error('Error checking email:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export default validateCSRF(handler);