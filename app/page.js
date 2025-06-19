'use client';

import '../app/globals.css';
import React, { useState } from 'react';
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

  const submitFeedMessage = async (feedData) => {
    try {
      // await fetch('/api/feed', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(feedData)
      // });

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

