import React, { useState } from 'react';
import { Calculator } from 'lucide-react';

const CurrencyConverter: React.FC = () => {
  const [fromCurrency] = useState('USD');
  const [toCurrency] = useState('EUR');
  const [exchangeRate] = useState(0.92);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center hover:shadow-md transition-shadow min-h-[280px]">
      <div className="w-20 h-20 mb-4 flex items-center justify-center bg-primary-lightest rounded-xl">
        <Calculator size={48} className="text-primary" strokeWidth={1.5} />
      </div>

      <h3 className="text-xl font-semibold text-primary-darkest mb-4 text-center">Currency Converter</h3>

      <div className="w-full space-y-3">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg">
          <span className="text-sm text-neutral-gray">From: {fromCurrency}</span>
          <span className="text-xl">🇺🇸</span>
        </div>

        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg">
          <span className="text-sm text-neutral-gray">To: {toCurrency}</span>
          <span className="text-xl">🇪🇺</span>
        </div>

        <div className="text-center pt-2">
          <span className="text-2xl font-bold text-primary-darkest">
            {exchangeRate.toFixed(2)} {toCurrency}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
