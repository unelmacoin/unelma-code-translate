import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Nav from '../components/Nav';
import { auth } from '../config/firebase';
import { useTheme } from '../contexts/ThemeContext';

const Login: React.FC = () => {
  const { isDark, toggleDarkMode } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Successfully logged in !', {
        duration: 2000, // Show for 2 seconds
      });
      router.push('/');
    } catch (error) {
      toast.error('Error logging in.');
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
        <h1 className="mb-4 text-3xl font-bold">Log In</h1>
        <div className="flex w-full max-w-md flex-col space-y-4">
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
            onClick={handleLogin}
            className={`rounded px-4 py-2 ${
              isDark
                ? 'bg-[#FFFFFF] text-[#000000] hover:bg-[#E0E0E0]'
                : 'bg-[#000000] text-[#FFFFFF] hover:bg-[#333333]'
            }`}
          >
            Log In
          </button>
          <div className={`${isDark ? 'text-white' : 'text-black'}`}>
            Don&apos;t have an account?{' '}
            <Link
              href="/signup"
              className={`hover:underline ${
                isDark ? 'text-white' : 'text-black'
              }`}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
