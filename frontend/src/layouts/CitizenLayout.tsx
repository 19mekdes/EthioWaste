
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/ui/Header';
import { CitizenSidebar } from '../components/citizen/CitizenSidebar';

interface LayoutProps {
  title?: string;
  children?: React.ReactNode;
}

export const CitizenLayout: React.FC<LayoutProps> = ({
  title,
  children,
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAF8]">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-500" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }


  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAF8] font-sans text-slate-800 md:h-screen md:min-h-0 md:overflow-hidden">
      <Header />

      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8 md:min-h-0 md:overflow-hidden">
        <div className="flex flex-col gap-5 md:h-full md:min-h-0 md:flex-row md:gap-8">
          {/* Desktop sidebar */}
          <aside className="md:h-full md:min-h-0 md:w-64 md:shrink-0 md:overflow-y-auto">
            <CitizenSidebar />
          </aside>

          {/* Main content */}
          <main className="min-w-0 flex-1 md:h-full md:min-h-0 md:overflow-y-auto">
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
