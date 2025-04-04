import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification, signOut } from 'firebase/auth';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Nav from '../components/Nav';
import { auth, db } from '../config/firebase';
import { useTheme } from '../contexts/ThemeContext';
import { doc, setDoc } from 'firebase/firestore'; 

const SignUpWithEmail: React.FC = () => {
  const { isDark, toggleDarkMode } = useTheme();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  const router = useRouter();

  const handleSignup = async (email: string, password: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    if (!emailPattern.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
  
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
  
    const normalizedEmail = email.trim().toLowerCase(); // Normalize email (trim and lowercase)
  
    try {
      setIsLoading(true); // Set loading state
      
      // Step 1: Create user with normalized email and password
      const userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
      const user = userCredential.user;
  
      // Step 2: Send email verification
      await sendEmailVerification(user);
      
      // Step 3: Update profile with name
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
      });
  
      // Step 4: Assign user role in Firestore
      await setDoc(doc(db, "users", user.uid), { // Using setDoc directly
        name: `${firstName} ${lastName}`,
        email: user.email,
        role: "user",
      });
  
      // Step 5: Sign out the user after signup
      await signOut(auth);
  
  
      // Step 6: Show success message
      toast.success('Your account has been successfully created! Please check your email to verify your account.', {
        style: { fontSize: '14px' },
        // duration: 5000, // Show for 5 seconds
      });
      
      // Step 7: Reset form fields
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : 'Error signing up.';
      toast.error(errorMessage);
      console.error('Error during sign-up:', errorMessage);
    } finally {
      setIsLoading(false); 
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSignup(email, password);
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
        <h1 className="mb-4 text-3xl font-bold mt-10">Sign Up</h1>
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
        <form onSubmit={handleSubmit} className="flex w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg flex-col space-y-4">
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
            autoComplete="given-name"
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
            autoComplete="family-name"
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
            autoComplete="email"
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
            autoComplete="new-password"
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`rounded px-4 py-2 ${
              isDark
                ? 'bg-[#FFFFFF] text-[#000000] hover:bg-[#E0E0E0]'
                : 'bg-[#000000] text-[#FFFFFF] hover:bg-[#333333]'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpWithEmail;