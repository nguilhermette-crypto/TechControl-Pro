import React, { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Cpu, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user profile exists
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // Create initial staff profile
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          name: user.displayName || 'Usuário',
          role: 'admin', // First user is admin for demo/setup purposes
          createdAt: serverTimestamp(),
        });
      }
      
      navigate('/');
    } catch (err: any) {
      console.error(err);
      setError('Falha na autenticação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-tech-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-purple/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-blue/10 blur-[120px] rounded-full"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-card p-10 relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-neon-blue to-accent-purple rounded-2xl flex items-center justify-center neon-glow mb-6 animate-float">
            <Cpu className="text-tech-black w-10 h-10" />
          </div>
          <h1 className="text-3xl font-display font-bold mb-2">TechControl Pro</h1>
          <p className="text-slate-400 text-center text-sm">Sistema Premium de Gestão para Assistência Técnica</p>
        </div>

        {error && (
          <div className="bg-status-error/10 border border-status-error/20 text-status-error p-4 rounded-xl text-sm mb-6 flex items-center gap-3">
            <Zap className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full btn-primary flex items-center justify-center gap-4 py-4"
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-tech-black border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Acessar com Google</span>
            </>
          )}
        </button>

        <div className="mt-8 pt-8 border-t border-white/5 flex flex-col gap-4">
          <div className="flex items-center gap-3 text-slate-500 text-xs uppercase tracking-widest font-semibold">
            <ShieldCheck className="w-4 h-4 text-neon-blue" />
            Acesso Restrito
          </div>
          <p className="text-slate-500 text-[10px] leading-relaxed">
            Este é um sistema de uso restrito. Todo acesso é monitorado e requer permissões administrativas válidas. Ao entrar, você concorda com os termos de segurança da TechControl Pro.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
