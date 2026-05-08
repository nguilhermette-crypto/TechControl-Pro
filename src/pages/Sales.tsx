import React, { useState, useEffect, useRef } from 'react';
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '../lib/firebase';
import { Product, SaleItem, Sale } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Barcode, Trash2, Plus, Minus, CreditCard, Banknote, QrCode as Pix, ReceiptText, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import confetti from 'canvas-confetti';

export default function Sales() {
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [barcode, setBarcode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastSaleId, setLastSaleId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card' | 'cash' | 'installments'>('pix');
  const inputRef = useRef<HTMLInputElement>(null);

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, quantity: 1 }];
    });
    // Add success sound effect
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2632/2632-preview.mp3');
    audio.play().catch(() => {});
  };

  const handleBarcodeSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!barcode) return;

    try {
      const q = query(collection(db, 'inventory'), where('barcode', '==', barcode));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const product = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Product;
        addToCart(product);
      }
      setBarcode('');
      inputRef.current?.focus();
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, 'inventory');
    }
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const finishSale = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);
    try {
      // 1. Create sale record
      const saleData = {
        items: cart,
        total,
        paymentMethod,
        date: serverTimestamp(),
        userId: 'some-user-id', // Use real auth here
        profit: total * 0.4, // Simplified
      };
      const saleRef = await addDoc(collection(db, 'sales'), saleData);
      
      // 2. Update stock
      for (const item of cart) {
        await updateDoc(doc(db, 'inventory', item.id), {
          quantity: increment(-item.quantity),
          updatedAt: serverTimestamp()
        });
      }

      setLastSaleId(saleRef.id);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00f2ff', '#7000ff', '#00ff88']
      });
      setShowReceipt(true);
      setCart([]);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'sales');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-160px)]">
      {/* POS Terminal */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-display font-bold">Ponto de Venda</h1>
            <p className="text-slate-500">Registre vendas rápidas com código de barras.</p>
          </div>
          <div className="glass-card px-4 py-2 border-neon-blue/20 flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
             <span className="text-xs font-mono uppercase font-bold text-neon-blue">Terminal Ativo</span>
          </div>
        </header>

        {/* Scan Area */}
        <form onSubmit={handleBarcodeSubmit} className="relative">
          <Barcode className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-neon-blue" />
          <input 
            ref={inputRef}
            type="text" 
            placeholder="ESCANEAR PRODUTO..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 pl-16 pr-6 outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue/50 text-2xl font-mono tracking-widest placeholder:opacity-30"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            autoFocus
          />
        </form>

        {/* Cart List */}
        <div className="flex-1 glass-card overflow-hidden flex flex-col">
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Carrinho de Compras</span>
            <span className="text-xs font-bold text-neon-blue">{cart.length} itens</span>
          </div>
          <div className="flex-1 overflow-auto p-6 space-y-4">
            <AnimatePresence>
              {cart.map((item) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl group border border-transparent hover:border-white/10 transition-all"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold group-hover:text-neon-blue transition-colors">{item.name}</h4>
                    <p className="text-xs text-slate-500">Preço Unit: R$ {item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-3 bg-tech-black rounded-xl p-1 border border-white/5">
                    <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-white/10 rounded-lg text-slate-400">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-mono font-bold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-white/10 rounded-lg text-slate-400">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-right min-w-[100px]">
                    <p className="font-mono font-bold text-neon-blue">R$ {(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="p-2 hover:bg-status-error/10 text-slate-600 hover:text-status-error rounded-lg">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            {cart.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-slate-500">
                <ShoppingCart className="w-16 h-16 opacity-10 mb-4" />
                <p className="font-medium">O carrinho está vazio</p>
                <p className="text-xs">Escaneie um produto para começar</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Checkout Sidebar */}
      <div className="flex flex-col gap-6">
        <div className="glass-card p-6 flex-1 flex flex-col">
          <h2 className="text-xl font-bold mb-8">Checkout</h2>
          
          <div className="space-y-4 mb-8">
            <label className="text-xs text-slate-500 uppercase tracking-widest font-bold block">Forma de Pagamento</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'pix', label: 'Pix', icon: Pix },
                { id: 'card', label: 'Cartão', icon: CreditCard },
                { id: 'cash', label: 'Dinheiro', icon: Banknote },
                { id: 'installments', label: 'Parcelado', icon: ReceiptText },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPaymentMethod(p.id as any)}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-2xl border transition-all gap-2",
                    paymentMethod === p.id 
                      ? "bg-neon-blue/10 border-neon-blue text-neon-blue neon-glow" 
                      : "bg-white/5 border-white/10 text-slate-500 hover:border-white/20"
                  )}
                >
                  <p.icon className="w-6 h-6" />
                  <span className="text-[10px] font-bold uppercase">{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto space-y-4">
            <div className="flex justify-between items-center text-slate-400">
              <span>Subtotal</span>
              <span className="font-mono">R$ {total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Desconto</span>
              <span className="font-mono">R$ 0,00</span>
            </div>
            <div className="h-px bg-white/10 my-2"></div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Total a Pagar</p>
                <p className="text-4xl font-display font-bold text-neon-blue">R$ {total.toFixed(2)}</p>
              </div>
            </div>
            
            <button 
              disabled={cart.length === 0 || isProcessing}
              onClick={finishSale}
              className="w-full btn-primary py-6 flex items-center justify-center gap-3 mt-4 disabled:opacity-50 disabled:grayscale"
            >
              <CheckCircle2 className="w-6 h-6" />
              <span className="text-xl">FINALIZAR VENDA</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Receipt Modal */}
      <AnimatePresence>
        {showReceipt && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReceipt(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-white text-tech-black p-8 rounded-none relative z-10 shadow-2xl"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold uppercase">TechControl Pro</h3>
                <p className="text-[10px] mt-1 italic">Soluções Inteligentes em Tecnologia</p>
                <div className="border-b border-dashed border-tech-black/20 my-4"></div>
                <p className="text-xs">DATA: {format(new Date(), 'dd/MM/yyyy HH:mm')}</p>
                <p className="text-xs uppercase">PDV: #001 | Cupom: #{lastSaleId?.slice(-6).toUpperCase()}</p>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-xs font-bold border-b border-dashed border-tech-black/20 pb-2">
                  <span>ITEM</span>
                  <span>TOTAL</span>
                </div>
                {/* We need to store previous cart to show here OR fetch from state */}
                <p className="text-[10px] italic text-center">Venda Processada com Sucesso</p>
              </div>

              <div className="text-right space-y-1 mb-8">
                <div className="flex justify-between text-sm font-bold">
                  <span>TOTAL R$</span>
                  <span>{total.toFixed(2)}</span>
                </div>
                <p className="text-[10px]">PAGAMENTO: {paymentMethod.toUpperCase()}</p>
              </div>

              <div className="text-center">
                <p className="text-[10px] font-bold">OBRIGADO PELA PREFERÊNCIA!</p>
                <p className="text-[8px] mt-2">v.1.0.4 - Cloud Enabled</p>
              </div>

              <button 
                onClick={() => setShowReceipt(false)}
                className="w-full mt-8 bg-tech-black text-white py-3 font-bold text-xs uppercase"
              >
                Fechar Comprovante
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
