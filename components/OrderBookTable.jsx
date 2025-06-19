'use client';

import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw } from 'lucide-react';

// Order Book Table Component
const OrderBookTable = ({ selectedSymbol }) => {
  const [orderBook, setOrderBook] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const wsRef = useRef(null);
  const orderBookData = useRef({}); // Store order book data by exchange

  useEffect(() => {
    if (selectedSymbol) {
      // Reset the order book when symbol changes
      orderBookData.current = {};
      setOrderBook([]);
      connectWebSocket();
    } else {
      // Close WebSocket if no symbol is selected
      if (wsRef.current) {
        wsRef.current.close();
      }
    }
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [selectedSymbol]);

  const connectWebSocket = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      wsRef.current = new WebSocket('ws://localhost:8765');
      
      wsRef.current.onopen = () => {
        console.log('WebSocket connection established');
        // No need to send a request as the server broadcasts data automatically
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          const { exchange, timestamp, data } = message;
          
          if (data && data.symbol === selectedSymbol) {
            // Update our order book with this data
            orderBookData.current[exchange] = {
              bidPrice: data.bid_price,
              bidSize: data.bid_size,
              askPrice: data.ask_price,
              askSize: data.ask_size,
              timestamp: timestamp
            };
            
            // Convert the order book to an array and sort by price
            const orderBookArray = Object.keys(orderBookData.current)
              .map(ex => ({
                exchange: ex,
                ...orderBookData.current[ex]
              }))
              .sort((a, b) => b.bidPrice - a.bidPrice); // Sort by bid price descending
            
            // Update state with the top 5 levels
            setOrderBook(orderBookArray.slice(0, 5));
            setIsLoading(false);
          }
        } catch (err) {
          console.error('Error processing message:', err, event.data);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('Connection error. Please try again later.');
        setIsLoading(false);
      };

      wsRef.current.onclose = (event) => {
        console.log('WebSocket connection closed:', event.code, event.reason);
        setIsLoading(false);
        
        // Try to reconnect after a delay if the connection was closed unexpectedly
        if (event.code !== 1000) { // 1000 is normal closure
          setTimeout(() => {
            if (selectedSymbol) {
              console.log('Attempting to reconnect WebSocket...');
              connectWebSocket();
            }
          }, 3000);
        }
      };
    } catch (err) {
      console.error('Error setting up WebSocket:', err);
      setError('Failed to connect to market data server.');
      setIsLoading(false);
    }
  };

  if (!selectedSymbol) {
    return (
      <div className="bg-[#2a2d31] rounded-xl shadow-sm border border-gray-800 p-6 h-full">
        <h2 className="text-lg font-semibold text-white mb-4">Consolidated Order Book</h2>
        <div className="text-center py-8 text-gray-400">
          Select a symbol to view order book data
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#2a2d31] rounded-xl shadow-sm border border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Consolidated Order Book - {selectedSymbol}
        </h2>
        <div className="text-center py-8">
          <div className="text-red-400 mb-2">Error connecting to market data</div>
          <div className="text-gray-400 text-sm">{error}</div>
          <button 
            onClick={() => { setError(null); connectWebSocket(); }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-[#2a2d31] rounded-xl shadow-sm border border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Consolidated Order Book - {selectedSymbol}
        </h2>
        <div className="text-center py-8">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-400 mx-auto mb-2" />
          <div className="text-gray-400">Loading order book...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#2a2d31] rounded-xl shadow-sm border border-gray-800 p-6">
      <h2 className="text-lg font-semibold text-white mb-4">
        Consolidated Order Book - {selectedSymbol}
      </h2>
      <div className="overflow-x-auto rounded-xl">
        <table className="min-w-full divide-y divide-gray-800">
          <thead className="bg-[#1b1d21]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Exchange
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Bid Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Bid Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Ask Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Ask Size
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {orderBook.map((level, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-[#232529]" : "bg-[#1b1d21]"}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                  {level.exchange}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400 font-mono">
                  ${level.bidPrice?.toFixed(2) || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-mono">
                  {level.bidSize?.toLocaleString() || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-400 font-mono">
                  ${level.askPrice?.toFixed(2) || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-mono">
                  {level.askSize?.toLocaleString() || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {orderBook.length === 0 && !isLoading && (
        <div className="text-center py-8 text-gray-400">
          No order book data available for {selectedSymbol}
        </div>
      )}
    </div>
  );
};

export default OrderBookTable;