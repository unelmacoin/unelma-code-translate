import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Nav from '../components/Nav';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const { isDark, toggleDarkMode } = useTheme();
  const { user, isAdmin, signInWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Let AuthContext handle the redirection, don't duplicate it here
  useEffect(() => {
    if (user) {
      setIsLoading(true);
    }
  }, [user]);

  // Don't show login page if already authenticated
  if (user || isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
        <div className="flex justify-center items-center h-screen text-2xl">Loading...</div>
          {/* <div className="text-gray-500">Please wait while we redirect you</div> */}
        </div>
      </div>
    );
  }

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleLogin = async () => {
    const emailError = !validateEmail(email) ? 'Invalid email format' : '';
    const passwordError = !validatePassword(password)
      ? 'Password must be at least 6 characters'
      : '';

    setErrors({ email: emailError, password: passwordError });

    if (emailError || passwordError) {
      return;
    }

    setIsLoading(true);
    try {
      await signInWithEmail(email, password);
      toast.success('Successfully logged in!');
    } catch (error) {
      toast.error('Invalid email or password. Please try again.');
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
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
        <h1 className="mb-4 text-3xl font-bold mt-10">Log In</h1>
        <form onSubmit={handleSubmit} className="flex w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg flex-col space-y-4">
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
            autoComplete="email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
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
            autoComplete="current-password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
           <div className={`text-center text-sm ${isDark ? 'text-white' : 'text-black'}`}>
            <Link
              href="/passwordreset"
              className={`hover:underline ${
                isDark ? 'text-white' : 'text-black'
              }`}
            >
              Forget Password?
            </Link>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`rounded px-4 py-2 ${
              isDark
                ? 'bg-[#FFFFFF] text-[#000000] hover:bg-[#E0E0E0]'
                : 'bg-[#000000] text-[#FFFFFF] hover:bg-[#333333]'
            }`}
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
          <div className={`text-center ${isDark ? 'text-white' : 'text-black'}`}>
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
        </form>
      </div>
    </div>
  );
};

export default Login;