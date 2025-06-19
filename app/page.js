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
import OrderBookTable from '@/components/OrderBookTable';
import DepthCharts from '@/components/DepthChart';
import ManualFeedEntry from '@/components/ManualFeedEntry';
import SymbolSelector from '@/components/SymbolSelector';
import ExchangeFeedViewer from '@/components/ExchangeFeedViewer';



// Main Dashboard Component
const Dashboard = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [feedMessages, setFeedMessages] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Submit feed message
  const submitFeedMessage = async (feedData) => {
    try {
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

      setFeedMessages(prev => [newMessage, ...prev].slice(0, 30));
    } catch (error) {
      console.error('Error submitting feed:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-[#121417]">
      <Header isExpanded={isExpanded} setIsExpanded={setIsExpanded} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-4">
          <h1 className="text-6xl font-extrabold text-transparent bg-clip-text h-17 bg-blue-300 mb-8">
            One Big Exchange
          </h1>
          {/* <h2 className="text-2xl font-semibold text-gray-300 ">
            Consolidated Market Depth Engine
          </h2> */}
          <p className="text-xl text-gray-400 leading-relaxed">
            <span className="text-blue-400 font-medium">Track.</span> <span className="text-purple-400 font-medium">Merge.</span> <span className="text-pink-400 font-medium">Serve.</span>
            <br />
            Build a unified, real-time view of market depth across multiple exchanges.
          </p>
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

