import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, doc, serverTimestamp, getDocs, where } from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '../lib/firebase';
import { Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, Barcode, AlertTriangle, Filter, MoreVertical, Edit2, Trash2, Package } from 'lucide-react';
import { cn } from '../lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const productSchema = z.object({
  name: z.string().min(2, 'Nome muito curto'),
  category: z.string().min(1, 'Selecione uma categoria'),
  quantity: z.number().min(0, 'Quantidade inválida'),
  minQuantity: z.number().min(0, 'Inválido'),
  barcode: z.string().optional(),
  price: z.number().min(0, 'Preço inválido'),
  cost: z.number().min(0, 'Custo inválido'),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function Inventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    const q = query(collection(db, 'inventory'), orderBy('updatedAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const prods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(prods);
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'inventory'));
  }, []);

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (editingProduct) {
        await updateDoc(doc(db, 'inventory', editingProduct.id), {
          ...data,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, 'inventory'), {
          ...data,
          updatedAt: serverTimestamp(),
        });
      }
      setIsModalOpen(false);
      setEditingProduct(null);
      reset();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'inventory');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.barcode?.includes(searchTerm)
  );

  const categories = ['Capinhas', 'Películas', 'Carregadores', 'Cabos', 'Fones', 'Peças técnicas', 'Outros'];

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Estoque Inteligente</h1>
          <p className="text-slate-500">Gestão automatizada de produtos e componentes.</p>
        </div>
        <button 
          onClick={() => { setEditingProduct(null); reset(); setIsModalOpen(true); }}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Novo Produto
        </button>
      </header>

      {/* Barcode Search Bar */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Barcode className="w-5 h-5 text-neon-blue animate-pulse" />
        </div>
        <input 
          type="text" 
          placeholder="Escaneie um código ou digite para buscar..." 
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue/50 transition-all text-lg font-mono"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoFocus
        />
        <div className="absolute inset-y-0 right-4 flex items-center">
          <Search className="w-5 h-5 text-slate-500" />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-bottom border-white/5 bg-white/5">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Produto</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Categoria</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500 text-center">Estoque</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Preço Venda</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold group-hover:text-neon-blue transition-colors">{product.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{product.barcode || 'Sem código'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full bg-accent-purple/10 text-accent-purple text-xs border border-accent-purple/20">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className={cn(
                        "font-bold",
                        product.quantity <= product.minQuantity ? "text-status-error" : "text-white"
                      )}>
                        {product.quantity}
                      </span>
                      <span className="text-[9px] text-slate-600">min: {product.minQuantity}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-status-success font-bold">R$ {product.price.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4">
                    {product.quantity <= product.minQuantity ? (
                      <span className="flex items-center gap-1.5 text-status-warning text-xs font-medium">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Reposição
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-status-success text-xs font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-status-success" />
                        Disponível
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => {
                        setEditingProduct(product);
                        reset({
                          name: product.name,
                          category: product.category,
                          quantity: product.quantity,
                          minQuantity: product.minQuantity,
                          barcode: product.barcode,
                          price: product.price,
                          cost: product.cost,
                        });
                        setIsModalOpen(true);
                      }}
                      className="p-2 hover:bg-white/10 rounded-lg text-slate-500 hover:text-white transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProducts.length === 0 && !loading && (
            <div className="p-12 text-center text-slate-500">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>Nenhum produto encontrado.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl glass-card p-8 relative z-10"
            >
              <h2 className="text-2xl font-bold mb-6">{editingProduct ? 'Editar Produto' : 'Cadastrar Novo Produto'}</h2>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2 block">Nome do Produto</label>
                    <input {...register('name')} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-neon-blue" />
                    {errors.name && <p className="text-status-error text-[10px] mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2 block">Categoria</label>
                    <select {...register('category')} className="w-full bg-tech-black border border-white/10 rounded-xl p-3 outline-none focus:border-neon-blue">
                      <option value="">Selecione...</option>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2 block">Código de Barras</label>
                    <input {...register('barcode')} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-neon-blue font-mono" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2 block">Custo (R$)</label>
                    <input {...register('cost', { valueAsNumber: true })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-neon-blue font-mono" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2 block">Venda (R$)</label>
                    <input {...register('price', { valueAsNumber: true })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-neon-blue font-mono" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2 block">Qtd Atual</label>
                    <input {...register('quantity', { valueAsNumber: true })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-neon-blue font-mono" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2 block">Qtd Mínima</label>
                    <input {...register('minQuantity', { valueAsNumber: true })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-neon-blue font-mono" />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 btn-secondary">Cancelar</button>
                  <button type="submit" className="flex-1 btn-primary">Salvar Produto</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
