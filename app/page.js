// 'use client';

// import React, { useState, useEffect } from 'react';
// import { ChevronDown, ChevronUp, Activity, TrendingUp, TrendingDown, Search, Settings, Bell, User } from 'lucide-react';
// import TopBar from '@/components/TopBar';
// import FilterControls from '@/components/FilterControls';
// import QuickStats from '@/components/QuickStats';
// import ExchangeStatus from '@/components/ExchangeStatus';
// import ActivityFeed from '@/components/ActivityFeed';

// // Main Dashboard Component
// const Dashboard = () => {
//   const [isExpanded, setIsExpanded] = useState(false);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
//       <TopBar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />

//       <div className={`transition-all duration-500 ease-in-out ${isExpanded ? 'pt-4' : 'pt-8'}`}>
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//             <div className="lg:col-span-1">
//               <FilterControls />
//             </div>
//             <div className="lg:col-span-1">
//               <QuickStats />
//             </div>
//             <div className="lg:col-span-1">
//               <ExchangeStatus />
//             </div>
//             <div className="lg:col-span-1">
//               <ActivityFeed />
//             </div>
//           </div>

//           {/* Placeholder for future components */}
//           <div className="mt-8 bg-white/50 backdrop-blur-sm rounded-xl p-8 border border-white/20">
//             <div className="text-center">
//               <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//               <h3 className="text-xl font-semibold text-gray-700 mb-2">Market Data Visualization Area</h3>
//               <p className="text-gray-500">
//                 This space is ready for your consolidated order book, price charts, and real-time market data displays.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

'use client';

import '../app/globals.css';
import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, TrendingUp, Plus, Eye, Search, X, Star, Clock } from 'lucide-react';
import Header from '@/components/Header';
import Design2 from '@/components/Design2';
import OrderBookTable from '@/components/OrderBookTable';
import DepthChart from '@/components/DepthChart';
import DepthCharts from '@/components/DepthChart';

// // Header Component
// const Header = () => {
//   return (
//     <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
//       <div className="flex justify-between items-center">
//         <div className="flex items-center space-x-3">
//           <TrendingUp className="h-8 w-8 text-blue-600" />
//           <h1 className="text-2xl font-bold text-gray-900">One Big Exchange</h1>
//         </div>
//         <div className="flex items-center space-x-2">
//           <span className="text-sm text-gray-600">Team:</span>
//           <span className="text-sm font-semibold text-gray-900 bg-gray-100 px-3 py-1 rounded-full">
//             Team Cobra Kai
//           </span>
//         </div>
//       </div>
//     </header>
//   );
// };

// // Symbol Selector Component
// const SymbolSelector = ({ selectedSymbol, onSymbolChange, onRefresh, isLoading }) => {
//   const popularSymbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NVDA'];

//   return (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//       <h2 className="text-lg font-semibold text-gray-900 mb-4">Symbol Selection</h2>
//       <div className="flex items-center space-x-4">
//         <div className="flex-1">
//           <label htmlFor="symbol" className="block text-sm font-medium text-gray-700 mb-2">
//             Stock Symbol
//           </label>
//           <div className="flex space-x-2">
//             <input
//               type="text"
//               id="symbol"
//               value={selectedSymbol}
//               onChange={(e) => onSymbolChange(e.target.value.toUpperCase())}
//               placeholder="Enter symbol (e.g., AAPL)"
//               className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//             <button
//               onClick={onRefresh}
//               disabled={isLoading || !selectedSymbol}
//               className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
//             >
//               <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
//               <span>Get Book</span>
//             </button>
//           </div>
//         </div>
//       </div>
//       <div className="mt-4">
//         <span className="text-sm text-gray-600 mb-2 block">Popular symbols:</span>
//         <div className="flex flex-wrap gap-2">
//           {popularSymbols.map((symbol) => (
//             <button
//               key={symbol}
//               onClick={() => onSymbolChange(symbol)}
//               className={`px-3 py-1 text-sm rounded-full border ${
//                 selectedSymbol === symbol
//                   ? 'bg-blue-100 border-blue-300 text-blue-700'
//                   : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
//               }`}
//             >
//               {symbol}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };


const SymbolSelector = ({ selectedSymbol, onSymbolChange, onRefresh, isLoading }) => {
  const [query, setQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [recentSymbols, setRecentSymbols] = useState([]);
  const [favorites, setFavorites] = useState(['AAPL', 'GOOGL']);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Default values for optional props
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

    // Add to recent symbols
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

  // Close dropdown when clicking outside
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

// Manual Feed Entry Component
const ManualFeedEntry = ({ onSubmitFeed }) => {
  const [feedData, setFeedData] = useState({
    messageType: 'NEW_ORDER',
    symbol: '',
    side: 'BUY',
    price: '',
    quantity: '',
    orderId: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmitFeed(feedData);
      // Reset form after successful submission
      setFeedData({
        messageType: 'NEW_ORDER',
        symbol: '',
        side: 'BUY',
        price: '',
        quantity: '',
        orderId: ''
      });
    } catch (error) {
      console.error('Error submitting feed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = feedData.symbol && feedData.price && feedData.quantity && feedData.orderId;

  return (
    <div className="bg-[#1b1d21] rounded-xl border border-border shadow-2xl backdrop-blur-sm">
      {/* Header Section */}
      <div className="border-b border-border bg-gradient-to-r from-surface to-accent2 rounded-t-xl p-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Manual Feed Entry</h2>
            <p className="text-sm text-gray-300">Submit trading orders directly to the feed</p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="p-8">
        <div className="space-y-6">
          {/* Message Type & Symbol Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-text">
                Message Type
                <span className="text-primary ml-1">*</span>
              </label>
              <div className="relative">
                <select
                  value={feedData.messageType}
                  onChange={(e) => setFeedData({ ...feedData, messageType: e.target.value })}
                  className="w-full px-4 py-3 bg-[#1a1d21] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text text-gray-300 appearance-none cursor-pointer transition-all duration-200 hover:border-primary/50"
                >
                  <option value="NEW_ORDER">NEW ORDER</option>
                  <option value="MODIFY_ORDER">MODIFY ORDER</option>
                  <option value="CANCEL_ORDER">CANCEL ORDER</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-text">
                Symbol
                <span className="text-primary ml-1">*</span>
              </label>
              <input
                type="text"
                value={feedData.symbol}
                onChange={(e) => setFeedData({ ...feedData, symbol: e.target.value.toUpperCase() })}
                onFocus={() => setFocusedField('symbol')}
                onBlur={() => setFocusedField(null)}
                placeholder="AAPL"
                className={`w-full px-4 py-3 bg-surface border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text placeholder-muted transition-all duration-200 hover:border-primary/50 ${focusedField === 'symbol' ? 'border-primary' : 'border-border'
                  }`}
                required
              />
            </div>
          </div>

          {/* Side & Price Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-text">
                Side
                <span className="text-primary ml-1">*</span>
              </label>
              <div className="flex bg-surface border border-border rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setFeedData({ ...feedData, side: 'BUY' })}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-[#326b21] ${feedData.side === 'BUY'
                      ? 'bg-[#1b1] text-white shadow-lg'
                      : 'text-muted hover:text-text hover:bg-accent'
                    }`}
                >
                  BUY
                </button>
                <button
                  type="button"
                  onClick={() => setFeedData({ ...feedData, side: 'SELL' })}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 bg-[#ea3322] hover:bg-[#a33424] ${feedData.side === 'SELL'
                      ? 'bg-danger text-white shadow-lg'
                      : 'text-muted hover:text-text hover:bg-accent'
                    }`}
                >
                  SELL
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-text">
                Price
                <span className="text-primary ml-1">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted text-sm">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={feedData.price}
                  onChange={(e) => setFeedData({ ...feedData, price: e.target.value })}
                  onFocus={() => setFocusedField('price')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="150.25"
                  className={`w-full pl-8 pr-4 py-3 bg-surface border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text placeholder-muted transition-all duration-200 hover:border-primary/50 ${focusedField === 'price' ? 'border-primary' : 'border-border'
                    }`}
                  required
                />
              </div>
            </div>
          </div>

          {/* Quantity & Order ID Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-text">
                Quantity
                <span className="text-primary ml-1">*</span>
              </label>
              <input
                type="number"
                value={feedData.quantity}
                onChange={(e) => setFeedData({ ...feedData, quantity: e.target.value })}
                onFocus={() => setFocusedField('quantity')}
                onBlur={() => setFocusedField(null)}
                placeholder="100"
                className={`w-full px-4 py-3 bg-surface border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text placeholder-muted transition-all duration-200 hover:border-primary/50 ${focusedField === 'quantity' ? 'border-primary' : 'border-border'
                  }`}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-text">
                Order ID
                <span className="text-primary ml-1">*</span>
              </label>
              <input
                type="text"
                value={feedData.orderId}
                onChange={(e) => setFeedData({ ...feedData, orderId: e.target.value })}
                onFocus={() => setFocusedField('orderId')}
                onBlur={() => setFocusedField(null)}
                placeholder="ORD12345"
                className={`w-full px-4 py-3 bg-surface border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text placeholder-muted transition-all duration-200 hover:border-primary/50 ${focusedField === 'orderId' ? 'border-primary' : 'border-border'
                  }`}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !isFormValid}
              className={`w-full px-6 py-4 rounded-lg font-semibold text-white transition-all duration-300 transform flex items-center justify-center space-x-3 ${isSubmitting || !isFormValid
                  ? 'bg-gray-600 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                }`}
            >
              <div className={`${isSubmitting ? 'animate-spin' : ''}`}>
                {isSubmitting ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <Plus className="w-5 h-5" />
                )}
              </div>
              <span className="text-lg">
                {isSubmitting ? 'Submitting Feed...' : 'Submit Feed Message'}
              </span>
            </button>
          </div>

          {/* Form Status Indicator */}
          {!isFormValid && (
            <div className="flex items-center space-x-2 text-sm text-muted bg-accent/30 rounded-lg p-3">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Please fill in all required fields to submit</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Exchange Feed Viewer Component
const ExchangeFeedViewer = ({ feedMessages }) => {
  const exchanges = ['EX1', 'EX2', 'EX3'];

  const groupedMessages = exchanges.reduce((acc, exchange) => {
    acc[exchange] = feedMessages.filter(msg => msg.exchange === exchange);
    return acc;
  }, {});

  return (
    <div className="bg-[#1b1d21] rounded-lg shadow-sm border border-gray-200 p-6">

      <div className="flex items-center space-x-2">
        <Eye className="h-5 w-5 text-gray-600" />
        <h2 className="text-xl font-semibold text-white pl-2">Exchange Feed Viewer</h2>
        
      </div>
      <p className='text-sm text-gray-300 pl-9'>view exchange feed information.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-8">
        {exchanges.map(exchange => (
          <div key={exchange} className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3 text-center bg-gray-50 py-2 rounded">
              {exchange}
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {groupedMessages[exchange].length > 0 ? (
                groupedMessages[exchange].map((message, index) => (
                  <div key={index} className="text-xs bg-gray-50 p-2 rounded border-l-4 border-blue-500">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-blue-600">{message.messageType}</span>
                      <span className="text-gray-500">{message.timestamp}</span>
                    </div>
                    <div className="text-gray-700">
                      {message.symbol} | {message.side} | ${message.price} | {message.quantity}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 text-sm py-4">
                  No recent messages
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [feedMessages, setFeedMessages] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Submit feed message
  const submitFeedMessage = async (feedData) => {
    try {
      // In real implementation, this would be:
      // await fetch('/api/feed', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(feedData)
      // });

      // Add to local feed messages for demo
      const newMessage = {
        ...feedData,
        exchange: ['EX1', 'EX2', 'EX3'][Math.floor(Math.random() * 3)],
        timestamp: new Date().toLocaleTimeString()
      };

      setFeedMessages(prev => [newMessage, ...prev].slice(0, 30)); // Keep last 30 messages
    } catch (error) {
      console.error('Error submitting feed:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-[#121417]">
      <Header isExpanded={isExpanded} setIsExpanded={setIsExpanded} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-white mb-4">🏦 One Big Exchange – Consolidated Market Depth Engine</h1>
          <p className="text-lg text-gray-400">Track. Merge. Serve.<br />Build a unified, real-time view of market depth across multiple exchanges.</p>
        </div>

        <div className="space-y-8">
          <div className="flex flex-col md:flex-row h-full">
            {/* Symbol Selector */}
            <div className="w-full md:w-1/3 lg:w-1/4 p-4 overflow-y-auto">
              <SymbolSelector
                selectedSymbol={selectedSymbol}
                onSymbolChange={setSelectedSymbol}
              />
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              {/* Order Book Table */}
              <OrderBookTable
                selectedSymbol={selectedSymbol}
              />
            </div>
          </div>

          {/* Divider before Depth Charts */}
          <div className="relative my-8 p-8">
            <hr className="border-t border-gray-600" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-[#121417] px-4 text-3xl text-gray-400 font-semibold uppercase tracking-wider">Market Depth Insights</span>
            </div>
          </div>

          <DepthCharts />

          {/* Feed Entry and Viewer */}
          <div className="relative my-8">
            <hr className="border-t border-gray-600" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-[#121417] px-4 text-3xl text-gray-400 font-semibold uppercase tracking-wider">Feed Management</span>
            </div>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 pt-12">
            <ManualFeedEntry onSubmitFeed={submitFeedMessage} />
            <ExchangeFeedViewer feedMessages={feedMessages} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

