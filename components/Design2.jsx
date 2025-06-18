'use client';

import React from 'react'
import { ChevronDownIcon, RocketIcon, MinusIcon, PlusIcon } from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
export function App() {
  // Sample data for the depth chart
  const depthChartData = [
    {
      name: '0',
      buy: 100,
      sell: 20,
    },
    {
      name: '1',
      buy: 90,
      sell: 30,
    },
    {
      name: '2',
      buy: 75,
      sell: 40,
    },
    {
      name: '3',
      buy: 60,
      sell: 45,
    },
    {
      name: '4',
      buy: 50,
      sell: 55,
    },
    {
      name: '5',
      buy: 45,
      sell: 65,
    },
    {
      name: '6',
      buy: 40,
      sell: 75,
    },
    {
      name: '7',
      buy: 35,
      sell: 85,
    },
    {
      name: '8',
      buy: 30,
      sell: 95,
    },
    {
      name: '9',
      buy: 25,
      sell: 100,
    },
  ]
  return (
    <div className="bg-[#121417] min-h-screen w-full flex justify-center items-center p-6">
      <div className="max-w-7xl w-full bg-[#1a1d21] rounded-lg overflow-hidden shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <h1 className="text-white text-2xl font-semibold">
            Consolidated Order Book
          </h1>
          <div className="flex items-center gap-4">
            <div className="bg-[#2a2d31] rounded-md flex items-center px-4 py-2">
              <span className="text-white text-lg mr-4">AAPL</span>
              <ChevronDownIcon className="text-white h-5 w-5" />
            </div>
            <div className="bg-[#2a2d31] rounded-full p-2">
              <RocketIcon className="text-[#e57373] h-6 w-6" />
            </div>
          </div>
        </div>
        {/* Main Content */}
        <div className="grid grid-cols-2 gap-4 p-4">
          {/* Order Book */}
          <div className="bg-[#1f2226] rounded-lg overflow-hidden">
            <div className="border-b border-gray-800 p-4">
              <h2 className="text-[#e57373] text-xl font-medium">Order Book</h2>
              <div className="border-b-2 border-[#e57373] w-24 mt-1"></div>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-800 bg-[#1a1d21]">
                  <th className="p-4 text-white">Price</th>
                  <th className="p-4 text-gray-400">Exchange</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-800 bg-[#1a1d21]">
                  <td className="p-4 text-white">151,5</td>
                  <td className="p-4 text-white">ALPACA</td>
                </tr>
                <tr className="border-b border-gray-800 bg-[#242830]">
                  <td className="p-4 text-white">150,0</td>
                  <td className="p-4 text-white">150</td>
                </tr>
                <tr className="border-b border-gray-800 bg-[#1a1d21]">
                  <td className="p-4 text-white">150</td>
                  <td className="p-4 text-white">ALPACA</td>
                </tr>
                <tr className="bg-[#242830]">
                  <td className="p-4 text-white">150,0</td>
                  <td className="p-4 text-white">BINANCE</td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* Depth Chart */}
          <div className="bg-[#1f2226] rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-800">
              <h2 className="text-white text-xl font-medium">Depth Chart</h2>
            </div>
            <div className="p-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={depthChartData}
                  margin={{
                    top: 5,
                    right: 5,
                    left: 5,
                    bottom: 5,
                  }}
                >
                  <defs>
                    <linearGradient id="colorBuy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3a8f9c" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#3a8f9c"
                        stopOpacity={0.2}
                      />
                    </linearGradient>
                    <linearGradient id="colorSell" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e57373" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#e57373"
                        stopOpacity={0.2}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#555" />
                  <YAxis stroke="#555" />
                  <Area
                    type="monotone"
                    dataKey="buy"
                    stroke="#3a8f9c"
                    fillOpacity={1}
                    fill="url(#colorBuy)"
                  />
                  <Area
                    type="monotone"
                    dataKey="sell"
                    stroke="#e57373"
                    fillOpacity={1}
                    fill="url(#colorSell)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between px-8 py-2">
              {[0, 1, 2, 3, 4, 5].map((dot) => (
                <div key={dot} className="h-2 w-2 rounded-full bg-gray-600" />
              ))}
            </div>
          </div>
        </div>
        {/* Detailed Order Table */}
        <div className="p-4">
          <div className="bg-[#1f2226] rounded-lg overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-800 bg-[#1a1d21]">
                  <th className="p-4 text-[#e57373]">
                    Price
                    <div className="border-b-2 border-[#e57373] w-12 mt-1"></div>
                  </th>
                  <th className="p-4 text-gray-400">Size</th>
                  <th className="p-4 text-gray-400">Exchange</th>
                  <th className="p-4 text-[#e57373]">
                    Asks
                    <div className="border-b-2 border-[#e57373] w-12 mt-1"></div>
                  </th>
                  <th className="p-4 text-gray-400">Sale</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-800 bg-[#1a1d21]">
                  <td className="p-4 text-white">151,5</td>
                  <td className="p-4 text-white">5</td>
                  <td className="p-4 text-white">ALPACA</td>
                  <td className="p-4 text-[#e57373]">151.6</td>
                  <td className="p-4 text-white">ASSU</td>
                </tr>
                <tr className="border-b border-gray-800 bg-[#242830]">
                  <td className="p-4 text-white">150</td>
                  <td className="p-4 text-white">20</td>
                  <td className="p-4 text-white">BINANCE</td>
                  <td className="p-4 text-[#e57373]">151.6</td>
                  <td className="p-4 text-white">SIMO</td>
                </tr>
                <tr className="border-b border-gray-800 bg-[#1a1d21]">
                  <td className="p-4 text-white">150</td>
                  <td className="p-4 text-white">25</td>
                  <td className="p-4 text-white">ALPACA</td>
                  <td className="p-4 text-[#e57373]">153.6</td>
                  <td className="p-4 text-white">ASSU</td>
                </tr>
                <tr className="border-b border-gray-800 bg-[#242830]">
                  <td className="p-4 text-white">150,0</td>
                  <td className="p-4 text-white">8</td>
                  <td className="p-4 text-white">BINANCE</td>
                  <td className="p-4 text-[#e57373]">153.0</td>
                  <td className="p-4 text-white">SIMUL</td>
                </tr>
                <tr className="bg-[#1a1d21]">
                  <td className="p-4 text-white">150,0</td>
                  <td className="p-4 text-white">20</td>
                  <td className="p-4 text-white">ALPACA</td>
                  <td className="p-4 text-[#e57373]">153.0</td>
                  <td className="p-4 text-white">ASIM</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {/* Bottom Controls */}
        <div className="grid grid-cols-2 gap-4 p-4">
          {/* Exchange Selector */}
          <div className="bg-[#1f2226] rounded-lg p-4">
            <div className="flex gap-4 mb-4">
              <button className="bg-transparent border-none text-[#e57373] font-medium px-3 py-1">
                ALPACA
              </button>
              <button className="bg-transparent border-none text-[#e57373] font-medium px-3 py-1">
                ALPACA
              </button>
              <button className="bg-transparent border-none text-gray-400 font-medium px-3 py-1">
                BINANCE
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button className="bg-[#2a2d31] text-gray-400 py-2 px-6 rounded">
                SIMUL
              </button>
              <button className="bg-[#2a2d31] text-gray-400 h-10 w-10 flex items-center justify-center rounded">
                <MinusIcon className="h-5 w-5" />
              </button>
              <button className="bg-[#2a2d31] text-gray-400 h-10 w-10 flex items-center justify-center rounded">
                <PlusIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          {/* Status Indicator */}
          <div className="bg-[#1f2226] rounded-lg p-4 flex items-center">
            <div className="flex items-center">
              <div className="h-4 w-4 rounded-full bg-[#3a8f9c] mr-3"></div>
              <span className="text-white text-xl">LIVE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App