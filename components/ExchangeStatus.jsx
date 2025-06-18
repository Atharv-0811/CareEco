'use client';

// Exchange Status Component
const ExchangeStatus = () => {
  const exchanges = [
    { name: 'NYSE', status: 'active', latency: '1.2ms' },
    { name: 'NASDAQ', status: 'active', latency: '0.8ms' },
    { name: 'ARCA', status: 'active', latency: '1.5ms' },
    { name: 'BATS', status: 'warning', latency: '3.2ms' },
  ];
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Exchange Status</h3>
      <div className="space-y-3">
        {exchanges.map((exchange, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                exchange.status === 'active' ? 'bg-green-500' : 
                exchange.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <span className="font-medium text-gray-700">{exchange.name}</span>
            </div>
            <span className="text-sm text-gray-500">{exchange.latency}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExchangeStatus;