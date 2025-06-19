'use client';
import React, { useState } from 'react';
import { Plus } from 'lucide-react';

// Manual Feed Entry Component
const ManualFeedEntry = ({ onSubmitFeed }) => {
  const [feedData, setFeedData] = useState({
    messageType: 'NEW_ORDER',
    symbol: '',
    side: 'BUY',
    price: '',
    quantity: '',
    orderId: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmitFeed(feedData);
      // Reset form after successful submission
      setFeedData({
        messageType: 'NEW_ORDER',
        symbol: '',
        side: 'BUY',
        price: '',
        quantity: '',
        orderId: ''
      });
    } catch (error) {
      console.error('Error submitting feed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = feedData.symbol && feedData.price && feedData.quantity && feedData.orderId;

  return (
    <div className="bg-[#1b1d21] rounded-xl border border-border shadow-2xl backdrop-blur-sm">
      {/* Header Section */}
      <div className="border-b border-border bg-gradient-to-r from-surface to-accent2 rounded-t-xl p-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Manual Feed Entry</h2>
            <p className="text-sm text-gray-300">Submit trading orders directly to the feed</p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="p-8">
        <div className="space-y-6">
          {/* Message Type & Symbol Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-text">
                Message Type
                <span className="text-primary ml-1">*</span>
              </label>
              <div className="relative">
                <select
                  value={feedData.messageType}
                  onChange={(e) => setFeedData({ ...feedData, messageType: e.target.value })}
                  className="w-full px-4 py-3 bg-[#1a1d21] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text text-gray-300 appearance-none cursor-pointer transition-all duration-200 hover:border-primary/50"
                >
                  <option value="NEW_ORDER">NEW ORDER</option>
                  <option value="MODIFY_ORDER">MODIFY ORDER</option>
                  <option value="CANCEL_ORDER">CANCEL ORDER</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-text">
                Symbol
                <span className="text-primary ml-1">*</span>
              </label>
              <input
                type="text"
                value={feedData.symbol}
                onChange={(e) => setFeedData({ ...feedData, symbol: e.target.value.toUpperCase() })}
                onFocus={() => setFocusedField('symbol')}
                onBlur={() => setFocusedField(null)}
                placeholder="AAPL"
                className={`w-full px-4 py-3 bg-surface border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text placeholder-muted transition-all duration-200 hover:border-primary/50 ${focusedField === 'symbol' ? 'border-primary' : 'border-border'
                  }`}
                required
              />
            </div>
          </div>

          {/* Side & Price Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-text">
                Side
                <span className="text-primary ml-1">*</span>
              </label>
              <div className="flex bg-surface border border-border rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setFeedData({ ...feedData, side: 'BUY' })}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-[#326b21] ${feedData.side === 'BUY'
                      ? 'bg-[#1b1] text-white shadow-lg'
                      : 'text-muted hover:text-text hover:bg-accent'
                    }`}
                >
                  BUY
                </button>
                <button
                  type="button"
                  onClick={() => setFeedData({ ...feedData, side: 'SELL' })}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 bg-[#ea3322] hover:bg-[#a33424] ${feedData.side === 'SELL'
                      ? 'bg-danger text-white shadow-lg'
                      : 'text-muted hover:text-text hover:bg-accent'
                    }`}
                >
                  SELL
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-text">
                Price
                <span className="text-primary ml-1">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted text-sm">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={feedData.price}
                  onChange={(e) => setFeedData({ ...feedData, price: e.target.value })}
                  onFocus={() => setFocusedField('price')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="150.25"
                  className={`w-full pl-8 pr-4 py-3 bg-surface border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text placeholder-muted transition-all duration-200 hover:border-primary/50 ${focusedField === 'price' ? 'border-primary' : 'border-border'
                    }`}
                  required
                />
              </div>
            </div>
          </div>

          {/* Quantity & Order ID Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-text">
                Quantity
                <span className="text-primary ml-1">*</span>
              </label>
              <input
                type="number"
                value={feedData.quantity}
                onChange={(e) => setFeedData({ ...feedData, quantity: e.target.value })}
                onFocus={() => setFocusedField('quantity')}
                onBlur={() => setFocusedField(null)}
                placeholder="100"
                className={`w-full px-4 py-3 bg-surface border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text placeholder-muted transition-all duration-200 hover:border-primary/50 ${focusedField === 'quantity' ? 'border-primary' : 'border-border'
                  }`}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-text">
                Order ID
                <span className="text-primary ml-1">*</span>
              </label>
              <input
                type="text"
                value={feedData.orderId}
                onChange={(e) => setFeedData({ ...feedData, orderId: e.target.value })}
                onFocus={() => setFocusedField('orderId')}
                onBlur={() => setFocusedField(null)}
                placeholder="ORD12345"
                className={`w-full px-4 py-3 bg-surface border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text placeholder-muted transition-all duration-200 hover:border-primary/50 ${focusedField === 'orderId' ? 'border-primary' : 'border-border'
                  }`}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !isFormValid}
              className={`w-full px-6 py-4 rounded-lg font-semibold text-white transition-all duration-300 transform flex items-center justify-center space-x-3 ${isSubmitting || !isFormValid
                  ? 'bg-gray-600 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                }`}
            >
              <div className={`${isSubmitting ? 'animate-spin' : ''}`}>
                {isSubmitting ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <Plus className="w-5 h-5" />
                )}
              </div>
              <span className="text-lg">
                {isSubmitting ? 'Submitting Feed...' : 'Submit Feed Message'}
              </span>
            </button>
          </div>

          {/* Form Status Indicator */}
          {!isFormValid && (
            <div className="flex items-center space-x-2 text-sm text-muted bg-accent/30 rounded-lg p-3">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Please fill in all required fields to submit</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManualFeedEntry;