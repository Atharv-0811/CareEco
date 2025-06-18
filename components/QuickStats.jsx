'use client';

// Quick Stats Component (for main dashboard)
const QuickStats = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Market Stats</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
          <p className="text-2xl font-bold text-green-600">1,247</p>
          <p className="text-sm text-green-700">Active Symbols</p>
          <p className="text-xs text-green-600 mt-1">+12 today</p>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
          <p className="text-2xl font-bold text-blue-600">$2.4B</p>
          <p className="text-sm text-blue-700">Total Volume</p>
          <p className="text-xs text-blue-600 mt-1">+5.7% today</p>
        </div>
      </div>
    </div>
  );
};

export default QuickStats;