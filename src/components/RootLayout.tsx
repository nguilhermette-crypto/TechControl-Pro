import React from 'react';
import { Sidebar } from './Sidebar';
import { useAuth } from './AuthProvider';
import { Navigate, Outlet } from 'react-router-dom';

export function RootLayout() {
  return (
    <div className="flex bg-tech-black min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
