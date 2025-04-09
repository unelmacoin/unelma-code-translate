import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Nav from '../components/Nav';
import { toast } from 'react-hot-toast';
import { useTheme } from '../contexts/ThemeContext';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase'; 

const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    if (!user) return null;

    // Check if the user already exists in Firestore
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // New user → Add to Firestore with default role (`user`)
      await setDoc(userRef, {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        role: 'user',
        createdAt: new Date(),
      });
    }

    return user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    return null;
  }
};

const SignUp: React.FC = () => {
  const { isDark, toggleDarkMode } = useTheme();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const router = useRouter();

  const handleSignInWithGoogle = async () => {
    setIsSigningIn(true);
    const user = await signInWithGoogle();
    setIsSigningIn(false);
    if (user) {
      toast.success('Successfully signed in using Google !', {
        duration: 2000, // Show for 2 seconds
      });
      router.push('/');
    }
  };

  return (
    <div
      className={`flex min-h-screen flex-col ${
        isDark ? 'bg-[#000000] text-[#FFFFFF]' : 'bg-[#FFFFFF] text-[#000000]'
      }`}
    >
      <div className="pt-4">
        <Nav
          isDark={isDark}
          toggleDarkMode={toggleDarkMode}
          showAuthButtons={false}
        />
      </div>
      <div className="mt-24 flex flex-grow items-start justify-center">
        <div className="flex flex-col items-center justify-center space-y-6 py-2">
          <h1 className="mb-4 text-3xl font-bold mt-10">Sign Up</h1>
          <h2 className="font mb-12 text-2xl">
            Already a member?{' '}
            <Link href="/login" legacyBehavior>
              <a
                className={`hover:underline ${
                  isDark ? 'text-white' : 'text-black'
                }`}
              >
                Log In
              </a>
            </Link>
          </h2>
          <button
            onClick={handleSignInWithGoogle}
            className={`mb-6 flex h-16 w-full sm:w-72 md:w-96 lg:w-[32rem] items-center justify-center rounded px-6 py-4 mx-auto whitespace-nowrap ${
              isDark
                ? 'bg-[#FFFFFF] text-[#000000] hover:bg-[#E0E0E0]'
                : 'bg-[#000000] text-[#FFFFFF] hover:bg-[#333333]'
            }`}
          >
            <Image
              src="/google.svg"
              alt="Google logo"
              width={36}
              height={36}
              className="mr-3 h-9 w-9"
            />
            <span className="text-xl">Sign up with Google</span>
          </button>
          <div className="mb-6 flex w-full sm:w-72 md:w-96 lg:w-[32rem] items-center mx-auto">
            <hr className="flex-grow border-t border-gray-300" />
            <span className="mx-4 text-xl">or</span>
            <hr className="flex-grow border-t border-gray-300" />
          </div>
          <Link href="/signupwithemail" legacyBehavior>
            <a
              className={`flex h-16 w-full sm:w-72 md:w-96 lg:w-[32rem] items-center justify-center rounded px-6 py-4 text-xl mx-auto whitespace-nowrap ${
                isDark
                  ? 'bg-[#FFFFFF] text-[#000000] hover:bg-[#E0E0E0]'
                  : 'bg-[#000000] text-[#FFFFFF] hover:bg-[#333333]'
              }`}
            >
              Create New Account
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
