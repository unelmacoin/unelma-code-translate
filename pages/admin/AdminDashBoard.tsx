import React from 'react';
import Nav from '../../components/Nav';
import { useTheme } from '../../contexts/ThemeContext';
import withAdminAuth from '../../hoc/WithAdminAuth';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';

const AdminDashboard: React.FC = () => {
  const { isDark, toggleDarkMode } = useTheme();
  const { signOut, addAllowedPath } = useAuth();
  const router = useRouter();

  const handleGoToHome = () => {
    // Add the home path to allowed paths for admin
    addAllowedPath('/');
    router.push('/'); 
  };

  const handleLogOut = async () => {
    try {
      await signOut(); 
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
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
          <h1 className="mb-4 mt-10 text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-xl">Welcome, Admin!</p>
          <button
            onClick={handleGoToHome}
            className={`w-40 rounded px-4 py-2 ${
              isDark
                ? 'bg-[#FFFFFF] text-[#000000] hover:bg-[#E0E0E0]'
                : 'bg-[#000000] text-[#FFFFFF] hover:bg-[#333333]'
            }`}
          >
            Go to Home
          </button>
          <button
            onClick={handleLogOut}
            className={`w-40 rounded px-4 py-2 ${
              isDark
               ? 'bg-[#FFFFFF] text-[#000000] hover:bg-[#E0E0E0]'
                : 'bg-[#000000] text-[#FFFFFF] hover:bg-[#333333]'
            }`}
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default withAdminAuth(AdminDashboard);

