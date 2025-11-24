import React, { useState } from 'react';
import { Search, Sparkles, ArrowRight } from 'lucide-react';

interface SearchHeroProps {
  onSearch: (query: string) => void;
  isCompact?: boolean;
}

export const SearchHero: React.FC<SearchHeroProps> = ({ onSearch, isCompact = false }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
    }
  };

  const suggestions = [
    "Navy blazer with gold buttons",
    "Casual white linen pants cheap",
    "Running shoes under $60",
    "Black silk dress midi"
  ];

  if (isCompact) {
    return (
      <div className="bg-white border-b border-slate-200 py-4 px-4 sm:px-6 lg:px-8 shadow-sm">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search for clothes..."
            className="w-full pl-12 pr-4 py-3 bg-slate-100 border-transparent focus:bg-white border focus:border-indigo-500 rounded-xl outline-none transition-all text-slate-800 placeholder:text-slate-400"
          />
          <button 
            type="submit"
            className="absolute right-2 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-8 animate-fade-in">
      <div className="space-y-4 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wide">
          <Sparkles className="w-3 h-3" />
          <span>Intelligent Discovery</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Effortless Style.<br />
          <span className="text-indigo-600">Unbeatable Value.</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
          Describe your perfect look. Vantage scans the web to find quality pieces at the best prices, instantly.
        </p>
      </div>

      <div className="w-full max-w-2xl">
        <form onSubmit={handleSubmit} className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative flex items-center bg-white rounded-xl shadow-xl border border-slate-100">
            <Search className="absolute left-5 w-6 h-6 text-slate-400" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What are you looking for today? (e.g. 'beige trench coat')"
              className="w-full pl-14 pr-36 py-5 bg-transparent rounded-xl outline-none text-lg text-slate-800 placeholder:text-slate-400"
              autoFocus
            />
            <button 
              type="submit"
              className="absolute right-2 top-2 bottom-2 bg-slate-900 hover:bg-indigo-600 text-white px-6 rounded-lg font-medium transition-all transform active:scale-95"
            >
              Search
            </button>
          </div>
        </form>
        
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => {
                setInput(s);
                onSearch(s);
              }}
              className="px-4 py-2 bg-white border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 text-slate-500 rounded-full text-sm transition-all shadow-sm hover:shadow-md"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};