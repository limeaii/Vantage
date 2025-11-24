import React from 'react';
import { Product, User } from '../types';
import { SourceCard } from './SourceCard';
import { Sparkles } from 'lucide-react';

interface ResultsViewProps {
  summary: string;
  products: Product[];
  generatedImage: string | null;
  query: string;
  onAddToCart: (product: Product) => void;
  user: User | null;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ summary, products, generatedImage, query, onAddToCart, user }) => {
  
  const isItemInCart = (url: string) => {
    if (!user) return false;
    return user.cart.some(item => item.url === url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
      
      {/* Top Section: Visual + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Visual Reference */}
        <div className="lg:col-span-1">
           {generatedImage ? (
            <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden h-full flex flex-col">
               <div className="bg-indigo-50 border-b border-indigo-100 px-4 py-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-indigo-800 uppercase tracking-wide">Your Search</span>
               </div>
               <div className="relative flex-grow min-h-[250px] bg-white p-4 flex items-center justify-center">
                  <img src={generatedImage} alt="AI Reference" className="max-h-64 object-contain mix-blend-multiply" />
               </div>
               <div className="bg-slate-50 px-4 py-3 border-t border-slate-100">
                 <p className="text-sm font-medium text-slate-900 text-center">"{query}"</p>
               </div>
            </div>
           ) : (
             <div className="bg-slate-100 rounded-2xl h-full flex items-center justify-center text-slate-400">
               <p>No preview available</p>
             </div>
           )}
        </div>

        {/* Summary Analysis */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-full flex flex-col justify-center">
             <h2 className="text-2xl font-bold text-slate-900 mb-4">Deal Report</h2>
             <p className="text-slate-600 leading-relaxed text-lg">
               {summary}
             </p>
             <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">
               <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600 text-xs font-bold">✓</span>
               <span>We filtered {products.length + 8} potential links to find these {products.length} specific matches.</span>
             </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold text-slate-900">Top Picks For You</h3>
          <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">
            {products.length} Items
          </span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product, idx) => (
              <div key={idx} className="h-full">
                <SourceCard 
                  product={product}
                  onAddToCart={onAddToCart}
                  isAdded={isItemInCart(product.url)}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <p className="text-slate-500 font-medium">No specific product pages found.</p>
              <p className="text-sm text-slate-400 mt-2">Try being more specific (e.g. "Mens Nike Running Shoes Size 10")</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
