import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { useAuth } from './AuthProvider';
import { Outlet } from 'react-router-dom';
import { Menu, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function RootLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex bg-tech-black min-h-screen text-slate-200">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-tech-black/80 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[280px] z-[70] lg:hidden shadow-[20px_0_50px_rgba(0,0,0,0.5)]"
            >
              <Sidebar isMobile onClose={() => setIsMobileMenuOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-tech-black/50 backdrop-blur-md border-b border-white/10 sticky top-0 z-[50]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-neon-blue to-accent-purple rounded-lg flex items-center justify-center shadow-[0_0_10px_rgba(0,242,255,0.3)]">
              <Cpu className="text-tech-black w-5 h-5" />
            </div>
            <span className="font-display font-bold text-lg">TechControl <span className="text-neon-blue">Pro</span></span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
          >
            <Menu className="w-6 h-6 text-neon-blue" />
          </button>
        </header>

        <main className="flex-1 lg:ml-64 p-4 md:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
