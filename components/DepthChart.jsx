import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip
);

const DepthChart = ({ bids = [], asks = [] }) => {
    const bidPrices = bids.map((bid) => bid.price);
    const bidSizes = bids.map((bid) => bid.size);
    const askPrices = asks.map((ask) => ask.price);
    const askSizes = asks.map((ask) => ask.size);

    const data = {
        labels: [...bidPrices.reverse(), ...askPrices],
        datasets: [
            {
                label: 'Bids',
                data: [...bidSizes.reverse(), ...Array(askSizes.length).fill(null)],
                borderColor: '#00FF00',
                backgroundColor: 'rgba(4, 255, 0, 0.4)',
                fill: true,
                tension: 0,
            },
            {
                label: 'Asks',
                data: [...Array(bidSizes.length).fill(null), ...askSizes],
                borderColor: '#FF0000',
                backgroundColor: 'rgba(255, 0, 0, 0.2)',
                fill: true,
                tension: 0,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            tooltip: {
                mode: 'index',
                intersect: false,
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Price',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Size',
                },
            },
        },
    };

    return (
        <div className="h-48 w-full">
            <Line data={data} options={options} />
        </div>
    );
};

const SYMBOL_PRICE_RANGES = {
    AAPL: [150.0, 200.0],
    GOOGL: [2000.0, 2500.0],
    MSFT: [200.0, 400.0],
    AMZN: [3000.0, 3500.0],
    TSLA: [200.0, 300.0],
};

const generateOrderBookData = (priceRange) => {
    const [minPrice, maxPrice] = priceRange;
    const midPrice = (minPrice + maxPrice) / 2;
    const spread = (maxPrice - minPrice) * 0.01;

    const bids = Array.from({ length: 10 }, (_, i) => ({
        price: (midPrice - spread * (i + 1)).toFixed(2),
        size: Math.random() * 100 + i * 100, 
    }));

    const asks = Array.from({ length: 10 }, (_, i) => ({
        price: (midPrice + spread * (i + 1)).toFixed(2),
        size: Math.random() * 100 + i * 100, 
    }));

    return { bids, asks };
};

const DepthCharts = () => {
    const [orderBooks, setOrderBooks] = useState({});

    useEffect(() => {
        const updateData = () => {
            const newOrderBooks = {};
            Object.keys(SYMBOL_PRICE_RANGES).forEach((symbol) => {
                newOrderBooks[symbol] = generateOrderBookData(SYMBOL_PRICE_RANGES[symbol]);
            });
            setOrderBooks(newOrderBooks);
        };

        updateData();
        const interval = setInterval(updateData, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="container mx-auto p-4 pb-12">
            {/* <h1 className="text-4xl font-bold mb-4 text-center -mt-4 pb-8">Stock Depth Charts</h1> */}
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Left side: Large graph */}
                <div className="lg:w-2/5 border rounded-lg p-4 shadow-md flex-grow">
                    <h2 className="text-lg font-semibold mb-2">AMZN</h2>
                    {orderBooks['AMZN'] ? (
                        <DepthChart
                            bids={orderBooks['AMZN'].bids}
                            asks={orderBooks['AMZN'].asks}
                            symbol="AMZN"
                        />
                    ) : (
                        <p>Loading...</p>
                    )}
                    <div className="mt-4 p-8">
                        <h3 className="text-xl font-semibold mb-2 pb-3">About AMZN</h3>
                        <p className="text-white/70 mb-3 pb-4">
                            This section displays the consolidated order book for AMZN, combining bids and asks from various exchanges to provide a comprehensive view of market depth.
                        </p>
                        <div className="flex space-x-2">
                            <button className="bg-blue-500/70 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                View All Exchanges
                            </button>
                            <button className="bg-green-500/70 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                                Analyze Liquidity
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right side: 2x2 grid of smaller graphs */}
                <div className="lg:w-3/5 grid grid-cols-2 gap-4">
                    {['AAPL', 'GOOGL', 'MSFT', 'TSLA'].map((symbol) => (
                        <div key={symbol} className="border rounded-lg p-4 shadow-md">
                            <h2 className="text-lg font-semibold mb-2">{symbol}</h2>
                            {orderBooks[symbol] ? (
                                <DepthChart
                                    bids={orderBooks[symbol].bids}
                                    asks={orderBooks[symbol].asks}
                                    symbol={symbol}
                                />
                            ) : (
                                <p>Loading...</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DepthCharts;