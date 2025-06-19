'use client';

import { ChevronDown, ChevronUp, Activity, TrendingUp, TrendingDown, Search, Settings, Bell, User } from 'lucide-react';

const Header = ({ isExpanded, setIsExpanded }) => {
  return (
    <div className={`bg-[#333] text-white transition-all duration-500 ease-in-out rounded-bl-xl rounded-br-xl ${
      isExpanded ? 'h-52' : 'h-16'
    } relative overflow-hidden`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-600/20"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]"></div>
      </div>
      
      {/* Main Header */}
      <div className="relative z-10 flex items-center justify-between h-16 px-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold bg-blue-300 bg-clip-text text-transparent">
              OBE
            </h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 gap-4">
          <div className="hidden md:flex items-center space-x-2 gap-4">
            <Search className="w-5 h-5 text-gray-400" />
            <Bell className="w-5 h-5 text-gray-400" />
            <Settings className="w-5 h-5 text-gray-400" />
            <User className="w-5 h-5 text-gray-400" />
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all duration-300"
          >
            <span className="text-sm font-medium">Overview</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>
      
      {/* Expanded Content - System Status Only */}
      <div className={`relative z-10 transition-all duration-500 ease-in-out ${
        isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}>
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SystemStat title="Market Status" value="Open" status="healthy" />
            <SystemStat title="Total Latency" value="1.2ms" status="good" />
            <SystemStat title="Data Quality" value="99.9%" status="excellent" />
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            <StatusTag label="All Feeds Active" status="success" />
            <StatusTag label="Emergency Mode" status="inactive" />
            <StatusTag label="Maintenance Window" status="scheduled" />
          </div>
        </div>
      </div>
    </div>
  );
};

// System Stat Component (for rarely needed info)
const SystemStat = ({ title, value, status }) => {
  const statusColor = status === 'healthy' ? 'text-green-400' : 
                     status === 'good' ? 'text-blue-400' : 
                     status === 'excellent' ? 'text-purple-400' : 'text-gray-400';
  
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-300">{title}</p>
          <p className="text-lg font-bold">{value}</p>
        </div>
        <div className={`w-3 h-3 rounded-full ${
          status === 'healthy' ? 'bg-green-400' : 
          status === 'good' ? 'bg-blue-400' : 
          status === 'excellent' ? 'bg-purple-400' : 'bg-gray-400'
        } animate-pulse`}></div>
      </div>
    </div>
  );
};

// Status Tag Component (for system status)
const StatusTag = ({ label, status }) => {
  const getStatusStyle = () => {
    switch (status) {
      case 'success':
        return 'bg-green-500/30 text-green-300 border-green-400/50';
      case 'inactive':
        return 'bg-gray-500/30 text-gray-300 border-gray-400/50';
      case 'scheduled':
        return 'bg-yellow-500/30 text-yellow-300 border-yellow-400/50';
      default:
        return 'bg-white/10 text-gray-300 border-white/20';
    }
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle()}`}>
      {label}
    </span>
  );
};

export default Header;