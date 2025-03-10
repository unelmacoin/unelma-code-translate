import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signInWithGoogle } from '../components/Nav';
import Image from 'next/image';
import Nav from '../components/Nav';
import { toast } from 'react-hot-toast';
import { useTheme } from '../contexts/ThemeContext';

const SignUp: React.FC = () => {
  const { isDark, toggleDarkMode } = useTheme();
  const router = useRouter();

  const handleSignInWithGoogle = async () => {
    try {
      await signInWithGoogle();
      toast.success('Successfully signed in using Google !', {
        duration: 2000, // Show for 2 seconds
      });
      router.push('/');
    } catch (error) {
      console.error('Error signing in with Google:', error);
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
          <h1 className="mb-4 text-3xl font-bold">Sign Up</h1>
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
            className={`mb-6 flex h-16 w-96 items-center justify-center rounded px-6 py-4 ${
              isDark
                ? 'bg-[#FFFFFF] text-[#000000] hover:bg-[#E0E0E0]'
                : 'bg-[#000000] text-[#FFFFFF] hover:bg-[#333333]'
            }`}
          >
            <div className="flex w-full items-center justify-center">
              <Image
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google logo"
                width={36}
                height={36}
                className="mr-3 h-9 w-9"
              />
              <span className="-ml-8 flex-grow text-center text-xl">
                Sign up with Google
              </span>
            </div>
          </button>
          <div className="mb-6 flex w-96 items-center">
            <hr className="flex-grow border-t border-gray-300" />
            <span className="mx-4 text-xl">or</span>
            <hr className="flex-grow border-t border-gray-300" />
          </div>
          <Link href="/signupwithemail" legacyBehavior>
            <a
              className={`flex h-16 w-96 items-center justify-center rounded px-6 py-4 text-xl ${
                isDark
                  ? 'bg-[#FFFFFF] text-[#000000] hover:bg-[#E0E0E0]'
                  : 'bg-[#000000] text-[#FFFFFF] hover:bg-[#333333]'
              }`}
            >
              Sign up with Email
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
