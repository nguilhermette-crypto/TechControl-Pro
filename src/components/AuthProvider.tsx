import React, { createContext, useContext, useState } from 'react';
import { UserProfile } from '../types';

interface AuthContextType {
  user: any | null;
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
