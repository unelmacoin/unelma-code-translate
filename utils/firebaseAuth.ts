import { db } from "../config/firebase";
import { doc, setDoc } from "firebase/firestore";
import { User } from 'firebase/auth';

export const assignUserRole = async (user: User) => {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);

try {
  await setDoc(userRef, {
    name: user.displayName || (user.email ? user.email.split("@")[0] : "Anonymous User"), 
    role: "user", // All users are assigned the role 'user'
  }, { merge: true }); // Merge to avoid overwriting existing data
} catch (error) {
  console.error("Error assigning user role:", error);
  throw error; // Re-throw or handle as appropriate for your application
}
};