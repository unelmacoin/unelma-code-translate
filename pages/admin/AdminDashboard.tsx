import React, { useState } from 'react'; 
import Nav from '../../components/Nav';
import { useTheme } from '../../contexts/ThemeContext';
import withAdminAuth from '../../hoc/WithAdminAuth';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast'; 
import ModelToggle from '../../components/ModelToggle';
 
const AdminDashboard: React.FC = () => {
  const { isDark, toggleDarkMode } = useTheme();
  const { signOut, addAllowedPath } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false); 

  const handleGoToHome = () => {
    // Add the home path to allowed paths for admin
    addAllowedPath('/');
    router.push('/'); 
  };

  const handleLogOut = async () => {
    try {
      setIsLoggingOut(true); 
      await signOut(); 
    } catch (error) {
      toast.error('Error logging out. Please try again.');
    } finally {
      setIsLoggingOut(false); 
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
      <div className="mt-24 flex flex-grow flex-col items-center px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">Admin Dashboard</h1>
 
        <div className="w-full max-w-4xl space-y-8">
          <ModelToggle isDark={isDark} />
 
          <div className="flex justify-center space-x-4">
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
              disabled={isLoggingOut}
              className={`w-40 rounded px-4 py-2 ${
                isDark
                  ? 'bg-[#FFFFFF] text-[#000000] hover:bg-[#E0E0E0]'
                  : 'bg-[#000000] text-[#FFFFFF] hover:bg-[#333333]'
              } ${isLoggingOut ? 'cursor-not-allowed opacity-70' : ''}`}
            >
              {isLoggingOut ? 'Logging out...' : 'Log Out'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAdminAuth(AdminDashboard);

