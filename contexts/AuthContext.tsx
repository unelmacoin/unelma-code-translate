import {createContext, useContext, useEffect, useState, useCallback} from 'react';
import { auth, db } from '../config/firebase';
import {User, signOut as firebaseSignOut,signInWithEmailAndPassword,signInWithPopup,GoogleAuthProvider} from 'firebase/auth';
import {doc, getDoc} from 'firebase/firestore';
import { useRouter } from 'next/router';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  disableRedirection: () => void;
  allowedPaths: string[];
  addAllowedPath: (path: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  signInWithEmail: async () => {},
  signInWithGoogle: async () => {},
  signOut: async () => {},
  disableRedirection: () => {},
  allowedPaths: [],
  addAllowedPath: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [redirectionEnabled, setRedirectionEnabled] = useState(true);
  const [allowedPaths, setAllowedPaths] = useState<string[]>(['/admin', '/']);
  const router = useRouter();

  const addAllowedPath = useCallback((path: string) => {
    setAllowedPaths((current) => [...current, path]);
  }, []);

  const checkUserRole = useCallback(async (user: User) => {
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const isUserAdmin = userData.role === 'admin';
        setIsAdmin(isUserAdmin);
        return isUserAdmin;
      }
      setIsAdmin(false);
      return false;
    } catch (error) {
      console.error('Error checking user role:', error);
      setIsAdmin(false);
      return false;
    }
  }, []);

  const handleRedirection = useCallback(
    async (user: User) => {
      if (!redirectionEnabled || !user) return;
  
      const isUserAdmin = await checkUserRole(user);
  
      // Prevent logged-in users from accessing login/signup
      if (['/login', '/signup'].includes(router.pathname)) {
        await router.replace(isUserAdmin ? '/admin' : '/');
        return;
      }
  
      if (!isUserAdmin && router.pathname === '/admin') {
        await router.replace('/');
      }
    },
    [checkUserRole, redirectionEnabled, router],
  );
  

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setLoading(true);

      if (user) {
        setUser(user);
        await handleRedirection(user);
      } else {
        setUser(null);
        setIsAdmin(false);
        if (router.pathname === '/admin') {
          await router.replace('/');
        }
      }

      setLoading(false);
    });

    return unsubscribe;
  }, [handleRedirection, router]);

  
  const signInWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
  
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Let `onAuthStateChanged` handle redirection, no need to do it here
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
  
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const isUserAdmin = userData.role === 'admin';
        setIsAdmin(isUserAdmin);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error signing in with email:', error);
      setLoading(false);
      throw error;
    }
  };
  

  const signInWithGoogle = async () => {
    try {
      // console.log('Signing in with Google');
      setLoading(true);

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Ensure we check the admin role directly from Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const isUserAdmin = userData.role === 'admin';
        setIsAdmin(isUserAdmin);

        if (isUserAdmin) {
          router.replace('/admin');
        } else {
          router.replace('/');
        }
      } else {
        router.replace('/');
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setLoading(false); 
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Get current path before signing out
      const currentPath = router.pathname;

      await firebaseSignOut(auth);
      setUser(null);
      setIsAdmin(false);

      if (currentPath === '/admin') {
        // Force navigation to login page when logging out from admin
        router.replace('/login');
      } else {
        await router.push('/');
      }
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const disableRedirection = () => {
    addAllowedPath(router.pathname);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-2xl">Loading...</div>  
  }

  return (
    <AuthContext.Provider
      value={{ user,loading, isAdmin, signInWithEmail, signInWithGoogle, signOut, disableRedirection, allowedPaths, addAllowedPath}} >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);