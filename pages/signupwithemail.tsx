import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Nav from '../components/Nav';
import { auth } from '../config/firebase';
import { useTheme } from '../contexts/ThemeContext';

const SignUpWithEmail: React.FC = () => {
  const { isDark, toggleDarkMode } = useTheme();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignUp = async () => {
    // Basic validation
    if (!firstName || !lastName || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
      });
      toast.success('Your account has been successfully created!', {
        style: {
          fontSize: '14px',
        },
      });
      router.push('/login');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error signing up.';
      toast.error(errorMessage);
    }
  };

  return (
    <div
      className={`min-h-screen ${
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
      <div className="mt-24 flex flex-col items-center justify-center py-2">
        <h1 className="mb-4 text-3xl font-bold">Sign Up</h1>
        <h2 className="font mb-4 text-2xl">
          Already a member?{' '}
          <Link
            href="/login"
            className={`hover:underline ${
              isDark ? 'text-white' : 'text-black'
            }`}
          >
            Log In
          </Link>
        </h2>
        <div className="flex w-full max-w-md flex-col space-y-4">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={`rounded border px-4 py-2 ${
              isDark
                ? 'border-gray-700 bg-gray-800 text-white'
                : 'border-gray-300 bg-white text-black'
            }`}
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={`rounded border px-4 py-2 ${
              isDark
                ? 'border-gray-700 bg-gray-800 text-white'
                : 'border-gray-300 bg-white text-black'
            }`}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`rounded border px-4 py-2 ${
              isDark
                ? 'border-gray-700 bg-gray-800 text-white'
                : 'border-gray-300 bg-white text-black'
            }`}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`rounded border px-4 py-2 ${
              isDark
                ? 'border-gray-700 bg-gray-800 text-white'
                : 'border-gray-300 bg-white text-black'
            }`}
          />
          <button
            onClick={handleSignUp}
            className={`rounded px-4 py-2 ${
              isDark
                ? 'bg-[#FFFFFF] text-[#000000] hover:bg-[#E0E0E0]'
                : 'bg-[#000000] text-[#FFFFFF] hover:bg-[#333333]'
            }`}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUpWithEmail;
