'use client';
import React from 'react';
import { Eye } from 'lucide-react';

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

export default ExchangeFeedViewer;