import type { NextApiRequest, NextApiResponse } from 'next';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
 
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}
 
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
 
  const { idToken, modelName, enabled } = req.body;
 
  if (!idToken || !modelName || enabled === undefined) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }
 
  try {
    // Verify ID token
    const decodedToken = await getAuth().verifyIdToken(idToken);
 
    // Check admin role
    const userDoc = await getFirestore()
      .collection('users')
      .doc(decodedToken.uid)
      .get();
 
    if (!userDoc.exists || userDoc.data()?.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }
 
    // Convert to boolean
    const boolEnabled = Boolean(enabled);
 
    // Use set with merge to ensure field updates or creation
    const docRef = getFirestore().collection('config').doc('modelAvailability');
    await docRef.set(
      { [modelName.toLowerCase()]: boolEnabled }, // Normalize key before saving
      { merge: true }
    );
 
    // Verify update
    const updatedDoc = await docRef.get();
    const updatedData = updatedDoc.data();
 
    return res.status(200).json({
      success: true,
      modelName,
      newValue: boolEnabled,
      allModels: updatedData,
    });
  } catch (error) {
    console.error('Error updating model availability:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error),
    });
  }
}