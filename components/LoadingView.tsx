import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingView: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-32 space-y-6">
      <div className="relative">
        <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin relative z-10" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-slate-800">Scouting the best deals...</h3>
        <p className="text-slate-500 max-w-sm mx-auto">
          Vantage is comparing prices across hundreds of stores to find your match.
        </p>
      </div>
    </div>
  );
};