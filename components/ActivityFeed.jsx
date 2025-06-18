'use client';

import React, { useState, useEffect } from 'react';

// Real-time Activity Feed
const ActivityFeed = () => {
  const [activities, setActivities] = useState([
    { id: 1, type: 'order', symbol: 'AAPL', action: 'New Order', price: '$175.25', time: '10:23:45' },
    { id: 2, type: 'book', symbol: 'GOOGL', action: 'Book Update', price: '$2,455.80', time: '10:23:44' },
    { id: 3, type: 'cancel', symbol: 'MSFT', action: 'Order Cancelled', price: '$335.40', time: '10:23:43' },
  ]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const newActivity = {
        id: Date.now(),
        type: ['order', 'book', 'cancel'][Math.floor(Math.random() * 3)],
        symbol: ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN'][Math.floor(Math.random() * 5)],
        action: ['New Order', 'Book Update', 'Order Cancelled', 'Order Modified'][Math.floor(Math.random() * 4)],
        price: `$${(Math.random() * 1000 + 100).toFixed(2)}`,
        time: new Date().toLocaleTimeString()
      };
      
      setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Live Activity</h3>
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {activities.map((activity, index) => (
          <div key={activity.id} className={`flex items-center justify-between p-2 rounded-lg transition-all duration-500 ${
            index === 0 ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
          }`}>
            <div className="flex items-center space-x-3">
              <div className={`w-2 h-2 rounded-full ${
                activity.type === 'order' ? 'bg-green-500' :
                activity.type === 'book' ? 'bg-blue-500' : 'bg-red-500'
              }`}></div>
              <div>
                <span className="font-medium text-gray-700">{activity.symbol}</span>
                <span className="text-sm text-gray-500 ml-2">{activity.action}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-700">{activity.price}</div>
              <div className="text-xs text-gray-500">{activity.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;