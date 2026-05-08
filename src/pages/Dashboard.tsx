import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { 
  TrendingUp, 
  Package, 
  ShoppingCart, 
  Wrench, 
  AlertCircle,
  Clock
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const data = [
  { name: 'Seg', v: 4000, l: 2400 },
  { name: 'Ter', v: 3000, l: 1398 },
  { name: 'Qua', v: 2000, l: 9800 },
  { name: 'Qui', v: 2780, l: 3908 },
  { name: 'Sex', v: 1890, l: 4800 },
  { name: 'Sáb', v: 2390, l: 3800 },
];

export default function Dashboard() {
  return (
    <div className="space-y-8 pb-12">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold">Resumo Geral</h1>
          <p className="text-slate-500">Bem-vindo ao centro de comando TechControl Pro.</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Status do Servidor</p>
          <div className="flex items-center gap-2 text-status-success font-mono text-sm">
            <div className="w-2 h-2 rounded-full bg-status-success animate-pulse"></div>
            Online & Sincronizado
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Vendas Hoje', value: 'R$ 1.250,00', icon: ShoppingCart, color: 'text-neon-blue', trend: '+12%' },
          { label: 'Aparelhos em Reparo', value: '18', icon: Wrench, color: 'text-accent-purple', trend: '4 urgentes' },
          { label: 'Estoque Baixo', value: '5 itens', icon: AlertCircle, color: 'text-status-warning', trend: 'Ação necessária' },
          { label: 'Lucro Estimado', value: 'R$ 8.420,00', icon: TrendingUp, color: 'text-status-success', trend: '+5.4%' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{stat.trend}</span>
            </div>
            <h3 className="text-sm font-medium text-slate-400 mb-1">{stat.label}</h3>
            <p className="text-2xl font-display font-bold">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-lg font-bold">Fluxo de Caixa Mensal</h2>
            <select className="bg-white/5 border border-white/10 rounded-lg text-xs px-3 py-2 outline-none focus:border-neon-blue">
              <option>Últimos 7 dias</option>
              <option>Últimos 30 dias</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorV" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00f2ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `R$${v}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#00f2ff' }}
                />
                <Area type="monotone" dataKey="v" stroke="#00f2ff" fillOpacity={1} fill="url(#colorV)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold mb-6">Ordens Recentes</h2>
          <div className="space-y-4">
            {[
              { id: 'OS-492', model: 'iPhone 13 Pro', status: 'finished', customer: 'João Silva' },
              { id: 'OS-493', model: 'Galaxy S22 Ultra', status: 'repairing', customer: 'Maria Souza' },
              { id: 'OS-494', model: 'iPad Air 4', status: 'waiting_parts', customer: 'Carlos Rosa' },
              { id: 'OS-495', model: 'iPhone 11', status: 'analysis', customer: 'Ana Paula' },
            ].map((os, i) => (
              <div key={i} className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-xl transition-colors cursor-pointer group">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs",
                  os.status === 'finished' ? "bg-status-success/20 text-status-success" : 
                  os.status === 'repairing' ? "bg-neon-blue/20 text-neon-blue" :
                  os.status === 'waiting_parts' ? "bg-status-warning/20 text-status-warning" :
                  "bg-slate-500/20 text-slate-400"
                )}>
                  {os.status === 'finished' ? <TrendingUp className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate group-hover:text-neon-blue transition-colors">#{os.id} - {os.model}</p>
                  <p className="text-xs text-slate-500 truncate">{os.customer}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white" />
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 border border-white/10 rounded-xl text-xs font-bold text-slate-400 hover:bg-white/5 hover:text-white transition-all">
            Ver Todas as Ordens
          </button>
        </div>
      </div>
    </div>
  );
}

function ChevronRight(props: any) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
