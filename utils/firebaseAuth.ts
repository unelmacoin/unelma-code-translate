import { db } from "../config/firebase";
import { doc, setDoc } from "firebase/firestore";

export const assignUserRole = async (user: any) => {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);

  await setDoc(userRef, {
    name: user.displayName || user.email.split("@")[0], 
    role: "user", // All users are assigned the role 'user'
  }, { merge: true }); // Merge to avoid overwriting existing data
};