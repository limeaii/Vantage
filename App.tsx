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
        error: "Oops! We encountered an issue scanning for deals. Please check the console for details.",
      });
    }
  };

  const resetHome = () => {
    setViewState(ViewState.HOME);
    setSearchState({ isLoading: false, data: null, error: null });
    setCurrentQuery('');
  };

  // Auth Handlers
  const handleLoginSuccess = (loggedInUser: