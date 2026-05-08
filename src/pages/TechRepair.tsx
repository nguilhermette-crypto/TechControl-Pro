import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '../lib/firebase';
import { OSStatus, ServiceOrder } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Wrench, 
  Smartphone, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Image as ImageIcon,
  MessageSquare,
  ChevronRight,
  Filter,
  User,
  Hash
} from 'lucide-react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

const statusConfig: Record<OSStatus, { label: string, color: string, icon: any }> = {
  analysis: { label: 'Em Análise', color: 'text-slate-400 bg-slate-500/10 border-slate-500/20', icon: Search },
  waiting_parts: { label: 'Aguardando Peça', color: 'text-status-warning bg-status-warning/10 border-status-warning/20', icon: AlertCircle },
  repairing: { label: 'Em Conserto', color: 'text-neon-blue bg-neon-blue/10 border-neon-blue/20', icon: Wrench },
  finished: { label: 'Finalizado', color: 'text-status-success bg-status-success/10 border-status-success/20', icon: CheckCircle2 },
  delivered: { label: 'Entregue', color: 'text-accent-purple bg-accent-purple/10 border-accent-purple/20', icon: Smartphone },
};

export default function TechRepair() {
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null);

  const [newOS, setNewOS] = useState({
    customerName: '',
    phone: '',
    model: '',
    brand: '',
    imei: '',
    color: '',
    notes: '',
  });

  const handleOpenOS = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const orderData = {
        customerName: newOS.customerName,
        device: {
          brand: newOS.brand,
          model: newOS.model,
          imei: newOS.imei,
          color: newOS.color,
        },
        status: 'analysis' as OSStatus,
        evaluation: {
          issues: [],
          notes: newOS.notes,
        },
        photos: [],
        total: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      await addDoc(collection(db, 'serviceOrders'), orderData);
      setIsModalOpen(false);
      setNewOS({ customerName: '', phone: '', model: '', brand: '', imei: '', color: '', notes: '' });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'serviceOrders');
    }
  };

  useEffect(() => {
    const q = query(collection(db, 'serviceOrders'), orderBy('updatedAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ServiceOrder));
      setOrders(data);
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'serviceOrders'));
  }, []);

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.device.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Assistência Técnica</h1>
          <p className="text-slate-500">Gestão de ordens de serviço e avaliações técnicas.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Abrir Ordem de Serviço
        </button>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {(Object.entries(statusConfig) as [OSStatus, any][]).map(([status, config]) => (
          <div key={status} className={cn("glass-card p-4 border-l-4", config.color.split(' ')[2])}>
            <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">{config.label}</p>
            <p className="text-2xl font-bold">{orders.filter(o => o.status === status).length}</p>
          </div>
        ))}
      </div>

      {/* Tool Bar */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input 
            type="text" 
            placeholder="Buscar por OS, cliente ou aparelho..." 
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-neon-blue"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn-secondary px-4">
          <Filter className="w-5 h-5" />
        </button>
      </div>

      {/* OS Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredOrders.map((order) => (
          <motion.div 
            layoutId={order.id}
            key={order.id}
            onClick={() => setSelectedOrder(order)}
            className="glass-card p-6 flex gap-6 cursor-pointer hover:border-neon-blue/40 transition-all group"
          >
            <div className="w-24 h-24 rounded-2xl bg-white/5 flex items-center justify-center text-slate-600 group-hover:text-neon-blue transition-colors">
              <Smartphone className="w-12 h-12" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-lg font-bold truncate group-hover:text-neon-blue transition-colors">{order.device.model}</h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <User className="w-3 h-3" /> {order.customerName || 'Cliente não identificado'}
                  </p>
                </div>
                <div className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase border", statusConfig[order.status].color)}>
                  {statusConfig[order.status].label}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4 py-4 border-y border-white/5">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Protocolo</p>
                  <p className="text-sm font-mono">#{order.id.slice(-6).toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">IMEI</p>
                  <p className="text-sm font-mono truncate">{order.device.imei || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    {order.createdAt ? format(order.createdAt.toDate(), 'dd/MM/yy') : '...'}
                  </div>
                  {order.evaluation?.issues?.length > 0 && (
                    <div className="flex items-center gap-1.5 text-xs text-status-error">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {order.evaluation.issues.length} problemas
                    </div>
                  )}
                </div>
                <button className="flex items-center gap-1 text-xs font-bold text-neon-blue opacity-0 group-hover:opacity-100 transition-opacity">
                  Ver Detalhes <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* New OS Modal Content (Simplified for now) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-4xl glass-card p-8 relative z-10 max-h-[90vh] overflow-auto scrollbar-hide">
              <h2 className="text-2xl font-bold mb-8">Nova Ordem de Serviço</h2>
              
              <form onSubmit={handleOpenOS} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Cliente Section */}
                  <div className="space-y-6">
                    <h3 className="text-xs uppercase font-bold tracking-widest text-neon-blue flex items-center gap-2">
                      <User className="w-4 h-4" /> Informações do Cliente
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] text-slate-500 uppercase font-bold mb-1.5 block">Nome Completo</label>
                        <input 
                          required
                          value={newOS.customerName}
                          onChange={e => setNewOS({...newOS, customerName: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-neon-blue font-medium"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 uppercase font-bold mb-1.5 block">WhatsApp / Telefone</label>
                        <input 
                          required
                          value={newOS.phone}
                          onChange={e => setNewOS({...newOS, phone: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-neon-blue font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Aparelho Section */}
                  <div className="space-y-6">
                    <h3 className="text-xs uppercase font-bold tracking-widest text-accent-purple flex items-center gap-2">
                      <Smartphone className="w-4 h-4" /> Detalhes do Aparelho
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] text-slate-500 uppercase font-bold mb-1.5 block">Marca</label>
                        <input 
                          required
                          value={newOS.brand}
                          onChange={e => setNewOS({...newOS, brand: e.target.value})}
                          placeholder="Ex: Apple"
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-neon-blue font-medium"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 uppercase font-bold mb-1.5 block">Modelo</label>
                        <input 
                          required
                          value={newOS.model}
                          onChange={e => setNewOS({...newOS, model: e.target.value})}
                          placeholder="Ex: iPhone 13"
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-neon-blue font-medium"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 uppercase font-bold mb-1.5 block">IMEI / Serial</label>
                        <input 
                          value={newOS.imei}
                          onChange={e => setNewOS({...newOS, imei: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-neon-blue font-mono text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 uppercase font-bold mb-1.5 block">Cor</label>
                        <input 
                          value={newOS.color}
                          onChange={e => setNewOS({...newOS, color: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-neon-blue font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <label className="text-[10px] text-slate-500 uppercase font-bold mb-1.5 block">Observações do Técnico / Defeito Relatado</label>
                  <textarea 
                    rows={4}
                    value={newOS.notes}
                    onChange={e => setNewOS({...newOS, notes: e.target.value})}
                    placeholder="Descreva aqui o estado visual e o problema relatado..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-neon-blue"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 btn-secondary">Cancelar</button>
                  <button type="submit" className="flex-1 btn-primary py-4">Gerar Ordem de Serviço</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
