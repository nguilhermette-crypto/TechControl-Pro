import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { Download, FileText, Calendar, Filter, TrendingUp, DollarSign, Package, Wrench } from 'lucide-react';
import { motion } from 'motion/react';

const data = [
  { month: 'Jan', revenue: 12000, profit: 4500, sales: 120 },
  { month: 'Fev', revenue: 15000, profit: 5800, sales: 145 },
  { month: 'Mar', revenue: 13000, profit: 5200, sales: 132 },
  { month: 'Abr', revenue: 18000, profit: 7100, sales: 168 },
  { month: 'Mai', revenue: 22000, profit: 9200, sales: 195 },
];

const categoryData = [
  { name: 'Capinhas', value: 45 },
  { name: 'Peças', value: 25 },
  { name: 'Películas', value: 15 },
  { name: 'Serviços', value: 15 },
];

const COLORS = ['#00f2ff', '#7000ff', '#00ff88', '#ffaa00'];

export default function Reports() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Relatórios & Analytics</h1>
          <p className="text-slate-500">Insights detalhados do desempenho da sua assistência.</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" /> Exportar CSV
          </button>
          <button className="btn-primary flex items-center gap-2">
            <FileText className="w-4 h-4" /> Gerar PDF
          </button>
        </div>
      </header>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8 bg-gradient-to-br from-neon-blue/10 to-transparent border-neon-blue/20">
          <div className="flex items-center gap-4 mb-6 text-neon-blue font-bold tracking-widest uppercase text-xs">
            <DollarSign className="w-5 h-5" /> Receita Total (Mês)
          </div>
          <p className="text-4xl font-display font-bold mb-2">R$ 22.450,00</p>
          <div className="flex items-center gap-2 text-status-success text-sm font-bold">
            <TrendingUp className="w-4 h-4" /> +18.4% vs mês anterior
          </div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 bg-gradient-to-br from-accent-purple/10 to-transparent border-accent-purple/20">
          <div className="flex items-center gap-4 mb-6 text-accent-purple font-bold tracking-widest uppercase text-xs">
            <Package className="w-5 h-5" /> Top Vendas
          </div>
          <p className="text-4xl font-display font-bold mb-2">342 itens</p>
          <p className="text-slate-500 text-sm">Capinhas são 45% do volume</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8 bg-gradient-to-br from-status-success/10 to-transparent border-status-success/20">
          <div className="flex items-center gap-4 mb-6 text-status-success font-bold tracking-widest uppercase text-xs">
            <Wrench className="w-5 h-5" /> Taxa de Reparo
          </div>
          <p className="text-4xl font-display font-bold mb-2">94.2%</p>
          <p className="text-slate-500 text-sm">118 ordens finalizadas este mês</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Revenue Trend */}
        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-lg">Evolução Financeira</h3>
            <div className="flex gap-2">
              <span className="flex items-center gap-1.5 text-xs text-neon-blue"><div className="w-2 h-2 rounded-full bg-neon-blue" /> Receita</span>
              <span className="flex items-center gap-1.5 text-xs text-accent-purple"><div className="w-2 h-2 rounded-full bg-accent-purple" /> Lucro</span>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0c', border: '1px solid #ffffff10', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#00f2ff" fill="#00f2ff" fillOpacity={0.1} strokeWidth={3} />
                <Area type="monotone" dataKey="profit" stroke="#7000ff" fill="#7000ff" fillOpacity={0.1} strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Distribution */}
        <div className="glass-card p-6">
          <h3 className="font-bold text-lg mb-8">Distribuição de Categorias</h3>
          <div className="h-[350px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0a0a0c', border: '1px solid #ffffff10', borderRadius: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
               <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Geral</span>
               <span className="text-2xl font-bold">100%</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {categoryData.map((c, i) => (
              <div key={c.name} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-xs text-slate-400">{c.name}: <span className="text-white font-bold">{c.value}%</span></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
