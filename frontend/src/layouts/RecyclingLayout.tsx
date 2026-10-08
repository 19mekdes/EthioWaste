import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/ui/Header';
import { RecyclingSidebar } from '../components/recycling/RecyclingSidebar';

interface LayoutProps {
  title?: string;
  children?: React.ReactNode;
}

export const RecyclingLayout: React.FC<LayoutProps> = ({ title, children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      <Header />
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <RecyclingSidebar />
          <main className="flex-1 min-w-0">
            {title && (
              <div className="mb-6 border-b border-slate-800 pb-4">
                <h1 className="text-2xl font-extrabold text-white tracking-tight">{title}</h1>
              </div>
            )}
            {children || <Outlet />}
          </main>
        </div>
      </div>
    </div>
  );
};
