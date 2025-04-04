import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';

const withAdminAuth = (WrappedComponent: React.ComponentType) => {
  const AdminAuthWrapper: React.FC = (props) => {
    const { user, loading, isAdmin } = useAuth();
    const router = useRouter();

    useEffect(() => {
      // Only redirect away from admin pages, don't enforce admin to be on admin pages
      if (!loading && !isAdmin && router.pathname === '/admin') {
        router.replace('/');
      }
    }, [user, loading, isAdmin, router]);

    if (loading) {
      return <div className="flex justify-center items-center h-screen text-2xl">Loading...</div>;    
    }

    if (!user || !isAdmin) {
      return null; 
    }

    return <WrappedComponent {...props} />;
  };

  return AdminAuthWrapper;
};

export default withAdminAuth;
