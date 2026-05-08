import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Wrench, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  Cpu,
  FileText,
  DollarSign,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from '../lib/firebase';
import { useAuth } from './AuthProvider';
import { cn } from '../lib/utils';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isMobile?: boolean;
}

export function Sidebar({ isOpen, onClose, isMobile }: SidebarProps) {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/', roles: ['admin', 'tech', 'cashier', 'staff'] },
    { icon: Package, label: 'Estoque', path: '/inventory', roles: ['admin', 'tech', 'cashier'] },
    { icon: ShoppingCart, label: 'Vendas', path: '/sales', roles: ['admin', 'cashier'] },
    { icon: Users, label: 'Clientes', path: '/customers', roles: ['admin', 'tech', 'cashier', 'staff'] },
    { icon: Wrench, label: 'Assistência', path: '/tech-repair', roles: ['admin', 'tech', 'cashier'] },
    { icon: FileText, label: 'Ordens de Serviço', path: '/service-orders', roles: ['admin', 'tech', 'cashier'] },
    { icon: BarChart3, label: 'Relatórios', path: '/reports', roles: ['admin'] },
    { icon: DollarSign, label: 'Financeiro', path: '/finance', roles: ['admin'] },
    { icon: Settings, label: 'Configurações', path: '/settings', roles: ['admin'] },
  ];

  const filteredItems = menuItems.filter(item => profile && item.roles.includes(profile.role));

  return (
    <div className={cn(
      "h-screen bg-tech-black border-r border-white/10 flex flex-col z-50 transition-all duration-300",
      isMobile ? "w-full" : "w-64 fixed left-0 top-0"
    )}>
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-neon-blue to-accent-purple rounded-xl flex items-center justify-center neon-glow">
            <Cpu className="text-tech-black w-6 h-6" />
          </div>
          <span className="font-display font-bold text-xl bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            TechControl
            <span className="text-neon-blue"> Pro</span>
          </span>
        </div>
        
        {isMobile && (
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      <nav className="flex-1 px-4 mt-4 space-y-2 overflow-y-auto scrollbar-hide">
        {filteredItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => isMobile && onClose?.()}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
              isActive 
                ? "bg-neon-blue/10 text-neon-blue border border-neon-blue/20 shadow-[0_0_15px_rgba(0,242,255,0.1)]" 
                : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
            <motion.div 
              className="ml-auto w-1 h-1 bg-neon-blue rounded-full opacity-0 group-hover:opacity-100"
              layoutId="nav-dot"
            />
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10 mb-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-full bg-accent-purple/20 flex items-center justify-center text-accent-purple text-xs font-bold">
              {profile?.name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">{profile?.name}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">{profile?.role}</p>
            </div>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-status-error hover:bg-status-error/10 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sair do Sistema</span>
        </button>
      </div>
    </div>
  );
}
