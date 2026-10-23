
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/ui/Header';
import { CitizenSidebar } from '../components/citizen/CitizenSidebar';

interface LayoutProps {
  title?: string;
  children?: React.ReactNode;
}

export const CitizenLayout: React.FC<LayoutProps> = ({ title, children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
  <div className="min-h-screen bg-[#F8FAF8] font-sans text-slate-800">
    <Header />
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="flex flex-col gap-5 md:flex-row md:gap-8">
        <CitizenSidebar />
        <main className="min-w-0 flex-1">
          {title && (
            <div className="mb-6 border-b border-slate-200 pb-4">
              <h1 className="text-2xl font-bold tracking-tight text-slate-800">
                {title}
              </h1>
            </div>
          )}
          {children || <Outlet />}
        </main>
      </div>
    </div>
  </div>
);
};
