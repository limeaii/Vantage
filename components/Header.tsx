import React from 'react';
import { ShoppingBag, User as UserIcon, LogOut, Sparkles } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  onLogoClick: () => void;
  user: User | null;
  onOpenAuth: () => void;
  onOpenCart: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onLogoClick, 
  user, 
  onOpenAuth, 
  onOpenCart, 
  onLogout 
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo Area */}
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={onLogoClick}
        >
          <div className="bg-indigo-600 p-2 rounded-lg group-hover:bg-indigo-700 transition-colors">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight hidden sm:inline-block">
            Vantage
          </span>
        </div>
        
        {/* Navigation / Actions */}
        <div className="flex items-center gap-4">
          {/* Nav links removed as requested */}

          {user ? (
            <div className="flex items-center gap-3">
               <button 
                onClick={onOpenCart}
                className="relative p-2 text-slate-600 hover:text-indigo-600 transition-colors"
                title="Your Cart"
              >
                <ShoppingBag className="w-6 h-6" />
                {user.cart.length > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-white">
                    {user.cart.length}
                  </span>
                )}
              </button>

              <div className="h-6 w-px bg-slate-200 mx-1"></div>

              <div className="flex items-center gap-3 pl-1">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-xs font-bold text-slate-800">{user.name}</span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wide">Member</span>
                </div>
                <button 
                  onClick={onLogout}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={onOpenAuth}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full font-medium text-sm transition-all shadow-md hover:shadow-lg"
            >
              <UserIcon className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};