import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';

// Define admin routes pattern
const isAdminRoute = (path: string): boolean => {
  return path === '/admin' || path.startsWith('/admin/');
};

const withAdminAuth = (WrappedComponent: React.ComponentType) => {
  const AdminAuthWrapper: React.FC = (props) => {
    const { user, loading, isAdmin } = useAuth();
    const router = useRouter();

    useEffect(() => {
      // Automatically redirect non-admin users from any admin routes
      if (!loading && !isAdmin && isAdminRoute(router.pathname)) {
        // Show a toast notification to explain the redirect
        toast.error("You don't have permission to access this page");
        
        // Redirect to home page
        router.replace('/');
      }
    }, [user, loading, isAdmin, router]);

    if (loading) {
      return <div className="flex justify-center items-center h-screen text-2xl">Loading...</div>;    
    }

    // Only render the wrapped component if user is admin
    // Otherwise return null (the redirect will happen anyway)
    if (!user || !isAdmin) {
      return null; 
    }

    return <WrappedComponent {...props} />;
  };

  return AdminAuthWrapper;
};

export default withAdminAuth;
