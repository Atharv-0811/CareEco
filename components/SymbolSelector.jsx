'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Search, RefreshCw, TrendingUp, Clock, X, Star } from 'lucide-react';

const SymbolSelector = ({ selectedSymbol, onSymbolChange, onRefresh, isLoading }) => {
  const [query, setQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [recentSymbols, setRecentSymbols] = useState([]);
  const [favorites, setFavorites] = useState(['AAPL', 'GOOGL']);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  onRefresh = onRefresh || (() => console.log('Refresh not implemented'));
  isLoading = isLoading || false;

  const popularSymbols = [
    { symbol: 'AAPL', name: 'Apple Inc.', trend: 'up' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', trend: 'up' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', trend: 'up' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', trend: 'down' },
    { symbol: 'TSLA', name: 'Tesla Inc.', trend: 'up' },
    { symbol: 'META', name: 'Meta Platforms', trend: 'neutral' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', trend: 'up' },
    { symbol: 'NFLX', name: 'Netflix Inc.', trend: 'neutral' },
    { symbol: 'AMD', name: 'Advanced Micro Devices', trend: 'up' },
    { symbol: 'PYPL', name: 'PayPal Holdings', trend: 'down' }
  ];

  const filteredSymbols = popularSymbols.filter(item =>
    item.symbol.toUpperCase().includes(query.toUpperCase()) ||
    item.name.toUpperCase().includes(query.toUpperCase())
  );

  const handleSymbolSelect = (symbol) => {
    onSymbolChange(symbol);
    setQuery('');
    setIsDropdownOpen(false);
    setFocusedIndex(-1);

    const newRecent = [symbol, ...recentSymbols.filter(s => s !== symbol)].slice(0, 5);
    setRecentSymbols(newRecent);
  };

  // const toggleFavorite = (symbol, e) => {
  //   e.stopPropagation();
  //   setFavorites(prev => 
  //     prev.includes(symbol) 
  //       ? prev.filter(s => s !== symbol)
  //       : [...prev, symbol]
  //   );
  // };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setIsDropdownOpen(value.length > 0);
    setFocusedIndex(-1);

    if (selectedSymbol && value !== selectedSymbol) {
      onSymbolChange('');
    }
  };

  const handleKeyDown = (e) => {
    if (!isDropdownOpen) return;

    const items = filteredSymbols;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => (prev + 1) % items.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => prev <= 0 ? items.length - 1 : prev - 1);
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && items[focusedIndex]) {
          handleSymbolSelect(items[focusedIndex].symbol);
        }
        break;
      case 'Escape':
        setIsDropdownOpen(false);
        setFocusedIndex(-1);
        break;
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down': return <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />;
      default: return <div className="h-3 w-3 rounded-full bg-gray-400" />;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-[#1b1d21] rounded-xl shadow-lg p-6 max-w-sm backdrop-blur-sm h-full border border-gray-300">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          Symbol Selector
        </h2>
        {selectedSymbol && (
          <div className="flex items-center gap-2 px-3 py-1 bg-[#555] rounded-full">
            <span className="text-sm font-medium text-white">{selectedSymbol}</span>
            <button
              onClick={() => onSymbolChange('')}
              className="text-white hover:text-black transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>

      <div className="relative mb-4" ref={dropdownRef}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white" />
          <input
            ref={inputRef}
            type="text"
            value={selectedSymbol && !query ? selectedSymbol : query}
            onChange={handleInputChange}
            onFocus={() => !selectedSymbol && setIsDropdownOpen(query.length > 0)}
            onKeyDown={handleKeyDown}
            placeholder="Search symbols or companies..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200 hover:border-gray-300"
          />
        </div>

        {isDropdownOpen && (
          <div className="absolute top-full left-0 w-full mt-2 bg-white shadow-xl rounded-lg border border-gray-100 z-20 max-h-64 overflow-hidden">
            <div className="max-h-64 overflow-y-auto">
              {filteredSymbols.length > 0 ? (
                <div className="py-2">
                  {filteredSymbols.map((item, index) => (
                    <button
                      key={item.symbol}
                      onClick={() => handleSymbolSelect(item.symbol)}
                      className={`w-full text-left px-4 py-3 flex items-center justify-between group transition-all duration-150 ${index === focusedIndex
                        ? 'bg-blue-50 border-l-4 border-blue-500'
                        : 'hover:bg-gray-50'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{item.symbol}</span>
                          {getTrendIcon(item.trend)}
                        </div>
                        <span className="text-sm text-gray-600 truncate">{item.name}</span>
                      </div>
                      <button
                        onClick={(e) => toggleFavorite(item.symbol, e)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
                      >
                        <Star
                          className={`h-4 w-4 ${favorites.includes(item.symbol)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-400 hover:text-yellow-400'
                            }`}
                        />
                      </button>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-gray-500">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No symbols found</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {!query && !selectedSymbol && (
        <div className="space-y-4">
          {/* {favorites.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-medium text-gray-700">Favorites</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {favorites.map((symbol) => (
                  <button
                    key={symbol}
                    onClick={() => handleSymbolSelect(symbol)}
                    className="px-3 py-1.5 text-sm rounded-full bg-yellow-50 border border-yellow-200 text-yellow-700 hover:bg-yellow-100 transition-all duration-150 hover:scale-105"
                  >
                    {symbol}
                  </button>
                ))}
              </div>
            </div>
          )} */}

          {recentSymbols.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-white" />
                <span className="text-sm font-medium text-white">Recent</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSymbols.map((symbol) => (
                  <button
                    key={symbol}
                    onClick={() => handleSymbolSelect(symbol)}
                    className="px-3 py-1.5 text-sm rounded-full bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 transition-all duration-150 hover:scale-105"
                  >
                    {symbol}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-white">Popular</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {popularSymbols.slice(0, 6).map((item) => (
                <button
                  key={item.symbol}
                  onClick={() => handleSymbolSelect(item.symbol)}
                  className="p-3 text-left rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-[#3a8f9c] transition-all duration-150 group bg-[#555]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-white">{item.symbol}</span>
                    {getTrendIcon(item.trend)}
                  </div>
                  {/* <span className="text-xs text-gray-600 group-hover:text-blue-600 transition-colors">
                    {item.name.split(' ').slice(0, 2).join(' ')}
                  </span> */}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-center">
        <button
          onClick={onRefresh}
          disabled={isLoading || !selectedSymbol}
          className="px-6 py-3 bg-gradient-to-r from-blue-600/70 to-blue-600/70 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center space-x-2 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg disabled:shadow-none"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="font-medium">
            {isLoading ? 'Loading...' : 'Get Order Book'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default SymbolSelector;