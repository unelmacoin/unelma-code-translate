import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../config/firebase';
import { User, signOut as firebaseSignOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
 
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  // signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  // signUpWithEmail: async () => {},
  signInWithEmail: async () => {},
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
 
  // const signUpWithEmail = async (email: string, password: string) => {
  //   try {
  //     await createUserWithEmailAndPassword(auth, email, password);
  //   } catch (error) {
  //     console.error('Error signing up with email:', error);
  //   }
  // };
 
  const signInWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error signing in with email:', error);
    }
  };
 
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };
 
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    // <AuthContext.Provider value={{ user, loading, signUpWithEmail, signInWithEmail, signInWithGoogle, signOut }}>
    <AuthContext.Provider value={{ user, loading, signInWithEmail, signInWithGoogle, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
