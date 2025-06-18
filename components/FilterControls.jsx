// Filter Control Component
'use client';

import React, { useState, useEffect } from 'react';

const FilterControls = () => {
  const [selectedExchanges, setSelectedExchanges] = useState(['NYSE', 'NASDAQ']);
  const [bookLevels, setBookLevels] = useState(5);
  
  const exchanges = ['NYSE', 'NASDAQ', 'ARCA', 'BATS', 'IEX', 'CBOE'];
  
  const toggleExchange = (exchange) => {
    setSelectedExchanges(prev => 
      prev.includes(exchange) 
        ? prev.filter(e => e !== exchange)
        : [...prev, exchange]
    );
  };
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Market Filters</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Exchanges</label>
          <div className="flex flex-wrap gap-2">
            {exchanges.map(exchange => (
              <button
                key={exchange}
                onClick={() => toggleExchange(exchange)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                  selectedExchanges.includes(exchange)
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {exchange}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Book Levels: {bookLevels}
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={bookLevels}
            onChange={(e) => setBookLevels(e.target.value)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1</span>
            <span>5</span>
            <span>10</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-gray-600">
            {selectedExchanges.length} exchanges selected
          </span>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;