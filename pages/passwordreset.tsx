import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Nav from '../components/Nav';
import { useTheme } from '../contexts/ThemeContext';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebase';

const PasswordReset: React.FC = () => {
  const { isDark, toggleDarkMode } = useTheme();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handlePasswordReset = async () => {
    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const response = await fetch('/api/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const { exists } = await response.json();
      if (!exists) {
        toast.error('Email not found. Please check and try again.');
        setIsLoading(false);
        return;
      }

      await sendPasswordResetEmail(auth, normalizedEmail);
      toast.success('Password reset link sent! Please check your email.', {
        duration: 4000,
      });
      router.push('/login');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error sending password reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handlePasswordReset();
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#000000] text-[#FFFFFF]' : 'bg-[#FFFFFF] text-[#000000]'}`}>
      <div className="pt-4">
        <Nav isDark={isDark} toggleDarkMode={toggleDarkMode} showAuthButtons={false} />
      </div>
      <div className="mt-24 flex flex-col items-center justify-center py-2">
        <h1 className="mb-4 text-3xl font-bold mt-10">Reset Password</h1>
        <form onSubmit={handleSubmit} className="flex w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg flex-col space-y-4">
          <input
            type="email"
            placeholder="Enter your registered email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`rounded border px-4 py-2 ${
              isDark
                ? 'border-gray-700 bg-gray-800 text-white'
                : 'border-gray-300 bg-white text-black'
            }`}
            autoComplete="email"
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`rounded px-4 py-2 ${
              isDark
                ? 'bg-[#FFFFFF] text-[#000000] hover:bg-[#E0E0E0]'
                : 'bg-[#000000] text-[#FFFFFF] hover:bg-[#333333]'
            }`}
          >
            {isLoading ? 'Sending reset link...' : 'Send Reset Link'}
          </button>
          <div className={`text-center ${isDark ? 'text-white' : 'text-black'}`}>
            Remember your password?{' '}
            <Link href="/login" className={`hover:underline ${isDark ? 'text-white' : 'text-black'}`}>
              Log In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordReset;
