import React, { useState } from 'react';
import { ExternalLink, Plus, Check, ShoppingCart } from 'lucide-react';
import { Product } from '../types';

interface SourceCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  isAdded?: boolean;
}

export const SourceCard: React.FC<SourceCardProps> = ({ product, onAddToCart, isAdded = false }) => {
  const [justAdded, setJustAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  // Fallback to favicon if specific product image fails or is missing
  const faviconUrl = `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encodeURIComponent(product.url)}&size=128`;
  
  // Determine which image to show
  const showSpecificImage = product.imageUrl && !imgError;
  const displayImage = showSpecificImage ? product.imageUrl : faviconUrl;

  return (
    <a 
      href={product.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="group flex flex-col bg-white rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-xl transition-all duration-300 overflow-hidden relative h-full"
    >
      {/* Image Section */}
      <div className="relative aspect-[4/3] w-full bg-slate-50 overflow-hidden border-b border-slate-100">
        <img 
          src={displayImage} 
          alt={product.title} 
          className={`w-full h-full ${showSpecificImage ? 'object-cover' : 'object-contain p-8 opacity-80 grayscale group-hover:grayscale-0 transition-all'}`}
          onError={() => setImgError(true)}
        />
        
        {/* Price Tag Overlay */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-slate-900 px-3 py-1 rounded-lg font-bold text-sm shadow-sm border border-slate-200 group-hover:scale-105 transition-transform">
          {product.price}
        </div>

        {/* Store Badge Overlay */}
        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md text-white px-2 py-1 rounded text-[10px] font-medium uppercase tracking-wide">
          {product.storeName}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-slate-900 line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors">
          {product.title}
        </h3>
        
        <p className="text-xs text-slate-500 line-clamp-2 mb-4 flex-grow">
          {product.description}
        </p>
        
        <div className="mt-auto flex items-center gap-2">
           <button
            onClick={handleAdd}
            disabled={isAdded}
            className={`
              flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm
              ${isAdded || justAdded
                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                : 'bg-slate-900 text-white hover:bg-indigo-600 hover:shadow-indigo-200'}
            `}
           >
             {isAdded || justAdded ? (
               <>
                <Check className="w-4 h-4" />
                <span>Saved</span>
               </>
             ) : (
               <>
                <ShoppingCart className="w-4 h-4" />
                <span>Save to Cart</span>
               </>
             )}
           </button>
           
           <div className="p-2.5 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
             <ExternalLink className="w-4 h-4" />
           </div>
        </div>
      </div>
    </a>
  );
};
