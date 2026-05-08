import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '../lib/firebase';
import { Customer } from '../types';
import { motion } from 'motion/react';
import { UserPlus, Search, Phone, Mail, History, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'customers'), orderBy('name', 'asc'));
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Customer));
      setCustomers(data);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'customers'));
  }, []);

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Gestão de Clientes</h1>
          <p className="text-slate-500">Histórico completo e integração com WhatsApp.</p>
        </div>
        <button className="btn-primary flex items-center justify-center gap-2">
          <UserPlus className="w-5 h-5" />
          Cadastrar Cliente
        </button>
      </header>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
        <input 
          type="text" 
          placeholder="Buscar por nome ou telefone..." 
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-neon-blue transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((client) => (
          <motion.div 
            layout
            key={client.id}
            className="glass-card p-6 border-transparent hover:border-neon-blue/20 transition-all hover:shadow-[0_0_20px_rgba(0,242,255,0.05)] cursor-pointer translate-y-0 hover:-translate-y-1"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-purple/20 to-neon-blue/10 flex items-center justify-center text-accent-purple font-bold text-xl uppercase">
                {client.name.charAt(0)}
              </div>
              <div className="flex gap-2">
                <button className="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors">
                  <History className="w-4 h-4" />
                </button>
                <a 
                  href={`https://wa.me/55${client.phone.replace(/\D/g, '')}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2 bg-status-success/10 rounded-lg text-status-success hover:bg-status-success/20 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            <h3 className="text-lg font-bold mb-4">{client.name}</h3>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <Phone className="w-4 h-4 text-neon-blue" />
                <span>{client.phone}</span>
              </div>
              {client.email && (
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <Mail className="w-4 h-4 text-neon-blue" />
                  <span className="truncate">{client.email}</span>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-slate-500">
              <span>Cliente desde</span>
              <span>{client.createdAt ? format(client.createdAt.toDate(), 'MM/yyyy') : '...'}</span>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full p-20 text-center">
            <p className="text-slate-500 font-medium">Nenhum cliente cadastrado com esses termos.</p>
          </div>
        )}
      </div>
    </div>
  );
}
