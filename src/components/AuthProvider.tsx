import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, profile: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading] = useState(false);
  
  const mockProfile: UserProfile = {
    uid: 'demo-id',
    email: 'admin@techcontrol.pro',
    name: 'Administrador Demo',
    role: 'admin',
    createdAt: new Date()
  };

  return (
    <AuthContext.Provider value={{ user: { uid: 'demo-id' } as any, profile: mockProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
