import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchHero } from './components/SearchHero';
import { LoadingView } from './components/LoadingView';
import { ResultsView } from './components/ResultsView';
import { AuthModal } from './components/AuthModal';
import { CartDrawer } from './components/CartDrawer';
import { SearchState, ViewState, User, Product } from './types';
import { searchDeals } from './services/geminiService';
import { storageService } from './services/storage';
import { Github } from 'lucide-react';

const App: React.FC = () => {
  // Navigation & Search State
  const [viewState, setViewState] = useState<ViewState>(ViewState.HOME);
  const [searchState, setSearchState] = useState<SearchState>({
    isLoading: false,
    data: null,
    error: null,
  });
  const [currentQuery, setCurrentQuery] = useState('');

  // User & Cart State
  const [user, setUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Initialize Auth
  useEffect(() => {
    const currentUser = storageService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleSearch = async (query: string) => {
    setViewState(ViewState.RESULTS);
    setSearchState({ isLoading: true, data: null, error: null });
    setCurrentQuery(query);

    try {
      const result = await searchDeals(query);
      setSearchState({
        isLoading: false,
        data: result,
        error: null,
      });
    } catch (err: any) {
      console.error("Search failed:", err);
      setSearchState({
        isLoading: false,
        data: null,
        error: "Oops! We encountered an issue scanning for deals. Please check your connection or try a different search term.",
      });
    }
  };

  const resetHome = () => {
    setViewState(ViewState.HOME);
    setSearchState({ isLoading: false, data: null, error: null });
    setCurrentQuery('');
  };

  // Auth Handlers
  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setIsAuthOpen(false);
  };

  const handleLogout = () => {
    storageService.logout();
    setUser(null);
    setIsCartOpen(false);
  };

  // Cart Handlers
  const handleAddToCart = async (product: Product) => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    
    try {
      const updatedUser = await storageService.addToCart(user.username, product);
      setUser(updatedUser);
      setIsCartOpen(true);
    } catch (error) {
      console.error("Failed to add to cart", error);
    }
  };

  const handleRemoveFromCart = async (itemId: string) => {
    if (!user) return;
    try {
      const updatedUser = await storageService.removeFromCart(user.username, itemId);
      setUser(updatedUser);
    } catch (error) {
      console.error("Failed to remove from cart", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header 
        onLogoClick={resetHome}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onLogout={handleLogout}
      />

      <main className="flex-grow">
        {viewState === ViewState.HOME && (
          <SearchHero onSearch={handleSearch} />
        )}

        {viewState === ViewState.RESULTS && (
          <div className="min-h-[calc(100vh-64px)]">
            <SearchHero onSearch={handleSearch} isCompact />
            
            {searchState.isLoading ? (
              <LoadingView />
            ) : searchState.error ? (
              <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                <div className="bg-red-50 text-red-600 px-6 py-4 rounded-xl max-w-md">
                  <p className="font-semibold">{searchState.error}</p>
                  <button 
                    onClick={() => handleSearch(currentQuery)}
                    className="mt-3 text-sm underline hover:text-red-800"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : searchState.data ? (
              <ResultsView 
                summary={searchState.data.summary}
                products={searchState.data.products}
                generatedImage={searchState.data.generatedImage || null}
                query={currentQuery}
                onAddToCart={handleAddToCart}
                user={user}
              />
            ) : null}
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm flex items-center justify-center gap-2">
            © 2024 Vantage Shopping. Powered by Gemini 2.5 Flash.
          </p>
        </div>
      </footer>

      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={user?.cart || []}
        onRemoveItem={handleRemoveFromCart}
      />
    </div>
  );
};

export default App;