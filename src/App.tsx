import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthProvider';
import { RootLayout } from './components/RootLayout';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Sales from './pages/Sales';
import TechRepair from './pages/TechRepair';
import Customers from './pages/Customers';
import Reports from './pages/Reports';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/tech-repair" element={<TechRepair />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/finance" element={<div className="p-8 text-center text-slate-500 font-display">Módulo Financeiro em Desenvolvimento</div>} />
            <Route path="/settings" element={<div className="p-8 text-center text-slate-500 font-display">Configurações do Sistema em Desenvolvimento</div>} />
            <Route path="/service-orders" element={<TechRepair />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
