import React from 'react';
import { Sidebar } from './Sidebar';
import { useAuth } from './AuthProvider';
import { Navigate, Outlet } from 'react-router-dom';

export function RootLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-tech-black">
        <div className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full animate-spin neon-glow mb-4"></div>
        <p className="text-neon-blue font-display tracking-widest animate-pulse">TECHCONTROL PRO</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex bg-tech-black min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
