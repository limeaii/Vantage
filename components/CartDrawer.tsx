import React from 'react';
import { X, ShoppingBag, ExternalLink, Trash2, AlertCircle } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (id: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onRemoveItem }) => {
  return (
    <>
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[90] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`} 
        onClick={onClose}
      />

      <div className={`fixed inset-y-0 right-0 z-[95] w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="h-full flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-800">Your Cart</h2>
              <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {items.length}
              </span>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-slate-500">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 text-slate-300" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">Your cart is empty</p>
                  <p className="text-sm">Start searching to find great deals!</p>
                </div>
              </div>
            ) : (
              items.map((item) => {
                 const faviconUrl = `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encodeURIComponent(item.url)}&size=64`;
                 const displayImage = item.imageUrl || faviconUrl;
                 
                 return (
                  <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-3 hover:border-indigo-300 transition-colors shadow-sm group relative">
                    <div className="flex gap-3">
                      {/* Thumbnail */}
                      <div className="w-16 h-16 shrink-0 bg-slate-50 rounded-lg border border-slate-100 overflow-hidden">
                        <img src={displayImage} alt="" className="w-full h-full object-cover" />
                      </div>
                      
                      <div className="flex-grow min-w-0 flex flex-col justify-between">
                         <div className="pr-6">
                            <h3 className="font-semibold text-slate-800 line-clamp-1 text-sm">
                              {item.title}
                            </h3>
                            <p className="text-xs text-slate-500">{item.storeName}</p>
                         </div>
                         
                         <div className="flex items-center justify-between mt-1">
                            <span className="text-sm font-bold text-slate-900">{item.price}</span>
                            <a 
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                            >
                              Buy Now <ExternalLink className="w-3 h-3" />
                            </a>
                         </div>
                      </div>
                      
                      <button 
                        onClick={() => onRemoveItem(item.id)}
                        className="absolute top-3 right-3 text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                 );
              })
            )}
          </div>

          {items.length > 0 && (
             <div className="p-5 border-t border-slate-100 bg-slate-50">
               <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl shadow-lg transition-all">
                 Checkout All
               </button>
             </div>
          )}
        </div>
      </div>
    </>
  );
};
